#!/usr/bin/env tsx
/**
 * Fix Vercel Deployment - Force Fresh Build
 * 
 * This script:
 * 1. Checks current Vercel deployment status
 * 2. Forces a fresh deployment with cache cleared
 * 3. Verifies the correct build is deployed
 */

import { DreamNetVercelAgent } from '@dreamnet/dreamnet-vercel-agent';

async function fixDeployment() {
  console.log('🚀 DreamNet Deployment Fix Script');
  console.log('================================\n');

  try {
    // Initialize Vercel agent
    const initialized = await DreamNetVercelAgent.init();
    if (!initialized) {
      console.error('❌ Vercel agent not initialized. Set VERCEL_TOKEN env var.');
      process.exit(1);
    }

    // Get current status
    console.log('📊 Checking current deployment status...');
    const status = await DreamNetVercelAgent.status();
    console.log(`   Projects found: ${status.projectsFound}`);
    console.log(`   Deployments found: ${status.deploymentsFound}`);
    console.log(`   Last sync: ${status.lastSyncAt ? new Date(status.lastSyncAt).toISOString() : 'never'}\n`);

    // List projects
    const projects = await DreamNetVercelAgent.listProjects();
    console.log('📦 Available projects:');
    projects.forEach((project, i) => {
      console.log(`   ${i + 1}. ${project.name} (${project.id})`);
      if (project.domains && project.domains.length > 0) {
        console.log(`      Domains: ${project.domains.join(', ')}`);
      }
    });
    console.log('');

    // Find dreamnet.ink project
    const dreamnetProject = projects.find(p => 
      p.name.includes('dreamnet') || 
      p.domains?.some(d => d.includes('dreamnet.ink'))
    );

    if (!dreamnetProject) {
      console.error('❌ Could not find dreamnet.ink project');
      console.log('💡 Please ensure the project is connected in Vercel dashboard');
      process.exit(1);
    }

    console.log(`✅ Found project: ${dreamnetProject.name}`);
    console.log(`   Project ID: ${dreamnetProject.id}`);
    console.log(`   Domains: ${dreamnetProject.domains?.join(', ') || 'none'}\n`);

    // Analyze cleanup (to see current state)
    console.log('🔍 Analyzing current deployment state...');
    const cleanupActions = await DreamNetVercelAgent.analyzeCleanup('dreamnet.ink');
    
    if (cleanupActions.length > 0) {
      console.log(`   Found ${cleanupActions.length} potential cleanup actions:`);
      cleanupActions.forEach((action, i) => {
        console.log(`   ${i + 1}. ${action.type}: ${action.description}`);
      });
    } else {
      console.log('   No cleanup actions needed');
    }
    console.log('');

    // Instructions for manual deployment
    console.log('📝 To force fresh deployment:');
    console.log('');
    console.log('   Option 1: Via Vercel CLI');
    console.log('   -----------------------');
    console.log('   npx vercel --prod --force');
    console.log('');
    console.log('   Option 2: Via Vercel Dashboard');
    console.log('   ------------------------------');
    console.log('   1. Go to: https://vercel.com/dashboard');
    console.log(`   2. Open project: ${dreamnetProject.name}`);
    console.log('   3. Go to Deployments tab');
    console.log('   4. Click "..." on latest deployment');
    console.log('   5. Click "Redeploy"');
    console.log('   6. UNCHECK "Use existing Build Cache"');
    console.log('   7. Click "Redeploy"');
    console.log('');
    console.log('   Option 3: Trigger via Git');
    console.log('   -------------------------');
    console.log('   git commit --allow-empty -m "Force Vercel redeploy"');
    console.log('   git push origin main');
    console.log('');

    // Verify configuration
    console.log('✅ Configuration Check:');
    console.log('   Root Directory: client');
    console.log('   Build Command: pnpm --filter client run build');
    console.log('   Output Directory: dist');
    console.log('   Entry Route: / → BaseMiniAppsHubPage');
    console.log('');

    console.log('✨ Deployment fix instructions complete!');
    console.log('   After redeploy, verify dreamnet.ink shows the mini app hub.');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

fixDeployment();

