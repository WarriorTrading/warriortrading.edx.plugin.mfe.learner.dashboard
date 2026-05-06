/**
 * Shallow-merge `pluginSlots` objects from feature modules.
 * If two modules define the same slot id, the later argument wins; for shared
 * slots, merge `plugins` arrays in one module or extend this helper.
 *
 * @param {...Record<string, object>} fragments
 * @returns {Record<string, object>}
 */
export function mergePluginSlots(...fragments) {
  return Object.assign({}, ...fragments);
}
