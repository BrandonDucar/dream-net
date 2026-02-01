#!/usr/bin/env tsx
/**
 * Deploy DreamNet to Amazon EKS
 * 
 * Creates EKS cluster, deploys application, sets up ingress
 * 
 * Usage: pnpm deploy:eks
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const CLUSTER_NAME = process.env.EKS_CLUSTER_NAME || 'dreamnet-cluster';
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID || '001092882186';

console.log('🚀 Deploying DreamNet to Amazon EKS...\n');
console.log(`📋 Configuration:`);
console.log(`   Region: ${AWS_REGION}`);
console.log(`   Cluster: ${CLUSTER_NAME}`);
console.log(`   Account: ${AWS_ACCOUNT_ID}\n`);

// Step 1: Verify AWS CLI and credentials
console.log('🔍 Checking AWS credentials...');
try {
  const identity = JSON.parse(
    execSync('aws sts get-caller-identity', { encoding: 'utf-8', stdio: 'pipe' }).trim()
  );
  console.log(`   ✅ Authenticated as: ${identity.Arn}\n`);
} catch (error) {
  console.error('❌ AWS credentials not configured');
  process.exit(1);
}

// Step 2: Check if eksctl is installed
console.log('🔍 Checking eksctl...');
try {
  const version = execSync('eksctl version', { encoding: 'utf-8', stdio: 'pipe' }).trim();
  console.log(`   ✅ eksctl installed: ${version}\n`);
} catch (error) {
  console.error('❌ eksctl not found. Install from: https://eksctl.io/installation/');
  console.log('   Or use AWS Console to create cluster manually');
  process.exit(1);
}

// Step 3: Check if cluster exists
console.log('🔍 Checking for existing cluster...');
let clusterExists = false;
try {
  execSync(
    `aws eks describe-cluster --name ${CLUSTER_NAME} --region ${AWS_REGION}`,
    { stdio: 'pipe' }
  );
  clusterExists = true;
  console.log(`   ✅ Cluster ${CLUSTER_NAME} exists\n`);
} catch (error) {
  console.log(`   ℹ️  Cluster ${CLUSTER_NAME} does not exist, will create\n`);
}

// Step 4: Create cluster if needed
if (!clusterExists) {
  console.log('🏗️  Creating EKS cluster...');
  const clusterConfigPath = join(process.cwd(), 'infrastructure', 'aws', 'eks', 'cluster.yaml');
  
  if (existsSync(clusterConfigPath)) {
    try {
      execSync(
        `eksctl create cluster -f ${clusterConfigPath}`,
        { stdio: 'inherit' }
      );
      console.log('✅ Cluster created successfully\n');
    } catch (error) {
      console.error('❌ Failed to create cluster');
      console.error('   Make sure IAM permissions are attached and eksctl is configured');
      process.exit(1);
    }
  } else {
    // Fallback: Create cluster with eksctl command
    try {
      execSync(
        `eksctl create cluster ` +
        `--name ${CLUSTER_NAME} ` +
        `--region ${AWS_REGION} ` +
        `--nodegroup-name standard-ng ` +
        `--node-type t3.large ` +
        `--nodes 3 ` +
        `--nodes-min 3 ` +
        `--nodes-max 10 ` +
        `--managed`,
        { stdio: 'inherit' }
      );
      console.log('✅ Cluster created successfully\n');
    } catch (error) {
      console.error('❌ Failed to create cluster');
      process.exit(1);
    }
  }
}

// Step 5: Update kubeconfig
console.log('🔐 Updating kubeconfig...');
try {
  execSync(
    `aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${AWS_REGION}`,
    { stdio: 'inherit' }
  );
  console.log('✅ Kubeconfig updated\n');
} catch (error) {
  console.error('❌ Failed to update kubeconfig');
  process.exit(1);
}

// Step 6: Build and push Docker images to ECR
console.log('🐳 Building and pushing Docker images...');
try {
  const ecrUri = `${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/dreamnet`;
  
  // Login to ECR
  execSync(
    `aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ecrUri}`,
    { stdio: 'inherit' }
  );
  
  // Create repository if needed
  try {
    execSync(`aws ecr describe-repositories --repository-names dreamnet --region ${AWS_REGION}`, { stdio: 'pipe' });
  } catch {
    console.log('   Creating ECR repository...');
    execSync(`aws ecr create-repository --repository-name dreamnet --region ${AWS_REGION}`, { stdio: 'inherit' });
  }
  
  // Build and push
  const imageTag = `${ecrUri}:latest`;
  execSync(`docker build -t ${imageTag} -f server/Dockerfile .`, { stdio: 'inherit' });
  execSync(`docker push ${imageTag}`, { stdio: 'inherit' });
  
  console.log(`✅ Image pushed: ${imageTag}\n`);
} catch (error) {
  console.error('❌ Failed to build/push images');
  console.error('   Make sure Docker is running and ECR permissions are set');
}

// Step 7: Create secrets
console.log('🔐 Creating Kubernetes secrets...');
const secretsPath = join(process.cwd(), 'infrastructure', 'aws', 'eks', 'secrets.yaml');
if (existsSync(secretsPath)) {
  try {
    execSync(`kubectl apply -f ${secretsPath}`, { stdio: 'inherit' });
    console.log('✅ Secrets created\n');
  } catch (error) {
    console.log('⚠️  Secrets file not found or failed to apply\n');
  }
}

// Step 8: Deploy application
console.log('📦 Deploying application...');
const deploymentPath = join(process.cwd(), 'infrastructure', 'aws', 'eks', 'deployment.yaml');
if (existsSync(deploymentPath)) {
  try {
    // Update image reference
    let deployment = readFileSync(deploymentPath, 'utf-8');
    deployment = deployment.replace(
      /001092882186\.dkr\.ecr\.us-east-1\.amazonaws\.com\/dreamnet:latest/g,
      `${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/dreamnet:latest`
    );
    
    const tempPath = join(process.cwd(), 'infrastructure', 'aws', 'eks', 'deployment-temp.yaml');
    require('fs').writeFileSync(tempPath, deployment);
    
    execSync(`kubectl apply -f ${tempPath}`, { stdio: 'inherit' });
    console.log('✅ Deployment applied\n');
  } catch (error) {
    console.error('❌ Failed to deploy');
    process.exit(1);
  }
}

// Step 9: Get service info
console.log('🔗 Retrieving service info...');
try {
  const services = execSync('kubectl get services', { encoding: 'utf-8' });
  console.log('\n📊 Services:');
  console.log(services);
  
  const pods = execSync('kubectl get pods', { encoding: 'utf-8' });
  console.log('\n📊 Pods:');
  console.log(pods);
  
  console.log('\n✅ Deployment complete!');
  console.log(`\n📊 View cluster: https://${AWS_REGION}.console.aws.amazon.com/eks/home?region=${AWS_REGION}#/clusters/${CLUSTER_NAME}`);
  console.log(`\n📊 View pods: kubectl get pods`);
  console.log(`\n📊 View logs: kubectl logs -f deployment/dreamnet-api`);
} catch (error) {
  console.log('⚠️  Could not retrieve service info');
}

