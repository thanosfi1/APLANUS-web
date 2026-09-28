# APLANUS — Current Development State

## Status
IN REVIEW — Earth seasons and day/night replacement.

## Active task
- Replace the old APLANUS Space / WorldWide Telescope page with a code-rendered Earth.
- Show the Earth's 23.44° axial tilt, computed solar illumination, UTC time, and current astronomical seasons in both hemispheres.
- Rename the homepage menu entry. Preserve other pages and astronomy calculations.

## Working branch
`feature/earth-seasons-day-night`

## Preview / approval state
Vercel Preview: PENDING verification
Preview status: PENDING
Owner approval: NOT YET GIVEN
Merge status: DO NOT MERGE

## Checks
- Source review: removed the third-party telescope iframe; page uses local HTML/CSS/canvas/JS.
- Solar position uses approximate apparent solar longitude, declination and equation of time.
- Land outlines are schematic; no satellite imagery.
- Vercel build and browser appearance require preview verification.

## Next action
Verify Vercel preview, send URL to owner, wait for explicit merge approval.
