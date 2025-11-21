#!/usr/bin/env tsx
/**
 * Complete Cloud Integration Test
 * Tests both Google Cloud and AWS CLI/SDK integration
 * 
 * Tests:
 * 1. SDK installation
 * 2. CLI availability
 * 3. Credentials configuration
 * 4. API endpoint functionality
 * 5. Service access
 * 
 * Usage: pnpm tsx scripts/test-cloud-integrations-complete.ts
 */

import { execSync } from 'child_process';
import { verifyGoogleCloudCredentials, listCloudStorageBuckets } from '../server/integrations/googleCloudClient';
import { verifyAwsCredentials, listS3Buckets } from '../server/integrations/awsClient';

const BASE_URL = process.env.API_URL || 'http://localhost:5000';

console.log('🌐 Complete Cloud Integration Test\n');
console.log('='.repeat(70));

const results = {
  googleCloud: {
    sdkInstalled: false,
    cliInstalled: false,
    credentialsConfigured: false,
    apiEndpointsWorking: false,
    servicesAccessible: false,
    errors: [] as string[]
  },
  aws: {
    sdkInstalled: false,
    cliInstalled: false,
    credentialsConfigured: false,
    apiEndpointsWorking: false,
    servicesAccessible: false,
    errors: [] as string[]
  }
};

// ==================== GOOGLE CLOUD TESTS ====================

console.log('\n📘 GOOGLE CLOUD PLATFORM');
console.log('='.repeat(70));

// Test 1: SDK Installation
console.log('\n1️⃣ Testing Google Cloud SDK Installation...');
try {
  const { ServicesClient } = await import('@google-cloud/run');
  const { Storage } = await import('@google-cloud/storage');
  const { ProjectsClient } = await import('@google-cloud/resource-manager');
  const { CloudBuildClient } = await import('@google-cloud/cloudbuild');
  console.log('   ✅ SDK packages installed');
  results.googleCloud.sdkInstalled = true;
} catch (error: any) {
  results.googleCloud.errors.push(`SDK installation: ${error.message}`);
  console.error(`   ❌ SDK installation failed: ${error.message}`);
}

// Test 2: CLI Installation
console.log('\n2️⃣ Testing Google Cloud CLI (gcloud)...');
try {
  const version = execSync('gcloud --version', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  console.log(`   ✅ gcloud CLI installed`);
  console.log(`      ${version.split('\n')[0]}`);
  results.googleCloud.cliInstalled = true;
} catch (error: any) {
  results.googleCloud.errors.push(`CLI installation: ${error.message}`);
  console.log('   ⚠️  gcloud CLI not found');
  console.log('   💡 Install: https://cloud.google.com/sdk/docs/install');
}

// Test 3: Credentials Configuration
console.log('\n3️⃣ Testing Google Cloud Credentials...');
try {
  const hasAdc = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const hasProject = !!(process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT);
  
  if (hasAdc) {
    console.log(`   ✅ GOOGLE_APPLICATION_CREDENTIALS set: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
  }
  if (hasProject) {
    console.log(`   ✅ Project ID configured: ${process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT}`);
  }
  
  // Try to verify credentials via SDK
  try {
    const projectInfo = await verifyGoogleCloudCredentials();
    console.log(`   ✅ Credentials verified`);
    console.log(`      Project ID: ${projectInfo.projectId}`);
    console.log(`      Region: ${projectInfo.region}`);
    results.googleCloud.credentialsConfigured = true;
  } catch (error: any) {
    console.log(`   ⚠️  Credentials not verified: ${error.message}`);
    console.log('   💡 To set up credentials:');
    console.log('      Option 1: gcloud auth application-default login');
    console.log('      Option 2: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json');
    console.log('      Option 3: export GCP_PROJECT_ID=your-project-id');
  }
} catch (error: any) {
  results.googleCloud.errors.push(`Credentials: ${error.message}`);
}

// Test 4: API Endpoints
console.log('\n4️⃣ Testing Google Cloud API Endpoints...');
try {
  const response = await fetch(`${BASE_URL}/api/google-cloud/status`);
  if (response.ok) {
    const data = await response.json();
    console.log('   ✅ API endpoint working');
    console.log(`      Project: ${data.project?.projectId || 'unknown'}`);
    console.log(`      Region: ${data.region || 'unknown'}`);
    results.googleCloud.apiEndpointsWorking = true;
  } else {
    throw new Error(`HTTP ${response.status}`);
  }
} catch (error: any) {
  results.googleCloud.errors.push(`API endpoints: ${error.message}`);
  console.log(`   ⚠️  API endpoint test failed: ${error.message}`);
  console.log('   💡 Ensure server is running: pnpm dev:app');
}

// Test 5: Service Access
console.log('\n5️⃣ Testing Google Cloud Service Access...');
try {
  const buckets = await listCloudStorageBuckets();
  console.log(`   ✅ Cloud Storage accessible`);
  console.log(`      Found ${buckets.length} buckets`);
  results.googleCloud.servicesAccessible = true;
} catch (error: any) {
  results.googleCloud.errors.push(`Service access: ${error.message}`);
  console.log(`   ⚠️  Service access test failed: ${error.message}`);
  console.log('   💡 Ensure credentials have Storage Admin permission');
}

// ==================== AWS TESTS ====================

console.log('\n\n📗 AWS');
console.log('='.repeat(70));

// Test 1: SDK Installation
console.log('\n1️⃣ Testing AWS SDK Installation...');
try {
  const { AmplifyClient } = await import('@aws-sdk/client-amplify');
  const { S3Client } = await import('@aws-sdk/client-s3');
  const { LambdaClient } = await import('@aws-sdk/client-lambda');
  const { STSClient } = await import('@aws-sdk/client-sts');
  console.log('   ✅ SDK packages installed');
  results.aws.sdkInstalled = true;
} catch (error: any) {
  results.aws.errors.push(`SDK installation: ${error.message}`);
  console.error(`   ❌ SDK installation failed: ${error.message}`);
}

// Test 2: CLI Installation
console.log('\n2️⃣ Testing AWS CLI...');
try {
  const version = execSync('aws --version', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  console.log(`   ✅ AWS CLI installed: ${version}`);
  results.aws.cliInstalled = true;
} catch (error: any) {
  results.aws.errors.push(`CLI installation: ${error.message}`);
  console.error(`   ❌ AWS CLI not found: ${error.message}`);
  console.log('   💡 Install: https://aws.amazon.com/cli/');
}

// Test 3: Credentials Configuration
console.log('\n3️⃣ Testing AWS Credentials...');
try {
  const identity = await verifyAwsCredentials();
  console.log(`   ✅ AWS credentials configured`);
  console.log(`      Account ID: ${identity.account}`);
  console.log(`      User ARN: ${identity.arn}`);
  console.log(`      User ID: ${identity.userId}`);
  results.aws.credentialsConfigured = true;
} catch (error: any) {
  results.aws.errors.push(`Credentials: ${error.message}`);
  console.log(`   ⚠️  Credentials not verified: ${error.message}`);
  console.log('   💡 To set up credentials:');
  console.log('      aws configure');
  console.log('      # OR set environment variables');
}

// Test 4: API Endpoints
console.log('\n4️⃣ Testing AWS API Endpoints...');
try {
  const response = await fetch(`${BASE_URL}/api/aws/status`);
  if (response.ok) {
    const data = await response.json();
    console.log('   ✅ API endpoint working');
    console.log(`      Account: ${data.account || 'unknown'}`);
    console.log(`      Region: ${data.region || 'unknown'}`);
    results.aws.apiEndpointsWorking = true;
  } else {
    throw new Error(`HTTP ${response.status}`);
  }
} catch (error: any) {
  results.aws.errors.push(`API endpoints: ${error.message}`);
  console.log(`   ⚠️  API endpoint test failed: ${error.message}`);
  console.log('   💡 Ensure server is running: pnpm dev:app');
}

// Test 5: Service Access
console.log('\n5️⃣ Testing AWS Service Access...');
try {
  const buckets = await listS3Buckets();
  console.log(`   ✅ S3 accessible`);
  console.log(`      Found ${buckets.length} buckets`);
  results.aws.servicesAccessible = true;
} catch (error: any) {
  results.aws.errors.push(`Service access: ${error.message}`);
  console.log(`   ⚠️  Service access test failed: ${error.message}`);
  console.log('   💡 Ensure IAM user has S3 permissions');
}

// ==================== SUMMARY ====================

console.log('\n\n📊 COMPLETE TEST SUMMARY');
console.log('='.repeat(70));

console.log('\n📘 Google Cloud Platform:');
console.log(`   SDK Installed: ${results.googleCloud.sdkInstalled ? '✅' : '❌'}`);
console.log(`   CLI Installed: ${results.googleCloud.cliInstalled ? '✅' : '❌'}`);
console.log(`   Credentials Configured: ${results.googleCloud.credentialsConfigured ? '✅' : '❌'}`);
console.log(`   API Endpoints Working: ${results.googleCloud.apiEndpointsWorking ? '✅' : '❌'}`);
console.log(`   Services Accessible: ${results.googleCloud.servicesAccessible ? '✅' : '❌'}`);

console.log('\n📗 AWS:');
console.log(`   SDK Installed: ${results.aws.sdkInstalled ? '✅' : '❌'}`);
console.log(`   CLI Installed: ${results.aws.cliInstalled ? '✅' : '❌'}`);
console.log(`   Credentials Configured: ${results.aws.credentialsConfigured ? '✅' : '❌'}`);
console.log(`   API Endpoints Working: ${results.aws.apiEndpointsWorking ? '✅' : '❌'}`);
console.log(`   Services Accessible: ${results.aws.servicesAccessible ? '✅' : '❌'}`);

// Errors
if (results.googleCloud.errors.length > 0 || results.aws.errors.length > 0) {
  console.log('\n❌ Errors:');
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
  console.log('\n📘 Google Cloud Setup:');
  console.log('   1. Set up Application Default Credentials:');
  console.log('      gcloud auth application-default login');
  console.log('   2. OR use service account JSON:');
  console.log('      export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json');
  console.log('   3. Set project ID:');
  console.log('      export GCP_PROJECT_ID=dreamnet-62b49');
  console.log('      gcloud config set project dreamnet-62b49');
}

if (!results.aws.servicesAccessible && results.aws.credentialsConfigured) {
  console.log('\n📗 AWS IAM Permissions:');
  console.log('   Your AWS credentials are configured but need IAM permissions.');
  console.log('   Account: 001092882186');
  console.log('   User: Dreamnet');
  console.log('\n   Required IAM Policies:');
  console.log('   - AmazonS3FullAccess (or custom S3 policy)');
  console.log('   - AmazonEC2ContainerRegistryFullAccess (for ECR)');
  console.log('   - AWSAppRunnerFullAccess (for App Runner)');
  console.log('   - CloudFrontFullAccess (for CloudFront)');
  console.log('\n   To add permissions:');
  console.log('   1. Go to AWS Console → IAM → Users → Dreamnet');
  console.log('   2. Add policies listed above');
  console.log('   3. Or create custom policy with minimal required permissions');
}

// Overall Status
const googleCloudReady = results.googleCloud.sdkInstalled && 
                        results.googleCloud.credentialsConfigured && 
                        results.googleCloud.apiEndpointsWorking;

const awsReady = results.aws.sdkInstalled && 
                 results.aws.credentialsConfigured && 
                 results.aws.apiEndpointsWorking;

console.log('\n🎯 READY STATUS:');
console.log('='.repeat(70));
console.log(`   Google Cloud: ${googleCloudReady ? '✅ READY' : '⚠️  NEEDS SETUP'}`);
console.log(`   AWS: ${awsReady ? '✅ READY' : '⚠️  NEEDS SETUP'}`);

if (googleCloudReady) {
  console.log('\n   🚀 Deploy to Google Cloud: pnpm deploy:gcp');
}
if (awsReady) {
  console.log('   🚀 Deploy to AWS: pnpm deploy:aws');
}

console.log('\n' + '='.repeat(70));

