#!/usr/bin/env tsx
/**
 * Enable ALL Google Cloud APIs for DreamNet
 * 
 * Enables all APIs we might need for full GCP integration
 * 
 * Usage: pnpm tsx scripts/enable-all-gcp-apis.ts
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';

console.log('🚀 Enabling ALL Google Cloud APIs for DreamNet...\n');
console.log(`📋 Project: ${PROJECT_ID}\n`);

const apisToEnable = [
  // Compute
  'compute.googleapis.com',           // Compute Engine
  'container.googleapis.com',         // GKE
  'run.googleapis.com',               // Cloud Run
  'appengine.googleapis.com',         // App Engine
  
  // Functions & Events
  'cloudfunctions.googleapis.com',    // Cloud Functions
  'cloudscheduler.googleapis.com',    // Cloud Scheduler
  'cloudtasks.googleapis.com',        // Cloud Tasks
  'pubsub.googleapis.com',            // Pub/Sub
  
  // Storage & Database
  'storage-component.googleapis.com', // Cloud Storage
  'sqladmin.googleapis.com',          // Cloud SQL
  'bigquery.googleapis.com',          // BigQuery
  'firestore.googleapis.com',         // Firestore
  
  // Build & Deploy
  'cloudbuild.googleapis.com',         // Cloud Build
  'artifactregistry.googleapis.com',   // Artifact Registry
  'containerregistry.googleapis.com',  // Container Registry
  
  // Monitoring & Logging
  'monitoring.googleapis.com',        // Cloud Monitoring
  'logging.googleapis.com',           // Cloud Logging
  
  // Security & IAM
  'iam.googleapis.com',               // IAM
  'secretmanager.googleapis.com',     // Secret Manager
  
  // Networking
  'servicenetworking.googleapis.com', // Service Networking
  'dns.googleapis.com',               // Cloud DNS
  
  // AI/ML
  'aiplatform.googleapis.com',        // Vertex AI
  'ml.googleapis.com',                // ML Engine
  
  // Service Usage (needed to check APIs)
  'serviceusage.googleapis.com',      // Service Usage API
];

console.log(`📦 Enabling ${apisToEnable.length} APIs...\n`);

const results: Array<{ api: string; success: boolean; error?: string }> = [];

for (const api of apisToEnable) {
  try {
    console.log(`   Enabling ${api}...`);
    execSync(
      `gcloud services enable ${api} --project=${PROJECT_ID}`,
      { stdio: 'inherit' }
    );
    results.push({ api, success: true });
    console.log(`   ✅ ${api} enabled\n`);
  } catch (error: any) {
    const errorMsg = error.message.split('\n')[0];
    results.push({ api, success: false, error: errorMsg });
    console.log(`   ⚠️  ${api} - ${errorMsg}\n`);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Enable Results:\n');

const successful = results.filter(r => r.success);
const failed = results.filter(r => !r.success);

console.log(`   ✅ Successfully Enabled: ${successful.length}`);
console.log(`   ❌ Failed: ${failed.length}`);

if (failed.length > 0) {
  console.log('\n⚠️  Failed APIs:');
  failed.forEach(r => {
    console.log(`   ❌ ${r.api} - ${r.error || 'Unknown error'}`);
  });
}

if (successful.length === apisToEnable.length) {
  console.log('\n✅ All APIs enabled successfully!');
  console.log('\n🚀 Next Steps:');
  console.log('   pnpm test:gcp        # Test connections');
  console.log('   pnpm deploy:gcp      # Deploy to Cloud Run');
  console.log('   pnpm deploy:gke      # Deploy to GKE');
} else {
  console.log('\n⚠️  Some APIs failed to enable. Check errors above.');
  console.log('💡 Common issues:');
  console.log('   - Billing not enabled');
  console.log('   - Insufficient permissions');
  console.log('   - API requires manual approval');
}

