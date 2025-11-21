#!/usr/bin/env tsx
/**
 * Google Cloud Data Infrastructure Deployment Script
 * 
 * Deploys DreamNet data infrastructure:
 * - Cloud SQL Postgres (replaces Neon)
 * - BigQuery (analytics warehouse)
 * - Memorystore Redis (caching)
 * - Cloud Storage buckets (if needed)
 * 
 * Usage: pnpm deploy:data-gcp
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';

console.log('🚀 Starting Google Cloud Data Infrastructure deployment...\n');
console.log(`📋 Configuration:`);
console.log(`   Project ID: ${PROJECT_ID}`);
console.log(`   Region: ${REGION}\n`);

// Step 1: Verify gcloud CLI is installed
console.log('🔍 Checking gcloud CLI...');
try {
  execSync('gcloud --version', { stdio: 'pipe' });
  console.log('✅ gcloud CLI found\n');
} catch (error) {
  console.error('❌ Error: gcloud CLI not found. Please install it:');
  console.error('   https://cloud.google.com/sdk/docs/install');
  process.exit(1);
}

// Step 2: Verify project access
console.log('🔍 Verifying project access...');
try {
  execSync(`gcloud config set project ${PROJECT_ID}`, { stdio: 'pipe' });
  const projectInfo = execSync(
    `gcloud projects describe ${PROJECT_ID} --format="value(projectId)"`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ).trim();
  
  if (projectInfo === PROJECT_ID) {
    console.log(`✅ Project access verified: ${PROJECT_ID}\n`);
  } else {
    console.error(`❌ Project mismatch: expected ${PROJECT_ID}, got ${projectInfo}`);
    process.exit(1);
  }
} catch (error: any) {
  console.error(`❌ Cannot access project ${PROJECT_ID}`);
  console.error(`   Error: ${error.message.split('\n')[0]}`);
  console.error(`   Make sure you have permissions and billing is enabled.`);
  process.exit(1);
}

// Step 3: Enable required APIs
console.log('🔧 Enabling required APIs...');
const requiredApis = [
  'sqladmin.googleapis.com',      // Cloud SQL
  'bigquery.googleapis.com',       // BigQuery
  'redis.googleapis.com',          // Memorystore
  'storage-component.googleapis.com', // Cloud Storage
  'serviceusage.googleapis.com',   // Service Usage
];

let apisEnabled = 0;
for (const api of requiredApis) {
  try {
    execSync(
      `gcloud services enable ${api} --project=${PROJECT_ID}`,
      { stdio: 'pipe' }
    );
    apisEnabled++;
    console.log(`   ✅ ${api}`);
  } catch (error: any) {
    if (error.message.includes('already enabled')) {
      apisEnabled++;
      console.log(`   ✅ ${api} (already enabled)`);
    } else {
      console.log(`   ⚠️  ${api} - ${error.message.split('\n')[0]}`);
    }
  }
}

console.log(`\n✅ Enabled ${apisEnabled}/${requiredApis.length} APIs\n`);

// Step 4: Create Cloud SQL Postgres instance
console.log('🗄️  Creating Cloud SQL Postgres instance...');
try {
  // Check if instance already exists
  try {
    const existing = execSync(
      `gcloud sql instances describe dreamnet-postgres --project=${PROJECT_ID}`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );
    console.log('   ℹ️  Cloud SQL instance already exists: dreamnet-postgres');
    console.log('   Skipping creation. Use gcloud sql instances update to modify.\n');
  } catch {
    // Instance doesn't exist, create it
    console.log('   Creating new instance...');
    execSync(
      `gcloud sql instances create dreamnet-postgres ` +
      `--database-version=POSTGRES_15 ` +
      `--tier=db-f1-micro ` +
      `--region=${REGION} ` +
      `--project=${PROJECT_ID} ` +
      `--storage-type=SSD ` +
      `--storage-size=20GB ` +
      `--storage-auto-increase ` +
      `--backup-start-time=03:00 ` +
      `--database-flags=max_connections=100 ` +
      `--authorized-networks=0.0.0.0/0`,
      { stdio: 'inherit' }
    );
    console.log('   ✅ Cloud SQL instance created\n');
  }
} catch (error: any) {
  console.error(`   ❌ Failed to create Cloud SQL instance: ${error.message.split('\n')[0]}`);
  console.error('   Continuing with other resources...\n');
}

// Step 5: Create database and user
console.log('📊 Creating database and user...');
try {
  // Create database
  try {
    execSync(
      `gcloud sql databases create dreamnet-db ` +
      `--instance=dreamnet-postgres ` +
      `--project=${PROJECT_ID}`,
      { stdio: 'pipe' }
    );
    console.log('   ✅ Database created: dreamnet-db');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('   ℹ️  Database already exists: dreamnet-db');
    } else {
      throw error;
    }
  }

  // Create user (password will be generated)
  try {
    const password = execSync(
      `gcloud sql users create dreamnet-user ` +
      `--instance=dreamnet-postgres ` +
      `--password=$(openssl rand -base64 32) ` +
      `--project=${PROJECT_ID}`,
      { stdio: 'pipe', encoding: 'utf-8' }
    );
    console.log('   ✅ User created: dreamnet-user');
    console.log('   ⚠️  Password generated. Store it securely in Secret Manager.');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('   ℹ️  User already exists: dreamnet-user');
    } else {
      console.log(`   ⚠️  Could not create user: ${error.message.split('\n')[0]}`);
      console.log('   You may need to create the user manually or reset password.');
    }
  }
  console.log('');
} catch (error: any) {
  console.error(`   ❌ Failed to create database/user: ${error.message.split('\n')[0]}\n`);
}

// Step 6: Create BigQuery dataset
console.log('📈 Creating BigQuery dataset...');
try {
  execSync(
    `bq mk --dataset ` +
    `--location=US ` +
    `--description="DreamNet Analytics Data Warehouse" ` +
    `--default_table_expiration=3600000 ` +
    `--default_partition_expiration=2592000000 ` +
    `${PROJECT_ID}:dreamnet_analytics`,
    { stdio: 'pipe' }
  );
  console.log('   ✅ BigQuery dataset created: dreamnet_analytics\n');
} catch (error: any) {
  if (error.message.includes('already exists')) {
    console.log('   ℹ️  BigQuery dataset already exists: dreamnet_analytics\n');
  } else {
    console.error(`   ⚠️  Could not create BigQuery dataset: ${error.message.split('\n')[0]}\n`);
  }
}

// Step 7: Create Memorystore Redis instance
console.log('🔴 Creating Memorystore Redis instance...');
try {
  try {
    const existing = execSync(
      `gcloud redis instances describe dreamnet-redis --region=${REGION} --project=${PROJECT_ID}`,
      { stdio: 'pipe' }
    );
    console.log('   ℹ️  Redis instance already exists: dreamnet-redis');
    console.log('   Skipping creation.\n');
  } catch {
    console.log('   Creating new instance...');
    execSync(
      `gcloud redis instances create dreamnet-redis ` +
      `--size=1 ` +
      `--region=${REGION} ` +
      `--redis-version=redis_7_0 ` +
      `--tier=standard ` +
      `--project=${PROJECT_ID}`,
      { stdio: 'inherit' }
    );
    console.log('   ✅ Redis instance created\n');
  }
} catch (error: any) {
  console.error(`   ⚠️  Could not create Redis instance: ${error.message.split('\n')[0]}`);
  console.error('   Note: Redis requires VPC network. This may need manual setup.\n');
}

// Step 8: Get connection details
console.log('🔗 Retrieving connection details...\n');
try {
  // Get Cloud SQL connection name
  const connectionName = execSync(
    `gcloud sql instances describe dreamnet-postgres --project=${PROJECT_ID} --format="value(connectionName)"`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ).trim();
  
  // Get Cloud SQL IP
  const sqlIp = execSync(
    `gcloud sql instances describe dreamnet-postgres --project=${PROJECT_ID} --format="value(ipAddresses[0].ipAddress)"`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ).trim();
  
  // Get Redis IP
  let redisIp = '';
  try {
    redisIp = execSync(
      `gcloud redis instances describe dreamnet-redis --region=${REGION} --project=${PROJECT_ID} --format="value(host)"`,
      { encoding: 'utf-8', stdio: 'pipe' }
    ).trim();
  } catch {
    redisIp = 'Not available (VPC required)';
  }
  
  console.log('✅ Data Infrastructure Deployment Complete!\n');
  console.log('📋 Connection Details:');
  console.log(`   Cloud SQL Connection Name: ${connectionName}`);
  console.log(`   Cloud SQL IP: ${sqlIp}`);
  console.log(`   Redis IP: ${redisIp}`);
  console.log(`   BigQuery Dataset: ${PROJECT_ID}:dreamnet_analytics\n`);
  
  console.log('💡 Next Steps:');
  console.log('   1. Store database password in Secret Manager:');
  console.log(`      gcloud secrets create dreamnet-db-password --data-file=-`);
  console.log('   2. Update DATABASE_URL env var with connection details');
  console.log('   3. Run database migrations');
  console.log(`   4. Deploy API: pnpm deploy:gcp\n`);
  
} catch (error: any) {
  console.error(`⚠️  Could not retrieve connection details: ${error.message.split('\n')[0]}\n`);
}

console.log('✅ Data infrastructure deployment script completed!');

