# APLANUS — Current Development State

## Status
IN REVIEW — Live Sky phase 1: correct phone-to-sky orientation (true north).

## Owner direction (2026-11-12)
Work only on Live Sky (Ζωντανός Ουρανός). Goal: Stellarium-like experience — moving the phone shows exactly what is in that part of the sky, plus many stars and galaxies. No change is merged without explicit owner approval.

Agreed phases (each = own branch + Vercel preview + owner approval):
1. Correct orientation (this task).
2. Thousands of naked-eye stars (verified open catalogue, real colours/magnitudes, fast rendering).
3. Messier + bright NGC objects, 88 constellations with lines and Greek names.
4. Visual polish: Milky Way band, glow, pinch zoom, horizon.

## Active task (phase 1)
Branch: `fix/live-sky-orientation`
- Root cause found: iOS north offset in `js/sky/sensors.js` (main) was applied with the wrong sign, so the sky was only correct if the iPhone's arbitrary alpha reference happened to be north (error = 2× that reference). Offset was also computed once only and ignored magnetic declination; Android used relative (not absolute) orientation.
- Fix: continuous compass fusion on iOS (only while the camera and the device top edge point the same horizontal way — phone held like reading — and not during fast turns), `deviceorientationabsolute` on Android, magnetic→true north via WMM2025 (`js/sky/wmm.js`, verified against all 100 official NOAA test values), adaptive quaternion smoothing, rAF-throttled rendering.
- Old saved CAL matrix (`aplanusCalMatrix`) is discarded; new key `aplanusCalMatrixV2`.
- Sensor diagnostics are hidden by default; open `sky.html?debug=1` to see them.

## Preview / approval state
Vercel Preview: READY — https://aplanus-sky-dev-git-fix-live-sky-orientation-thanosfotis3-1320.vercel.app/sky.html (PR #53)
Owner device test: PENDING (iPhone + Android if available)
Owner approval: NOT YET GIVEN
Merge status: DO NOT MERGE

## Open PRs touching Live Sky
- #52 (diagnostics only, has a literal "\\n" display bug) — recommended to close, superseded by phase 1. Awaiting owner decision; not closed.
- #47 (isolated sensor lab) — untouched.

## Owner device test #1 (2026-11-12, iPhone) and fix
- Reported: nothing moved until 🧭 was pressed; N/E/S/W wrong; sky "slid".
- Cause: the first version assumed `webkitCompassHeading` follows the back camera when the phone is held up. If it follows the device top edge instead (Core Location portrait default), the offset flips 180° when the camera points above the horizon and the smoothing slowly rotates the sky — matching the report.
- Fix: compass used only when both interpretations agree (camera and top edge within 6°, i.e. phone tilted like reading); simulated under BOTH interpretations, heading error ≤ ~2.5° with compass noise, no drift.
- Start overlay "▶ Ξεκίνα" on mobile (sensor permission needs a tap) also starts GPS.

## Owner device test #2 (2026-11-12): N/E/S/W still appear in random places
- Likely: north never locked (agreement gate too strict) while the sky was still drawn with arbitrary yaw.
- Fix: the app now learns on the device which direction webkitCompassHeading refers to (cam / top / euler = 360-alpha), tracking each hypothesis' consistency while the phone moves; until then only poses where all agree are used. Simulated all three: correct model learned in every run, error ≤5° before / ≤3° after learning.
- Until north is locked a centre guide (yellow) tells the user what to do; the sky is not presented as correct.
- Saved CAL keys V1/V2 discarded (V3), since test-time calibrations were made against wrong north.
- `?debug=1` now shows raw α/β/γ, compass, camH/topH, learned model and per-model rms — ask the owner for a screenshot if still wrong.

## Unresolved / to verify on device
- Owner re-test #3 needed.

## Next action
Owner tests the preview on the phone; on approval merge, then start phase 2.
