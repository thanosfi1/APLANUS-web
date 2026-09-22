# APLANUS — Current Development State

## Status
APPROVED — homepage brightest-visible-planet card ready to merge.

## Active task
- Remove the «Κυρίαρχος Αστερισμός Εποχής» card from the homepage.
- Replace it with a «Φωτεινότερος ορατός πλανήτης» card.
- Select the brightest major planet currently above the horizon for the selected location/date/time.
- Show apparent magnitude, altitude, date/time, and realistic planet imagery.
- Use the same realistic planet imagery in the planet cards, including minor-body presentation without visible black image backgrounds.

## Working branch
`feature/realtime-earth-day-night`

## Preview / approval state
Vercel Preview: https://aplanus-sky-dev-git-feature-realtime-e-ba99d9-thanosfotis3-1320.vercel.app
Preview status: READY
Owner approval: APPROVED
Merge status: PENDING MERGE

## Checks
- Scoped to `index.html` plus this handoff file.
- Astronomy Engine provides apparent magnitudes and horizon positions for the selected/current time.
- External Wikimedia Commons planet imagery is used by the homepage.
- Vercel check succeeded for approved preview head `ff7d395595795dadbb0f4e84932791f6b55ba71e`.
- PR is mergeable and was 11 commits ahead / 0 behind main before this handoff update.

## Last known handoff
2026-09-22

## Next action
Merge PR #13 after this handoff update passes the required preview check.
