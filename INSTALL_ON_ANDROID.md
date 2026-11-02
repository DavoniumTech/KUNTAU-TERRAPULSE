# Install Quenta TeraPost on Android

1. Wait until the updated `main` branch has completed its Cloudflare Pages deployment.
2. On Android, remove the previous TeraPost home-screen shortcut/app.
3. Open the deployed HTTPS Cloudflare website in Chrome (not `127.0.0.1`, `localhost`, or the Windows local-preview address).
4. Open Chrome's menu and select **Install app** or **Add to Home screen**.
5. Launch the new app icon showing the KUNTAU Science Academy crest.

The PWA opens in standalone app display mode. It is still a web-installed PWA, not a signed native APK; it uses the browser's installed-app runtime. After installing, launch it once online so the current service worker can cache the application shell. The map basemap and external source links still require connectivity.
