import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProgress,
  completeLesson,
  createInitialState,
  getDueReviews,
  getNextLesson,
  markAnswer,
  normalizeState,
  reviewLesson,
  shouldRemindToday,
} from './core.js';
import { LESSONS } from './content.js';
import { MEDIA, RESOURCE_SETS } from './resources.js';

test('resource data stays separate from lesson content', () => {
  assert.equal(LESSONS[0].media, undefined);
  assert.equal(LESSONS[0].resources, undefined);
  assert.equal(MEDIA[LESSONS[0].id].creditUrl.includes('commons.wikimedia.org'), true);
  assert.equal(RESOURCE_SETS[LESSONS[0].id].length, 2);
});

test('new learners start at lesson one with zero XP', () => {
  const state = createInitialState();
  assert.equal(state.currentLessonId, 'what-is-indonesia');
  assert.equal(state.xp, 0);
  assert.deepEqual(state.completedLessonIds, []);
  assert.equal(state.profile.name, 'Fredrick');
  assert.deepEqual(state.history, []);
  assert.equal(state.onboardingCompleted, false);
});

test('XP maps to a named level and progress toward the next milestone', async () => {
  const { getLevelSummary } = await import('./core.js');
  assert.deepEqual(getLevelSummary(0), {
    current: { name: 'Curious Explorer', minXp: 0 },
    next: { name: 'Island Mapper', minXp: 100 },
    progress: 0,
    remainingXp: 100,
  });
  assert.deepEqual(getLevelSummary(175), {
    current: { name: 'Island Mapper', minXp: 100 },
    next: { name: 'Archipelago Guide', minXp: 250 },
    progress: 50,
    remainingXp: 75,
  });
});

test('the highest level stays complete instead of overflowing its progress bar', async () => {
  const { getLevelSummary } = await import('./core.js');
  assert.deepEqual(getLevelSummary(999), {
    current: { name: 'Nusantara Scholar', minXp: 500 },
    next: null,
    progress: 100,
    remainingXp: 0,
  });
});

test('legacy learners with activity skip the new onboarding screen', () => {
  const state = normalizeState({ xp: 100, completedLessonIds: ['what-is-indonesia'] });
  assert.equal(state.onboardingCompleted, true);
});

test('completing a lesson awards XP once and advances to the next lesson', () => {
  const state = createInitialState();
  const next = completeLesson(state, 'what-is-indonesia', '2026-09-18');
  assert.equal(next.xp, 100);
  assert.deepEqual(next.completedLessonIds, ['what-is-indonesia']);
  assert.equal(next.currentLessonId, 'map-of-indonesia');
  assert.deepEqual(next.history, [{ lessonId: 'what-is-indonesia', date: '2026-09-18', xp: 100 }]);
  assert.equal(completeLesson(next, 'what-is-indonesia', '2026-09-18').xp, 100);
});

test('progress is based on completed lessons', () => {
  assert.equal(calculateProgress(createInitialState(), 6), 0);
  assert.equal(calculateProgress({ completedLessonIds: ['a', 'b'] }, 6), 33);
});

test('quiz answers track best score and reward XP only for a correct answer', () => {
  let state = createInitialState();
  state = markAnswer(state, 'what-is-indonesia', true);
  state = markAnswer(state, 'what-is-indonesia', false);
  assert.equal(state.xp, 10);
  assert.equal(state.quizBest.whatIsIndonesia ?? state.quizBest['what-is-indonesia'], 1);
});

test('repeating a completed quiz does not farm XP', () => {
  let state = createInitialState();
  state = markAnswer(state, 'what-is-indonesia', true);
  state = markAnswer(state, 'what-is-indonesia', true);
  assert.equal(state.xp, 10);
  assert.equal(state.quizBest['what-is-indonesia'], 1);
});

test('reminder is due when enabled and not completed today', () => {
  const state = { reminderEnabled: true, lastStudyDate: '2026-09-17' };
  assert.equal(shouldRemindToday(state, '2026-09-18'), true);
  assert.equal(shouldRemindToday({ ...state, lastStudyDate: '2026-09-18' }, '2026-09-18'), false);
});

test('invalid persisted state is repaired safely', () => {
  const state = normalizeState({ xp: 'bad', completedLessonIds: 'bad', reminderEnabled: 'yes' });
  assert.equal(state.xp, 0);
  assert.deepEqual(state.completedLessonIds, []);
  assert.equal(state.reminderEnabled, false);
  assert.equal(getNextLesson(state, [{ id: 'a' }]).id, 'a');
});

test('normalization removes duplicate progress and invalid quiz or review records', () => {
  const state = normalizeState({
    completedLessonIds: ['a', 'a', 'b', 42],
    quizBest: { a: 2, b: 'bad', c: -1 },
    reviews: {
      a: { interval: 2, nextReviewDate: '2026-09-20' },
      b: { interval: 99, nextReviewDate: 'not-a-date' },
      c: { interval: -1, nextReviewDate: '2026-09-20' },
    },
  });
  assert.deepEqual(state.completedLessonIds, ['a', 'b']);
  assert.deepEqual(state.quizBest, { a: 2 });
  assert.deepEqual(state.reviews, { a: { interval: 2, nextReviewDate: '2026-09-20' } });
});

test('completing a lesson schedules its first spaced review', () => {
  const next = completeLesson(createInitialState(), 'what-is-indonesia', '2026-09-18');
  assert.deepEqual(next.reviews['what-is-indonesia'], { interval: 1, nextReviewDate: '2026-09-19' });
  assert.deepEqual(getDueReviews(next, '2026-09-18'), []);
  assert.deepEqual(getDueReviews(next, '2026-09-19'), ['what-is-indonesia']);
});

test('streak continues only on the immediately following study day', () => {
  const first = completeLesson(createInitialState(), 'what-is-indonesia', '2026-09-18');
  const consecutive = completeLesson(first, 'map-of-indonesia', '2026-09-19');
  const afterGap = completeLesson(consecutive, 'peoples-and-languages', '2026-09-21');
  assert.equal(consecutive.streak, 2);
  assert.equal(afterGap.streak, 1);
});

test('a remembered review advances its interval without adding completion XP', () => {
  const completed = completeLesson(createInitialState(), 'what-is-indonesia', '2026-09-18');
  const reviewed = reviewLesson(completed, 'what-is-indonesia', '2026-09-19', true);
  assert.equal(reviewed.xp, 105);
  assert.deepEqual(reviewed.reviews['what-is-indonesia'], { interval: 2, nextReviewDate: '2026-09-22' });
  assert.equal(reviewed.history[0].xp, 100);
});

test('a missed review resets to a short interval and remains due today', () => {
  const completed = completeLesson(createInitialState(), 'what-is-indonesia', '2026-09-18');
  const reviewed = reviewLesson(completed, 'what-is-indonesia', '2026-09-20', false);
  assert.deepEqual(reviewed.reviews['what-is-indonesia'], { interval: 0, nextReviewDate: '2026-09-21' });
  assert.deepEqual(getDueReviews(reviewed, '2026-09-21'), ['what-is-indonesia']);
});
