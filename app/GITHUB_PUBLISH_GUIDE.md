# Publish KUNTAU TERRAPULSE v0.8.0 to GitHub `main` (Windows CMD)

## 1. Extract and check the app

1. Extract `KUNTAU_TERRAPULSE_V0.8.0_INTERACTIVE_GLOBE.zip` to your Desktop.
2. Open `KUNTAU_TERRAPULSE_V0.8.0\app` and double-click `START_TERRAPULSE.bat`.
3. Check Overview, Explore map, Compare, Insights, Learn & field guide, Data & methods, and Settings. Try the globe drag/zoom/Focus Kura controls, both display modes and several palettes.
4. The packaged previews work without the original GeoTIFFs. The original Float32 GeoTIFFs are optional and can be selected locally for a fresh recalculation.

## 2. Prepare the repository

The default repository used in this guide is `https://github.com/DavoniumTech/KUNTAU-TERRAPULSE.git`. If the GitHub repository has another owner or name, replace that URL with the repository's exact HTTPS clone URL.

Open CMD. If the repository has not already been cloned onto the Desktop, run this once:

```cmd
cd /d "%USERPROFILE%\Desktop"
git clone https://github.com/DavoniumTech/KUNTAU-TERRAPULSE.git
```

If the repository is already cloned, skip `git clone`. Make sure the extracted update folder is named `KUNTAU_TERRAPULSE_V0.8.0` on the Desktop.

## 3. Copy the update into the existing clone

This copies the new project files into the clone while preserving its `.git` directory and commit history:

```cmd
robocopy "%USERPROFILE%\Desktop\KUNTAU_TERRAPULSE_V0.8.0" "%USERPROFILE%\Desktop\KUNTAU-TERRAPULSE" /E /XD .git
```

Robocopy return codes 0–7 are normally success or success-with-differences. Continue to Git only if the files copied without a serious error.

## 4. Review and push to `main`

```cmd
cd /d "%USERPROFILE%\Desktop\KUNTAU-TERRAPULSE"
git switch main
git status --short
git add .
git status
git commit -m "KTP v0.8.0: interactive 3D Earth and 12 colour themes"
git push origin main
```

Before `git commit`, inspect `git status`. The source project and packaged low-resolution previews/catalogue/QA files may be committed; **do not commit** original `.tif`, `.tiff`, `.h5`, `.hdf5`, `.netrc`, `.dodsrc`, `.env`, access tokens or passwords. The root `.gitignore` excludes these common formats. If Git says there is nothing to commit, there are no staged changes to publish.

GitHub may request sign-in in a browser. Use Git Credential Manager; never put a password or token in code or a project file.

## 5. Cloudflare Pages production settings

In the Cloudflare Pages project connected to this repository, set:

- **Production branch:** `main`
- **Root directory:** `app`
- **Build command:** `exit 0`
- **Build output directory:** `.`

Save the settings. A successful push to `main` should trigger a Pages deployment automatically. Verify the deployment log and open the generated Pages URL. The app is a static PWA; this update does not create a backend or upload raw source rasters.

## Later updates

After making and testing another change, use `git status`, `git add .`, `git commit -m "Describe the change"` and `git push origin main`.
