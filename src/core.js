export const LESSON_XP = 100;
export const ANSWER_XP = 10;
export const REVIEW_XP = 5;
export const REVIEW_INTERVALS = [0, 1, 3, 7, 14, 30];
export const LEVELS = [
  { name: 'Curious Explorer', minXp: 0 },
  { name: 'Island Mapper', minXp: 100 },
  { name: 'Archipelago Guide', minXp: 250 },
  { name: 'Nusantara Scholar', minXp: 500 },
];
export const DEFAULT_LESSON_ORDER = [
  'what-is-indonesia',
  'map-of-indonesia',
  'peoples-and-languages',
  'trade-and-kingdoms',
  'religion-and-adat',
  'modern-indonesia',
];

export function createInitialState() {
  return {
    profile: { name: 'Fredrick', goal: 'Understand Indonesia region by region' },
    onboardingCompleted: false,
    currentLessonId: 'what-is-indonesia',
    completedLessonIds: [],
    xp: 0,
    streak: 0,
    lastStudyDate: null,
    quizBest: {},
    reminderEnabled: false,
    reminderTime: '20:00',
    notes: {},
    history: [],
    reviews: {},
  };
}

export function normalizeState(input = {}) {
  const initial = createInitialState();
  const hasLegacyActivity = input.xp > 0
    || (Array.isArray(input.completedLessonIds) && input.completedLessonIds.length > 0)
    || (Array.isArray(input.history) && input.history.length > 0)
    || typeof input.lastStudyDate === 'string';
  return {
    ...initial,
    ...input,
    onboardingCompleted: input.onboardingCompleted === true || (input.onboardingCompleted === undefined && hasLegacyActivity),
    currentLessonId: typeof input.currentLessonId === 'string' ? input.currentLessonId : initial.currentLessonId,
    completedLessonIds: Array.isArray(input.completedLessonIds)
      ? [...new Set(input.completedLessonIds.filter((id) => typeof id === 'string'))]
      : [],
    xp: Number.isFinite(input.xp) && input.xp >= 0 ? input.xp : 0,
    streak: Number.isFinite(input.streak) && input.streak >= 0 ? input.streak : 0,
    quizBest: input.quizBest && typeof input.quizBest === 'object' ? Object.fromEntries(
      Object.entries(input.quizBest).filter(([, score]) => Number.isInteger(score) && score > 0),
    ) : {},
    reminderEnabled: input.reminderEnabled === true,
    reminderTime: typeof input.reminderTime === 'string' ? input.reminderTime : initial.reminderTime,
    notes: input.notes && typeof input.notes === 'object' ? input.notes : {},
    profile: input.profile && typeof input.profile === 'object'
      ? { name: typeof input.profile.name === 'string' ? input.profile.name : initial.profile.name, goal: typeof input.profile.goal === 'string' ? input.profile.goal : initial.profile.goal }
      : initial.profile,
    history: Array.isArray(input.history) ? input.history.filter((item) => item && typeof item.lessonId === 'string') : [],
    reviews: input.reviews && typeof input.reviews === 'object' ? Object.fromEntries(
      Object.entries(input.reviews).filter(([, review]) => review
        && Number.isInteger(review.interval)
        && review.interval >= 0
        && review.interval < REVIEW_INTERVALS.length
        && /^\d{4}-\d{2}-\d{2}$/.test(review.nextReviewDate)),
    ) : {},
  };
}

export function getNextLesson(state, lessons) {
  const completed = new Set(state.completedLessonIds || []);
  return lessons.find((lesson) => !completed.has(lesson.id)) || lessons.at(-1);
}

export function calculateProgress(state, totalLessons) {
  if (!totalLessons) return 0;
  return Math.min(100, Math.round((state.completedLessonIds.length / totalLessons) * 100));
}

export function getLevelSummary(xp = 0) {
  const safeXp = Number.isFinite(xp) && xp >= 0 ? xp : 0;
  const currentIndex = LEVELS.reduce((index, level, candidateIndex) => (
    level.minXp <= safeXp ? candidateIndex : index
  ), 0);
  const current = LEVELS[currentIndex];
  const next = LEVELS[currentIndex + 1] || null;
  if (!next) return { current, next: null, progress: 100, remainingXp: 0 };
  const span = next.minXp - current.minXp;
  return {
    current,
    next,
    progress: Math.round(((safeXp - current.minXp) / span) * 100),
    remainingXp: next.minXp - safeXp,
  };
}

export function completeLesson(state, lessonId, today, lessons = DEFAULT_LESSON_ORDER.map((id) => ({ id }))) {
  const next = normalizeState(state);
  const alreadyComplete = next.completedLessonIds.includes(lessonId);
  if (!alreadyComplete) {
    next.completedLessonIds = [...next.completedLessonIds, lessonId];
    next.xp += LESSON_XP;
  }
  if (!alreadyComplete) {
    next.history = [{ lessonId, date: today, xp: LESSON_XP }, ...next.history.filter((item) => item.lessonId !== lessonId)].slice(0, 30);
    next.reviews = { ...next.reviews, [lessonId]: { interval: 1, nextReviewDate: addDays(today, REVIEW_INTERVALS[1]) } };
  }
  if (next.lastStudyDate !== today) {
    next.streak = next.lastStudyDate === addDays(today, -1) ? next.streak + 1 : 1;
    next.lastStudyDate = today;
  }
  const nextLesson = lessons.length ? getNextLesson(next, lessons) : null;
  if (nextLesson && nextLesson.id !== lessonId) next.currentLessonId = nextLesson.id;
  return next;
}

export function markAnswer(state, lessonId, correct) {
  const next = normalizeState(state);
  if (!correct) return next;
  const prior = Number(next.quizBest[lessonId] || 0);
  if (prior < 1) next.xp += ANSWER_XP;
  next.quizBest = { ...next.quizBest, [lessonId]: Math.max(prior, 1) };
  return next;
}

export function shouldRemindToday(state, today) {
  return state.reminderEnabled === true && state.lastStudyDate !== today;
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getDueReviews(state, today) {
  const normalized = normalizeState(state);
  return normalized.completedLessonIds.filter((lessonId) => normalized.reviews[lessonId]?.nextReviewDate <= today);
}

export function reviewLesson(state, lessonId, today, remembered) {
  const next = normalizeState(state);
  if (!next.completedLessonIds.includes(lessonId)) return next;
  const prior = next.reviews[lessonId] || { interval: 0, nextReviewDate: today };
  const interval = remembered ? Math.min(prior.interval + 1, REVIEW_INTERVALS.length - 1) : 0;
  next.reviews = {
    ...next.reviews,
    [lessonId]: { interval, nextReviewDate: addDays(today, REVIEW_INTERVALS[Math.max(1, interval)]) },
  };
  if (remembered) next.xp += REVIEW_XP;
  return next;
}

export function getToday(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
