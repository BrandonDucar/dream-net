#!/usr/bin/env tsx
/**
 * Test All Cloud SDKs
 * 
 * Runs tests for both Google Cloud and AWS SDKs
 * 
 * Usage: pnpm tsx scripts/test-cloud-sdks.ts
 */

import { execSync } from 'child_process';

console.log('🌐 Testing All Cloud SDKs\n');
console.log('='.repeat(60));

// Test Google Cloud
console.log('\n📘 GOOGLE CLOUD PLATFORM');
console.log('='.repeat(60));
try {
  execSync('pnpm tsx scripts/test-google-cloud-sdk.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('\n❌ Google Cloud SDK tests failed');
}

// Test AWS
console.log('\n\n📗 AWS');
console.log('='.repeat(60));
try {
  execSync('pnpm tsx scripts/test-aws-sdk.ts', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
} catch (error) {
  console.error('\n❌ AWS SDK tests failed');
}

console.log('\n' + '='.repeat(60));
console.log('✅ Cloud SDK testing complete!');
console.log('\n💡 To deploy:');
console.log('   Google Cloud: pnpm deploy:gcp');
console.log('   AWS: pnpm deploy:aws');

