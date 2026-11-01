# Publish KUNTAU TERRAPULSE v0.8.2 to GitHub `main` (Windows CMD)

The release root contains `PUBLISH_TO_GITHUB_MAIN.bat`. Use that script instead of hand-writing a Robocopy line; it normalizes the source folder path so a trailing-backslash quoting error cannot occur.

## One-command extraction and publish

1. Place `KUNTAU_TERRAPULSE_V0.8.2_MOBILE_STUDIO.zip` in your Windows Downloads folder.
2. Open CMD.
3. Copy the complete one-line command from the package-root file `CMD_EXTRACT_AND_PUBLISH.txt`.
4. The command extracts the release to the Desktop and launches `PUBLISH_TO_GITHUB_MAIN.bat`.
5. Press Enter to use the default Desktop clone path, or enter the full path to the existing clone (without quotation marks).
6. Review the staged file list. Type `Y` only when it is correct.

The script checks that the `origin` remote is `https://github.com/DavoniumTech/KUNTAU-TERRAPULSE.git`, refuses to overwrite a dirty local Git clone, fetches/pulls `main`, preserves `.git`, excludes raw GeoTIFF/HDF5 files and credentials, checks the staged files, then asks before committing and pushing.

## Cloudflare Pages

- Production branch: `main`
- Root directory: `app`
- Build command: `exit 0`
- Build output directory: `.`

A successful push triggers a deployment only if Cloudflare Pages is already connected to this GitHub repository and branch. Check the Cloudflare deployment log before reinstalling the phone app.

## Android installation

Do not install the phone app from the Windows local preview (`http://127.0.0.1:8080`). Deploy to Cloudflare first, remove the previous home-screen app, open the public HTTPS Pages/custom-domain address in Chrome on the phone, then choose **Install app** or **Add to Home screen**. See `INSTALL_ON_ANDROID.md`.

## Data safety

Do not put the original Float32 GeoTIFFs, source HDF5 granules, Earthdata `.netrc`/`_netrc`, `.dodsrc`, `.env` files, passwords, tokens, private keys or certificates into the public repository. The package includes preview/QA evidence and metadata; the original full science products are obtained separately from ASF after local Earthdata authentication.
