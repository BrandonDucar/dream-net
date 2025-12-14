/**
 * Verify Vercel Integration
 * Tests connection and lists projects
 */

import { initializeVercel, listProjects, getProject } from '../packages/dreamnet-vercel-agent/logic/vercelClient';

async function verifyVercelIntegration() {
  console.log(`\n🔍 Verifying Vercel Integration...\n`);

  // Check environment variables
  const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;

  console.log(`📋 Configuration:`);
  console.log(`   VERCEL_TOKEN: ${token ? '✅ Set' : '❌ Not set'}`);
  console.log(`   VERCEL_TEAM_ID: ${teamId || 'Not set (using personal account)'}`);
  console.log();

  if (!token) {
    console.error(`❌ VERCEL_TOKEN not found!`);
    console.log(`\n💡 To set up:`);
    console.log(`   1. Get token from: https://vercel.com/account/tokens`);
    console.log(`   2. Set env var: export VERCEL_TOKEN=your_token`);
    console.log(`   3. Or add to .env file: VERCEL_TOKEN=your_token\n`);
    return false;
  }

  // Initialize Vercel client
  console.log(`🔌 Initializing Vercel client...`);
  const initialized = await initializeVercel();
  
  if (!initialized) {
    console.error(`❌ Failed to initialize Vercel client`);
    return false;
  }

  console.log(`✅ Vercel client initialized\n`);

  // Test API connection by listing projects
  console.log(`📦 Fetching projects from Vercel...`);
  try {
    const projects = await listProjects();
    
    console.log(`✅ Successfully connected to Vercel API!`);
    console.log(`\n📊 Found ${projects.length} project(s):\n`);
    
    if (projects.length === 0) {
      console.log(`   (No projects found - blank slate! ✅)`);
    } else {
      projects.forEach((project, index) => {
        console.log(`   ${index + 1}. ${project.name}`);
        console.log(`      ID: ${project.id}`);
        console.log(`      Created: ${new Date(project.createdAt).toLocaleDateString()}`);
        console.log();
      });
    }

    // Test getting a specific project
    if (projects.length > 0) {
      const testProject = projects[0];
      console.log(`🧪 Testing getProject('${testProject.name}')...`);
      const fetched = await getProject(testProject.name);
      if (fetched) {
        console.log(`✅ Successfully fetched project: ${fetched.name}\n`);
      }
    }

    console.log(`✨ Vercel Integration Status: ✅ WORKING\n`);
    return true;

  } catch (error: any) {
    console.error(`❌ API Error:`, error.message);
    console.log(`\n💡 Troubleshooting:`);
    console.log(`   - Check if token is valid`);
    console.log(`   - Verify token has correct permissions`);
    console.log(`   - Check network connection\n`);
    return false;
  }
}

// Run verification
if (require.main === module) {
  verifyVercelIntegration()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error(`\n❌ Verification failed:`, error);
      process.exit(1);
    });
}

export { verifyVercelIntegration };

