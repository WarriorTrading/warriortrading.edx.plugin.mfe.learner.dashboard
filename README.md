# warriortrading.edx.plugin.mfe.learner.dashboard

Warrior Trading's Open edX frontend plugin for learner dashboard MFE customizations, including default course sorting and enhanced user experience features.

## edX code framework

We use the [Frontend Plugin Framework](https://github.com/openedx/frontend-plugin-framework) so customizations stay in **plugin slot configuration** instead of forking [frontend-app-learner-dashboard](https://github.com/openedx/frontend-app-learner-dashboard).

- **This repo** holds `env.config.js` and `src/plugins/*`: merge-friendly `pluginSlots` and feature-specific stubs.
- **The host MFE** (built by Ulmo/Tutor) supplies URLs, auth, and the `PluginSlot` locations; slot `id` values must match the **exact revision** of the learner-dashboard image you ship.

## Node.js (nvm)

Use [nvm](https://github.com/nvm-sh/nvm) and the version in [`.nvmrc`](.nvmrc):

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
cd /path/to/warriortrading.edx.plugin.mfe.learner.dashboard
nvm install   # first time
nvm use
npm install
npm run validate
npm run lint
```

`npm run validate` runs against [`src/buildConfig.validate.js`](src/buildConfig.validate.js): it checks the same **slot shape** as the merged [`buildConfig.js`](src/buildConfig.js) graph without importing [`CourseListSlotAugment.js`](src/plugins/course-list-alphabetical/CourseListSlotAugment.js) (browser-only). The webpack bundle uses [`src/buildConfig.js`](src/buildConfig.js) via [`env.config.js`](env.config.js); [`mergePluginSlots.js`](src/mergePluginSlots.js) **concatenates** `plugins` when multiple fragments use the same slot id.

[`env.config.js`](env.config.js) mirrors the course list slot config onto the key **`course_list_slot`** (FPF `idAlias` on `CourseListSlot`) so `usePluginSlot`’s `findLast` lookup cannot pick a stale empty bucket keyed only by the alias.

### Troubleshooting: course list plugins not applying

On `/learner-dashboard`, open DevTools and run:

```js
getConfig().pluginSlots['org.openedx.frontend.learner_dashboard.course_list.v1'];
getConfig().pluginSlots.course_list_slot;
```

Both should reference the **same** object and include your course-list **`insert`** operation (Title A–Z + grade strip). If `course_list_slot` pointed at a different `{ plugins: [] }` object than the canonical id, the UI would ignore Warrior plugins until the mirror in `env.config.js` is present.

### Optional: CSS-only hide for audit passing-grade banner

If you remove the grade-hiding logic from [`CourseListSlotAugment.js`](src/plugins/course-list-alphabetical/CourseListSlotAugment.js), you can hide the strip with theme SCSS (fragile across Paragon upgrades), for example targeting `.course-card-banners` in your brand plugin—verify selectors in DevTools for your Paragon version.

## Dependency versions

Align `@openedx/frontend-plugin-framework` with the learner-dashboard MFE Ulmo builds (see that repo’s `package.json` / lockfile). This repo starts from `^1.7.0`; **pin** to Ulmo’s resolved version when integrating to avoid duplicate or mismatched React / platform behavior.

`react` and `react-dom` are **peer** dependencies so versions stay in sync with the host.

## Tutor dev (Ulmo) — integrated layout

Ulmo’s MFE plugin copies this tree into the Docker build context as **`warrior-learner-dashboard/`** next to `Dockerfile` and `env.config.jsx`:

`$TUTOR_ROOT/env/plugins/mfe/build/mfe/warrior-learner-dashboard/`

The Dockerfile **`COPY`s** that directory into **`/openedx/app/warrior-learner-dashboard`** for **every** MFE image (so shared `env.config.jsx` can resolve the dynamic import path at webpack build time). Only **`APP_ID === 'learner-dashboard'`** actually imports and merges [`env.config.js`](env.config.js) from that folder.

Merge behavior lives in Ulmo’s **`env.config.jsx`**: it calls `mergeWarriorPluginSlots(config, warriorConfig.pluginSlots)` after the existing learner-dashboard Indigo slots.

### Sync this repo into Tutor before (or after) you edit files

From this repo, with `TUTOR_ROOT` set:

```sh
export TUTOR_ROOT=/path/to/tutor-root
./scripts/sync-to-tutor-mfe.sh
```

Then rebuild the MFE image (Ulmo / Tutor as you usually run it), e.g.:

```sh
tutor images build mfe
```

**Recreate** the **`mfe`** container after a rebuild so it binds the **new** image ID. `docker restart` / `tutor dev restart mfe` reuses the old image layer while the tag `openedx-mfe:…` already points at the new build. Example (adjust compose paths to your `TUTOR_ROOT`):

```sh
docker compose -f "$TUTOR_ROOT/env/local/docker-compose.yml" -f "$TUTOR_ROOT/env/dev/docker-compose.yml" \
  --project-name tutor_dev up -d --force-recreate --no-deps mfe
```

Or remove and `tutor dev start` the `mfe` service per your Ulmo docs.

### Bind mount for fast iteration (dev only)

After a successful image build, overlay your working copy (same container path webpack uses):

```sh
tutor mounts add mfe /ABS/PATH/TO/warriortrading.edx.plugin.mfe.learner.dashboard:/openedx/app/warrior-learner-dashboard
```

Restart `mfe` so the mount applies. Edits under `src/` and root `env.config.js` should hot-reload; changes to Ulmo **`env.config.jsx`** still need a rebuild. Use `tutor mounts list` to inspect mounts. **Do not use bind mounts in production Kubernetes** — use `COPY` + pinned tags only.

### Reference

- Frontend Platform [ADR on JS-based config](https://github.com/openedx/frontend-platform/blob/master/docs/decisions/0007-javascript-file-configuration.rst)

## DevOps and Kubernetes (portable delivery)

Local `TUTOR_ROOT` and venv paths are for **developer convenience only**. Staging and production must **not** rely on personal directories or ad hoc bind mounts.

**Build-time rule:** Anything that runs in the browser (including [`CourseListSlotAugment.js`](src/plugins/course-list-alphabetical/CourseListSlotAugment.js)) must be **compiled inside the `frontend-app-learner-dashboard` webpack bundle** when the MFE image is built.

**Recommended handoff to DevOps:**

1. **Pin versions:** Use one git tag (or digest) for `frontend-app-learner-dashboard` and one for this repo per environment.
2. **Copy into the MFE tree:** In the Docker/CI stage that builds the MFE images, `COPY` this repository (or a tarball) to **`warrior-learner-dashboard/`** in the Tutor MFE build context and into **`/openedx/app/warrior-learner-dashboard`** in the image (see Ulmo’s `Dockerfile`). Merge [`env.config.js`](env.config.js) via Ulmo’s `env.config.jsx` as in the Tutor dev section above.
3. **Rebuild on change:** When this repo’s tag changes, rebuild and redeploy the learner-dashboard image; there is no separate runtime-only artifact for the course list augment plugin.

Optional long-term improvement: contribute a `getConfig()`-driven default sort in the upstream MFE so operators can use config-only merges without a slot plugin that reads `courseListData`.

### Manual verification (local or after deploy)

After merging `pluginSlots` into the learner-dashboard image and rebuilding the MFE:

1. Activate your Tutor venv and set `TUTOR_ROOT` (see below).
2. Rebuild or restart the learner-dashboard MFE so webpack picks up this repo’s files and merged `env.config`.
3. Log in as a learner with **multiple** courses, open `/learner-dashboard`, and confirm the list order matches **Refine → Title (A–Z)** on first paint (allow for a brief flash before `useLayoutEffect` runs).
4. Confirm the audit strip **“Grade required to pass the course: …%”** is hidden on course cards (or adjust SCSS / remove that logic in `CourseListSlotAugment.js` per the optional section above).

## Important: Tutor env

Run the following to set environment when working with Ulmo locally:

```sh
# if Tutor is in a venv
# This varies by different users so change "pathto"
source ~/pathto/tutor-ulmo/venv-tutor-ulmo/bin/activate
export TUTOR_ROOT=~/pathto/tutor-ulmo/tutor-root
```
