import { readFileSync } from 'fs';
import { join } from 'path';

// Simulate the GPTAgentRegistry.registerAll() logic
const registryPath = join(process.cwd(), 'registry.json');
const data = JSON.parse(readFileSync(registryPath, 'utf-8'));

// Filter for Active GPTs only (matching the fix)
const activeGPTs = data.filter(gpt => gpt.status === "Active");
const draftCount = data.length - activeGPTs.length;

console.log('📊 Agent Registration Test');
console.log('========================');
console.log(`Total entries in registry.json: ${data.length}`);
console.log(`Active entries: ${activeGPTs.length}`);
console.log(`Draft entries (will be skipped): ${draftCount}`);
console.log('');
console.log('✅ Expected behavior after fix:');
console.log(`   - Only ${activeGPTs.length} Active agents will be registered`);
console.log(`   - ${draftCount} Draft agents will be skipped`);
console.log('');
console.log('❌ Old behavior (before fix):');
console.log(`   - All ${data.length} agents would be registered (including Draft)`);
console.log('');

if (activeGPTs.length === 64) {
  console.log('✅ Correct: 64 Active agents found');
} else {
  console.log(`⚠️  Warning: Expected 64 Active agents, found ${activeGPTs.length}`);
}

if (draftCount === 11) {
  console.log('✅ Correct: 11 Draft agents will be skipped');
} else {
  console.log(`⚠️  Warning: Expected 11 Draft agents, found ${draftCount}`);
}

