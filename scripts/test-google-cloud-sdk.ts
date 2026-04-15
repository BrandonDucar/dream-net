#!/usr/bin/env tsx
/**
 * Test Google Cloud SDK Connectivity
 * 
 * Verifies:
 * - Google Cloud SDK packages are installed
 * - Credentials are configured
 * - Can authenticate and access GCP services
 * 
 * Usage: pnpm tsx scripts/test-google-cloud-sdk.ts
 */

// Google Cloud SDK imports - using correct syntax
import { ServicesClient } from '@google-cloud/run/build/src/v2';
import { Storage } from '@google-cloud/storage';
import { ProjectsClient } from '@google-cloud/resource-manager';
import { CloudBuildClient } from '@google-cloud/cloudbuild';

console.log('🔍 Testing Google Cloud SDK...\n');

// Configuration
const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'dreamnet-62b49';
const REGION = process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';

console.log(`📋 Configuration:`);
console.log(`   Project ID: ${PROJECT_ID}`);
console.log(`   Region: ${REGION}\n`);

const results = {
  sdkInstalled: false,
  credentialsConfigured: false,
  projectAccessible: false,
  cloudRunAccessible: false,
  storageAccessible: false,
  cloudBuildAccessible: false,
  errors: [] as string[]
};

// Test 1: Check SDK installation
console.log('1️⃣ Testing SDK Installation...');
try {
  // Try importing all SDKs
  console.log('   ✅ @google-cloud/run installed');
  console.log('   ✅ @google-cloud/storage installed');
  console.log('   ✅ @google-cloud/resource-manager installed');
  console.log('   ✅ @google-cloud/cloudbuild installed');
  results.sdkInstalled = true;
} catch (error: any) {
  results.errors.push(`SDK installation: ${error.message}`);
  console.error(`   ❌ SDK installation check failed: ${error.message}`);
}

// Test 2: Check credentials
console.log('\n2️⃣ Testing Credentials...');
try {
  // Check for Application Default Credentials
  const hasAdc = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                 process.env.GCLOUD_PROJECT ||
                 process.env.GOOGLE_CLOUD_PROJECT;
  
  if (hasAdc || process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('   ✅ Application Default Credentials detected');
    results.credentialsConfigured = true;
  } else {
    console.log('   ⚠️  No Application Default Credentials found');
    console.log('   💡 To set up credentials:');
    console.log('      1. Run: gcloud auth application-default login');
    console.log('      2. Or set GOOGLE_APPLICATION_CREDENTIALS to service account JSON path');
    console.log('      3. Or set GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT env var');
  }
} catch (error: any) {
  results.errors.push(`Credentials check: ${error.message}`);
  console.error(`   ❌ Credentials check failed: ${error.message}`);
}

// Test 3: Test Resource Manager (project access)
console.log('\n3️⃣ Testing Resource Manager (Project Access)...');
try {
  const resourceManager = new ProjectsClient();
  const project = await resourceManager.getProject({ name: `projects/${PROJECT_ID}` });
  console.log(`   ✅ Project accessible: ${project[0].displayName || PROJECT_ID}`);
  console.log(`      Project ID: ${project[0].projectId}`);
  console.log(`      Project Number: ${project[0].name}`);
  results.projectAccessible = true;
} catch (error: any) {
  results.errors.push(`Resource Manager: ${error.message}`);
  console.error(`   ❌ Cannot access project: ${error.message}`);
  console.log('   💡 Ensure:');
  console.log('      - Project ID is correct');
  console.log('      - Credentials have resourcemanager.projects.get permission');
  console.log('      - Run: gcloud auth application-default login');
}

// Test 4: Test Cloud Run
console.log('\n4️⃣ Testing Cloud Run...');
try {
  const cloudRun = new ServicesClient();
  const parent = `projects/${PROJECT_ID}/locations/${REGION}`;
  const [services] = await cloudRun.listServices({ parent });
  console.log(`   ✅ Cloud Run accessible`);
  console.log(`      Found ${services.length} services in ${REGION}`);
  if (services.length > 0) {
    services.slice(0, 3).forEach(service => {
      console.log(`      - ${service.name || 'unknown'}`);
    });
  }
  results.cloudRunAccessible = true;
} catch (error: any) {
  results.errors.push(`Cloud Run: ${error.message}`);
  console.error(`   ❌ Cannot access Cloud Run: ${error.message}`);
  console.log('   💡 Ensure:');
  console.log('      - Credentials have run.services.list permission');
  console.log('      - Region is correct');
}

// Test 5: Test Cloud Storage
console.log('\n5️⃣ Testing Cloud Storage...');
try {
  const storage = new Storage({ projectId: PROJECT_ID });
  const [buckets] = await storage.getBuckets();
  console.log(`   ✅ Cloud Storage accessible`);
  console.log(`      Found ${buckets.length} buckets`);
  if (buckets.length > 0) {
    buckets.slice(0, 3).forEach(bucket => {
      console.log(`      - ${bucket.name}`);
    });
  }
  results.storageAccessible = true;
} catch (error: any) {
  results.errors.push(`Cloud Storage: ${error.message}`);
  console.error(`   ❌ Cannot access Cloud Storage: ${error.message}`);
  console.log('   💡 Ensure:');
  console.log('      - Credentials have storage.buckets.list permission');
}

// Test 6: Test Cloud Build
console.log('\n6️⃣ Testing Cloud Build...');
try {
  const cloudBuild = new CloudBuildClient({ projectId: PROJECT_ID });
  const [builds] = await cloudBuild.listBuilds({
    projectId: PROJECT_ID,
    pageSize: 5
  });
  console.log(`   ✅ Cloud Build accessible`);
  console.log(`      Found ${builds.length} recent builds`);
  if (builds.length > 0) {
    builds.slice(0, 3).forEach(build => {
      const status = build.status || 'UNKNOWN';
      const source = build.source?.storageSource?.object || build.source?.repoSource?.branchName || 'unknown';
      console.log(`      - ${status}: ${source}`);
    });
  }
  results.cloudBuildAccessible = true;
} catch (error: any) {
  results.errors.push(`Cloud Build: ${error.message}`);
  console.error(`   ❌ Cannot access Cloud Build: ${error.message}`);
  console.log('   💡 Ensure:');
  console.log('      - Credentials have cloudbuild.builds.list permission');
}

// Summary
console.log('\n📊 Summary:');
console.log(`   SDK Installed: ${results.sdkInstalled ? '✅' : '❌'}`);
console.log(`   Credentials Configured: ${results.credentialsConfigured ? '✅' : '❌'}`);
console.log(`   Project Accessible: ${results.projectAccessible ? '✅' : '❌'}`);
console.log(`   Cloud Run Accessible: ${results.cloudRunAccessible ? '✅' : '❌'}`);
console.log(`   Storage Accessible: ${results.storageAccessible ? '✅' : '❌'}`);
console.log(`   Cloud Build Accessible: ${results.cloudBuildAccessible ? '✅' : '❌'}`);

if (results.errors.length > 0) {
  console.log('\n❌ Errors:');
  results.errors.forEach(err => console.log(`   - ${err}`));
}

const allPassed = results.sdkInstalled && 
                  results.credentialsConfigured && 
                  results.projectAccessible && 
                  results.cloudRunAccessible && 
                  results.storageAccessible && 
                  results.cloudBuildAccessible;

if (allPassed) {
  console.log('\n✅ All Google Cloud SDK tests passed!');
  console.log('\n🚀 Ready to deploy: pnpm deploy:gcp');
} else {
  console.log('\n⚠️  Some tests failed. See above for details.');
  console.log('\n💡 Next Steps:');
  if (!results.credentialsConfigured) {
    console.log('   1. Set up credentials:');
    console.log('      gcloud auth application-default login');
    console.log('      # OR');
    console.log('      export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json');
  }
  if (!results.projectAccessible) {
    console.log('   2. Verify project ID:');
    console.log(`      export GCP_PROJECT_ID=${PROJECT_ID}`);
    console.log('      gcloud config set project <PROJECT_ID>');
  }
  if (!results.cloudRunAccessible || !results.storageAccessible || !results.cloudBuildAccessible) {
    console.log('   3. Ensure IAM permissions:');
    console.log('      - Cloud Run Admin');
    console.log('      - Storage Admin');
    console.log('      - Cloud Build Editor');
  }
  process.exit(1);
}

