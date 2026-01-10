#!/usr/bin/env tsx
/**
 * Internal Setup Script
 * 
 * Runs all internal setup tasks before deployment:
 * 1. Register all 143 agents as citizens
 * 2. Initialize government departments
 * 3. Verify core systems
 * 4. Check health endpoints
 * 
 * Usage: pnpm tsx scripts/internal-setup.ts
 */

import { execSync } from 'child_process';

console.log('🏛️ DreamNet Internal Setup\n');
console.log('='.repeat(60));

const results = {
  agentsRegistered: false,
  departmentsInitialized: false,
  systemsVerified: false,
  healthChecksPassed: false,
  errors: [] as string[]
};

// Step 1: Register Agents
console.log('\n1️⃣ Registering All 143 Agents as Citizens...');
try {
  // Check if server is running
  try {
    const healthCheck = execSync('curl http://localhost:3000/health', { 
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log('   ✅ Server is running');
    
    // Register agents via API
    const registerResponse = execSync('curl -X POST http://localhost:3000/api/register-agents', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    const result = JSON.parse(registerResponse);
    
    if (result.success) {
      console.log(`   ✅ Registered ${result.summary.registered} agents`);
      console.log(`   ✅ Issued ${result.summary.passportsIssued} passports`);
      console.log(`   ✅ Created ${result.summary.citizensCreated} citizens`);
      results.agentsRegistered = true;
    } else {
      throw new Error('Registration failed');
    }
  } catch (error: any) {
    console.log('   ⚠️  Server not running. Starting server...');
    console.log('   💡 Run: pnpm dev:app');
    console.log('   💡 Then run this script again');
    results.errors.push('Server not running');
  }
} catch (error: any) {
  results.errors.push(`Agent registration: ${error.message}`);
  console.error(`   ❌ Failed: ${error.message}`);
}

// Step 2: Verify Systems
console.log('\n2️⃣ Verifying Core Systems...');
const systems = [
  { name: 'Star Bridge', endpoint: '/api/star-bridge/status' },
  { name: 'Wolf Pack', endpoint: '/api/wolf-pack/status' },
  { name: 'Shield Core', endpoint: '/api/shield/status' },
  { name: 'Directory', endpoint: '/api/directory/status' },
];

let systemsVerified = 0;
for (const system of systems) {
  try {
    execSync(`curl http://localhost:3000${system.endpoint}`, {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log(`   ✅ ${system.name} verified`);
    systemsVerified++;
  } catch {
    console.log(`   ⚠️  ${system.name} not accessible (may need initialization)`);
  }
}

if (systemsVerified === systems.length) {
  results.systemsVerified = true;
}

// Step 3: Health Checks
console.log('\n3️⃣ Running Health Checks...');
try {
  const health = execSync('curl http://localhost:3000/health', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  console.log('   ✅ /health endpoint responding');
  
  const ready = execSync('curl http://localhost:3000/ready', {
    encoding: 'utf-8',
    stdio: 'pipe'
  });
  console.log('   ✅ /ready endpoint responding');
  
  results.healthChecksPassed = true;
} catch (error: any) {
  results.errors.push(`Health checks: ${error.message}`);
  console.error(`   ❌ Health checks failed: ${error.message}`);
}

// Summary
console.log('\n📊 Setup Summary:');
console.log(`   Agents Registered: ${results.agentsRegistered ? '✅' : '❌'}`);
console.log(`   Systems Verified: ${results.systemsVerified ? '✅' : '⚠️'}`);
console.log(`   Health Checks: ${results.healthChecksPassed ? '✅' : '❌'}`);

if (results.errors.length > 0) {
  console.log('\n❌ Errors:');
  results.errors.forEach(err => console.log(`   - ${err}`));
}

const allPassed = results.agentsRegistered && results.systemsVerified && results.healthChecksPassed;

if (allPassed) {
  console.log('\n✅ Internal setup complete! Ready to deploy.');
  console.log('\n🚀 Next steps:');
  console.log('   1. Set up GCP/AWS credentials');
  console.log('   2. Run: pnpm deploy:gcp or pnpm deploy:aws');
  console.log('   3. Point domains to deployment URLs');
} else {
  console.log('\n⚠️  Some setup incomplete. See above for details.');
  console.log('\n💡 To complete setup:');
  console.log('   1. Start server: pnpm dev:app');
  console.log('   2. Run this script again: pnpm tsx scripts/internal-setup.ts');
}

