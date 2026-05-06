/**
 * Merge `pluginSlots` fragments. When the same slot id appears in multiple
 * fragments, `plugins` arrays are concatenated (order: first fragment first)
 * and `keepDefault` is true only if all fragments keep the default.
 *
 * @param {...Record<string, object>} fragments
 * @returns {Record<string, object>}
 */
export function mergePluginSlots(...fragments) {
  /** @type {Record<string, object>} */
  const out = {};
  for (const frag of fragments) {
    if (frag == null || typeof frag !== 'object') {
      continue;
    }
    for (const [slotId, slot] of Object.entries(frag)) {
      if (slot == null || typeof slot !== 'object') {
        continue;
      }
      const incoming = Array.isArray(slot.plugins) ? slot.plugins : [];
      const incomingKeep = slot.keepDefault !== false;
      if (!out[slotId]) {
        out[slotId] = {
          keepDefault: incomingKeep,
          plugins: [...incoming],
        };
      } else {
        const prev = out[slotId];
        out[slotId] = {
          keepDefault: prev.keepDefault !== false && incomingKeep,
          plugins: [...(prev.plugins || []), ...incoming],
        };
      }
    }
  }
  return out;
}
