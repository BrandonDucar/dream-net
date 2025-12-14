/**
 * Deploy Token Balance Mini App to Vercel
 * Uses existing Vercel integration
 */

import { initializeVercel, createProject, listProjects } from '../packages/dreamnet-vercel-agent/logic/vercelClient';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

async function createVercelProject(projectName: string) {
  // Initialize Vercel client
  const initialized = await initializeVercel();
  if (!initialized) {
    throw new Error('Failed to initialize Vercel client. Check VERCEL_TOKEN env var.');
  }

  // Check if project exists
  const projects = await listProjects();
  const existing = projects.find(p => p.name === projectName);
  
  if (existing) {
    console.log(`✅ Project already exists: ${existing.name} (${existing.id})`);
    return existing;
  }

  // Create new project via API
  console.log(`📦 Creating Vercel project: ${projectName}...`);
  // Note: createProject might not exist, so we'll use API directly
  const VERCEL_API_BASE = 'https://api.vercel.com';
  const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  
  const url = teamId
    ? `${VERCEL_API_BASE}/v9/projects?teamId=${teamId}`
    : `${VERCEL_API_BASE}/v9/projects`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: projectName,
      framework: 'vite',
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    if (error.error?.code === 'project_already_exists' || response.status === 409) {
      // Project exists, fetch it
      const projects = await listProjects();
      const existing = projects.find(p => p.name === projectName);
      if (existing) {
        console.log(`✅ Project found: ${existing.name} (${existing.id})`);
        return existing;
      }
    }
    throw new Error(`Failed to create project: ${response.status} - ${error.message || error.error?.message}`);
  }

  const project = await response.json();
  console.log(`✅ Project created: ${project.name} (${project.id})`);
  return project;
}

async function deployMiniApp(miniappPath: string, projectName: string): Promise<string> {
  console.log(`\n🚀 Deploying Mini App to Vercel...`);
  console.log(`   Path: ${miniappPath}`);
  console.log(`   Project: ${projectName}\n`);

  if (!existsSync(miniappPath)) {
    throw new Error(`Mini App path does not exist: ${miniappPath}`);
  }

  // Check if Vercel CLI is available
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    throw new Error('Vercel CLI not found. Install with: npm i -g vercel');
  }

  // Install dependencies first
  console.log(`📦 Installing dependencies...`);
  try {
    execSync('pnpm install', { 
      cwd: miniappPath,
      stdio: 'inherit'
    });
  } catch (error) {
    console.warn(`⚠️  pnpm install had issues, continuing...`);
  }

  // Build the app
  console.log(`\n🔨 Building Mini App...`);
  try {
    execSync('pnpm build', { 
      cwd: miniappPath,
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error('Build failed. Check errors above.');
  }

  // Link to project (if not already linked)
  const vercelDir = join(miniappPath, '.vercel');
  if (!existsSync(vercelDir)) {
    console.log(`\n🔗 Linking to Vercel project...`);
    try {
      execSync(`vercel link --yes --project ${projectName}`, { 
        cwd: miniappPath,
        stdio: 'inherit',
        env: { ...process.env }
      });
    } catch (error) {
      console.warn(`⚠️  Link failed, will try deployment anyway...`);
    }
  }

  // Deploy to production
  console.log(`\n📤 Deploying to Vercel production...\n`);
  try {
    const output = execSync('vercel --prod --yes', { 
      cwd: miniappPath,
      encoding: 'utf-8',
      stdio: 'pipe',
      env: { ...process.env }
    });
    
    // Extract URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+\.vercel\.app/);
    const url = urlMatch ? urlMatch[0] : `https://${projectName}.vercel.app`;
    
    console.log(`\n✅ Deployment complete!`);
    console.log(`   URL: ${url}\n`);
    
    return url;
  } catch (error: any) {
    console.error(`\n❌ Deployment failed`);
    console.error(error.message);
    throw error;
  }
}

async function main() {
  const miniappName = 'token-balance';
  const projectName = `dreamnet-${miniappName}`;
  const miniappPath = join(process.cwd(), 'miniapps', miniappName);

  console.log(`\n🎯 Deploying Token Balance Mini App to Vercel\n`);
  console.log(`   Mini App: ${miniappName}`);
  console.log(`   Project: ${projectName}`);
  console.log(`   Path: ${miniappPath}\n`);

  try {
    // Step 1: Create Vercel project
    const project = await createVercelProject(projectName);

    // Step 2: Deploy the Mini App
    const url = await deployMiniApp(miniappPath, projectName);

    // Step 3: Output next steps
    console.log(`\n✨ Deployment Summary:`);
    console.log(`   Project ID: ${project.id}`);
    console.log(`   Project Name: ${project.name}`);
    console.log(`   URL: ${url}\n`);

    console.log(`📋 Next Steps:`);
    console.log(`   1. Update manifest:`);
    console.log(`      File: ${miniappPath}/public/.well-known/farcaster.json`);
    console.log(`      - Set homeUrl to: ${url}`);
    console.log(`      - Update all image URLs to use ${url}`);
    console.log(`   2. Add screenshots (REQUIRED for featured apps):`);
    console.log(`      - ${url}/screenshot1.png`);
    console.log(`      - ${url}/screenshot2.png`);
    console.log(`   3. Setup account association:`);
    console.log(`      - Go to https://build.base.org/account-association`);
    console.log(`      - Paste URL: ${url}`);
    console.log(`      - Click "Submit" then "Verify"`);
    console.log(`      - Copy accountAssociation fields to manifest`);
    console.log(`   4. Redeploy with updated manifest:`);
    console.log(`      cd ${miniappPath} && vercel --prod`);
    console.log(`   5. Test using Base Build Preview tool`);
    console.log(`   6. Post to Base App to publish\n`);

  } catch (error: any) {
    console.error(`\n❌ Deployment failed:`, error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

