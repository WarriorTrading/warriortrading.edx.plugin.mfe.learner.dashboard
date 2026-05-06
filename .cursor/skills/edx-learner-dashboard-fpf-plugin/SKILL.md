---
name: edx-learner-dashboard-fpf-plugin
description: Engineers Open edX learner-dashboard MFE customizations via Frontend Plugin Framework in a sibling repo (warrior-learner-dashboard), Tutor Ulmo merge, webpack constraints, slot Insert vs Wrap, post-build container recreate, and validate/lint patterns. Use when extending warriortrading.edx.plugin.mfe.learner.dashboard, Tutor MFE env.config.jsx, PluginSlot course list, default Title A–Z sort, or hiding CertificateBanner UI without forking frontend-app-learner-dashboard.
disable-model-invocation: true
---

# Open edX learner-dashboard FPF plugin (Tutor Ulmo)

## What this repo is

- **Plugin repo** (not the MFE app): exports `env.config.js` with `pluginSlots` merged into **`frontend-app-learner-dashboard`** at webpack build time.
- **Host** copies this tree to **`warrior-learner-dashboard/`** in the Tutor MFE build context and into **`/openedx/app/warrior-learner-dashboard`** in the image; Ulmo **`env.config.jsx`** dynamically imports `./warrior-learner-dashboard/env.config.js` when `APP_ID === 'learner-dashboard'` and merges `pluginSlots` (e.g. `mergeWarriorPluginSlots`).

## Hard constraints (do not skip)

1. **Webpack resolves from the app root** (`/openedx/app`). Code under `warrior-learner-dashboard/` does **not** get the host’s `src`-relative aliases (e.g. legacy `data/context`). On **`release/ulmo.3`**, `src/data/context` may not exist; sort state lives in **`courseListData.filterOptions.setSortBy`** from `CoursesPanel` / `useCourseListData`.
2. **Prefer `Insert` + `DIRECT_PLUGIN`** for logic that needs **`courseListData`**: `PluginContainerDirect` spreads slot **`pluginProps`** onto `RenderWidget` (same path as default `<CourseList />`). **`Wrap`** passes `component` + `pluginProps`; relying only on Wrap was brittle compared to a single augment component.
3. **`usePluginSlot` picks one config bucket** via `findLast` over `Object.keys(pluginSlots)` matching slot **`id` or `idAliases`**. If two keys (e.g. canonical id vs `course_list_slot`) point at **different** objects, the **last key wins** — not a deep merge. **Mirror** the canonical course list slot onto **`course_list_slot`** as the **same object reference** in exported `pluginSlots` (see repo `env.config.js`).
4. **Merging slot fragments**: use **`mergePluginSlots`** that **concatenates** `plugins` for the same slot id (shallow `Object.assign` per slot **overwrites** and drops plugins).
5. **After `docker build` / `tutor images build mfe`**: the image **tag** moves to a new digest; **`docker restart` / `tutor dev restart mfe` keeps the old container image**. **Recreate** the `mfe` service (`docker compose … up -d --force-recreate mfe`) so the container binds the new image. Then hard-refresh the browser.

## Implementation pattern (reference)

- **Single augment**: `CourseListSlotAugment` — `useLayoutEffect` → `courseListData?.filterOptions?.setSortBy?.('title')`; optional **MutationObserver** for DOM-only hides (e.g. CertificateBanner “Grade required to pass…” — **English defaultMessage**; add locales if needed). Target **`.course-card-banners`** and `:scope > *` before Paragon-specific classes.
- **Slot id**: `org.openedx.frontend.learner_dashboard.course_list.v1` (alias `course_list_slot` on host `CourseListSlot`).
- **`npm run validate`**: uses **`src/buildConfig.validate.js`** — must **not** import webpack-only / React augment through a path that loads `@edx/frontend-platform` in Node. Use **string** `op`/`type` (`'insert'`, `'DIRECT_PLUGIN'`) in modules that validate imports if FPF import pulls platform.
- **Sync**: `./scripts/sync-to-tutor-mfe.sh` with **`TUTOR_ROOT`** → `env/plugins/mfe/build/mfe/warrior-learner-dashboard/`.

## Verification checklist

- [ ] `npm run lint` && `npm run validate` in plugin repo  
- [ ] Sync → image build → **`--force-recreate` `mfe`**  
- [ ] Browser: `getConfig().pluginSlots['org.openedx.frontend.learner_dashboard.course_list.v1']` and `.course_list_slot` — **same object**, includes expected `insert`  
- [ ] `/learner-dashboard`: Refine shows **Title (A–Z)**; grade strip behavior as designed  

## Repo map

| Area | Role |
|------|------|
| `env.config.js` | `buildPluginSlots()`, alias mirror `course_list_slot` |
| `src/buildConfig.js` | Merges feature `pluginSlots` fragments for webpack |
| `src/buildConfig.validate.js` | Node-safe shape check (no augment import) |
| `src/mergePluginSlots.js` | Concatenate `plugins` per slot id across fragments |
| `src/plugins/course-list-alphabetical/` | Course list augment (`Insert`) |
| `src/plugins/hide-grade-required/` | Empty merge stub; LM-123 lives in augment unless split later |

## Anti-patterns

- Importing host-only modules from plugin files that **`npm run validate`** loads.  
- Assuming **`restart`** applies a newly built MFE image.  
- **`Hide` on `course_card_banner`** to remove **CertificateBanner** text (different component tree).  
- Relying on **English substring** for production multi-locale without a plan.

## Further reading

- Root [`README.md`](../../../README.md) — Tutor paths, recreate command, troubleshooting `getConfig().pluginSlots`.
