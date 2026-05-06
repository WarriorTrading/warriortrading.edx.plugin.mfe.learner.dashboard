import { mergePluginSlots } from './mergePluginSlots.js';
import { courseListAlphabeticalPluginSlots } from './plugins/course-list-alphabetical/index.js';
import { hideGradeRequiredPluginSlots } from './plugins/hide-grade-required/index.js';

/**
 * Assembled `pluginSlots` for the learner-dashboard host (no FPF package import;
 * safe to load from Node-based `npm run validate`).
 */
export function buildPluginSlots() {
  return mergePluginSlots(
    courseListAlphabeticalPluginSlots,
    hideGradeRequiredPluginSlots,
  );
}
