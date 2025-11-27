#!/usr/bin/env node
/**
 * Inspect and Configure Vercel Project
 * Checks current settings and updates build configuration
 */

const VERCEL_API_BASE = 'https://api.vercel.com';
const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;

if (!token) {
  console.error('❌ VERCEL_TOKEN or VERCEL_API_TOKEN environment variable not set');
  console.error('   Set it with: export VERCEL_TOKEN=your_token');
  process.exit(1);
}

async function vercelRequest(endpoint, options = {}) {
  const url = teamId && !endpoint.includes('?')
    ? `${VERCEL_API_BASE}${endpoint}?teamId=${teamId}`
    : `${VERCEL_API_BASE}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Vercel API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  return response.json();
}

async function main() {
  console.log('🔍 Inspecting Vercel project configuration...\n');

  try {
    // Step 1: List projects
    console.log('📋 Step 1: Listing projects...');
    const projectsResponse = await vercelRequest('/v9/projects');
    const projects = projectsResponse.projects || [];
    
    if (projects.length === 0) {
      console.error('❌ No projects found in Vercel');
      process.exit(1);
    }

    console.log(`✅ Found ${projects.length} project(s):`);
    projects.forEach(p => {
      console.log(`   - ${p.name} (ID: ${p.id})`);
    });

    // Find dream-net project
    const project = projects.find(p => 
      p.name.toLowerCase().includes('dream') || 
      p.name.toLowerCase().includes('dreamnet')
    ) || projects[0];

    console.log(`\n🎯 Using project: ${project.name} (${project.id})\n`);

    // Step 2: Get current project settings
    console.log('📋 Step 2: Getting current project settings...');
    const projectDetails = await vercelRequest(`/v9/projects/${project.id}`);
    
    console.log('\n📊 Current Project Settings:');
    console.log(`   Root Directory: ${projectDetails.rootDirectory || '(not set)'}`);
    console.log(`   Build Command: ${projectDetails.buildCommand || '(not set)'}`);
    console.log(`   Install Command: ${projectDetails.installCommand || '(not set)'}`);
    console.log(`   Output Directory: ${projectDetails.outputDirectory || '(not set)'}`);
    console.log(`   Framework: ${projectDetails.framework || '(not set)'}`);
    console.log(`   Node Version: ${projectDetails.nodeVersion || '(not set)'}`);
    console.log(`   GitHub Repo: ${projectDetails.link?.repo || '(not connected)'}`);
    console.log(`   GitHub Branch: ${projectDetails.link?.productionBranch || '(not set)'}`);

    // Step 3: List deployments
    console.log('\n📋 Step 3: Listing recent deployments...');
    const deploymentsResponse = await vercelRequest(`/v13/deployments?projectId=${project.id}&limit=5`);
    const deployments = deploymentsResponse.deployments || [];
    
    console.log(`✅ Found ${deployments.length} recent deployment(s):`);
    deployments.forEach((d, i) => {
      const status = d.readyState === 'READY' ? '✅' : d.readyState === 'ERROR' ? '❌' : '⏳';
      console.log(`   ${status} ${d.url || d.name} - ${d.state} - Commit: ${d.meta?.gitCommitRef || 'N/A'}`);
    });

    // Step 4: Check domains
    console.log('\n📋 Step 4: Checking domains...');
    const domainsResponse = await vercelRequest(`/v9/projects/${project.id}/domains`);
    const domains = domainsResponse.domains || [];
    
    console.log(`✅ Found ${domains.length} domain(s):`);
    domains.forEach(d => {
      console.log(`   - ${d.name} (${d.verification?.verified ? '✅ verified' : '⚠️ not verified'})`);
    });

    // Step 5: Update project settings
    console.log('\n📋 Step 5: Updating project settings...');
    const updatePayload = {
      buildCommand: 'corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate && cd client && pnpm install && pnpm build',
      installCommand: 'corepack enable pnpm && corepack prepare pnpm@10.21.0 --activate',
      outputDirectory: 'client/dist',
      rootDirectory: '.',
      framework: null,
      nodeVersion: '24.x',
    };

    console.log('\n🔧 Updating with:');
    console.log(`   Build Command: ${updatePayload.buildCommand}`);
    console.log(`   Install Command: ${updatePayload.installCommand}`);
    console.log(`   Output Directory: ${updatePayload.outputDirectory}`);
    console.log(`   Root Directory: ${updatePayload.rootDirectory}`);
    console.log(`   Node Version: ${updatePayload.nodeVersion}`);

    const updated = await vercelRequest(`/v9/projects/${project.id}`, {
      method: 'PATCH',
      body: JSON.stringify(updatePayload),
    });

    console.log('\n✅ Project settings updated successfully!');
    console.log('\n📊 Updated Settings:');
    console.log(`   Root Directory: ${updated.rootDirectory}`);
    console.log(`   Build Command: ${updated.buildCommand}`);
    console.log(`   Install Command: ${updated.installCommand}`);
    console.log(`   Output Directory: ${updated.outputDirectory}`);
    console.log(`   Node Version: ${updated.nodeVersion}`);

    // Step 6: Trigger deployment (optional)
    console.log('\n💡 Next Steps:');
    console.log('   1. Push to GitHub to trigger auto-deployment');
    console.log('   2. Or manually trigger via: vercel deploy --prod');
    console.log(`   3. Monitor at: https://vercel.com/${teamId ? `team/${teamId}/` : ''}${project.name}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();

