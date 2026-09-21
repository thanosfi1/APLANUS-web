# APLANUS — Current Development State

## Status
IN PROGRESS — updating the 88-constellation star cards.

## Active task
For each of the 88 IAU constellations:
- display only the two brightest HYG catalogue entries by apparent magnitude;
- display distance and spectral type;
- display verified stellar-system multiplicity when available;
- remove the system-type filter from the page;
- explicitly represent Alpha Centauri as a triple system: Rigil Kentaurus, Toliman, and Proxima Centauri;
- render one colored star for a single/unverified object, and the verified number of colored stellar components for multiple systems;
- show component spectral types when the source provides them.

## Working branch
`feature/constellations-two-brightest-system-svg`

## Preview / approval state
Vercel Preview: PENDING
Preview status: PENDING
Owner approval: PENDING
Merge status: NOT MERGED

## Checks
- Change is scoped to `stars.html` plus this handoff file.
- Existing HYG loading and MSC/CDS enrichment are preserved.
- No unknown multiplicity is guessed: unresolved objects remain «Μη επαληθευμένο» and render as one object rather than inventing companions.
- SVG support was extended through seven verified components.

## Last known handoff
2026-09-22

## Next action
Open PR, verify Vercel Preview, send preview to owner, wait for explicit approval before merge.
