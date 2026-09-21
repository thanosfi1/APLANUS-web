# APLANUS — Current Development State

## Status
IN PROGRESS — removing a stray literal `/n` from the top-left navigation menu.

## Active task
Remove the stray `/n` displayed between «Παρατήρηση» and «Αστέρια & Αστερισμοί» in the three-line navigation menu.

## Working branch
`fix/menu-stray-newline`

## Preview / approval state
Vercel Preview: PENDING
Preview status: PENDING
Owner approval: PENDING.
Merge status: NOT MERGED.

Checks: source-level review confirms the stray literal `\n` was present in `index.html` and was removed without changing the surrounding menu items.

## Last known handoff
2026-09-22

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
