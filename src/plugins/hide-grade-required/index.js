/**
 * Hide “Grade required to pass the course” (LM-123) on /learner-dashboard.
 *
 * Prefer FPF `Hide` / `Wrap` on `default_contents` when the host exposes a slot;
 * otherwise use CSS or brand SCSS after inspecting the DOM and slot structure.
 *
 * Set slot IDs in `src/shared/constants.js` after checking Ulmo’s
 * frontend-app-learner-dashboard for `PluginSlot` `id` values.
 *
 * Use symbols from `src/shared/pluginFramework.js` when defining operations.
 */

/** @type {Record<string, object>} */
export const hideGradeRequiredPluginSlots = {
  // [SLOT_IDS.courseCard]: {
  //   keepDefault: true,
  //   plugins: [],
  // },
};
