import { LESSONS, REGIONS } from './content.js';
import { MEDIA, RESOURCE_SETS } from './resources.js';
import {
  calculateProgress, completeLesson, createInitialState, getDueReviews, getLevelSummary, getNextLearningAction, getToday, markAnswer, normalizeState, reviewLesson, shouldRemindToday,
} from './core.js';
import './styles.css';
import './mobile-fix.css';

const STORAGE_KEY = 'nusantara-learning-state-v1';
let state = loadState();
let answerState = null;

function loadState() {
  try { return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')); } catch { return createInitialState(); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c])); }
function getRoute() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'dashboard') return { type: 'dashboard' };
  if (parts[0] === 'class' && LESSONS.some((item) => item.id === parts[1])) return { type: 'class', id: parts[1] };
  return { type: 'home' };
}
function withResources(item) { return { ...item, media: MEDIA[item.id], resources: RESOURCE_SETS[item.id] }; }
function currentLesson() { return withResources(LESSONS.find((item) => item.id === state.currentLessonId) || LESSONS[0]); }
function findLesson(id) { return withResources(LESSONS.find((item) => item.id === id) || LESSONS[0]); }
function completed(id) { return state.completedLessonIds.includes(id); }
function nav() { return `<nav class="app-nav"><a href="#/" class="nav-link">Learn</a><a href="#/dashboard" class="nav-link">My dashboard</a></nav>`; }
function header() { return `<header class="topbar"><a class="brand" href="#/" aria-label="Nusantara Learning home"><span class="brand-mark">✦</span><span><strong>Nusantara</strong><small>Learning journey</small></span></a><div class="top-actions">${nav()}<span class="stat-pill streak">🔥 <b>${state.streak}</b></span><span class="stat-pill xp">✦ <b>${state.xp}</b> XP</span><a href="#/dashboard" class="avatar" aria-label="Open profile">${escapeHtml((state.profile.name || 'FY').slice(0, 2).toUpperCase())}</a></div></header>`; }
function progressBar() { const progress = calculateProgress(state, LESSONS.length); return `<div class="progress-block"><div class="progress-label"><span>Course progress</span><strong>${progress}%</strong></div><div class="progress-track"><span style="width:${progress}%"></span></div><small>${state.completedLessonIds.length} of ${LESSONS.length} classes complete</small></div>`; }
function lessonList() { return `<nav class="lesson-nav" aria-label="Course classes">${LESSONS.map((item) => `<a class="lesson-nav-item ${item.id === state.currentLessonId ? 'active' : ''} ${completed(item.id) ? 'done' : ''}" href="#/class/${item.id}"><span class="lesson-number">${completed(item.id) ? '✓' : item.number}</span><span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.tag)} · ${item.duration}</small></span></a>`).join('')}</nav>`; }
function sidebar() { return `<aside class="sidebar"><div class="sidebar-intro"><span class="eyebrow">INDONESIA 101</span><h1>Understand the archipelago, one story at a time.</h1><p>Build the map first. Then let history, people, belief, and everyday life connect.</p></div>${progressBar()}${lessonList()}<a class="settings-link" href="#/dashboard">⌁ View profile & history</a></aside>`; }
function shell(body, showSidebar = true) { return `<div class="shell">${header()}<main class="layout ${showSidebar ? '' : 'full-layout'}">${showSidebar ? sidebar() : ''}<section class="content">${body}</section></main><footer><span>Built for a lifelong Indonesia 101 → 201 journey.</span><span>Progress stays on this device.</span></footer></div>`; }
function hero(item) { return `<section class="hero-card" style="--accent:${item.color}"><div class="hero-copy"><div class="eyebrow">CLASS ${item.number} · ${escapeHtml(item.region.toUpperCase())}</div><h2>${escapeHtml(item.title)}</h2><p class="hero-subtitle">${escapeHtml(item.subtitle)}</p><div class="hero-meta"><span>◷ ${item.duration}</span><span>✦ ${item.xp} XP</span><span>▣ ${item.tag}</span></div><a class="primary-button" href="#class-content">${completed(item.id) ? 'Review class' : 'Start class'} <span>→</span></a></div><div class="hero-orbit" aria-hidden="true"><div class="orbit-line"></div><div class="island-shape island-a"></div><div class="island-shape island-b"></div><div class="island-shape island-c"></div><span>INDONESIA</span></div></section>`; }
function media(item) { return `<figure class="lesson-media"><img src="${item.media.image}" data-fallback="${item.media.remoteImage || ''}" alt="${escapeHtml(item.media.imageAlt)}" loading="eager"/><figcaption><b>Visual lesson asset</b> · ${escapeHtml(item.media.credit)} · <a href="${item.media.creditUrl}" target="_blank" rel="noreferrer">source and license</a></figcaption></figure>`; }
function resources(item) { return `<section class="resources-section"><div class="section-heading compact"><div><span class="eyebrow">GO FURTHER</span><h2>Resources for this class</h2></div><span class="section-note">Read, watch, and explore</span></div><div class="resource-grid">${item.resources.map(([kind, title, url, description]) => `<a class="resource-card" href="${url}" target="_blank" rel="noreferrer"><span class="resource-kind">${escapeHtml(kind)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p><span class="resource-arrow">Open resource ↗</span></a>`).join('')}</div></section>`; }
function quiz(item) { return `<div class="quiz-card" id="quiz-card"><div class="quiz-heading"><span class="quiz-icon">?</span><div><span class="eyebrow">CHECK YOUR MAP</span><h3>${escapeHtml(item.question)}</h3></div></div><div class="answers">${item.answers.map((answer, index) => `<button class="answer-button" data-answer="${index}">${String.fromCharCode(65 + index)} <span>${escapeHtml(answer)}</span></button>`).join('')}</div><div class="quiz-result" aria-live="polite"></div></div>`; }
function classPage(id) {
  const item = findLesson(id);
  return shell(`<div class="class-header"><a href="#/" class="back-link">← All classes</a><details class="mobile-course-menu"><summary>Class ${item.number} of ${LESSONS.length} · Open course map</summary>${lessonList()}</details><span class="class-progress-label">${completed(item.id) ? 'Completed class' : `Class ${item.number} of ${LESSONS.length}`}</span></div>${hero(item)}<section class="class-grid" id="class-content"><div class="lesson-panel"><div class="story-card"><p>${escapeHtml(item.story)}</p></div><div class="fact-grid">${item.facts.map(([label, text]) => `<article><span class="fact-label ${label.toLowerCase().replace(/ /g, '-')}">${escapeHtml(label)}</span><p>${escapeHtml(text)}</p></article>`).join('')}</div><div class="vocab-section"><div class="subheading"><h3>Words to carry with you</h3><span>5 new words</span></div><div class="vocab-grid">${item.vocabulary.map(([word, meaning]) => `<div><strong>${escapeHtml(word)}</strong><span>${escapeHtml(meaning)}</span></div>`).join('')}</div></div>${quiz(item)}<div class="lesson-actions"><button class="primary-button" data-action="complete">${completed(item.id) ? 'Completed ✓' : 'Complete class'} <span>+${item.xp} XP</span></button><textarea data-note placeholder="Add a note for your future self...">${escapeHtml(state.notes[item.id] || '')}</textarea></div></div><div class="lesson-aside">${media(item)}<div class="class-side-card"><span class="eyebrow">YOUR NOTES</span><h3>Make this idea yours.</h3><p>Your note is saved on this device and appears in your dashboard history.</p></div></div></section>${resources(item)}`, true);
}
function homePage() {
  const item = currentLesson();
  const nextAction = getNextLearningAction(state, LESSONS, getToday());
  const dueReviewItem = nextAction.type === 'review' ? findLesson(nextAction.lessonId) : null;
  const reviewPrompt = dueReviewItem ? `<section class="review-prompt" aria-label="Spaced review reminder"><div class="review-prompt-icon">↻</div><div><span class="eyebrow">READY TO RECALL</span><h3>${escapeHtml(dueReviewItem.title)}</h3><p>${nextAction.dueCount === 1 ? 'One class is ready for a quick spaced review.' : `${nextAction.dueCount} classes are ready for spaced review.`}</p></div><a class="text-button" href="#/dashboard">Review now <span>→</span></a></section>` : '';
  return shell(`<section class="welcome-strip"><div><span class="eyebrow">WELCOME BACK, ${escapeHtml(state.profile.name.toUpperCase())}</span><h2>Ready to keep exploring?</h2></div><a href="#/dashboard" class="text-button">View my history →</a></section>${hero(item)}${reviewPrompt}<section class="continue-card"><div class="continue-icon">▶</div><div><span class="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h3>${escapeHtml(item.title)}</h3><p>${state.lastStudyDate ? `Last studied ${state.lastStudyDate}` : 'Your first expedition starts here.'}</p></div><a class="text-button" href="#/class/${item.id}">Continue <span>→</span></a></section><section class="section-heading"><div><span class="eyebrow">EXPLORE THE ARCHIPELAGO</span><h2>Indonesia is many worlds</h2></div><span class="section-note">Seven regions · one shared journey</span></section><section class="region-grid">${REGIONS.map((region) => `<article class="region-card" style="--region:${region.color}"><div class="region-art"><span>${region.id === 'bali-nusa' ? '◒' : region.id === 'papua' ? '✺' : '◇'}</span></div><div><h3>${escapeHtml(region.name)}</h3><p>${escapeHtml(region.note)}</p><span class="locked-label">${region.id === 'java' ? 'AVAILABLE NEXT' : 'UNLOCK AS YOU LEARN'}</span></div></article>`).join('')}</section><section class="reminder-card" id="reminder"><div class="reminder-icon">🔔</div><div class="reminder-copy"><span class="eyebrow">KEEP THE THREAD</span><h2>Make Indonesia part of your rhythm.</h2><p>Set a gentle reminder so the app remembers where you left off.</p><div class="reminder-controls"><label><input type="checkbox" data-reminder-toggle ${state.reminderEnabled ? 'checked' : ''}/> Remind me</label><input type="time" data-reminder-time value="${state.reminderTime}" ${state.reminderEnabled ? '' : 'disabled'}/><button class="secondary-button" data-action="notifications">Enable browser notifications</button></div><small class="reminder-status">${state.reminderEnabled ? `Next reminder at ${state.reminderTime}` : 'Reminders are currently off.'}</small></div></section>`, true);
}
function onboardingPage() {
  return `<main class="onboarding-page"><div class="onboarding-mark">✦</div><span class="eyebrow">NUSANTARA LEARNING</span><h1>Start with one useful idea about Indonesia.</h1><p class="onboarding-lede">Take a 12-minute first class, see the map, learn five words, and test what you understood. Set up a profile only if you want your progress personalized.</p><div class="onboarding-points"><span>◈ 12-minute first class</span><span>◷ Real images and sources</span><span>✦ No account required</span></div><a class="primary-button onboarding-start" href="#/class/what-is-indonesia">Start class 1 <span>→</span></a><div class="onboarding-preview"><div><b>Every class follows one simple loop</b><span>Story → visual → key ideas → vocabulary → recall quiz → resources</span></div><a href="#/class/what-is-indonesia">Preview class →</a></div><details class="profile-setup"><summary>Personalize your learning (optional)</summary><form class="onboarding-form" data-onboarding-form><label>What should we call you?<input name="name" value="${escapeHtml(state.profile.name === 'Fredrick' ? '' : state.profile.name)}" placeholder="Your name" autocomplete="name"/></label><label>What are you hoping to understand?<textarea name="goal" placeholder="For example: the people and history behind the places I visit">${escapeHtml(state.profile.goal === 'Understand Indonesia region by region' ? '' : state.profile.goal)}</textarea></label><button class="secondary-button" type="submit">Save profile and continue <span>→</span></button></form></details><small class="onboarding-note">Private by design · progress stays on this device</small></main>`;
}
function dashboardPage() {
  const progress = calculateProgress(state, LESSONS.length);
  const level = getLevelSummary(state.xp);
  const history = [...state.history].reverse().map((entry) => { const item = findLesson(entry.lessonId); const reviewLabel = entry.remembered ? 'remembered' : 'reviewed for tomorrow'; const activityLabel = entry.type === 'review' ? `Review · ${reviewLabel}${entry.xp ? ` · +${entry.xp} XP` : ''}` : `Class complete · +${entry.xp} XP`; return `<a href="#/class/${item.id}" class="history-row"><span class="history-dot">${entry.type === 'review' ? '↻' : '✓'}</span><span><b>${escapeHtml(item.title)}</b><small>${entry.date} · ${activityLabel}</small></span><span>→</span></a>`; }).join('') || '<p class="empty-state">Your completed classes will appear here.</p>';
  const dueReviews = getDueReviews(state, getToday());
  const reviewQueue = dueReviews.length ? `<section class="dashboard-panel review-panel"><div class="section-heading compact"><div><span class="eyebrow">SPACED REVIEW</span><h2>Keep these fresh</h2></div><span class="section-note">${dueReviews.length} due today</span></div><p class="review-intro">A quick retrieval today helps this idea stick. Open the class if you need a refresher.</p><div class="review-list">${dueReviews.map((id) => { const item = findLesson(id); return `<div class="review-row"><a href="#/class/${item.id}"><b>${escapeHtml(item.title)}</b><small>Review class ↗</small></a><div class="review-actions"><button class="secondary-button" data-review="${item.id}" data-remembered="false">Review tomorrow</button><button class="primary-button" data-review="${item.id}" data-remembered="true">I remembered <span>+5 XP</span></button></div></div>`; }).join('')}</div></section>` : `<section class="dashboard-panel review-panel review-clear"><span class="eyebrow">SPACED REVIEW</span><h2>You’re all caught up.</h2><p>Your next review will appear here after a class becomes due.</p></section>`;
  return shell(`<section class="dashboard-hero"><div class="profile-avatar">${escapeHtml((state.profile.name || 'FY').slice(0, 2).toUpperCase())}</div><div><span class="eyebrow">YOUR LEARNING PROFILE</span><h2>${escapeHtml(state.profile.name)}</h2><p>${escapeHtml(state.profile.goal)}</p></div><div class="dashboard-score"><strong>${state.xp}</strong><span>total XP</span></div></section><section class="level-card"><div><span class="eyebrow">YOUR LEVEL</span><h2>${escapeHtml(level.current.name)}</h2><p>${level.next ? `${level.remainingXp} XP to ${escapeHtml(level.next.name)}` : 'You have reached the highest level in this course.'}</p></div><div class="level-progress"><div class="progress-label"><span>${level.next ? 'Next milestone' : 'Course milestone'}</span><strong>${level.progress}%</strong></div><div class="progress-track" role="progressbar" aria-label="Progress to next level" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${level.progress}"><span style="width:${level.progress}%"></span></div></div></section><section class="dashboard-stats"><article><strong>${state.streak}</strong><span>day streak</span></article><article><strong>${state.completedLessonIds.length}/${LESSONS.length}</strong><span>classes complete</span></article><article><strong>${progress}%</strong><span>course progress</span></article><article><strong>${Object.keys(state.quizBest).length}</strong><span>quiz wins</span></article></section>${reviewQueue}<section class="dashboard-columns"><div class="dashboard-panel"><div class="section-heading compact"><div><span class="eyebrow">LEARNING HISTORY</span><h2>Your path so far</h2></div></div><div class="history-list">${history}</div></div><div class="dashboard-panel profile-panel"><span class="eyebrow">PROFILE SETTINGS</span><h2>Shape your journey</h2><label>Name<input data-profile-name value="${escapeHtml(state.profile.name)}"/></label><label>Learning goal<textarea data-profile-goal>${escapeHtml(state.profile.goal)}</textarea></label><button class="secondary-button" data-action="save-profile">Save profile</button><div class="dashboard-reminder"><b>Reminder</b><span>${state.reminderEnabled ? `On at ${state.reminderTime}` : 'Off'}</span><a href="#/" data-scroll="reminder">Change on home →</a></div></div></section>`, false);
}
function render() {
  const route = getRoute();
  if (route.type !== 'home' && !state.onboardingCompleted) {
    state = normalizeState({ ...state, onboardingCompleted: true });
    saveState();
  }
  document.querySelector('#app').innerHTML = (!state.onboardingCompleted && route.type === 'home')
    ? onboardingPage()
    : route.type === 'dashboard' ? dashboardPage() : route.type === 'class' ? classPage(route.id) : homePage();
  bindEvents(route);
}
function bindEvents(route) {
  document.querySelector('[data-onboarding-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.name.value.trim() || 'Learner';
    const goal = form.elements.goal.value.trim() || 'Understand Indonesia region by region';
    if (!name) return;
    state = normalizeState({ ...state, profile: { name, goal }, onboardingCompleted: true });
    saveState();
    render();
  });
  document.querySelector('[data-action="guest"]')?.addEventListener('click', () => {
    state = normalizeState({ ...state, onboardingCompleted: true });
    saveState();
    window.location.hash = '#/class/what-is-indonesia';
  });
  document.querySelectorAll('.lesson-media img[data-fallback]').forEach((image) => image.addEventListener('error', () => {
    if (image.dataset.fallback && image.src !== image.dataset.fallback) image.src = image.dataset.fallback;
  }, { once: true }));
  const completeButton = document.querySelector('[data-action="complete"]');
  if (completeButton) completeButton.addEventListener('click', () => { state = completeLesson(state, route.id, getToday(), LESSONS); saveState(); render(); document.querySelector('#class-content')?.scrollIntoView({ behavior: 'smooth' }); });
  document.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => { const item = findLesson(route.id); const index = Number(button.dataset.answer); const correct = index === item.correct; state = markAnswer(state, item.id, correct); saveState(); document.querySelectorAll('[data-answer]').forEach((b, i) => { b.disabled = true; if (i === item.correct) b.classList.add('correct'); if (i === index && !correct) b.classList.add('wrong'); }); const result = document.querySelector('.quiz-result'); result.textContent = correct ? 'Correct — +10 XP. You found the thread.' : `Not quite. The answer is ${String.fromCharCode(65 + item.correct)}.`; result.className = `quiz-result ${correct ? 'success' : 'retry'}`; }));
  document.querySelectorAll('[data-review]').forEach((button) => button.addEventListener('click', () => { state = reviewLesson(state, button.dataset.review, getToday(), button.dataset.remembered === 'true'); saveState(); render(); }));
  document.querySelector('[data-note]')?.addEventListener('input', (event) => { state.notes[route.id] = event.target.value; saveState(); });
  document.querySelector('[data-reminder-toggle]')?.addEventListener('change', (event) => { state.reminderEnabled = event.target.checked; saveState(); render(); });
  document.querySelector('[data-reminder-time]')?.addEventListener('change', (event) => { state.reminderTime = event.target.value; saveState(); render(); });
  document.querySelector('[data-action="notifications"]')?.addEventListener('click', enableNotifications);
  document.querySelector('[data-action="save-profile"]')?.addEventListener('click', () => { state.profile.name = document.querySelector('[data-profile-name]').value.trim() || 'Learner'; state.profile.goal = document.querySelector('[data-profile-goal]').value.trim() || 'Understand Indonesia region by region'; saveState(); render(); });
  document.querySelector('[data-scroll="reminder"]')?.addEventListener('click', () => { window.location.hash = '#/'; setTimeout(() => document.querySelector('#reminder')?.scrollIntoView({ behavior: 'smooth' }), 50); });
}
async function enableNotifications() { if (!('Notification' in window)) { alert('Browser notifications are not supported here.'); return; } const permission = await Notification.requestPermission(); if (permission === 'granted') new Notification('Nusantara Learning', { body: `Your next Indonesia class is: ${currentLesson().title}` }); }
window.addEventListener('hashchange', render);
if (!window.location.hash) window.location.hash = '#/';
render();
if (shouldRemindToday(state, getToday())) document.title = 'Nusantara Learning · Your class is waiting';

if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
