/**
 * Test Guardian Framework and Agent Registration
 */

import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🧪 Testing Guardian Framework & Agent Registration\n');

// Test 1: Verify registry.json has correct counts
console.log('📊 Test 1: Registry.json Analysis');
const registryPath = join(process.cwd(), 'registry.json');
const data = JSON.parse(readFileSync(registryPath, 'utf-8'));

const activeGPTs = data.filter(gpt => gpt.status === "Active");
const draftGPTs = data.filter(gpt => gpt.status === "Draft");

console.log(`   Total entries: ${data.length}`);
console.log(`   Active entries: ${activeGPTs.length} ✅`);
console.log(`   Draft entries: ${draftGPTs.length} (will be skipped)`);
console.log(`   Expected drones: ${activeGPTs.length} (one per Active agent)\n`);

// Test 2: Verify agent IDs are unique
console.log('🔍 Test 2: Agent ID Uniqueness');
const agentIds = activeGPTs.map(gpt => {
  const name = gpt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `gpt-${name}`;
});

const uniqueIds = new Set(agentIds);
if (agentIds.length === uniqueIds.size) {
  console.log(`   ✅ All ${agentIds.length} agent IDs are unique`);
} else {
  const duplicates = agentIds.filter((id, index) => agentIds.indexOf(id) !== index);
  console.log(`   ❌ Found ${agentIds.length - uniqueIds.size} duplicate IDs:`);
  duplicates.forEach(id => console.log(`      - ${id}`));
}
console.log('');

// Test 3: Verify Guardian Framework package exists
console.log('🛡️ Test 3: Guardian Framework Package');
import { existsSync } from 'fs';
try {
  const guardianPath = join(process.cwd(), 'packages/guardian-framework-core/index.ts');
  const guardianExists = existsSync(guardianPath);
  if (guardianExists) {
    console.log('   ✅ Guardian Framework package exists');
  } else {
    console.log('   ❌ Guardian Framework package not found');
  }
} catch (error) {
  console.log(`   ⚠️  Error checking package: ${error.message}`);
}
console.log('');

// Test 4: Verify Guardian routes exist
console.log('🛣️  Test 4: Guardian API Routes');
try {
  const routesPath = join(process.cwd(), 'server/routes/guardian.ts');
  const routesExist = existsSync(routesPath);
  if (routesExist) {
    console.log('   ✅ Guardian routes file exists');
    const routesContent = readFileSync(routesPath, 'utf-8');
    const endpoints = [
      '/api/guardian/status',
      '/api/guardian/shields/status',
      '/api/guardian/dome/status',
      '/api/guardian/drones',
      '/api/guardian/fleet/status',
    ];
    endpoints.forEach(endpoint => {
      if (routesContent.includes(endpoint)) {
        console.log(`      ✅ ${endpoint}`);
      } else {
        console.log(`      ❌ ${endpoint} (missing)`);
      }
    });
  } else {
    console.log('   ❌ Guardian routes file not found');
  }
} catch (error) {
  console.log(`   ⚠️  Error checking routes: ${error.message}`);
}
console.log('');

// Test 5: Verify server integration
console.log('🔌 Test 5: Server Integration');
try {
  const serverPath = join(process.cwd(), 'server/index.ts');
  const serverContent = readFileSync(serverPath, 'utf-8');
  
  const checks = [
    { name: 'Guardian router import', pattern: /createGuardianRouter/ },
    { name: 'Guardian route registration', pattern: /\/api\/guardian.*createGuardianRouter/ },
    { name: 'Guardian Framework initialization', pattern: /guardianFramework\.initialize/ },
    { name: 'Guardian cycle interval', pattern: /guardianFramework\.runCycle/ },
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(serverContent)) {
      console.log(`   ✅ ${check.name}`);
    } else {
      console.log(`   ❌ ${check.name} (missing)`);
    }
  });
} catch (error) {
  console.log(`   ⚠️  Error checking server: ${error.message}`);
}
console.log('');

console.log('✅ All tests complete!\n');
console.log('📋 Summary:');
console.log(`   - ${activeGPTs.length} Active agents will be registered`);
console.log(`   - ${activeGPTs.length} personal drones will be created`);
console.log(`   - ${draftGPTs.length} Draft agents will be skipped`);
console.log(`   - Guardian Framework ready for deployment`);

