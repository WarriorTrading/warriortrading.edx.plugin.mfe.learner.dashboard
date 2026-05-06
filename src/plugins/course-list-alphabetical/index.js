/**
 * Default Title (A–Z) sort and audit passing-grade banner handling for the course list slot.
 *
 * Uses a single **Insert** DIRECT_PLUGIN so `courseListData` is passed from the slot the
 * same way as the default CourseList (Wrap-only paths do not merge slot `pluginProps` the
 * same way in `@openedx/frontend-plugin-framework` PluginContainerDirect).
 *
 * @see https://github.com/openedx/frontend-plugin-framework
 */

import CourseListSlotAugment from './CourseListSlotAugment.js';
import { SLOT_IDS } from '../../shared/constants.js';

/** @type {Record<string, object>} */
export const courseListAlphabeticalPluginSlots = {
  [SLOT_IDS.courseList]: {
    keepDefault: true,
    plugins: [
      {
        // String op/type matches `@openedx/frontend-plugin-framework` constants
        // (`insert` / `DIRECT_PLUGIN`) without importing FPF in `hide-grade-required`.
        op: 'insert',
        widget: {
          id: 'warrior_course_list_slot_augment',
          type: 'DIRECT_PLUGIN',
          priority: 5,
          RenderWidget: CourseListSlotAugment,
        },
      },
    ],
  },
};
