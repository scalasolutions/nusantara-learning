import { LESSONS, REGIONS } from './content.js';
import {
  calculateProgress,
  completeLesson,
  createInitialState,
  getToday,
  markAnswer,
  normalizeState,
  shouldRemindToday,
} from './core.js';
import './styles.css';

const STORAGE_KEY = 'nusantara-learning-state-v1';
let state = loadState();
let activeLessonId = state.currentLessonId;
let answerState = null;

function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
  } catch {
    return createInitialState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function lesson(id = activeLessonId) {
  return LESSONS.find((item) => item.id === id) || LESSONS[0];
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

function render() {
  const current = lesson();
  const progress = calculateProgress(state, LESSONS.length);
  const completed = new Set(state.completedLessonIds);
  const reviewCount = Object.keys(state.quizBest).length;
  document.querySelector('#app').innerHTML = `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="#top" aria-label="Nusantara Learning home">
          <span class="brand-mark">✦</span>
          <span><strong>Nusantara</strong><small>Learning journey</small></span>
        </a>
        <div class="top-stats" aria-label="Learning statistics">
          <span class="stat-pill streak">🔥 <b>${state.streak}</b> day streak</span>
          <span class="stat-pill xp">✦ <b>${state.xp}</b> XP</span>
          <span class="avatar">FY</span>
        </div>
      </header>

      <main id="top" class="layout">
        <aside class="sidebar">
          <div class="sidebar-intro">
            <span class="eyebrow">INDONESIA 101</span>
            <h1>Understand the archipelago, one story at a time.</h1>
            <p>Build the map first. Then let history, people, belief, and everyday life connect.</p>
          </div>
          <div class="progress-block">
            <div class="progress-label"><span>Your journey</span><strong>${progress}%</strong></div>
            <div class="progress-track"><span style="width:${progress}%"></span></div>
            <small>${completed.size} of ${LESSONS.length} foundations complete</small>
          </div>
          <nav class="lesson-nav" aria-label="Course lessons">
            ${LESSONS.map((item) => `
              <button class="lesson-nav-item ${item.id === current.id ? 'active' : ''} ${completed.has(item.id) ? 'done' : ''}" data-lesson="${item.id}">
                <span class="lesson-number">${completed.has(item.id) ? '✓' : item.number}</span>
                <span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.tag)} · ${item.duration}</small></span>
              </button>`).join('')}
          </nav>
          <button class="settings-link" data-scroll="reminder">⚙ Reminder settings</button>
        </aside>

        <section class="content">
          <section class="hero-card" style="--accent:${current.color}">
            <div class="hero-copy">
              <div class="eyebrow">EPISODE ${current.number} · ${escapeHtml(current.region.toUpperCase())}</div>
              <h2>${escapeHtml(current.title)}</h2>
              <p class="hero-subtitle">${escapeHtml(current.subtitle)}</p>
              <div class="hero-meta"><span>◷ ${current.duration}</span><span>✦ ${current.xp} XP</span><span>▣ ${current.tag}</span></div>
              <button class="primary-button" data-action="start">${completed.has(current.id) ? 'Review episode' : 'Start episode'} <span>→</span></button>
            </div>
            <div class="hero-orbit" aria-hidden="true"><div class="orbit-line"></div><div class="island-shape island-a"></div><div class="island-shape island-b"></div><div class="island-shape island-c"></div><span>INDONESIA</span></div>
          </section>

          <section class="continue-card">
            <div class="continue-icon">▶</div>
            <div><span class="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h3>${escapeHtml(current.title)}</h3><p>${state.lastStudyDate ? `Last studied ${state.lastStudyDate}` : 'Your first expedition starts here.'}</p></div>
            <button class="text-button" data-action="start">Continue <span>→</span></button>
          </section>

          <section class="section-heading"><div><span class="eyebrow">EXPLORE THE ARCHIPELAGO</span><h2>Indonesia is many worlds</h2></div><span class="section-note">Seven regions · one shared journey</span></section>
          <section class="region-grid">${REGIONS.map((region) => `<article class="region-card" style="--region:${region.color}"><div class="region-art"><span>${region.name === 'Bali & Nusa Tenggara' ? '◒' : region.name === 'Papua' ? '✺' : '◇'}</span></div><div><h3>${escapeHtml(region.name)}</h3><p>${escapeHtml(region.note)}</p><span class="locked-label">${region.id === 'java' ? 'AVAILABLE NEXT' : 'UNLOCK AS YOU LEARN'}</span></div></article>`).join('')}</section>

          <section class="lesson-panel" id="lesson-panel">
            <div class="section-heading compact"><div><span class="eyebrow">TODAY'S LESSON</span><h2>${escapeHtml(current.title)}</h2></div><span class="lesson-status">${completed.has(current.id) ? 'COMPLETED' : 'READY'}</span></div>
            <div class="story-card"><p>${escapeHtml(current.story)}</p></div>
            <div class="fact-grid">${current.facts.map(([label, text]) => `<article><span class="fact-label ${label.toLowerCase().replace(/ /g, '-')}">${escapeHtml(label)}</span><p>${escapeHtml(text)}</p></article>`).join('')}</div>
            <div class="vocab-section"><div class="subheading"><h3>Words to carry with you</h3><span>5 new words</span></div><div class="vocab-grid">${current.vocabulary.map(([word, meaning]) => `<div><strong>${escapeHtml(word)}</strong><span>${escapeHtml(meaning)}</span></div>`).join('')}</div></div>
            <div class="quiz-card" id="quiz-card"><div class="quiz-heading"><span class="quiz-icon">?</span><div><span class="eyebrow">CHECK YOUR MAP</span><h3>${escapeHtml(current.question)}</h3></div></div><div class="answers">${current.answers.map((answer, index) => `<button class="answer-button" data-answer="${index}">${String.fromCharCode(65 + index)} <span>${escapeHtml(answer)}</span></button>`).join('')}</div><div class="quiz-result" aria-live="polite"></div></div>
            <div class="lesson-actions"><button class="primary-button" data-action="complete">${completed.has(current.id) ? 'Completed ✓' : 'Complete episode'} <span>+${current.xp} XP</span></button><textarea data-note placeholder="Add a note for your future self...">${escapeHtml(state.notes[current.id] || '')}</textarea></div>
          </section>

          <section class="reminder-card" id="reminder">
            <div class="reminder-icon">🔔</div><div class="reminder-copy"><span class="eyebrow">KEEP THE THREAD</span><h2>Make Indonesia part of your rhythm.</h2><p>Set a gentle reminder so the app remembers where you left off.</p><div class="reminder-controls"><label><input type="checkbox" data-reminder-toggle ${state.reminderEnabled ? 'checked' : ''}/> Remind me</label><input type="time" data-reminder-time value="${state.reminderTime}" ${state.reminderEnabled ? '' : 'disabled'}/><button class="secondary-button" data-action="notifications">Enable browser notifications</button></div><small class="reminder-status">${state.reminderEnabled ? `Next reminder at ${state.reminderTime}` : 'Reminders are currently off.'}</small></div>
          </section>
        </section>
      </main>
      <footer><span>Built for a lifelong Indonesia 101 → 201 journey.</span><span>Progress stays on this device.</span></footer>
    </div>`;
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll('[data-lesson]').forEach((button) => button.addEventListener('click', () => { activeLessonId = button.dataset.lesson; state.currentLessonId = activeLessonId; saveState(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }));
  document.querySelectorAll('[data-action="start"]').forEach((button) => button.addEventListener('click', () => document.querySelector('#lesson-panel').scrollIntoView({ behavior: 'smooth', block: 'start' })));
  document.querySelector('[data-action="complete"]').addEventListener('click', () => {
    state = completeLesson(state, activeLessonId, getToday(), LESSONS);
    activeLessonId = state.currentLessonId;
    saveState();
    render();
    document.querySelector('#lesson-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => answerQuiz(Number(button.dataset.answer))));
  document.querySelector('[data-note]').addEventListener('input', (event) => { state.notes[activeLessonId] = event.target.value; saveState(); });
  document.querySelector('[data-reminder-toggle]').addEventListener('change', (event) => { state.reminderEnabled = event.target.checked; saveState(); render(); });
  document.querySelector('[data-reminder-time]').addEventListener('change', (event) => { state.reminderTime = event.target.value; saveState(); render(); });
  document.querySelector('[data-action="notifications"]').addEventListener('click', enableNotifications);
  document.querySelector('[data-scroll="reminder"]').addEventListener('click', () => document.querySelector('#reminder').scrollIntoView({ behavior: 'smooth' }));
}

function answerQuiz(index) {
  const current = lesson();
  const result = document.querySelector('.quiz-result');
  const buttons = document.querySelectorAll('[data-answer]');
  const correct = index === current.correct;
  state = markAnswer(state, current.id, correct);
  saveState();
  buttons.forEach((button, buttonIndex) => { button.disabled = true; if (buttonIndex === current.correct) button.classList.add('correct'); if (buttonIndex === index && !correct) button.classList.add('wrong'); });
  result.textContent = correct ? 'Correct — +10 XP. You found the thread.' : `Not quite. The answer is ${String.fromCharCode(65 + current.correct)}. Keep the idea, not just the letter.`;
  result.className = `quiz-result ${correct ? 'success' : 'retry'}`;
}

async function enableNotifications() {
  if (!('Notification' in window)) { alert('Browser notifications are not supported here. The in-app reminder preference is still saved.'); return; }
  const permission = await Notification.requestPermission();
  if (permission === 'granted') new Notification('Nusantara Learning', { body: `Your next Indonesia lesson is: ${lesson().title}` });
}

render();
if (shouldRemindToday(state, getToday())) document.title = 'Nusantara Learning · Your lesson is waiting';
