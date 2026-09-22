# APLANUS — Current Development State

## Status
IN PROGRESS — real planet and moon imagery on the Planets & Satellites page.

## Active task
- Replace the CSS/SVG-style body illustrations inside the planet/dwarf-planet cards in `planets.html` with real spacecraft/astronomical image assets.
- Replace the generic moon circles under each card with real image assets for the named satellites.
- Do not generate imagery; use external Wikimedia/NASA-derived image files.
- Preserve existing planet/moon text, counts, layout, and the top scale comparison.

## Working branch
`feature/planet-moon-real-png`

## Preview / approval state
Vercel Preview: PENDING
Preview status: PENDING
Owner approval: PENDING
Merge status: NOT MERGED

## Checks
- Scoped to `planets.html` plus this handoff file.
- No astronomy calculations or displayed object counts changed.
- Planet imagery uses Wikimedia Commons real-image assets; moon imagery uses named spacecraft/astronomical image assets where available.
- No generated images.

## Last known handoff
2026-09-22

## Next action
Open PR, verify Vercel Preview, send it to owner, and wait for explicit approval before merge.
