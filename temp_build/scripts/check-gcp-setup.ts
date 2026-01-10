#!/usr/bin/env tsx
/**
 * Check Google Cloud Setup Status
 * 
 * Verifies billing, APIs, and authentication
 * 
 * Usage: pnpm check:gcp-setup
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';

console.log('🔍 Checking Google Cloud Setup...\n');
console.log(`📋 Project: ${PROJECT_ID}\n`);

const results = {
  billing: false,
  authentication: false,
  apis: false,
  errors: [] as string[]
};

// Check 1: Billing
console.log('1️⃣ Checking Billing...');
try {
  const billing = execSync(
    `gcloud billing projects describe ${PROJECT_ID}`,
    { encoding: 'utf-8', stdio: 'pipe' }
  );
  
  if (billing.includes('billingAccountName')) {
    console.log('   ✅ Billing enabled');
    results.billing = true;
  } else {
    console.log('   ❌ Billing not enabled');
    console.log('   💡 Enable at: https://console.cloud.google.com/billing?project=dreamnet-62b49');
  }
} catch (error: any) {
  if (error.message.includes('billing not enabled')) {
    console.log('   ❌ Billing not enabled');
    console.log('   💡 Enable at: https://console.cloud.google.com/billing?project=dreamnet-62b49');
  } else {
    console.log(`   ⚠️  Could not check billing: ${error.message.split('\n')[0]}`);
  }
}

// Check 2: Authentication
console.log('\n2️⃣ Checking Authentication...');
try {
  const account = execSync('gcloud config get-value account', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  
  if (account && account !== '(unset)') {
    console.log(`   ✅ Authenticated as: ${account}`);
    results.authentication = true;
  } else {
    console.log('   ❌ Not authenticated');
    console.log('   💡 Run: gcloud auth login');
    console.log('   💡 Then: gcloud auth application-default login');
  }
} catch (error: any) {
  console.log('   ❌ Not authenticated');
  console.log('   💡 Run: gcloud auth login');
}

// Check 3: Application Default Credentials
console.log('\n3️⃣ Checking Application Default Credentials...');
try {
  const adcPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (adcPath) {
    const fs = require('fs');
    if (fs.existsSync(adcPath)) {
      console.log(`   ✅ ADC file exists: ${adcPath}`);
      results.authentication = true;
    } else {
      console.log(`   ⚠️  ADC path set but file not found: ${adcPath}`);
    }
  } else {
    // Check default location
    const defaultPath = `${process.env.APPDATA || process.env.HOME}/gcloud/application_default_credentials.json`;
    const fs = require('fs');
    if (fs.existsSync(defaultPath)) {
      console.log(`   ✅ ADC file found at default location`);
      results.authentication = true;
    } else {
      console.log('   ⚠️  No Application Default Credentials found');
      console.log('   💡 Run: gcloud auth application-default login');
      console.log('   💡 Or: pnpm setup:gcp-service-account /path/to/key.json');
    }
  }
} catch (error: any) {
  console.log('   ⚠️  Could not check ADC');
}

// Check 4: APIs
console.log('\n4️⃣ Checking APIs...');
const requiredApis = [
  'container.googleapis.com',      // GKE
  'compute.googleapis.com',         // Compute
  'sqladmin.googleapis.com',        // Cloud SQL
  'bigquery.googleapis.com',        // BigQuery
  'storage-component.googleapis.com', // Storage
  'cloudbuild.googleapis.com',      // Cloud Build
  'run.googleapis.com',            // Cloud Run
  'cloudfunctions.googleapis.com',  // Functions
  'pubsub.googleapis.com',         // Pub/Sub
  'serviceusage.googleapis.com'     // Service Usage
];

let enabledCount = 0;
for (const api of requiredApis) {
  try {
    execSync(
      `gcloud services list --enabled --filter="name:${api}" --project=${PROJECT_ID}`,
      { stdio: 'pipe' }
    );
    enabledCount++;
  } catch {
    // API not enabled
  }
}

if (enabledCount === requiredApis.length) {
  console.log(`   ✅ All required APIs enabled (${enabledCount}/${requiredApis.length})`);
  results.apis = true;
} else {
  console.log(`   ⚠️  Only ${enabledCount}/${requiredApis.length} APIs enabled`);
  console.log('   💡 Run: pnpm enable:gcp-apis');
}

// Summary
console.log('\n📊 Setup Status:');
console.log('='.repeat(50));
console.log(`   Billing: ${results.billing ? '✅ Enabled' : '❌ Not Enabled'}`);
console.log(`   Authentication: ${results.authentication ? '✅ Configured' : '❌ Not Configured'}`);
console.log(`   APIs: ${results.apis ? '✅ Enabled' : '⚠️  Partially Enabled'}`);

const allReady = results.billing && results.authentication && results.apis;

if (allReady) {
  console.log('\n✅ Google Cloud is ready to deploy!');
  console.log('\n🚀 Next Steps:');
  console.log('   pnpm deploy:data-gcp  # Deploy data infrastructure');
  console.log('   pnpm deploy:gke       # Deploy to Kubernetes');
} else {
  console.log('\n⚠️  Setup incomplete. See above for what needs to be done.');
  console.log('\n💡 Quick Links:');
  if (!results.billing) {
    console.log('   Billing: https://console.cloud.google.com/billing?project=dreamnet-62b49');
  }
  if (!results.authentication) {
    console.log('   Service Accounts: https://console.cloud.google.com/iam-admin/serviceaccounts?project=dreamnet-62b49');
  }
  if (!results.apis) {
    console.log('   APIs: https://console.cloud.google.com/apis/library?project=dreamnet-62b49');
    console.log('   Or run: pnpm enable:gcp-apis');
  }
}

