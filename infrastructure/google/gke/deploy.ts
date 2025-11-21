#!/usr/bin/env tsx
/**
 * Deploy DreamNet to Google Kubernetes Engine (GKE)
 * 
 * Creates cluster, deploys application, sets up ingress
 * 
 * Usage: pnpm deploy:gke
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const PROJECT_ID = process.env.GCP_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || process.env.GOOGLE_CLOUD_REGION || 'us-central1';
const CLUSTER_NAME = process.env.GKE_CLUSTER_NAME || 'dreamnet-cluster';
const ZONE = `${REGION}-a`;

console.log('🚀 Deploying DreamNet to Google Kubernetes Engine...\n');
console.log(`📋 Configuration:`);
console.log(`   Project: ${PROJECT_ID}`);
console.log(`   Region: ${REGION}`);
console.log(`   Cluster: ${CLUSTER_NAME}\n`);

// Step 1: Verify gcloud is authenticated
console.log('🔍 Checking authentication...');
try {
  const account = execSync('gcloud config get-value account', { encoding: 'utf-8' }).trim();
  if (!account || account === '(unset)') {
    throw new Error('Not authenticated');
  }
  console.log(`   ✅ Authenticated as: ${account}\n`);
} catch (error) {
  console.error('❌ Not authenticated. Run: gcloud auth login');
  process.exit(1);
}

// Step 2: Check if cluster exists
console.log('🔍 Checking for existing cluster...');
let clusterExists = false;
try {
  execSync(
    `gcloud container clusters describe ${CLUSTER_NAME} --zone=${ZONE} --project=${PROJECT_ID}`,
    { stdio: 'pipe' }
  );
  clusterExists = true;
  console.log(`   ✅ Cluster ${CLUSTER_NAME} exists\n`);
} catch (error) {
  console.log(`   ℹ️  Cluster ${CLUSTER_NAME} does not exist, will create\n`);
}

// Step 3: Create cluster if needed
if (!clusterExists) {
  console.log('🏗️  Creating GKE cluster...');
  try {
    execSync(
      `gcloud container clusters create ${CLUSTER_NAME} ` +
      `--zone=${ZONE} ` +
      `--project=${PROJECT_ID} ` +
      `--machine-type=e2-standard-4 ` +
      `--num-nodes=3 ` +
      `--enable-autoscaling ` +
      `--min-nodes=3 ` +
      `--max-nodes=10 ` +
      `--enable-autorepair ` +
      `--enable-autoupgrade ` +
      `--addons=HorizontalPodAutoscaling,HttpLoadBalancing ` +
      `--enable-network-policy`,
      { stdio: 'inherit' }
    );
    console.log('✅ Cluster created successfully\n');
  } catch (error) {
    console.error('❌ Failed to create cluster');
    console.error('   Make sure billing is enabled and APIs are enabled');
    process.exit(1);
  }
}

// Step 4: Get cluster credentials
console.log('🔐 Getting cluster credentials...');
try {
  execSync(
    `gcloud container clusters get-credentials ${CLUSTER_NAME} --zone=${ZONE} --project=${PROJECT_ID}`,
    { stdio: 'inherit' }
  );
  console.log('✅ Credentials configured\n');
} catch (error) {
  console.error('❌ Failed to get credentials');
  process.exit(1);
}

// Step 5: Build and push Docker images
console.log('🐳 Building Docker images...');
try {
  // Build API image
  const apiImage = `gcr.io/${PROJECT_ID}/dreamnet-api:latest`;
  execSync(
    `gcloud builds submit --tag ${apiImage} --project=${PROJECT_ID} -f server/Dockerfile .`,
    { stdio: 'inherit' }
  );
  console.log(`✅ API image built: ${apiImage}\n`);
  
  // Build frontend image (if separate)
  const frontendImage = `gcr.io/${PROJECT_ID}/dreamnet-frontend:latest`;
  execSync(
    `gcloud builds submit --tag ${frontendImage} --project=${PROJECT_ID} -f client/Dockerfile .`,
    { stdio: 'inherit' }
  ).catch(() => {
    console.log('⚠️  Frontend Dockerfile not found, skipping frontend image');
  });
} catch (error) {
  console.error('❌ Failed to build images');
  process.exit(1);
}

// Step 6: Create secrets
console.log('🔐 Creating Kubernetes secrets...');
const secretsPath = join(process.cwd(), 'infrastructure', 'google', 'gke', 'secrets.yaml');
if (existsSync(secretsPath)) {
  try {
    execSync(`kubectl apply -f ${secretsPath}`, { stdio: 'inherit' });
    console.log('✅ Secrets created\n');
  } catch (error) {
    console.log('⚠️  Secrets file not found or failed to apply\n');
  }
} else {
  console.log('⚠️  No secrets file found, skipping\n');
}

// Step 7: Deploy application
console.log('📦 Deploying application...');
const deploymentPath = join(process.cwd(), 'infrastructure', 'google', 'gke', 'deployment.yaml');
if (existsSync(deploymentPath)) {
  try {
    // Update image references in deployment
    let deployment = readFileSync(deploymentPath, 'utf-8');
    deployment = deployment.replace(
      /gcr.io\/dreamnet-62b49\/dreamnet:latest/g,
      `gcr.io/${PROJECT_ID}/dreamnet-api:latest`
    );
    deployment = deployment.replace(
      /gcr.io\/dreamnet-62b49\/dreamnet-frontend:latest/g,
      `gcr.io/${PROJECT_ID}/dreamnet-frontend:latest`
    );
    
    const tempPath = join(process.cwd(), 'infrastructure', 'google', 'gke', 'deployment-temp.yaml');
    require('fs').writeFileSync(tempPath, deployment);
    
    execSync(`kubectl apply -f ${tempPath}`, { stdio: 'inherit' });
    console.log('✅ Deployment applied\n');
  } catch (error) {
    console.error('❌ Failed to deploy');
    process.exit(1);
  }
} else {
  console.error('❌ Deployment file not found');
  process.exit(1);
}

// Step 8: Create services
console.log('🌐 Creating services...');
const servicePath = join(process.cwd(), 'infrastructure', 'google', 'gke', 'service.yaml');
if (existsSync(servicePath)) {
  try {
    execSync(`kubectl apply -f ${servicePath}`, { stdio: 'inherit' });
    console.log('✅ Services created\n');
  } catch (error) {
    console.error('❌ Failed to create services');
  }
}

// Step 9: Create ingress
console.log('🔗 Setting up ingress...');
const ingressPath = join(process.cwd(), 'infrastructure', 'google', 'gke', 'ingress.yaml');
if (existsSync(ingressPath)) {
  try {
    execSync(`kubectl apply -f ${ingressPath}`, { stdio: 'inherit' });
    console.log('✅ Ingress created\n');
  } catch (error) {
    console.log('⚠️  Ingress setup failed (may need manual configuration)\n');
  }
}

// Step 10: Get service URLs
console.log('🔗 Retrieving service URLs...');
try {
  const services = execSync('kubectl get services', { encoding: 'utf-8' });
  console.log('\n📊 Services:');
  console.log(services);
  
  const ingress = execSync('kubectl get ingress', { encoding: 'utf-8' }).catch(() => '');
  if (ingress) {
    console.log('\n📊 Ingress:');
    console.log(ingress);
  }
  
  console.log('\n✅ Deployment complete!');
  console.log(`\n📊 View cluster: https://console.cloud.google.com/kubernetes/clusters/details/${ZONE}/${CLUSTER_NAME}?project=${PROJECT_ID}`);
  console.log(`\n📊 View pods: kubectl get pods`);
  console.log(`\n📊 View logs: kubectl logs -f deployment/dreamnet-api`);
} catch (error) {
  console.log('⚠️  Could not retrieve service info');
}

