#!/usr/bin/env tsx
/**
 * Test Reliability System Components
 * 
 * Quick smoke test of the reliability patterns we've implemented.
 */

console.log('🧪 Testing DreamNet Reliability System...\n');

// Test 1: Startup DAG
console.log('1️⃣ Testing Startup DAG...');
try {
  const { getStartupDAG } = await import('../server/core/startup-dag');
  const dag = getStartupDAG();
  
  // Register a test service
  dag.register({
    id: 'test-service',
    name: 'Test Service',
    dependencies: [],
    init: async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    },
    healthCheck: async () => true,
    critical: false,
  });
  
  const status = dag.getStatus();
  console.log(`   ✅ DAG initialized: ${status.total} service(s) registered`);
  console.log(`   ✅ Status: ${status.ready} ready, ${status.failed} failed, ${status.pending} pending\n`);
} catch (error: any) {
  console.error(`   ❌ DAG test failed: ${error.message}\n`);
}

// Test 2: Health Gates
console.log('2️⃣ Testing Health Gates...');
try {
  const { getHealthGates } = await import('../server/core/health-gates');
  const gates = getHealthGates();
  
  gates.register({
    serviceId: 'test-gate',
    name: 'Test Gate',
    check: async () => true,
    critical: false,
    requiredPasses: 1,
  });
  
  const readiness = await gates.getReadiness();
  console.log(`   ✅ Health gates initialized: ${readiness.gates.length} gate(s)`);
  console.log(`   ✅ Critical ready: ${readiness.criticalReady}\n`);
} catch (error: any) {
  console.error(`   ❌ Health gates test failed: ${error.message}\n`);
}

// Test 3: Circuit Breaker
console.log('3️⃣ Testing Circuit Breaker...');
try {
  const { getCircuitBreakerRegistry, withCircuitBreaker } = await import('../server/core/circuit-breaker');
  const registry = getCircuitBreakerRegistry();
  
  // Test successful execution
  const result = await withCircuitBreaker('test-breaker', async () => {
    return 'success';
  });
  
  console.log(`   ✅ Circuit breaker executed: ${result}`);
  
  const breakers = registry.getAll();
  console.log(`   ✅ Registry: ${breakers.length} breaker(s)\n`);
} catch (error: any) {
  console.error(`   ❌ Circuit breaker test failed: ${error.message}\n`);
}

// Test 4: Feature Flags
console.log('4️⃣ Testing Feature Flags...');
try {
  const { IntegrationFlagsService } = await import('../server/services/IntegrationFlagsService');
  
  const flags = await IntegrationFlagsService.getAllFlags();
  console.log(`   ✅ Feature flags loaded: ${flags.length} flag(s)`);
  
  const isEnabled = await IntegrationFlagsService.isEnabled('citadel_enabled');
  console.log(`   ✅ Flag check: citadel_enabled = ${isEnabled}\n`);
} catch (error: any) {
  console.error(`   ❌ Feature flags test failed: ${error.message}\n`);
}

// Test 5: Config Files
console.log('5️⃣ Testing Config Files...');
try {
  const fs = await import('fs/promises');
  const path = await import('path');
  
  const graphPath = path.join(process.cwd(), 'deploy', 'graph.json');
  const graphContent = await fs.readFile(graphPath, 'utf-8');
  const graph = JSON.parse(graphContent);
  
  console.log(`   ✅ graph.json loaded: ${graph.services?.length || 0} service(s) defined`);
  
  const flagsPath = path.join(process.cwd(), 'server', 'config', 'feature-flags.yaml');
  const flagsExist = await fs.access(flagsPath).then(() => true).catch(() => false);
  console.log(`   ✅ feature-flags.yaml exists: ${flagsExist}\n`);
} catch (error: any) {
  console.error(`   ❌ Config files test failed: ${error.message}\n`);
}

console.log('✅ Reliability system tests complete!\n');

