# APLANUS — Current Development State

## Status
IN PROGRESS — enriching «Φωτεινότερα Αστέρια Βραδιάς» with spectral and stellar-system information.

## Active task
On the homepage bright-stars cards:
- show each star's spectral type;
- show whether it is a single star or belongs to a stellar system;
- correct Capella's displayed Greek name to «Αίγα / Δίφρος (Capella)».

## Working branch
`feature/bright-stars-spectral-system-info`

## Preview / approval state
Vercel Preview: PENDING
Preview status: PENDING
Owner approval: PENDING.
Merge status: NOT MERGED.

## Checks
- Astronomy metadata was checked against SIMBAD/CDS before being added.
- Existing visibility calculation, magnitude, distance, altitude and star-card selection logic were left unchanged.
- PR #7 (previous homepage title change) was explicitly approved by the owner and merged to main as commit a8e8154b00980e53358d6d9c3243f1820048af73.

## Last known handoff
2026-09-22

## Next action
Open a PR, verify its Vercel Preview, give the owner the preview URL, and wait for explicit approval before merge.
