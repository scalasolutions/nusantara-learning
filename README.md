# Nusantara Learning

A private, gamified Indonesia-learning companion. The first MVP is designed as an installable web app/PWA and keeps learning progress in the browser.

## MVP

- Indonesia 101 lesson path
- XP, streaks, lesson completion, and quiz rewards
- Resume exactly where you left off
- Region explorer cards
- Individual class pages with real Wikimedia Commons media and source credits
- Curated institutional resources for every class
- Learner profile, dashboard statistics, saved notes, and learning history
- Browser reminder preferences and notification permission
- Responsive UI for desktop and mobile

## Run locally

```bash
npm install
npm test
npm run dev
```

Open the local URL printed by Vite.

## Reminder behavior

Reminder preferences are stored locally in the browser. Enable notifications from the app's reminder card. Telegram delivery can be added as a separate private integration later; no bot token is stored in this client app.

## Scope

This is a learning companion, not an academic reference database. Lessons distinguish established facts from simplifications and interpretations, and the content will grow region by region.
