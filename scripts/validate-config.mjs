import { buildPluginSlots } from '../src/buildConfig.js';

const pluginSlots = buildPluginSlots();

if (pluginSlots == null || typeof pluginSlots !== 'object') {
  console.error('validate-config: expected pluginSlots to be an object');
  process.exit(1);
}

for (const [slotId, slotConfig] of Object.entries(pluginSlots)) {
  if (slotConfig == null || typeof slotConfig !== 'object') {
    console.error(`validate-config: slot "${slotId}" must be an object`);
    process.exit(1);
  }
  if (!Array.isArray(slotConfig.plugins)) {
    console.error(`validate-config: slot "${slotId}" must have a plugins array`);
    process.exit(1);
  }
}

console.log('validate-config: ok', { slotCount: Object.keys(pluginSlots).length });
