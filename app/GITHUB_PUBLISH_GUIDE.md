# Publish KUNTAU TERRAPULSE source to GitHub using Windows CMD

## Before you publish

1. Test the app locally in Chrome first.
2. Create an empty GitHub repository named `KUNTAU-TERRAPULSE` (or use your chosen name).
3. Do not upload any `.tif`, `.tiff`, `.h5`, `.hdf5`, `.netrc`, `_netrc`, `.env` or password/token files. The project's `.gitignore` excludes common sensitive/raster formats, but always inspect `git status` before committing.

## CMD commands

Open CMD and enter the application folder (adjust only if you extracted elsewhere):

```cmd
cd /d "%USERPROFILE%\Desktop\KUNTAU_TERRAPULSE_V030\KUNTAU_TERRAPULSE_PWA"
```

Check Git is installed:

```cmd
git --version
```

Start version control and review the file list:

```cmd
git init
git add .
git status
```

Read the status list. It should include source files such as `index.html`, `app.js`, `styles.css`, `manifest.webmanifest`, `assets`, `README_BEGINNER.md` and `IMAGE_CREDITS.md`. It must not include your GeoTIFF/HDF5 data or Earthdata credentials.

Create the first commit:

```cmd
git commit -m "KUNTAU TERRAPULSE v0.7.0: real NISAR evidence integration"
git branch -M main
```

Connect your GitHub repository. Replace the example URL with the exact HTTPS URL displayed by GitHub after creating your repository:

```cmd
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/KUNTAU-TERRAPULSE.git
git push -u origin main
```

GitHub may open a browser sign-in window. Use Git Credential Manager/browser sign-in; do not paste your GitHub password or personal access token into project files or chat.

## Future updates

After editing and testing files:

```cmd
git status
git add .
git commit -m "Describe the update"
git push
```

GitHub is for source-code version history and collaboration. It is not where we store the large local NISAR files. We can configure GitHub Pages or Cloudflare Pages after the app passes its local data tests and the deployment path is chosen.


## v0.7.0 update

Publish the tested update from `integration/nisar-data-map`. Keep original GeoTIFFs, HDF5 products, credentials, `.netrc` and `.dodsrc` out of Git. Review `docs/KTP_V070_RELEASE_NOTES.md` before merging to `main`.
