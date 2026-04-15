/**
 * AWS Production Deployment Script
 * Deploys DreamNet frontend to AWS Amplify
 */

import { verifyAwsCredentials, createAmplifyApp, deployToAmplify } from '../server/integrations/awsClient.js';

async function deployToAWS() {
  console.log('🚀 Deploying DreamNet to AWS Amplify\n');

  try {
    // Verify credentials
    console.log('🔐 Verifying AWS credentials...');
    const identity = await verifyAwsCredentials();
    console.log(`✅ Connected to AWS Account: ${identity.account}\n`);

    // Check if app exists
    const appName = 'dreamnet';
    console.log(`📱 Checking for Amplify app: ${appName}...`);

    // Create or get app
    let appId: string;
    try {
      const { listAmplifyApps } = await import('../server/integrations/awsClient.js');
      const apps = await listAmplifyApps();
      const existingApp = apps.find((app: any) => app.name === appName);

      if (existingApp) {
        console.log(`✅ Found existing app: ${existingApp.appId}`);
        appId = existingApp.appId;
      } else {
        console.log(`📦 Creating new Amplify app...`);
        const app = await createAmplifyApp({
          name: appName,
          description: 'DreamNet Platform - Biomimetic Multi-Agent AI System',
          platform: 'WEB',
          environmentVariables: {
            NODE_ENV: 'production',
          },
        });
        appId = app.appId!;
        console.log(`✅ Created app: ${appId}`);
      }
    } catch (error: any) {
      console.error('❌ Failed to create/get app:', error.message);
      throw error;
    }

    // Deploy
    console.log('\n🚀 Deploying to Amplify...');
    const deployment = await deployToAmplify({
      appId,
      branchName: 'main',
    });

    console.log(`✅ Deployment started: ${deployment.jobId}`);
    console.log(`\n📝 Monitor deployment at: https://console.aws.amazon.com/amplify/home?region=us-east-1#/${appId}`);

  } catch (error: any) {
    console.error('\n❌ Deployment failed:', error.message);
    console.log('\n💡 Alternative: Use API endpoint:');
    console.log('   POST /api/aws/amplify/deploy');
    process.exit(1);
  }
}

deployToAWS().catch(console.error);
