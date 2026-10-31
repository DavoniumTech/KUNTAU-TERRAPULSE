# KUNTAU TP — October Science Review Update Pack

This is a **safe add-on pack** for the existing KUNTAU TERRAPULSE repository. It does not replace the current homepage, source data, application scripts, or deployment settings.

## What this package adds

- `app/science-review.html`, `.css`, `.js`: a mobile-first, plain-language science review page. It reports the October observations and clearly labels the comparison as awaiting validation.
- `docs/KUNTAU_TP_TEAM_WORK_PLAN.md`: responsibilities and reporting instructions for the six-person team.
- `docs/KUNTAU_TP_QGIS_BEGINNER_GUIDE.md`: step-by-step QGIS checks for the two observations. It deliberately avoids assuming layer names or declaring the rasters comparable.
- `docs/KUNTAU_TP_FARMER_EXPLANATION.md`: farmer-facing wording and prohibited overclaims.
- `docs/KUNTAU_TP_APP_UPDATE_SPEC.md`: requirements for integrating the improved experience into the main app after inspecting its existing code.
- `docs/KUNTAU_TP_CLOUDFLARE_DOMAIN_GUIDE.md`: GitHub-to-Cloudflare deployment and custom-domain guidance.
- `data/review/templates/`: CSV templates for metadata, raster quality, and validation records.

## Important science status

The two known acquisitions are 8 October 2026 (SHSH, HH) and 20 October 2026 (DHDH, HH/HV). The shared HH channel does **not** automatically make the observations scientifically comparable. The package therefore does not publish an agricultural change conclusion or farmer recommendation. The QGIS workflow asks the team to assess metadata, geometry, radiometry, masks, quality layers, and supporting evidence first.

## Install into the existing repository (Windows CMD)

1. Open CMD and switch to the existing feature branch first:

```cmd
cd /d "%USERPROFILE%\Desktop\KUNTAU-TERRAPULSE-GITHUB"
git switch integration/nisar-data-map
git pull --ff-only origin integration/nisar-data-map
git status --short
```

2. Extract this ZIP into the **root** of your repository folder. Keep the folder structure. The files in this pack use new names and are intended as additions; do not extract over a different folder.

3. Confirm that the new files are present, then stage only this pack:

```cmd
git add README_KUNTAU_TP_UPDATE.md app/science-review.html app/science-review.css app/science-review.js docs/KUNTAU_TP_TEAM_WORK_PLAN.md docs/KUNTAU_TP_QGIS_BEGINNER_GUIDE.md docs/KUNTAU_TP_FARMER_EXPLANATION.md docs/KUNTAU_TP_APP_UPDATE_SPEC.md docs/KUNTAU_TP_CLOUDFLARE_DOMAIN_GUIDE.md data/review/templates
git diff --cached --check
git status --short
```

4. If the staged list contains only the intended new files and `git diff --cached --check` reports no errors, commit and push:

```cmd
git commit -m "Add KUNTAU TP science review and team validation guide"
git push origin integration/nisar-data-map
```

5. Open this pull-request comparison link and review the files before merging:

https://github.com/DavoniumTech/KUNTAU-TERRAPULSE/compare/main...integration/nisar-data-map?expand=1

**Do not push directly to `main`, do not force-push, and do not create or move release tags for this update.** Merge the reviewed pull request only after checking its contents and confirming the Cloudflare production branch. If your local branch name is different, stop and check `git branch --show-current` before proceeding.

## Test the new page locally

With the current app server running, open:

`http://127.0.0.1:8080/science-review.html`

If your current local server uses a different port or serves a different folder, open the equivalent path under its local address. The page is an additional page; it does not automatically appear in the existing app navigation.

## Scope limitation

This pack adds a working standalone review page and documentation. It does **not** rewrite the existing home screen, bottom navigation, onboarding, 3D Earth, satellite animation, or existing before/after map controls. Those changes require inspecting and modifying the actual current app files. Do not describe this add-on pack as a complete redesign.
