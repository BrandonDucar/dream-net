#!/usr/bin/env tsx
/**
 * Test ALL Google Cloud APIs and Services
 * 
 * Comprehensive test of every GCP service we might use
 * Shows what's available, what's enabled, what needs setup
 * 
 * Usage: pnpm tsx scripts/test-all-gcp-apis.ts
 */

import { execSync } from 'child_process';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';

console.log('🔍 Testing ALL Google Cloud APIs and Services...\n');
console.log(`📋 Project: ${PROJECT_ID}\n`);

interface ApiStatus {
  name: string;
  enabled: boolean;
  accessible: boolean;
  error?: string;
  details?: any;
}

const apis: ApiStatus[] = [];

// All GCP APIs we might use
const apiList = [
  // Compute
  { api: 'compute.googleapis.com', name: 'Compute Engine', test: 'gcloud compute instances list --limit=1' },
  { api: 'container.googleapis.com', name: 'GKE', test: 'gcloud container clusters list' },
  { api: 'run.googleapis.com', name: 'Cloud Run', test: 'gcloud run services list' },
  { api: 'appengine.googleapis.com', name: 'App Engine', test: 'gcloud app describe' },
  
  // Functions & Events
  { api: 'cloudfunctions.googleapis.com', name: 'Cloud Functions', test: 'gcloud functions list' },
  { api: 'cloudscheduler.googleapis.com', name: 'Cloud Scheduler', test: 'gcloud scheduler jobs list' },
  { api: 'cloudtasks.googleapis.com', name: 'Cloud Tasks', test: 'gcloud tasks queues list' },
  { api: 'pubsub.googleapis.com', name: 'Pub/Sub', test: 'gcloud pubsub topics list' },
  
  // Storage & Database
  { api: 'storage-component.googleapis.com', name: 'Cloud Storage', test: 'gcloud storage buckets list' },
  { api: 'sqladmin.googleapis.com', name: 'Cloud SQL', test: 'gcloud sql instances list' },
  { api: 'bigquery.googleapis.com', name: 'BigQuery', test: 'gcloud bq datasets list' },
  { api: 'firestore.googleapis.com', name: 'Firestore', test: 'gcloud firestore databases list' },
  
  // Build & Deploy
  { api: 'cloudbuild.googleapis.com', name: 'Cloud Build', test: 'gcloud builds list --limit=1' },
  { api: 'artifactregistry.googleapis.com', name: 'Artifact Registry', test: 'gcloud artifacts repositories list' },
  { api: 'containerregistry.googleapis.com', name: 'Container Registry', test: 'gcloud container images list' },
  
  // Monitoring & Logging
  { api: 'monitoring.googleapis.com', name: 'Cloud Monitoring', test: 'gcloud monitoring dashboards list' },
  { api: 'logging.googleapis.com', name: 'Cloud Logging', test: 'gcloud logging logs list --limit=1' },
  
  // Security & IAM
  { api: 'iam.googleapis.com', name: 'IAM', test: 'gcloud iam service-accounts list' },
  { api: 'secretmanager.googleapis.com', name: 'Secret Manager', test: 'gcloud secrets list' },
  
  // Networking
  { api: 'servicenetworking.googleapis.com', name: 'Service Networking', test: 'gcloud services vpc-peerings list' },
  { api: 'dns.googleapis.com', name: 'Cloud DNS', test: 'gcloud dns managed-zones list' },
  
  // AI/ML
  { api: 'aiplatform.googleapis.com', name: 'Vertex AI', test: 'gcloud ai models list --region=us-central1' },
  { api: 'ml.googleapis.com', name: 'ML Engine', test: 'gcloud ml-engine models list' },
];

console.log('📡 Checking API Status...\n');

for (const { api, name, test } of apiList) {
  const status: ApiStatus = {
    name,
    enabled: false,
    accessible: false,
  };
  
  // Check if API is enabled
  try {
    const result = execSync(
      `gcloud services list --enabled --filter="name:${api}" --project=${PROJECT_ID} --format="value(name)"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    if (result.trim()) {
      status.enabled = true;
      
      // Try to access the service
      try {
        execSync(test, { encoding: 'utf-8', stdio: 'pipe', timeout: 5000 });
        status.accessible = true;
        console.log(`   ✅ ${name} - Enabled & Accessible`);
      } catch (error: any) {
        status.accessible = false;
        status.error = error.message.split('\n')[0];
        console.log(`   ⚠️  ${name} - Enabled but not accessible`);
      }
    } else {
      console.log(`   ❌ ${name} - Not Enabled`);
    }
  } catch (error: any) {
    status.error = error.message.split('\n')[0];
    console.log(`   ❌ ${name} - Error checking`);
  }
  
  apis.push(status);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 API Status Summary\n');

const enabled = apis.filter(a => a.enabled);
const accessible = apis.filter(a => a.accessible);

console.log(`   Total APIs Checked: ${apis.length}`);
console.log(`   ✅ Enabled: ${enabled.length}`);
console.log(`   ✅ Accessible: ${accessible.length}`);
console.log(`   ❌ Not Enabled: ${apis.length - enabled.length}`);

console.log('\n🎯 Enabled & Ready:');
accessible.forEach(api => {
  console.log(`   ✅ ${api.name}`);
});

console.log('\n⚠️  Enabled but Needs Setup:');
apis.filter(a => a.enabled && !a.accessible).forEach(api => {
  console.log(`   ⚠️  ${api.name} - ${api.error || 'Check permissions'}`);
});

console.log('\n❌ Not Enabled (Can Enable):');
apis.filter(a => !a.enabled).forEach(api => {
  console.log(`   ❌ ${api.name}`);
});

console.log('\n💡 To Enable APIs:');
console.log(`   gcloud services enable <API_NAME> --project=${PROJECT_ID}`);
console.log(`   Or: pnpm enable:gcp-apis`);

// Generate enable script
const notEnabledApis = apis.filter(a => !a.enabled).map(a => {
  const apiInfo = apiList.find(ai => ai.name === a.name);
  return apiInfo?.api;
}).filter(Boolean);

if (notEnabledApis.length > 0) {
  console.log('\n📝 Quick Enable Script:');
  console.log('```bash');
  notEnabledApis.forEach(api => {
    console.log(`gcloud services enable ${api} --project=${PROJECT_ID}`);
  });
  console.log('```');
}

