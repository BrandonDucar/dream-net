#!/usr/bin/env tsx
/**
 * Enable Required Google Cloud APIs
 * 
 * Automatically enables all APIs needed for DreamNet infrastructure
 * 
 * Usage: pnpm enable:gcp-apis
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';

const REQUIRED_APIS = [
  // Kubernetes & Compute
  'container.googleapis.com',           // GKE
  'compute.googleapis.com',             // Compute Engine
  'cloudresourcemanager.googleapis.com', // Resource Manager
  
  // Databases & Storage
  'sqladmin.googleapis.com',           // Cloud SQL
  'bigquery.googleapis.com',           // BigQuery
  'spanner.googleapis.com',           // Cloud Spanner
  'redis.googleapis.com',              // Memorystore (Redis)
  'storage-component.googleapis.com',   // Cloud Storage
  'bigtableadmin.googleapis.com',      // Bigtable
  
  // Serverless & Functions
  'cloudfunctions.googleapis.com',     // Cloud Functions
  'run.googleapis.com',                // Cloud Run
  'cloudscheduler.googleapis.com',     // Cloud Scheduler
  
  // Messaging & Events
  'pubsub.googleapis.com',             // Pub/Sub
  'cloudbuild.googleapis.com',        // Cloud Build
  
  // AI/ML
  'aiplatform.googleapis.com',        // Vertex AI
  'ml.googleapis.com',                // ML Engine
  
  // Monitoring & Logging
  'logging.googleapis.com',           // Cloud Logging
  'monitoring.googleapis.com',        // Cloud Monitoring
  'cloudtrace.googleapis.com',       // Cloud Trace
  'errorreporting.googleapis.com',    // Error Reporting
  
  // Networking
  'servicenetworking.googleapis.com', // Service Networking
  'vpcaccess.googleapis.com',         // VPC Access
  
  // IAM & Security
  'iam.googleapis.com',               // IAM
  'serviceusage.googleapis.com',      // Service Usage
];

console.log('🔧 Enabling Google Cloud APIs...\n');
console.log(`📋 Project: ${PROJECT_ID}\n`);

let enabled = 0;
let failed = 0;
const errors: string[] = [];

for (const api of REQUIRED_APIS) {
  try {
    console.log(`   Enabling ${api}...`);
    execSync(
      `gcloud services enable ${api} --project=${PROJECT_ID}`,
      { stdio: 'pipe' }
    );
    enabled++;
    console.log(`   ✅ ${api}`);
  } catch (error: any) {
    failed++;
    const errorMsg = `Failed to enable ${api}`;
    errors.push(errorMsg);
    console.log(`   ⚠️  ${api} - ${errorMsg}`);
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Enabled: ${enabled}/${REQUIRED_APIS.length}`);
console.log(`   Failed: ${failed}`);

if (errors.length > 0) {
  console.log(`\n⚠️  Errors:`);
  errors.forEach(err => console.log(`   - ${err}`));
  console.log(`\n💡 Some APIs may require billing to be enabled.`);
  console.log(`   Go to: https://console.cloud.google.com/billing`);
}

if (enabled === REQUIRED_APIS.length) {
  console.log(`\n✅ All APIs enabled successfully!`);
} else {
  console.log(`\n⚠️  Some APIs failed to enable. Check billing and permissions.`);
}

