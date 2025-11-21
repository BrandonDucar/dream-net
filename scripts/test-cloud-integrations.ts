/**
 * Test Cloud Integrations (AWS & Google Cloud)
 * Quick verification script
 */

import { verifyAwsCredentials } from '../server/integrations/awsClient.js';
import { verifyGoogleCloudCredentials } from '../server/integrations/googleCloudClient.js';

async function testIntegrations() {
  console.log('🧪 Testing Cloud Integrations...\n');

  // Test AWS
  console.log('📦 Testing AWS SDK...');
  try {
    const awsInfo = await verifyAwsCredentials();
    console.log('✅ AWS Credentials:', {
      account: awsInfo.account,
      userId: awsInfo.userId.substring(0, 20) + '...',
    });
  } catch (error: any) {
    console.log('⚠️  AWS:', error.message);
    console.log('   (This is OK if credentials not configured)');
  }

  console.log('');

  // Test Google Cloud
  console.log('☁️  Testing Google Cloud SDK...');
  try {
    const gcpInfo = await verifyGoogleCloudCredentials();
    console.log('✅ Google Cloud Credentials:', {
      projectId: gcpInfo.projectId,
      region: gcpInfo.region,
    });
  } catch (error: any) {
    console.log('⚠️  Google Cloud:', error.message);
    console.log('   (This is OK if credentials not configured)');
  }

  console.log('\n✅ Integration tests complete!');
  console.log('\n📝 Note: Credential errors are expected if not configured.');
  console.log('   Set up credentials to use cloud services:');
  console.log('   - AWS: AWS CLI configured or AWS_ACCESS_KEY_ID env var');
  console.log('   - GCP: GOOGLE_APPLICATION_CREDENTIALS env var or gcloud auth');
}

testIntegrations().catch(console.error);



