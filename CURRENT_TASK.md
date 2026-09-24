# APLANUS — Current Development State

## Status
IN PROGRESS — PR #23 updated with Sun/Moon long-press and hero swap fixes; awaiting mobile/Vercel Preview review and owner approval.

## Active task
- Prevent native long-press previews and dragging on homepage/Planets images, including Sun and SVG Moon.
- Keep the smaller Moon visible when Sun is active.
- Prevent touch-swipe synthetic clicks from switching the selected Sun/Moon slide back.
- Preserve astronomy calculations, image sources, lunar phase and ordinary tap/swipe controls.

## Working branch
`fix/disable-image-long-press`

## Preview / approval state
Vercel Preview: branch-specific URL still needs verification.
Owner approval: PENDING.
Merge status: DO NOT MERGE before mobile preview review and explicit approval.

## Checks
- Inspected homepage hero CSS, markup and swipe/tap handlers.
- Changes scoped to homepage hero CSS/JS, existing image protection and this handoff.
- Live iPhone long-press, swap and Vercel deployment checks remain pending.

## Previous task
PR #22 hero Sun/Moon frame fix merged into main on 2026-09-22.
