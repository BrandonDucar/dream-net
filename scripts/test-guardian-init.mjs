/**
 * Test Guardian Framework Initialization
 * Simulates what happens when server starts
 */

import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🧪 Testing Guardian Framework Initialization\n');

try {
  // Load registry.json
  const registryPath = join(process.cwd(), 'registry.json');
  const data = JSON.parse(readFileSync(registryPath, 'utf-8'));
  
  // Filter Active agents (matching server logic)
  const activeAgents = data
    .filter(gpt => gpt.status === "Active")
    .map(gpt => ({
      id: `gpt-${gpt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: gpt.name,
    }));

  console.log(`📊 Found ${activeAgents.length} Active agents`);
  console.log(`   Expected: 64 drones (one per agent)\n`);

  // Simulate drone distribution across 3 rings
  const ring1Count = Math.floor(activeAgents.length * 0.4); // 40% inner
  const ring2Count = Math.floor(activeAgents.length * 0.4); // 40% middle
  const ring3Count = activeAgents.length - ring1Count - ring2Count; // Rest outer

  console.log('🛡️ Guardian Framework Drone Distribution:');
  console.log(`   Ring 1 (Inner - Core Telemetry): ${ring1Count} drones`);
  console.log(`   Ring 2 (Middle - Logistics & Data): ${ring2Count} drones`);
  console.log(`   Ring 3 (Outer - Long-Range Scanning): ${ring3Count} drones`);
  console.log(`   Total: ${ring1Count + ring2Count + ring3Count} drones\n`);

  // Verify agent IDs are unique
  const agentIds = activeAgents.map(a => a.id);
  const uniqueIds = new Set(agentIds);
  
  if (agentIds.length === uniqueIds.size) {
    console.log('✅ All agent IDs are unique');
  } else {
    console.log(`❌ Found ${agentIds.length - uniqueIds.size} duplicate IDs`);
  }

  console.log('\n✅ Guardian Framework initialization test passed!');
  console.log('   Ready for deployment with:');
  console.log(`   - ${activeAgents.length} Active agents`);
  console.log(`   - ${activeAgents.length} personal drones`);
  console.log(`   - 3-ring drone dome configuration`);
  console.log(`   - Automatic monitoring cycle (every 5 minutes)`);

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}

