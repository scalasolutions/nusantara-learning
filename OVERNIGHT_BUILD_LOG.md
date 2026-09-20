# Overnight build log

## 2026-09-21 03:14 WIB
- Added backward-compatible spaced review state and pure scheduling transitions: first review after 1 day, then 3/7/14/30-day intervals; remembered reviews award +5 XP, missed reviews reset to tomorrow.
- Added dashboard review queue with explicit “I remembered” and “Review tomorrow” actions. Original completion history and +100 XP milestones remain unchanged.
- Verification: `npm test` (9 passing), `npm run build` (Vite production build passed), `git diff --check` (passed), and headless Chrome smoke-rendered home, class, and dashboard routes. Dashboard rendered the new spaced-review empty state without app runtime errors.
- Remaining risks: progress, reminders, and review scheduling remain device-local; browser notifications are still best-effort and do not guarantee delivery while the app is closed. No cloud sync, auth, payments, or reliable external scheduler is included.

## 2026-09-21 03:47 WIB
- Added a real installable PWA foundation: manifest metadata, SVG app icon, service worker with offline fallback/cache cleanup, and registration on HTTPS or localhost. Updated documentation to distinguish offline revisit support from reliable background reminders.
- Verification: `npm test` (9 passing), `npm run build` (Vite production build passed), `git diff --check` (passed), and Chrome headless smoke-rendered `http://localhost:5173/#/dashboard` with the expected profile, review, and empty-history UI. Manifest, service worker, and HTML links also returned successfully over the local server.
- Remaining risks: offline support is limited to the app shell and previously visited same-origin content; remote fonts/media/resources still require network. Notifications remain best-effort and progress remains device-local.
