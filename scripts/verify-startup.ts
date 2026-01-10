#!/usr/bin/env tsx
/**
 * Verification Script for DreamNet Server Startup
 * 
 * Checks for common issues before attempting to start the server:
 * - Required environment variables
 * - Critical file existence
 * - Import path validity
 * 
 * Usage: tsx scripts/verify-startup.ts
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const errors: string[] = [];
const warnings: string[] = [];

console.log('🔍 Verifying DreamNet server startup prerequisites...\n');

// Check required files
const requiredFiles = [
  'server/index.ts',
  'server/core/dreamnet-os.ts',
  'server/core/agents/manifest.json',
  'server/config/env.ts',
  'package.json',
  'pnpm-workspace.yaml',
  'Dockerfile',
];

console.log('📁 Checking required files...');
for (const file of requiredFiles) {
  if (existsSync(join(process.cwd(), file))) {
    console.log(`   ✅ ${file}`);
  } else {
    errors.push(`Missing required file: ${file}`);
    console.log(`   ❌ ${file} - MISSING`);
  }
}

// Check environment variables
console.log('\n🔐 Checking environment variables...');
const nodeEnv = process.env.NODE_ENV;
if (!nodeEnv) {
  warnings.push('NODE_ENV not set (will default to development)');
  console.log('   ⚠️  NODE_ENV not set');
} else {
  console.log(`   ✅ NODE_ENV=${nodeEnv}`);
}

const port = process.env.PORT || '3000';
console.log(`   ✅ PORT=${port} (default: 3000)`);

// Check optional but important env vars
const optionalVars = {
  'DATABASE_URL': 'Database connection (optional - server can start without)',
  'GCP_PROJECT_ID': 'GCP Project ID (required for deployments)',
  'GCP_REGION': 'GCP Region (defaults to us-central1)',
};

console.log('\n📋 Optional environment variables:');
for (const [key, description] of Object.entries(optionalVars)) {
  if (process.env[key]) {
    console.log(`   ✅ ${key} is set`);
  } else {
    console.log(`   ⚠️  ${key} not set - ${description}`);
  }
}

// Check critical imports (basic file existence check)
console.log('\n📦 Checking critical imports...');
const criticalImports = [
  'server/routes/health.ts',
  'server/routes/agent.ts',
  'server/routes/star-bridge.ts',
  'server/core/agents/dreamkeeper.ts',
  'server/core/agents/deploykeeper.ts',
  'server/core/agents/relaybot.ts',
  'server/core/agents/envkeeper.ts',
];

for (const file of criticalImports) {
  if (existsSync(join(process.cwd(), file))) {
    console.log(`   ✅ ${file}`);
  } else {
    warnings.push(`Import file may be missing: ${file}`);
    console.log(`   ⚠️  ${file} - may cause import errors`);
  }
}

// Check Dockerfile
console.log('\n🐳 Checking Dockerfile...');
if (existsSync(join(process.cwd(), 'Dockerfile'))) {
  console.log('   ✅ Dockerfile exists');
  
  // Check if Dockerfile references correct paths
  const dockerfileContent = readFileSync(join(process.cwd(), 'Dockerfile'), 'utf-8');
  if (dockerfileContent.includes('server/Dockerfile')) {
    warnings.push('Dockerfile may reference server/Dockerfile (should be root Dockerfile)');
    console.log('   ⚠️  Dockerfile references server/Dockerfile');
  } else {
    console.log('   ✅ Dockerfile uses root-level paths');
  }
} else {
  errors.push('Dockerfile missing');
  console.log('   ❌ Dockerfile missing');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Verification Summary\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Server should start successfully.');
  console.log('\nTo start the server:');
  console.log('   pnpm dev:app');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log('❌ Errors found:');
    errors.forEach(err => console.log(`   - ${err}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(warn => console.log(`   - ${warn}`));
  }
  
  if (errors.length > 0) {
    console.log('\n❌ Server may not start due to errors above.');
    process.exit(1);
  } else {
    console.log('\n⚠️  Server may start but with limitations.');
    process.exit(0);
  }
}

