/**
 * Google Cloud Production Deployment Script
 * Deploys DreamNet to Google Cloud Run
 */

import { verifyGoogleCloudCredentials, deployToCloudRun } from '../server/integrations/googleCloudClient.js';
import { execSync } from 'child_process';

async function deployToGCP() {
  console.log('🚀 Deploying DreamNet to Google Cloud Run\n');

  try {
    // Verify credentials
    console.log('🔐 Verifying Google Cloud credentials...');
    const projectInfo = await verifyGoogleCloudCredentials();
    console.log(`✅ Connected to Project: ${projectInfo.projectId}`);
    console.log(`✅ Region: ${projectInfo.region}\n`);

    // Build Docker image
    console.log('🐳 Building Docker image...');
    const imageName = `gcr.io/${projectInfo.projectId}/dreamnet:latest`;
    
    try {
      execSync(`docker build -t ${imageName} .`, { stdio: 'inherit' });
      console.log('✅ Docker image built\n');
    } catch (error: any) {
      console.error('❌ Docker build failed:', error.message);
      console.log('\n💡 Make sure Docker is running and Dockerfile exists');
      throw error;
    }

    // Push to Google Container Registry
    console.log('📤 Pushing to Google Container Registry...');
    try {
      execSync(`docker push ${imageName}`, { stdio: 'inherit' });
      console.log('✅ Image pushed to GCR\n');
    } catch (error: any) {
      console.error('❌ Push failed:', error.message);
      console.log('\n💡 Make sure you have gcloud configured:');
      console.log('   gcloud auth configure-docker');
      throw error;
    }

    // Deploy to Cloud Run
    console.log('🚀 Deploying to Cloud Run...');
    const service = await deployToCloudRun({
      serviceName: 'dreamnet-api',
      image: imageName,
      port: 8080,
      environmentVariables: {
        NODE_ENV: 'production',
        PORT: '8080',
        DATABASE_URL: process.env.DATABASE_URL || '',
      },
      memory: '1Gi',
      cpu: '1',
      minInstances: 0,
      maxInstances: 10,
    });

    console.log(`\n✅ Deployment successful!`);
    console.log(`🌐 Service URL: ${service.url}`);
    console.log(`📝 Service Name: ${service.serviceName}`);
    console.log(`🔄 Revision: ${service.revision}`);

  } catch (error: any) {
    console.error('\n❌ Deployment failed:', error.message);
    console.log('\n💡 Alternative: Use API endpoint:');
    console.log('   POST /api/google-cloud/run/deploy');
    console.log('\n💡 Or use gcloud CLI directly:');
    console.log('   gcloud run deploy dreamnet-api \\');
    console.log('     --image gcr.io/dreamnet-62b49/dreamnet:latest \\');
    console.log('     --platform managed \\');
    console.log('     --region us-central1 \\');
    console.log('     --allow-unauthenticated');
    process.exit(1);
  }
}

deployToGCP().catch(console.error);
