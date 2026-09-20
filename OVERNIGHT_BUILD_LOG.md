## 2026-09-21 05:56 WIB
- Added first-run onboarding with a clear Indonesia-learning value proposition, learner name and goal capture, and local persistence. Fresh profiles now see onboarding before the course shell; existing profiles with activity are automatically treated as onboarded, preserving legacy progress and storage compatibility.
- Verification: focused RED test failed before implementation as expected; then `npm test` (13 passing), `npm run build` (Vite production build passed), `git diff --check` (passed), and live Vite HTTP smoke checks confirmed the app shell, manifest, and onboarding form/module wiring. Full interactive browser verification was unavailable because Chrome/Chromium and Playwright are not installed in this environment.
- Remaining risks: onboarding/profile/progress remain device-local; browser notifications are best-effort and do not guarantee delivery while the app is closed; no cloud sync, auth, payments, or reliable external scheduler is included.

## 2026-09-21 03:14 WIB
- Added backward-compatible spaced review state and pure scheduling transitions: first review after 1 day, then 3/7/14/30-day intervals; remembered reviews award +5 XP, missed reviews reset to tomorrow.
- Added dashboard review queue with explicit “I remembered” and “Review tomorrow” actions. Original completion history and +100 XP milestones remain unchanged.
- Verification: `npm test` (9 passing), `npm run build` (Vite production build passed), `git diff --check` (passed), and headless Chrome smoke-rendered home, class, and dashboard routes. Dashboard rendered the new spaced-review empty state without app runtime errors.
- Remaining risks: progress, reminders, and review scheduling remain device-local; browser notifications are still best-effort and do not guarantee delivery while the app is closed. No cloud sync, auth, payments, or reliable external scheduler is included.

## 2026-09-21 03:47 WIB
- Added a real installable PWA foundation: manifest metadata, SVG app icon, service worker with offline fallback/cache cleanup, and registration on HTTPS or localhost. Updated documentation to distinguish offline revisit support from reliable background reminders.
- Verification: `npm test` (9 passing), `npm run build` (Vite production build passed), `git diff --check` (passed), and Chrome headless smoke-rendered `http://localhost:5173/#/dashboard` with the expected profile, review, and empty-history UI. Manifest, service worker, and HTML links also returned successfully over the local server.
- Remaining risks: offline support is limited to the app shell and previously visited same-origin content; remote fonts/media/resources still require network. Notifications remain best-effort and progress remains device-local.

## 2026-09-21 04:20 WIB
- Made quiz XP rewards idempotent: a correct answer awards the +10 XP milestone only once per lesson, preventing reload/retry farming while preserving existing `quizBest` state and completion/review rewards.
- Verification: focused RED test failed with 20 XP as expected, then `npm test` (10 passing), `npm run build` (Vite production build passed), and `git diff --check` (passed). Chrome headless rendered the class route from the local dev server (28,182-byte DOM containing the quiz and lesson content); manifest and service worker endpoints also returned successfully.
- Remaining risks: quiz state stores a one-time completion marker rather than detailed attempt history; progress, reminders, and review state remain device-local. Browser notifications are best-effort and do not guarantee delivery while the app is closed.

## 2026-09-21 04:51 WIB
- Fixed streak integrity: a study day now extends the streak only when it follows the previous study date immediately; studying after a gap correctly starts a new one-day streak. Added a regression test while preserving all existing state fields and XP behavior.
- Verification: focused RED test failed with streak 3 instead of 1, then passed after the fix; `npm test` (11 passing), `npm run build` (Vite production build passed), `git diff --check` (passed), and local HTTP smoke checks returned the app shell, manifest, and service worker successfully from Vite.
- Remaining risks: automated browser tooling is not installed in this repo, so this cycle used local HTTP smoke verification rather than a full interactive browser session. Progress, reminders, and review state remain device-local; browser notifications are best-effort and do not guarantee delivery while the app is closed.

## 2026-09-21 05:23 WIB
- Separated lesson content from media/resource metadata: `resources.js` now exports immutable lookup data, while the UI composes resource-enriched lesson views without mutating the content module at import time. This preserves the current storage/state contract and reduces SPA blank-screen risk as content scales.
- Added a regression test proving lesson content remains free of injected resource properties while all six classes retain media/resource lookups.
- Verification: focused RED test failed because the old module mutated lessons, then passed after refactor; `npm test` (12 passing), `npm run build` (Vite production build passed), `git diff --check` (passed), and local Vite HTTP smoke checks for the app shell, module wiring, and class hash route passed.
- Remaining risks: full interactive browser automation is unavailable in this repo; progress, reminders, and review state remain device-local; browser notifications are best-effort and do not guarantee delivery while the app is closed.
