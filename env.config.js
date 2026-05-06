import { buildPluginSlots } from './src/buildConfig.js';
import { SLOT_IDS } from './src/shared/constants.js';
import {
  DIRECT_PLUGIN,
  IFRAME_PLUGIN,
  PLUGIN_OPERATIONS,
} from './src/shared/pluginFramework.js';

if (!PLUGIN_OPERATIONS || !DIRECT_PLUGIN || !IFRAME_PLUGIN) {
  throw new Error('@openedx/frontend-plugin-framework failed to load expected exports');
}

/**
 * Merge-friendly fragment for the learner-dashboard host.
 * The host supplies LMS URLs and other env; this file should only add what
 * you need (typically `pluginSlots`). Tutor/Docker may deep-merge or replace
 * `env.config.js` — document your Ulmo pipeline in README.
 */
const pluginSlots = buildPluginSlots();
// FPF `usePluginSlot` resolves config with `findLast` over keys matching the slot
// `id` or any `idAlias`. Mirror the canonical id onto `course_list_slot` so a
// later empty entry under the alias cannot win over this merged config.
if (pluginSlots[SLOT_IDS.courseList]) {
  pluginSlots.course_list_slot = pluginSlots[SLOT_IDS.courseList];
}

const config = {
  pluginSlots,
};

export default config;
