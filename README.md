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

`npm run validate` runs against [`src/buildConfig.js`](src/buildConfig.js) (same `pluginSlots` merge as [`env.config.js`](env.config.js)) so it does not need to load `@openedx/frontend-plugin-framework` in plain Node; the host MFE’s webpack build still resolves the full `env.config.js` graph.

## Dependency versions

Align `@openedx/frontend-plugin-framework` with the learner-dashboard MFE Ulmo builds (see that repo’s `package.json` / lockfile). This repo starts from `^1.7.0`; **pin** to Ulmo’s resolved version when integrating to avoid duplicate or mismatched React / platform behavior.

`react` and `react-dom` are **peer** dependencies so versions stay in sync with the host.

## Wiring into Ulmo (learner-dashboard image)

`env.config.js` is intended to be **merged** with the host’s JavaScript config (see Frontend Platform [ADR on JS-based config](https://github.com/openedx/frontend-platform/blob/master/docs/decisions/0007-javascript-file-configuration.rst)). How you merge depends on your Tutor plugin or Dockerfile, for example:

- Copy or bind-mount this repo’s `env.config.js` into the learner-dashboard app directory before `npm run build`, **or**
- Concatenate / deep-merge `pluginSlots` from this file into the host’s `env.config.js` in a build step.

Document the exact Ulmo pipeline here once it is fixed (single file replacement vs merge).

## Important: Tutor env

Run the following to set environment when working with Ulmo locally:

```sh
# if Tutor is in a venv
# This varies by different users so change "pathto"
source ~/pathto/tutor-ulmo/venv-tutor-ulmo/bin/activate
export TUTOR_ROOT=~/pathto/tutor-ulmo/tutor-root
```
