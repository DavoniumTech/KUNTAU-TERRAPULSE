# Install KUNTAU TERRAPULSE on Android

## Why the old icon could not connect

The Windows `START_TERRAPULSE.bat` launcher runs a local preview at `http://127.0.0.1:8080`. That address refers to the computer itself. When the app is installed on a phone, `127.0.0.1` refers to the phone, not the computer. A phone home-screen app cannot use the Windows local-preview address.

## Correct phone installation

1. Deploy this release to Cloudflare Pages: production branch `main`, root directory `app`, build command `exit 0`, output directory `.`.
2. Wait until deployment succeeds and the public HTTPS Cloudflare Pages or custom-domain address shows the updated TERRAPULSE home page in Chrome.
3. On the phone, long-press the old TERRAPULSE icon and remove/uninstall the old home-screen app.
4. Open the live HTTPS site in Chrome on the phone. Do not use a `file://` URL, `127.0.0.1`, or `localhost`.
5. Open Chrome's three-dot menu and choose **Install app** or **Add to Home screen**. Confirm.
6. Launch the new KUNTAU TERRAPULSE crest icon. It should open in a standalone app window.

The updated manifest uses the app-relative root (`./`) for both `start_url` and `scope`; the service-worker cache has also been refreshed. Removing the old icon and reinstalling from the current HTTPS deployment ensures Android saves the corrected launch address.

## Is the app source code visible to users?

No. TERRAPULSE is a Progressive Web App (PWA), not an APK from Google Play. HTML, CSS and JavaScript are the files the browser uses to render the interface. When launched from the installed icon, people see the finished workspace, not source-code text.
