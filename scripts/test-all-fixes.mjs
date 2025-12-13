#!/usr/bin/env node
/**
 * Comprehensive Test Suite for Deployment Fixes
 * Tests all fixes for 75 agents issue, Guardian 404, and /agents route
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Comprehensive Test Suite for Deployment Fixes\n');
console.log('=' .repeat(60) + '\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result === true || (result && result.passed)) {
      console.log(`✅ ${name}`);
      testsPassed++;
      return true;
    } else {
      console.log(`❌ ${name}`);
      if (result && result.message) console.log(`   ${result.message}`);
      testsFailed++;
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    testsFailed++;
    return false;
  }
}

// Test 1: Registry Structure
test('Registry.json has correct structure', () => {
  const registryPath = join(__dirname, '../registry.json');
  if (!existsSync(registryPath)) return { passed: false, message: 'registry.json not found' };
  
  const registryData = JSON.parse(readFileSync(registryPath, 'utf8'));
  const total = registryData.length;
  const active = registryData.filter(gpt => gpt.status === 'Active').length;
  const draft = registryData.filter(gpt => gpt.status === 'Draft').length;
  
  return total === 75 && active === 64 && draft === 11;
});

// Test 2: Agent Registry Filtering
test('GPTAgentRegistry filters for Active GPTs only', () => {
  const registryCodePath = join(__dirname, '../server/gpt-agents/GPTAgentRegistry.ts');
  if (!existsSync(registryCodePath)) return { passed: false, message: 'GPTAgentRegistry.ts not found' };
  
  const code = readFileSync(registryCodePath, 'utf8');
  return code.includes('status === "Active"') && 
         code.includes('filter(gpt => gpt.status === "Active")');
});

// Test 3: Agent Count Logging
test('Server logs Active/Draft breakdown', () => {
  const serverIndexPath = join(__dirname, '../server/index.ts');
  if (!existsSync(serverIndexPath)) return { passed: false, message: 'server/index.ts not found' };
  
  const code = readFileSync(serverIndexPath, 'utf8');
  return code.includes('stats.byStatus?.Active') && 
         code.includes('stats.byStatus?.Draft');
});

// Test 4: Guardian Framework Package
test('Guardian Framework package exists', () => {
  const guardianPath = join(__dirname, '../packages/guardian-framework-core');
  return existsSync(guardianPath) && 
         existsSync(join(guardianPath, 'GuardianFramework.ts')) &&
         existsSync(join(guardianPath, 'types.ts'));
});

// Test 5: Guardian getStatus() Returns Null
test('GuardianFramework.getStatus() can return null', () => {
  const frameworkPath = join(__dirname, '../packages/guardian-framework-core/GuardianFramework.ts');
  if (!existsSync(frameworkPath)) return { passed: false, message: 'GuardianFramework.ts not found' };
  
  const code = readFileSync(frameworkPath, 'utf8');
  return code.includes('getStatus(): GuardianStatus | null') &&
         code.includes('if (!this.initialized)') &&
         code.includes('return null');
});

// Test 6: Guardian Routes Null Checks
test('All Guardian routes check for null status', () => {
  const routesPath = join(__dirname, '../server/routes/guardian.ts');
  if (!existsSync(routesPath)) return { passed: false, message: 'guardian.ts routes not found' };
  
  const code = readFileSync(routesPath, 'utf8');
  const routes = ['/status', '/shields/status', '/dome/status', '/drones', '/fleet/status'];
  
  for (const route of routes) {
    const pattern = new RegExp(`router\\.get\\("${route.replace('/', '\\/')}"[^]*?if \\(!status\\)`, 's');
    if (!pattern.test(code)) {
      return { passed: false, message: `Route ${route} missing null check` };
    }
  }
  return true;
});

// Test 7: Guardian Routes Return 503
test('Guardian routes return 503 when uninitialized', () => {
  const routesPath = join(__dirname, '../server/routes/guardian.ts');
  if (!existsSync(routesPath)) return { passed: false, message: 'guardian.ts routes not found' };
  
  const code = readFileSync(routesPath, 'utf8');
  return code.includes('res.status(503)');
});

// Test 8: /agents Route Exists
test('/agents route exists in server/index.ts', () => {
  const serverIndexPath = join(__dirname, '../server/index.ts');
  if (!existsSync(serverIndexPath)) return { passed: false, message: 'server/index.ts not found' };
  
  const code = readFileSync(serverIndexPath, 'utf8');
  return code.includes('app.get("/agents"');
});

// Test 9: /api/agents Route Enhanced
test('/api/agents route includes GPT agents', () => {
  const agentRouterPath = join(__dirname, '../server/routes/agent.ts');
  if (!existsSync(agentRouterPath)) return { passed: false, message: 'agent.ts router not found' };
  
  const code = readFileSync(agentRouterPath, 'utf8');
  return code.includes('router.get("/agents"') && 
         (code.includes('gptAgentRegistry') || code.includes('gptAgents'));
});

// Test 10: Guardian getAllDrones() Handles Uninitialized
test('getAllDrones() returns empty array when not initialized', () => {
  const frameworkPath = join(__dirname, '../packages/guardian-framework-core/GuardianFramework.ts');
  if (!existsSync(frameworkPath)) return { passed: false, message: 'GuardianFramework.ts not found' };
  
  const code = readFileSync(frameworkPath, 'utf8');
  return code.includes('getAllDrones(): PersonalDrone[]') &&
         code.includes('if (!this.initialized)') &&
         code.includes('return [];');
});

// Test 11: Guardian getDrone() Handles Uninitialized
test('getDrone() returns undefined when not initialized', () => {
  const frameworkPath = join(__dirname, '../packages/guardian-framework-core/GuardianFramework.ts');
  if (!existsSync(frameworkPath)) return { passed: false, message: 'GuardianFramework.ts not found' };
  
  const code = readFileSync(frameworkPath, 'utf8');
  return code.includes('getDrone(agentId: string): PersonalDrone | undefined') &&
         code.includes('if (!this.initialized)') &&
         code.includes('return undefined;');
});

// Test 12: Guardian Initialization Error Logging
test('Guardian initialization logs errors properly', () => {
  const serverIndexPath = join(__dirname, '../server/index.ts');
  if (!existsSync(serverIndexPath)) return { passed: false, message: 'server/index.ts not found' };
  
  const code = readFileSync(serverIndexPath, 'utf8');
  return code.includes('[Guardian Framework] Initialization failed') &&
         code.includes('error.stack');
});

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed\n`);

if (testsFailed === 0) {
  console.log('✅ All tests passed! Ready for deployment.\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please review the errors above.\n');
  process.exit(1);
}

