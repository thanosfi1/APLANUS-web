# APLANUS — Current Development State

This file is the short, continuously updated handoff between development sessions.

## Status
IN PROGRESS — observation visibility rules are implemented and awaiting owner approval.

## Active task
Correct the `Παρατήρηση` section so the Moon is marked visible whenever it is above the horizon, Venus is visible above the horizon even during daytime, other planets are visible only during astronomical night and above the horizon, and Deep-Sky targets are shown as visible only during astronomical night and only when above the horizon.

## Working branch
`fix/observation-visibility-rules` (PR #5)

## Preview / approval state
Vercel Preview: https://aplanus-sky-dev-git-fix-observation-vi-5f0754-thanosfotis3-1320.vercel.app
Preview status: NEEDS REDEPLOY / CHECK for latest commit `a9c34e71f83676b02afe1aed393c1ddfdf3b85b0`.
Owner approval: PENDING.
Merge status: NOT MERGED.

Checks: source-level review performed for the requested visibility rule; Vercel preview must be rechecked for latest commit before approval.

For every future user-visible task, record:
- Vercel preview URL;
- whether preview was actually checked;
- owner approval: PENDING / APPROVED;
- merge status.

Never merge to `main` while approval is PENDING.

## Last known handoff
2026-09-21

## Latest requested adjustment
- Venus remains eligible above the horizon during daytime.
- Mercury, Mars, Jupiter, Saturn, Uranus and Neptune require astronomical night (`Sun altitude < -12°`) and altitude above the horizon.
- Deep-Sky visibility rule remains unchanged.

## Important current priorities
- Preserve existing working APLANUS behavior and design.
- Astronomy accuracy and traceable source attribution are important.
- Stellar-system/component counts must not be guessed.
- Live Sky / AR is intentionally not a current priority unless explicitly requested.
- Preview every user-visible change on Vercel before merging to main.
- Merge only after explicit owner approval.

## Before starting the next task
Read:
1. `AGENTS.md`
2. `APLANUS_CONTEXT.md`
3. this file
4. current relevant code and recent repository changes

Then replace the Active task section with the exact requested task and record the branch being used.

## Before ending every session
Update this file with:
- exact status: IN PROGRESS / BLOCKED / READY;
- what was completed;
- what remains;
- working branch;
- PR number/link if one exists;
- Vercel preview URL;
- preview check result;
- owner approval: PENDING / APPROVED;
- checks actually performed;
- unresolved questions/known issues;
- exact next action.

Do not write vague notes such as "continue later." The purpose is for a completely new ChatGPT conversation to recover the work accurately.
