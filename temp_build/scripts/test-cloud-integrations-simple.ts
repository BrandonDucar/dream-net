#!/usr/bin/env tsx
/**
 * Simple Cloud Integration Test
 * Tests CLI availability and integration code structure
 * 
 * Usage: pnpm tsx scripts/test-cloud-integrations-simple.ts
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

console.log('🌐 Cloud Integration Test (CLI + Code Structure)\n');
console.log('='.repeat(70));

const results = {
  googleCloud: {
    cliInstalled: false,
    sdkCodeExists: false,
    apiRoutesExist: false,
    credentialsConfigured: false,
    errors: [] as string[]
  },
  aws: {
    cliInstalled: false,
    sdkCodeExists: false,
    apiRoutesExist: false,
    credentialsConfigured: false,
    errors: [] as string[]
  }
};

// ==================== GOOGLE CLOUD TESTS ====================

console.log('\n📘 GOOGLE CLOUD PLATFORM');
console.log('='.repeat(70));

// Test 1: CLI Installation
console.log('\n1️⃣ Testing Google Cloud CLI (gcloud)...');
try {
  const version = execSync('gcloud --version', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  console.log(`   ✅ gcloud CLI installed`);
  console.log(`      ${version.split('\n')[0]}`);
  results.googleCloud.cliInstalled = true;
} catch (error: any) {
  results.googleCloud.errors.push(`CLI: ${error.message}`);
  console.log('   ❌ gcloud CLI not found');
}

// Test 2: SDK Code Exists
console.log('\n2️⃣ Testing Integration Code...');
const googleCloudClientPath = join(process.cwd(), 'server', 'integrations', 'googleCloudClient.ts');
const googleCloudRoutesPath = join(process.cwd(), 'server', 'routes', 'google-cloud.ts');

if (existsSync(googleCloudClientPath)) {
  console.log('   ✅ Integration client code exists');
  results.googleCloud.sdkCodeExists = true;
} else {
  console.log('   ❌ Integration client code missing');
}

if (existsSync(googleCloudRoutesPath)) {
  console.log('   ✅ API routes code exists');
  results.googleCloud.apiRoutesExist = true;
} else {
  console.log('   ❌ API routes code missing');
}

// Test 3: Credentials Check
console.log('\n3️⃣ Testing Credentials Configuration...');
const hasAdc = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
const hasProject = !!(process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT);

if (hasAdc) {
  console.log(`   ✅ GOOGLE_APPLICATION_CREDENTIALS set`);
  results.googleCloud.credentialsConfigured = true;
} else if (hasProject) {
  console.log(`   ⚠️  Project ID set but no credentials file`);
  console.log(`      Project: ${process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT}`);
} else {
  console.log('   ⚠️  No credentials configured');
  console.log('   💡 Run: gcloud auth application-default login');
}

// Test 4: SDK Packages Check
console.log('\n4️⃣ Testing SDK Packages...');
try {
  const { ServicesClient } = await import('@google-cloud/run');
  const { Storage } = await import('@google-cloud/storage');
  console.log('   ✅ Google Cloud SDK packages installed');
} catch (error: any) {
  results.googleCloud.errors.push(`SDK packages: ${error.message}`);
  console.log(`   ❌ SDK packages not installed: ${error.message}`);
}

// ==================== AWS TESTS ====================

console.log('\n\n📗 AWS');
console.log('='.repeat(70));

// Test 1: CLI Installation
console.log('\n1️⃣ Testing AWS CLI...');
try {
  const version = execSync('aws --version', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  console.log(`   ✅ AWS CLI installed: ${version}`);
  results.aws.cliInstalled = true;
} catch (error: any) {
  results.aws.errors.push(`CLI: ${error.message}`);
  console.log('   ❌ AWS CLI not found');
}

// Test 2: SDK Code Exists
console.log('\n2️⃣ Testing Integration Code...');
const awsClientPath = join(process.cwd(), 'server', 'integrations', 'awsClient.ts');
const awsRoutesPath = join(process.cwd(), 'server', 'routes', 'aws.ts');

if (existsSync(awsClientPath)) {
  console.log('   ✅ Integration client code exists');
  results.aws.sdkCodeExists = true;
} else {
  console.log('   ❌ Integration client code missing');
}

if (existsSync(awsRoutesPath)) {
  console.log('   ✅ API routes code exists');
  results.aws.apiRoutesExist = true;
} else {
  console.log('   ❌ API routes code missing');
}

// Test 3: Credentials Check
console.log('\n3️⃣ Testing Credentials Configuration...');
try {
  const identity = JSON.parse(
    execSync('aws sts get-caller-identity', { encoding: 'utf-8', stdio: 'pipe' }).trim()
  );
  console.log(`   ✅ AWS credentials configured`);
  console.log(`      Account: ${identity.Account}`);
  console.log(`      User: ${identity.Arn}`);
  results.aws.credentialsConfigured = true;
} catch (error: any) {
  results.aws.errors.push(`Credentials: ${error.message}`);
  console.log('   ❌ AWS credentials not configured');
  console.log('   💡 Run: aws configure');
}

// Test 4: Test S3 Access (basic permission check)
console.log('\n4️⃣ Testing S3 Access...');
try {
  execSync('aws s3 ls', { encoding: 'utf-8', stdio: 'pipe' });
  console.log('   ✅ S3 accessible');
} catch (error: any) {
  if (error.message.includes('AccessDenied')) {
    console.log('   ⚠️  S3 access denied - need IAM permissions');
    console.log('   💡 Add AmazonS3FullAccess policy to IAM user');
  } else {
    console.log(`   ⚠️  S3 test failed: ${error.message}`);
  }
}

// Test 5: SDK Packages Check
console.log('\n5️⃣ Testing SDK Packages...');
try {
  // Check if AWS SDK packages are in package.json
  const packageJson = await import('../package.json', { assert: { type: 'json' } });
  const deps = { ...packageJson.default.dependencies, ...packageJson.default.devDependencies };
  const hasAwsSdk = Object.keys(deps).some(key => key.includes('@aws-sdk'));
  
  if (hasAwsSdk) {
    console.log('   ✅ AWS SDK packages found in package.json');
  } else {
    console.log('   ⚠️  AWS SDK packages not in package.json');
    console.log('   💡 Install: pnpm add @aws-sdk/client-amplify @aws-sdk/client-s3 @aws-sdk/client-lambda @aws-sdk/client-sts');
  }
} catch (error: any) {
  console.log(`   ⚠️  Could not check package.json: ${error.message}`);
}

// ==================== SUMMARY ====================

console.log('\n\n📊 TEST SUMMARY');
console.log('='.repeat(70));

console.log('\n📘 Google Cloud Platform:');
console.log(`   CLI Installed: ${results.googleCloud.cliInstalled ? '✅' : '❌'}`);
console.log(`   SDK Code Exists: ${results.googleCloud.sdkCodeExists ? '✅' : '❌'}`);
console.log(`   API Routes Exist: ${results.googleCloud.apiRoutesExist ? '✅' : '❌'}`);
console.log(`   Credentials Configured: ${results.googleCloud.credentialsConfigured ? '✅' : '⚠️'}`);

console.log('\n📗 AWS:');
console.log(`   CLI Installed: ${results.aws.cliInstalled ? '✅' : '❌'}`);
console.log(`   SDK Code Exists: ${results.aws.sdkCodeExists ? '✅' : '❌'}`);
console.log(`   API Routes Exist: ${results.aws.apiRoutesExist ? '✅' : '❌'}`);
console.log(`   Credentials Configured: ${results.aws.credentialsConfigured ? '✅' : '❌'}`);

// Errors
if (results.googleCloud.errors.length > 0 || results.aws.errors.length > 0) {
  console.log('\n⚠️  Issues Found:');
  if (results.googleCloud.errors.length > 0) {
    console.log('\n   Google Cloud:');
    results.googleCloud.errors.forEach(err => console.log(`      - ${err}`));
  }
  if (results.aws.errors.length > 0) {
    console.log('\n   AWS:');
    results.aws.errors.forEach(err => console.log(`      - ${err}`));
  }
}

// Next Steps
console.log('\n💡 NEXT STEPS:');
console.log('='.repeat(70));

if (!results.googleCloud.credentialsConfigured) {
  console.log('\n📘 Google Cloud:');
  console.log('   1. Set up credentials:');
  console.log('      gcloud auth application-default login');
  console.log('   2. Set project ID:');
  console.log('      export GCP_PROJECT_ID=dreamnet-62b49');
  console.log('      gcloud config set project dreamnet-62b49');
}

if (results.aws.credentialsConfigured && !results.aws.errors.some(e => e.includes('S3'))) {
  console.log('\n📗 AWS:');
  console.log('   1. Add IAM permissions (via AWS Console):');
  console.log('      - Go to: IAM → Users → Dreamnet');
  console.log('      - Add policies: AmazonS3FullAccess, etc.');
  console.log('   2. Install AWS SDK packages (if needed):');
  console.log('      pnpm add @aws-sdk/client-amplify @aws-sdk/client-s3 @aws-sdk/client-lambda @aws-sdk/client-sts');
}

console.log('\n' + '='.repeat(70));
console.log('✅ Test complete!');

