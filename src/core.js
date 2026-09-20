export const LESSON_XP = 100;
export const ANSWER_XP = 10;
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
  };
}

export function normalizeState(input = {}) {
  const initial = createInitialState();
  return {
    ...initial,
    ...input,
    currentLessonId: typeof input.currentLessonId === 'string' ? input.currentLessonId : initial.currentLessonId,
    completedLessonIds: Array.isArray(input.completedLessonIds)
      ? input.completedLessonIds.filter((id) => typeof id === 'string')
      : [],
    xp: Number.isFinite(input.xp) && input.xp >= 0 ? input.xp : 0,
    streak: Number.isFinite(input.streak) && input.streak >= 0 ? input.streak : 0,
    quizBest: input.quizBest && typeof input.quizBest === 'object' ? input.quizBest : {},
    reminderEnabled: input.reminderEnabled === true,
    reminderTime: typeof input.reminderTime === 'string' ? input.reminderTime : initial.reminderTime,
    notes: input.notes && typeof input.notes === 'object' ? input.notes : {},
    profile: input.profile && typeof input.profile === 'object'
      ? { name: typeof input.profile.name === 'string' ? input.profile.name : initial.profile.name, goal: typeof input.profile.goal === 'string' ? input.profile.goal : initial.profile.goal }
      : initial.profile,
    history: Array.isArray(input.history) ? input.history.filter((item) => item && typeof item.lessonId === 'string') : [],
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

export function completeLesson(state, lessonId, today, lessons = DEFAULT_LESSON_ORDER.map((id) => ({ id }))) {
  const next = normalizeState(state);
  const alreadyComplete = next.completedLessonIds.includes(lessonId);
  if (!alreadyComplete) {
    next.completedLessonIds = [...next.completedLessonIds, lessonId];
    next.xp += LESSON_XP;
  }
  if (!alreadyComplete) {
    next.history = [{ lessonId, date: today, xp: LESSON_XP }, ...next.history.filter((item) => item.lessonId !== lessonId)].slice(0, 30);
  }
  if (next.lastStudyDate !== today) {
    next.streak = next.lastStudyDate ? next.streak + 1 : 1;
    next.lastStudyDate = today;
  }
  const nextLesson = lessons.length ? getNextLesson(next, lessons) : null;
  if (nextLesson && nextLesson.id !== lessonId) next.currentLessonId = nextLesson.id;
  return next;
}

export function markAnswer(state, lessonId, correct) {
  const next = normalizeState(state);
  if (!correct) return next;
  next.xp += ANSWER_XP;
  const prior = Number(next.quizBest[lessonId] || 0);
  next.quizBest = { ...next.quizBest, [lessonId]: Math.max(prior, 1) };
  return next;
}

export function shouldRemindToday(state, today) {
  return state.reminderEnabled === true && state.lastStudyDate !== today;
}

export function getToday(date = new Date()) {
  return date.toISOString().slice(0, 10);
}
