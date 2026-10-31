# KUNTAU TERRAPULSE — Release notes

## v0.5.0 — KTP 3D Space Studio

- Official project monogram is **KTP** (Kuntau TerraPulse): K = Kuntau; TP = TerraPulse. It is not KTT or KTC.
- Refreshed SVG and PNG app icons (32, 192 and 512 px) and corrected brand-mark accessibility text.
- Expanded from a small home-page 3D illustration to a full-window Three.js space scene with an illustrated Earth, orbital paths, satellite model, small moons/planets, sun-like star, starfield and drifting particles.
- Adaptive rendering: lower pixel ratio and 30 FPS target on small screens; reduced-motion and WebGL fallback are supported.
- Persistent sticky top bar, desktop side rail and mobile bottom navigation retained.
- PWA manifest and service-worker cache revised so installed clients can receive the new shell and icon.
- Local server remains bound to 127.0.0.1 and now sends basic security headers (CSP, no-sniff, no-frame, restricted device permissions).
- Raster handling, before/after comparison, map layers, metadata exports and scientific caveats are retained.

## Important limitations

- Three.js solar-system scene is illustrative, not a live satellite tracker, live Earth rendering, or the source of scientific map evidence.
- The app is an installable Progressive Web App (PWA), not a native Android APK. Install it from the browser to open in a standalone app window.
- The local Python server is for demonstration and local testing only; it is not a hardened internet-facing production server.
- The October 8 SHSH and October 20 DHDH products remain subject to scientific comparability review. The test AOI has not been verified as the reported river reach.
