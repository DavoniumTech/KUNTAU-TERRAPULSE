# Publish KUNTAU TERRAPULSE v1.0.0 to GitHub main

1. Download and extract `KUNTAU_TERRAPULSE_V1.0.0.zip` to the Desktop using the one-line command in the release root file `CMD_EXTRACT_AND_PUBLISH.txt`.
2. The command opens `PUBLISH_TO_GITHUB_MAIN.bat`.
3. The helper checks that the existing clone points to `DavoniumTech/KUNTAU-TERRAPULSE`, updates `main` with fast-forward only, and refuses to work on a dirty clone.
4. Review the proposed file list. Type `YES` only when it is correct.
5. The helper commits and pushes to the existing `origin/main`; it never deletes or recreates the remote repository.

The helper excludes original GeoTIFF/HDF5 files and credential material from the copied/staged files. Cloudflare Pages must already be connected to this repository and branch for automatic deployment.
