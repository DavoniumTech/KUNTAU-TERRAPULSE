# KUNTAU TP — Main Application Update Specification

This specification is for the next integration into the existing PWA after the current source code is inspected. It is not an implementation claim; the standalone `science-review.html` page is the only frontend addition in this pack.

## Product principles

1. Farmer-first language, with scientific detail available when requested.
2. No unvalidated claim about crop health, flooding, soil moisture, or agricultural action.
3. Dates, channels, units, data quality, and uncertainty are visible beside every map.
4. The app must explain what the data can and cannot show.
5. The experience must remain usable on lower-cost Android phones and slower connections.

## Required application experience

### Mobile navigation
- Fixed bottom navigation with clear labels and safe-area padding.
- Large readable body text, high-contrast labels, and touch targets of at least 44 CSS pixels.
- Avoid overlapping the map controls or device gesture area.

### Main destinations
- **Explore:** choose a region and see available observations.
- **Compare:** show the two observation dates separately and a difference view only when approved.
- **Learn:** explain radar, channels, units, masks, limitations, and the meaning of the legend.

### Comparison screen
- Show 8 October and 20 October as separate, date-labelled observations.
- Show acquisition configuration and channel for each date.
- Display the validation status prominently.
- Keep the difference layer hidden or clearly marked exploratory until approved.
- Explain that a matching grid is not the same as scientific comparability.

### Learning and settings
- Add an in-app user guide under Settings.
- Define SAR, NISAR, HH, HV, GCOV, masks, valid pixels, and uncertainty in plain language.
- Include the farmer explanation from `KUNTAU_TP_FARMER_EXPLANATION.md`.

### Visual design and performance
- Use a rich but restrained palette with distinct accent colours; do not rely on a single blue/green tone.
- Improve map legends, loading states, and error messages.
- Retain a recognisable Earth/satellite visual identity without making the 3D background compete with the data.
- Load heavy visual effects only where supported; prefer reduced-motion support and low-bandwidth defaults.
- Check every visible button and navigation item on mobile and desktop.

## Acceptance tests

- A first-time user can identify the two dates without help.
- A first-time user can explain in their own words what the radar display represents.
- The app never labels radar return as “crop health” without validated supporting methodology.
- When comparison validation is pending or failed, the app clearly says so.
- Both observations remain separately accessible.
- The app remains readable at 360px screen width.
- Navigation, buttons, offline/error states, and install prompts are tested.
- Existing routes, data files, and PWA install behaviour remain intact.
