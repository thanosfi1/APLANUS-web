# APLANUS Agent Rules

These instructions apply to every AI coding session in this repository.

## Startup protocol — mandatory
Before changing code:
1. Read `APLANUS_CONTEXT.md`.
2. Read `CURRENT_TASK.md`.
3. Inspect current `main`, recent commits/PRs, and only the files relevant to the request.
4. Treat repository state as truth. Never rely on memory from another chat.
5. Briefly state: current task, relevant files, intended minimal change.
6. If CURRENT_TASK conflicts with the user's newest explicit instruction, the newest instruction wins and CURRENT_TASK must be updated accordingly.

## Anti-drift / anti-hallucination rules
- Do not invent requirements, astronomy facts, APIs, files, functions, dependencies, or completed work.
- Do not perform "helpful" unrelated refactors, redesigns, cleanup, renames, dependency changes or architecture changes.
- Do not delete or replace working functionality unless explicitly requested.
- Never rewrite a large working file merely to make a small change.
- Inspect definitions/call sites before changing shared JavaScript, CSS, APIs, service-worker or navigation behavior.
- For astronomical facts/data: verify against traceable reliable sources. If uncertain or conflicting, mark it unresolved rather than guessing.
- Never claim a test/check passed unless it was actually run or verifiably checked.
- Never expose or commit secrets/tokens/passwords.
- Do not push experimental changes directly to `main`.

## Mandatory preview-before-production workflow
For every user-visible feature/fix:
1. Start from current `main` and work on a dedicated feature/fix branch.
2. Make only the scoped requested change.
3. Create/use a Vercel Preview Deployment for that branch/PR.
4. Automatically locate the newest Vercel Preview URL created for the active branch/PR and give that clickable URL directly to the owner in ChatGPT, together with exactly what changed and what was checked. The owner/friend must not be required to open the Vercel dashboard just to find the preview.
   - Prefer the deployment/status/check associated with the current branch/commit/PR.
   - Verify that the URL corresponds to the current change before presenting it.
   - If Vercel has not finished deploying yet, check its deployment/status rather than inventing or reusing an older URL.
   - Never present the stable `aplanus-sky-dev.vercel.app` URL as the new change's preview unless it has been verified to represent that exact current deployment.
5. DO NOT merge to `main` merely because the implementation is complete or the preview builds successfully.
6. Wait for explicit owner approval such as "βάλ' το", "merge", or equivalent.
7. Only after that approval may the PR be merged into `main`/production.
8. If the preview is unavailable or broken, treat the task as not approved and do not merge.

Known APLANUS preview/development deployment: `https://aplanus-sky-dev.vercel.app`. Verify the actual branch/PR preview URL for each task rather than assuming this stable URL always represents the current branch.

## Change protocol
Default workflow:
`main -> feature/fix branch -> scoped edits -> checks -> Vercel Preview -> owner review/approval -> Pull Request merge -> main/production`.

One requested feature/fix should remain one coherent change. If a request unexpectedly requires broad architectural work, stop and explain why before doing it.

## Completion protocol — mandatory
Before saying a task is finished:
1. Review the diff for unrelated changes.
2. Run/perform the checks available for the affected area.
3. Confirm existing related behavior was preserved.
4. Commit/push the work and open/update a PR when appropriate.
5. Automatically retrieve and provide the current branch/PR's clickable Vercel preview URL in the chat; do not make the owner search the Vercel dashboard. Then wait for explicit owner approval before merge.
6. Update `CURRENT_TASK.md` so another fresh chat can continue without old conversation history.
7. Report exactly what changed, what was checked, what remains, branch/PR/preview, and any uncertainty.

## New-chat recovery
A fresh chat should need only this repository. It must read `AGENTS.md`, `APLANUS_CONTEXT.md`, and `CURRENT_TASK.md` before editing.
