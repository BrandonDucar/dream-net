#!/usr/bin/env tsx
/**
 * Test Server Startup Sequence
 * 
 * Tests critical imports and identifies blockers
 */

console.log('🔍 Testing Server Startup Sequence...\n');

const tests = {
  critical: [] as Array<{ name: string; passed: boolean; error?: string }>,
  optional: [] as Array<{ name: string; passed: boolean; error?: string }>
};

// Test 1: Core Express setup
console.log('1️⃣ Testing Core Express...');
try {
  const express = await import('express');
  tests.critical.push({ name: 'express', passed: true });
  console.log('   ✅ Express');
} catch (error: any) {
  tests.critical.push({ name: 'express', passed: false, error: error.message });
  console.log(`   ❌ Express: ${error.message}`);
}

// Test 2: Environment config
console.log('\n2️⃣ Testing Environment Config...');
try {
  const { getEnvConfig } = await import('../server/config/env');
  const config = getEnvConfig();
  tests.critical.push({ name: 'env-config', passed: true });
  console.log(`   ✅ Env Config - NODE_ENV: ${config.NODE_ENV}, PORT: ${config.PORT}`);
  console.log(`   ✅ INIT_SUBSYSTEMS: ${config.INIT_SUBSYSTEMS || false}`);
} catch (error: any) {
  tests.critical.push({ name: 'env-config', passed: false, error: error.message });
  console.log(`   ❌ Env Config: ${error.message}`);
}

// Test 3: Critical routes
console.log('\n3️⃣ Testing Critical Routes...');
const criticalRoutes = [
  { name: 'health', path: '../server/routes/health' },
  { name: 'ops', path: '../server/routes/ops' },
  { name: 'star-bridge', path: '../server/routes/star-bridge' },
  { name: 'super-spine', path: '../server/routes/super-spine' },
];

for (const route of criticalRoutes) {
  try {
    await import(route.path);
    tests.critical.push({ name: `route-${route.name}`, passed: true });
    console.log(`   ✅ ${route.name}`);
  } catch (error: any) {
    tests.critical.push({ name: `route-${route.name}`, passed: false, error: error.message });
    console.log(`   ❌ ${route.name}: ${error.message}`);
  }
}

// Test 4: Core subsystems (Super Spine, Star Bridge)
console.log('\n4️⃣ Testing Core Subsystems...');
const coreSubsystems = [
  { name: 'StarBridgeLungs', path: '@dreamnet/star-bridge-lungs' },
  { name: 'SuperSpine', path: '../server/routes/super-spine' },
];

for (const subsystem of coreSubsystems) {
  try {
    await import(subsystem.path);
    tests.critical.push({ name: subsystem.name, passed: true });
    console.log(`   ✅ ${subsystem.name}`);
  } catch (error: any) {
    tests.critical.push({ name: subsystem.name, passed: false, error: error.message });
    console.log(`   ❌ ${subsystem.name}: ${error.message}`);
  }
}

// Test 5: Optional subsystems (only if INIT_SUBSYSTEMS=true)
console.log('\n5️⃣ Testing Optional Subsystems...');
const optionalSubsystems = [
  { name: 'NeuralMesh', path: '@dreamnet/neural-mesh' },
  { name: 'WolfPack', path: '@dreamnet/wolf-pack' },
  { name: 'OctopusExecutor', path: '@dreamnet/octopus-executor' },
];

for (const subsystem of optionalSubsystems) {
  try {
    await import(subsystem.path);
    tests.optional.push({ name: subsystem.name, passed: true });
    console.log(`   ✅ ${subsystem.name}`);
  } catch (error: any) {
    tests.optional.push({ name: subsystem.name, passed: false, error: error.message });
    console.log(`   ⚠️  ${subsystem.name}: ${error.message} (optional)`);
  }
}

// Test 6: Routes module
console.log('\n6️⃣ Testing Routes Module...');
try {
  const routesModule = await import('../server/routes');
  if (routesModule?.registerRoutes) {
    tests.critical.push({ name: 'routes-module', passed: true });
    console.log('   ✅ Routes Module');
  } else {
    tests.critical.push({ name: 'routes-module', passed: false, error: 'registerRoutes not found' });
    console.log('   ❌ Routes Module: registerRoutes not found');
  }
} catch (error: any) {
  tests.critical.push({ name: 'routes-module', passed: false, error: error.message });
  console.log(`   ❌ Routes Module: ${error.message}`);
}

// Summary
console.log('\n📊 Summary:');
const criticalPassed = tests.critical.filter(t => t.passed).length;
const criticalTotal = tests.critical.length;
const optionalPassed = tests.optional.filter(t => t.passed).length;
const optionalTotal = tests.optional.length;

console.log(`\n   Critical: ${criticalPassed}/${criticalTotal} passed`);
if (criticalPassed < criticalTotal) {
  console.log('\n   ❌ CRITICAL FAILURES:');
  tests.critical.filter(t => !t.passed).forEach(t => {
    console.log(`      - ${t.name}: ${t.error}`);
  });
}

console.log(`\n   Optional: ${optionalPassed}/${optionalTotal} passed`);

if (criticalPassed === criticalTotal) {
  console.log('\n✅ All critical tests passed! Server should start.');
} else {
  console.log('\n❌ Critical failures detected. Server may not start.');
  process.exit(1);
}

