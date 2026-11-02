# Quenta TeraPost v0.8.2

## Mobile studio and interaction
- Mobile layout rebuilt with larger text, comfortable spacing, image-led story cards, larger touch controls, and four primary destinations plus a More bottom sheet.
- Added a community-context feature card with an explicitly labelled generated illustration, a link to the 2 March 2024 ICIR River Kura report, and a warning that the artwork is not site evidence.
- Expanded the onboarding story using Earth imagery and packaged observations, with plain-language explanations.
- Added an observation-date timeline for 8 October and 20 October 2026 (12 days apart).
- Added a translucent SVG analytics chart showing the supplied valid-pixel response distribution (72.7% lower later, 27.3% higher later; 1 unchanged pixel). These are measurement differences, not flood or crop classes.
- Preserved Dark and Light primary modes and the twelve accent themes in Settings.

## KUNTAU badge
- The app icon, favicon, header and onboarding use the KUNTAU Science Academy crest isolated from the finalized TerraPulse emblem. The public app name remains Quenta TeraPost.

## PWA launch and speed
- Manifest uses the app-relative root (`./`) for `start_url` and `scope`, and `TeraPost` as the short Android label.
- Added PNG app icons and Apple touch icon.
- Service worker cache bumped to `ktp-shell-v10-mobile-studio`; large ZIP downloads are no longer in the first-install precache.
- The 3D globe uses lower particle counts, geometry and pixel ratio on phones, and prefers low-power mode.
- Removed the render-blocking Google Fonts import in favour of a system font stack.
- Added an Android installation guide in Settings and `INSTALL_ON_ANDROID.md`.

## Phone launch warning
The Windows development server binds to `127.0.0.1` on the computer. A phone cannot use that address. After deploying this release, remove the previous home-screen icon, visit the public HTTPS Cloudflare URL in Chrome on the phone, and install again.

## Science integrity retained
The observations are 8 October 2026 (SHSH) and 20 October 2026 (DHDH), 12 days apart. Both supplied QA summaries report an identification-group check failure; the Kura test AOI is not field-verified against the Rafin Kura channel. The comparison remains exploratory.

## Image source and context
The community feature uses a real World Bank photograph of a rehabilitated irrigation canal in Kano, credited to David Shonowo for the World Bank, as regional context. It is not the Kura test site. A generated local image is used only as a clearly labelled offline fallback. The home page links the 2024 ICIR River Kura impact report and an earlier 2022 Tiga Dam/Kano community flood-photo report.

## On-demand tools
Leaflet is downloaded only when Explore map is opened. GeoTIFF.js and Proj4js are downloaded only when a user selects original GeoTIFF files. Three.js loads asynchronously after the app shell is rendered. If a library cannot load, the rest of the workspace remains usable and the map displays a retry message.
