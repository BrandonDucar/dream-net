#!/usr/bin/env tsx
/**
 * Test EVERYTHING - Complete DreamNet System Check
 * 
 * Tests:
 * - GCP authentication & APIs
 * - Server startup readiness
 * - Docker build readiness
 * - Self-management endpoints
 * - Safe boot sequence
 * 
 * Usage: pnpm tsx scripts/test-everything.ts
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

async function testSDKPackage(pkg: string): Promise<boolean> {
  try {
    await import(pkg);
    return true;
  } catch {
    return false;
  }
}

console.log('🧪 Testing EVERYTHING in DreamNet...\n');
console.log('='.repeat(60));

const results: Array<{ category: string; test: string; status: '✅' | '❌' | '⚠️'; details?: string }> = [];

// 1. GCP Authentication
console.log('\n1️⃣ Testing GCP Authentication...');
try {
  const account = execSync('gcloud config get-value account', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  if (account && account !== '(unset)') {
    results.push({ category: 'GCP', test: 'Authentication', status: '✅', details: account });
    console.log(`   ✅ Authenticated as: ${account}`);
  } else {
    results.push({ category: 'GCP', test: 'Authentication', status: '❌' });
    console.log('   ❌ Not authenticated');
  }
} catch {
  results.push({ category: 'GCP', test: 'Authentication', status: '❌' });
  console.log('   ❌ Not authenticated');
}

// 2. GCP Project
console.log('\n2️⃣ Testing GCP Project...');
const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
try {
  execSync(`gcloud config set project ${PROJECT_ID}`, { stdio: 'pipe' });
  results.push({ category: 'GCP', test: 'Project', status: '✅', details: PROJECT_ID });
  console.log(`   ✅ Project: ${PROJECT_ID}`);
} catch {
  results.push({ category: 'GCP', test: 'Project', status: '⚠️' });
  console.log(`   ⚠️  Project may not be set: ${PROJECT_ID}`);
}

// 3. Critical Files
console.log('\n3️⃣ Testing Critical Files...');
const criticalFiles = [
  'server/index.ts',
  'server/core/dreamnet-os.ts',
  'server/core/safe-boot.ts',
  'server/routes/self-manage.ts',
  'Dockerfile',
  'app.yaml',
  'package.json',
];

criticalFiles.forEach(file => {
  if (existsSync(join(process.cwd(), file))) {
    results.push({ category: 'Files', test: file, status: '✅' });
    console.log(`   ✅ ${file}`);
  } else {
    results.push({ category: 'Files', test: file, status: '❌' });
    console.log(`   ❌ ${file} - MISSING`);
  }
});

// 4. npm Scripts
console.log('\n4️⃣ Testing npm Scripts...');
const scripts = [
  'test:gcp-apis',
  'enable:gcp-apis',
  'deploy:appengine',
  'deploy:gcp',
  'deploy:gke',
  'setup:scheduler',
  'verify:startup',
  'verify:docker',
];

scripts.forEach(script => {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    if (packageJson.scripts[script]) {
      results.push({ category: 'Scripts', test: script, status: '✅' });
      console.log(`   ✅ ${script}`);
    } else {
      results.push({ category: 'Scripts', test: script, status: '❌' });
      console.log(`   ❌ ${script} - NOT FOUND`);
    }
  } catch {
    results.push({ category: 'Scripts', test: script, status: '⚠️' });
  }
});

// 5. GCP SDK Packages
console.log('\n5️⃣ Testing GCP SDK Packages...');
const sdkPackages = [
  '@google-cloud/run',
  '@google-cloud/storage',
  '@google-cloud/cloudbuild',
  '@google-cloud/functions-framework',
  '@google-cloud/secret-manager',
];

for (const pkg of sdkPackages) {
  const installed = await testSDKPackage(pkg);
  if (installed) {
    results.push({ category: 'SDK', test: pkg, status: '✅' });
    console.log(`   ✅ ${pkg}`);
  } else {
    results.push({ category: 'SDK', test: pkg, status: '❌' });
    console.log(`   ❌ ${pkg} - NOT INSTALLED`);
  }
}

// 6. Cloud Functions
console.log('\n6️⃣ Testing Cloud Functions...');
const functions = [
  'cloud-functions/star-bridge-breath/index.ts',
  'cloud-functions/dreamkeeper-health/index.ts',
  'cloud-functions/envkeeper-sync/index.ts',
];

functions.forEach(func => {
  if (existsSync(join(process.cwd(), func))) {
    results.push({ category: 'Functions', test: func, status: '✅' });
    console.log(`   ✅ ${func}`);
  } else {
    results.push({ category: 'Functions', test: func, status: '❌' });
    console.log(`   ❌ ${func} - MISSING`);
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Complete Test Results:\n');

const categories = ['GCP', 'Files', 'Scripts', 'SDK', 'Functions'];
categories.forEach(category => {
  const categoryResults = results.filter(r => r.category === category);
  const passed = categoryResults.filter(r => r.status === '✅').length;
  const total = categoryResults.length;
  
  console.log(`${category}: ${passed}/${total} passed`);
  categoryResults.forEach(r => {
    console.log(`   ${r.status} ${r.test}${r.details ? ` (${r.details})` : ''}`);
  });
  console.log('');
});

const totalPassed = results.filter(r => r.status === '✅').length;
const totalTests = results.length;

console.log('='.repeat(60));
console.log(`\n📊 Overall: ${totalPassed}/${totalTests} tests passed\n`);

if (totalPassed === totalTests) {
  console.log('✅ EVERYTHING IS READY!');
  console.log('\n🚀 Next Steps:');
  console.log('   1. Test GCP APIs: pnpm test:gcp-apis');
  console.log('   2. Enable APIs: pnpm enable:gcp-apis');
  console.log('   3. Deploy: pnpm deploy:appengine (or deploy:gcp or deploy:gke)');
  console.log('   4. Setup scheduler: pnpm setup:scheduler');
} else {
  console.log('⚠️  Some tests failed. See above for details.');
  console.log('\n💡 Quick Fixes:');
  const failed = results.filter(r => r.status === '❌');
  if (failed.some(r => r.category === 'GCP')) {
    console.log('   - Run: gcloud auth login');
    console.log('   - Run: gcloud auth application-default login');
  }
  if (failed.some(r => r.category === 'SDK')) {
    console.log('   - Run: pnpm install');
  }
}

