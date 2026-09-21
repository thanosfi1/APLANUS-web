# APLANUS — Current Development State

This file is the short, continuously updated handoff between development sessions.

## Status
READY — no unfinished task is currently recorded.

## Active task
None. Wait for the owner's next explicit request.

## Working branch
`main` is the stable/production baseline. Create a new feature/fix branch for the next task.

## Preview / approval state
No active preview awaiting approval.

For every future user-visible task, record:
- Vercel preview URL;
- whether preview was actually checked;
- owner approval: PENDING / APPROVED;
- merge status.

Never merge to `main` while approval is PENDING.

## Last known handoff
2026-09-21

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
