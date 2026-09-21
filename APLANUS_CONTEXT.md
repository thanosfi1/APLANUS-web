# APLANUS — AI / Developer Handover

## Purpose
This file is the persistent context for development of APLANUS. It is intended to let a developer — and a new ChatGPT conversation — continue from the current repository state without relying on old chat history.

## Repository
- Repository: thanosfi1/APLANUS-web
- Production/default branch: main
- The repository is public.
- Always inspect the current repository before making changes. The repository is the source of truth; this document is guidance and may lag behind code.

## Current project structure
At the time this handover was created, main contains:
- index.html — main/home page
- stars.html — stars
- planets.html — planets
- nebulae.html — nebulae/deep-sky content
- sky.html — sky feature
- calendar.html — astronomical calendar
- observation.html — observation feature
- css/ — styles
- js/ — JavaScript modules/assets
- api/ — API-related code
- manifest.json — PWA manifest
- sw.js — service worker

## Existing astronomy work
The project has been developed around real astronomical data/calculations rather than invented values. Previous work includes Astronomy Engine-based calculations, location/GPS-related functionality, sky calculations (including RA/Dec to altitude/azimuth), Sun/Moon/planet information, astronomical calendar/eclipses, stars/constellations/deep-sky features and source attribution.

Star/system data work has included HYG and external astronomical catalog/source integration. Previous development specifically attempted to improve:
- the brightest stars shown for each constellation;
- whether an object is a single star or a multiple-star system;
- the number of components in a stellar system;
- separate display of components;
- visible source labels such as HYG / WDS or equivalent verified source;
- avoiding unverified astronomy claims.

IMPORTANT: astronomical facts must not be guessed. If catalogues disagree, preserve/identify the source and uncertainty rather than silently inventing a value.

## Current constraint
Live Sky / AR and problematic iPhone sensor/AR work were intentionally deprioritized. Do not restart or substantially redesign that area unless the owner explicitly asks for it.

## Mandatory development rules
1. READ BEFORE WRITE. Inspect the current relevant files and recent repository state before editing.
2. ONE REQUEST = ONE SCOPED CHANGE. Do not redesign unrelated parts of the application.
3. NEVER replace a large working file merely because rewriting it is easier.
4. Preserve existing working functionality, navigation, visual language and mobile behavior unless the request explicitly changes them.
5. Never fabricate astronomical data. Prefer authoritative/traceable sources and keep source attribution where appropriate.
6. Do not silently remove features, data, links, calculations or UI.
7. Keep changes small and reviewable.
8. Before considering a task complete, check for broken references, obvious JS errors, missing files and unintended regressions in affected pages.
9. Do not push experimental work directly into main. Use a feature branch and a Pull Request unless the owner explicitly instructs otherwise.
10. Never commit passwords, tokens, API keys, private credentials or secrets.
11. If the requested change conflicts with existing behavior or requires a large architectural rewrite, explain the conflict before implementing it.
12. Do not assume previous ChatGPT messages are correct when they conflict with the repository. Current code wins.

## Git workflow
For each development task:
1. Sync/read current main.
2. Create a dedicated branch, e.g. feature/<short-name> or fix/<short-name>.
3. Make only the requested change.
4. Test/review the affected pages.
5. Commit with a descriptive message.
6. Open a Pull Request into main.
7. In the PR description record:
   - what changed;
   - files changed;
   - tests/checks performed;
   - known limitations or remaining work.
8. Merge only after review/approval.

## Continuity across ChatGPT chats
A new ChatGPT conversation MUST NOT depend on the previous conversation.

At the beginning of every new chat, give the assistant the repository and say:

"Continue development of APLANUS from the current repository state. First read APLANUS_CONTEXT.md and inspect the current main branch and relevant files. Treat the repository as the source of truth. Do not change code yet. Summarize the current state, then wait for my requested change."

Before ending a development session, the developer should ensure that all completed work is committed/pushed and that unfinished work is represented by a branch/PR or clearly recorded below.

## SESSION STATE
This section is the lightweight handoff between sessions.

Last handover baseline: 2026-09-21

Current principle:
- main is the stable baseline.
- New development should happen through branches + PRs.
- Live Sky / AR is not the current priority.
- Accuracy of star/system data and source traceability is important.

When a task is completed, update this section only when there is important context that cannot be understood from commits/PRs.

### In progress
- None recorded in this handover file.

### Next task
- Defined by the owner in the next development request.

### Known cautions
- Re-check stellar-system/component counts against reliable astronomical sources before presenting them as verified.
- Do not revive old assumptions from chat history if the current repository has newer code/data.
- PWA assets/service-worker behavior should be verified before relying on offline/install behavior.

## Prompt for each new ChatGPT chat
Copy/paste:

You are continuing development of the APLANUS web application.
Repository: thanosfi1/APLANUS-web

FIRST:
1. Read APLANUS_CONTEXT.md from the current main branch.
2. Inspect the current repository state and the files relevant to my request.
3. Treat current repository code + merged commits as the source of truth, not memories from an older chat.
4. Do not make unrelated improvements.
5. Do not remove working functionality.
6. For astronomy data, never guess; use traceable reliable sources and preserve source attribution.
7. Work on a dedicated branch and propose changes through a Pull Request unless I explicitly tell you otherwise.
8. Keep each change small enough to review and roll back.

Before editing, briefly tell me what you found and which files you expect to touch. Then perform only the change I request.
