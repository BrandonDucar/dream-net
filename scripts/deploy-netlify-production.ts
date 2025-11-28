/**
 * Deploy DreamNet Hub to Netlify Production
 */

import { getDeploymentManager } from '../packages/deployment-core/src/index.js';
import { existsSync } from 'fs';
import { join } from 'path';

async function deployToNetlify() {
  console.log('🚀 Deploying DreamNet Hub to Netlify...\n');

  // Check if token is set
  if (!process.env.NETLIFY_TOKEN) {
    console.error('❌ NETLIFY_TOKEN not set in environment');
    console.log('Please set NETLIFY_TOKEN in your .env file');
    process.exit(1);
  }

  // Check if dist exists
  const distPath = join(process.cwd(), 'client', 'dist');
  if (!existsSync(distPath)) {
    console.error('❌ client/dist does not exist');
    console.log('Building client first...');
    // Could build here, but assuming it's already built
    process.exit(1);
  }

  console.log('✅ NETLIFY_TOKEN is set');
  console.log('✅ client/dist exists\n');

  const manager = getDeploymentManager();
  
  console.log('🌐 Deploying to Netlify production...\n');
  
  try {
    const result = await manager.deploy({
      platform: 'netlify',
      projectName: 'dreamnet-hub',
      sourceDirectory: 'client/dist',
    });

    if (result.success) {
      console.log('\n🎉 Deployment successful!');
      console.log(`📦 Deployment ID: ${result.deploymentId}`);
      console.log(`🌐 Live URL: ${result.url}`);
      if (result.logs) {
        console.log('\n📋 Deployment Logs:');
        result.logs.forEach(log => console.log(`   ${log}`));
      }
      console.log('\n✨ Your DreamNet Hub is now live on Netlify!');
    } else {
      console.error('\n❌ Deployment failed');
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('\n❌ Deployment error:', error.message);
    process.exit(1);
  }
}

deployToNetlify();

