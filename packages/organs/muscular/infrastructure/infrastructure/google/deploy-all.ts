#!/usr/bin/env tsx
/**
 * Google Cloud Platform Deployment Script
 * 
 * Deploys DreamNet to Google Cloud Run:
 * - Builds frontend (client/)
 * - Builds backend Docker image
 * - Deploys to Cloud Run (serves both frontend static files and backend API)
 * 
 * Usage: pnpm deploy:gcp
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';
const SERVICE_NAME = process.env.GCP_SERVICE_NAME || 'dreamnet-api';
const REGISTRY = `${REGION}-docker.pkg.dev/${PROJECT_ID}/dreamnet-images`;
const IMAGE_NAME = `${REGISTRY}/${SERVICE_NAME}:latest`;

console.log('🚀 Starting Google Cloud Platform deployment...\n');
console.log(`📋 Configuration:`);
console.log(`   Project ID: ${PROJECT_ID}`);
console.log(`   Region: ${REGION}`);
console.log(`   Service Name: ${SERVICE_NAME}`);
console.log(`   Image: ${IMAGE_NAME}\n`);

// Step 1: Verify gcloud CLI is installed
console.log('🔍 Checking gcloud CLI...');
try {
  execSync('gcloud --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Error: gcloud CLI not found. Please install it:');
  console.error('   https://cloud.google.com/sdk/docs/install');
  process.exit(1);
}

// Step 2: Build frontend (skip local build - will be built in Docker)
console.log('\n📦 Frontend will be built in Docker...');
console.log('✅ Skipping local build (Docker will handle it)\n');

// Step 3: Build Docker image
console.log('🐳 Building Docker image...');
try {
  execSync(
    `gcloud builds submit --tag ${IMAGE_NAME} --project ${PROJECT_ID} --machine-type=e2-highcpu-8`,
    { stdio: 'inherit', cwd: process.cwd() }
  );
  console.log('✅ Docker image built and pushed to Artifact Registry\n');
} catch (error) {
  console.error('❌ Docker build failed');
  process.exit(1);
}

// Step 4: Deploy to Cloud Run
console.log('☁️  Deploying to Cloud Run...');
try {
  const envVars = loadEnvVars();
  const envFlags = envVars.map(([key, value]) => `--set-env-vars=${key}=${value}`).join(' ');

  execSync(
    `gcloud run deploy ${SERVICE_NAME} ` +
    `--image ${IMAGE_NAME} ` +
    `--platform managed ` +
    `--region ${REGION} ` +
    `--project ${PROJECT_ID} ` +
    `--allow-unauthenticated ` +
    `--port 8080 ` +
    `--memory 2Gi ` +
    `--cpu 2 ` +
    `--timeout 300 ` +
    `--max-instances 10 ` +
    (envFlags ? `${envFlags} ` : '') +
    `--set-env-vars=NODE_ENV=production`,
    { stdio: 'inherit', cwd: process.cwd() }
  );
  console.log('✅ Deployment successful\n');
} catch (error) {
  console.error('❌ Deployment failed');
  process.exit(1);
}

// Step 5: Get service URL
console.log('🔗 Retrieving service URL...');
try {
  const url = execSync(
    `gcloud run services describe ${SERVICE_NAME} --region ${REGION} --project ${PROJECT_ID} --format="value(status.url)"`,
    { encoding: 'utf-8', stdio: 'pipe' }
  ).trim();

  console.log('\n✅ Deployment complete!');
  console.log(`\n🌐 Service URL: ${url}`);
  console.log(`\n📊 View logs: gcloud run services logs read ${SERVICE_NAME} --region ${REGION}`);
  console.log(`\n⚙️  Manage service: https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}?project=${PROJECT_ID}`);
} catch (error) {
  console.error('⚠️  Could not retrieve service URL. Check Cloud Run console.');
}

function loadEnvVars(): Array<[string, string]> {
  const envVars: Array<[string, string]> = [];

  // Load from .env.gcp if it exists
  const envGcpPath = join(process.cwd(), '.env.gcp');
  if (existsSync(envGcpPath)) {
    const content = readFileSync(envGcpPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars.push([key.trim(), valueParts.join('=').trim()]);
        }
      }
    }
  }

  // Also check for common env vars in process.env
  const commonVars = [
    'DATABASE_URL',
    'OPENAI_API_KEY',
    'ANTHROPIC_API_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER',
    'GMAIL_REFRESH_TOKEN',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'DISCORD_WEBHOOK_URL',
    'TELEGRAM_BOT_TOKEN',
    'TELEGRAM_CHAT_ID',
    'CF_API_TOKEN',
    'CF_ZONE_ID',
    'VERCEL_TOKEN',
    'ALLOWED_ORIGINS',
    'OPERATOR_WALLETS',
  ];

  for (const key of commonVars) {
    if (process.env[key] && !envVars.some(([k]) => k === key)) {
      envVars.push([key, process.env[key]!]);
    }
  }

  return envVars;
}

