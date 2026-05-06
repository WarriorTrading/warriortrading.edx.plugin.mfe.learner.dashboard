import { buildPluginSlots } from './src/buildConfig.js';
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
const config = {
  pluginSlots: buildPluginSlots(),
};

export default config;
