#!/usr/bin/env tsx
/**
 * DreamNet Exploration Script
 * 
 * Explores all systems, endpoints, and reports on DreamNet status
 * 
 * Usage: pnpm tsx scripts/explore-dreamnet.ts
 */

import { execSync } from 'child_process';

const BASE_URL = 'http://localhost:3000';

console.log('🔍 DreamNet Exploration Report\n');
console.log('='.repeat(60));

const results: Record<string, any> = {};

// Helper to make requests
function request(endpoint: string): any {
  try {
    const response = execSync(`curl -s ${BASE_URL}${endpoint}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    return JSON.parse(response);
  } catch (error: any) {
    return { error: error.message, available: false };
  }
}

// 1. Health & Readiness
console.log('\n1️⃣ Health & Readiness');
console.log('-'.repeat(60));
const health = request('/health');
results.health = health;
if (health.ok) {
  console.log('   ✅ Server is healthy');
  console.log(`   Schema Version: ${health.details?.schema_version || 'unknown'}`);
  console.log(`   Database: ${health.details?.db_backend || 'unknown'}`);
  console.log(`   Security Status: ${health.details?.security?.status || 'unknown'}`);
} else {
  console.log('   ❌ Health check failed');
}

const ready = request('/ready');
results.ready = ready;
if (ready.ok || ready.status === 'ready') {
  console.log('   ✅ Server is ready');
} else {
  console.log('   ⚠️  Server not fully ready');
}

// 2. Agent Registration Status
console.log('\n2️⃣ Agent Citizenship');
console.log('-'.repeat(60));
const agentStatus = request('/api/register-agents/status');
results.agentStatus = agentStatus;
if (agentStatus.success) {
  console.log(`   Agents: ${agentStatus.counts?.agents || 0}/143`);
  console.log(`   Citizens: ${agentStatus.counts?.citizens || 0}/143`);
  console.log(`   Passports: ${agentStatus.counts?.passports || 0}/143`);
  if (agentStatus.status === 'complete') {
    console.log('   ✅ All agents registered!');
  } else {
    console.log('   ⚠️  Agents need registration');
  }
} else {
  console.log('   ⚠️  Agent status unavailable');
}

// 3. Directory Status
console.log('\n3️⃣ Directory & Discovery');
console.log('-'.repeat(60));
const directory = request('/api/directory/status');
results.directory = directory;
if (directory.success) {
  console.log(`   Entities: ${directory.counts?.total || 0}`);
  console.log(`   Agents: ${directory.counts?.agents || 0}`);
  console.log(`   Citizens: ${directory.counts?.citizens || 0}`);
  console.log(`   Nodes: ${directory.counts?.nodes || 0}`);
  console.log(`   Ports: ${directory.counts?.ports || 0}`);
  console.log(`   Conduits: ${directory.counts?.conduits || 0}`);
} else {
  console.log('   ⚠️  Directory status unavailable');
}

// 4. DreamState Governance
console.log('\n4️⃣ DreamState Governance');
console.log('-'.repeat(60));
const dreamState = request('/api/dream-state/status');
results.dreamState = dreamState;
if (dreamState.success) {
  console.log(`   Passports: ${dreamState.passportCount || 0}`);
  console.log(`   Departments: ${dreamState.departmentCount || 0}`);
  console.log(`   Proposals: ${dreamState.proposalCount || 0}`);
  console.log(`   Open Proposals: ${dreamState.openProposals || 0}`);
} else {
  console.log('   ⚠️  DreamState status unavailable');
}

// 5. Star Bridge
console.log('\n5️⃣ Star Bridge (Cross-Chain)');
console.log('-'.repeat(60));
const starBridge = request('/api/star-bridge/status');
results.starBridge = starBridge;
if (starBridge.success || starBridge.status) {
  console.log('   ✅ Star Bridge active');
  console.log(`   Status: ${starBridge.status || 'operational'}`);
} else {
  console.log('   ⚠️  Star Bridge status unavailable');
}

// 6. Wolf Pack
console.log('\n6️⃣ Wolf Pack');
console.log('-'.repeat(60));
const wolfPack = request('/api/wolf-pack/status');
results.wolfPack = wolfPack;
if (wolfPack.success || wolfPack.status) {
  console.log('   ✅ Wolf Pack active');
  console.log(`   Targets: ${wolfPack.targets?.length || 0}`);
} else {
  console.log('   ⚠️  Wolf Pack status unavailable');
}

// 7. Shield Core
console.log('\n7️⃣ Shield Core (Defense)');
console.log('-'.repeat(60));
const shield = request('/api/shield/status');
results.shield = shield;
if (shield.success || shield.status) {
  console.log('   ✅ Shield Core active');
} else {
  console.log('   ⚠️  Shield Core status unavailable');
}

// 8. Agent Gateway
console.log('\n8️⃣ Agent Gateway');
console.log('-'.repeat(60));
const gatewayTools = request('/api/agent/gateway/tools');
results.gatewayTools = gatewayTools;
if (gatewayTools.success) {
  console.log(`   ✅ Agent Gateway active`);
  console.log(`   Available Tools: ${gatewayTools.totalTools || 0}`);
  console.log(`   Your Access: ${gatewayTools.availableTools || 0} tools`);
} else {
  console.log('   ⚠️  Agent Gateway status unavailable');
}

// 9. Economic Engine
console.log('\n9️⃣ Economic Engine');
console.log('-'.repeat(60));
const economic = request('/api/economic-engine/status');
results.economic = economic;
if (economic.success || economic.status) {
  console.log('   ✅ Economic Engine active');
  console.log(`   Tokens: ${economic.tokens?.length || 0}`);
  console.log(`   Balances: ${economic.balances?.length || 0}`);
} else {
  console.log('   ⚠️  Economic Engine status unavailable');
}

// 10. Fleets
console.log('\n🔟 Fleets');
console.log('-'.repeat(60));
const fleets = request('/api/fleets/status');
results.fleets = fleets;
if (fleets.success || fleets.fleets) {
  console.log('   ✅ Fleets system active');
  const fleetList = fleets.fleets || [];
  fleetList.forEach((fleet: any) => {
    console.log(`   - ${fleet.name}: ${fleet.status || 'unknown'}`);
  });
} else {
  console.log('   ⚠️  Fleets status unavailable');
}

// Summary
console.log('\n📊 Summary');
console.log('='.repeat(60));
console.log(`Health: ${results.health?.ok ? '✅' : '❌'}`);
console.log(`Ready: ${results.ready?.ok ? '✅' : '⚠️'}`);
console.log(`Agents Registered: ${results.agentStatus?.counts?.agents || 0}/143`);
console.log(`Directory Entities: ${results.directory?.counts?.total || 0}`);
console.log(`Passports Issued: ${results.dreamState?.passportCount || 0}`);
console.log(`Star Bridge: ${results.starBridge?.status ? '✅' : '⚠️'}`);
console.log(`Wolf Pack: ${results.wolfPack?.status ? '✅' : '⚠️'}`);
console.log(`Agent Gateway: ${results.gatewayTools?.success ? '✅' : '⚠️'}`);

console.log('\n🎯 Next Steps:');
if (!results.agentStatus?.counts?.agents || results.agentStatus?.counts?.agents < 143) {
  console.log('   1. Register agents: POST /api/register-agents');
}
if (!results.dreamState?.passportCount || results.dreamState?.passportCount < 143) {
  console.log('   2. Issue passports to all agents');
}
console.log('   3. Verify all systems operational');
console.log('   4. Ready to deploy! 🚀');

