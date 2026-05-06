/**
 * LM-123 (hide audit “Grade required to pass the course”) lives in
 * {@link ../course-list-alphabetical/CourseListSlotAugment.js} together with default
 * Title (A–Z) sort — one DIRECT_PLUGIN on the course list slot so slot props match the host.
 *
 * This module stays as an empty merge fragment for backwards-compatible imports from
 * {@link ../../buildConfig.js}.
 */

/** @type {Record<string, object>} */
export const hideGradeRequiredPluginSlots = {};
