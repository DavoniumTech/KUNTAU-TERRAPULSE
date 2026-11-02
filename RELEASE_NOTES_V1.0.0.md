# KUNTAU TERRAPULSE v1.0.0 — Brand & navigation refresh

## Product identity
- Restored the exact product name: **KUNTAU TERRAPULSE**.
- Restored the **KTP** monogram and paired it with the KUNTAU Science Academy crest as a visible app badge.
- Kept **Quentausas Corp** as product team/company and KUNTAU Science Academy as institutional collaboration.

## Interface changes
- Removed the scroll-direction auto-hide logic from the mobile bottom navigation. The dock remains fixed and visible during page scrolling.
- Refined safe-area spacing and content clearance below the fixed dock.
- Added a subtle repeating space-doodle wallpaper with planets, stars, a rocket, satellite and orbit motifs in both dark and light modes.
- Added gradient calligraphic accents to display headings while retaining readable body typography.
- Reframed the home feature and onboarding for a broad audience; removed the local flood-impact problem narrative from the main landing feature.
- Improved desktop hero and feature sizing while retaining a phone-first layout.

## PWA changes
- Updated manifest display name, short name, icon cache-busters and root-relative launch path.
- Bumped the service-worker cache to `ktp-shell-v13-fixed-bottom-dock` so the old cached interface is replaced.
- Kept dark/light preferences and migrated the previous saved theme/palette values.

## Verification performed
- JavaScript syntax checks passed for `app.js`, `globe3d.js` and `sw.js`.
- Manifest JSON parsed successfully.
- KTP+badge icon PNG variants were rendered from the bundled SVG and visually inspected.
- Local browser screenshot verification was blocked by the container browser's local-network access policy; no real Android device or Cloudflare deployment was tested.

## Scientific integrity retained
The included Kura evidence remains an exploratory comparison. The 72.729% lower / 27.270% higher values describe common valid radar-measurement pixels, not flood or crop-damage area. The different acquisition modes, QA flags and unverified footprint remain disclosed in the analysis sections.
