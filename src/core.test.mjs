import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProgress,
  completeLesson,
  createInitialState,
  getNextLesson,
  markAnswer,
  normalizeState,
  shouldRemindToday,
} from './core.js';

test('new learners start at lesson one with zero XP', () => {
  const state = createInitialState();
  assert.equal(state.currentLessonId, 'what-is-indonesia');
  assert.equal(state.xp, 0);
  assert.deepEqual(state.completedLessonIds, []);
});

test('completing a lesson awards XP once and advances to the next lesson', () => {
  const state = createInitialState();
  const next = completeLesson(state, 'what-is-indonesia', '2026-09-18');
  assert.equal(next.xp, 100);
  assert.deepEqual(next.completedLessonIds, ['what-is-indonesia']);
  assert.equal(next.currentLessonId, 'map-of-indonesia');
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
