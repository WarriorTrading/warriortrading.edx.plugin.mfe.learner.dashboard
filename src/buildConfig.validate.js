import { mergePluginSlots } from './mergePluginSlots.js';
import { hideGradeRequiredPluginSlots } from './plugins/hide-grade-required/index.js';
import { SLOT_IDS } from './shared/constants.js';

/**
 * Shape-only merge for `npm run validate` in Node. Does not import
 * Does not import {@link ./plugins/course-list-alphabetical/CourseListSlotAugment.js}
 * (browser-only; pulled in by {@link ./buildConfig.js} for webpack).
 * The real slot config is merged in {@link ./buildConfig.js} for the webpack bundle.
 */
const courseListAlphabeticalPluginSlotsForValidate = {
  [SLOT_IDS.courseList]: {
    keepDefault: true,
    plugins: [],
  },
};

export function buildPluginSlots() {
  return mergePluginSlots(
    courseListAlphabeticalPluginSlotsForValidate,
    hideGradeRequiredPluginSlots,
  );
}
