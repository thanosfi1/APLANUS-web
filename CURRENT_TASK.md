# APLANUS — Current Development State

## Status
APPROVED — real planet and moon imagery ready to merge.

## Active task
- Replace the CSS/SVG-style body illustrations inside the planet/dwarf-planet cards in `planets.html` with real spacecraft/astronomical image assets.
- Replace the generic moon circles under each card with real image assets for the named satellites.
- Do not generate imagery; use external Wikimedia/NASA-derived image files.
- Preserve existing planet/moon text, counts, layout, and the top scale comparison.

## Working branch
`feature/planet-moon-real-png`

## Preview / approval state
Vercel Preview: https://aplanus-sky-dev-git-feature-planet-moo-f7168d-thanosfotis3-1320.vercel.app
Preview status: READY
Owner approval: APPROVED
Merge status: PENDING MERGE

## Checks
- Scoped to `planets.html` plus this handoff file.
- No astronomy calculations or displayed object counts changed.
- Planet imagery uses Wikimedia Commons real-image assets; moon imagery uses named spacecraft/astronomical image assets where available.
- No generated images.

## Last known handoff
2026-09-22

## Next action
Merge PR #15 after this handoff update.
