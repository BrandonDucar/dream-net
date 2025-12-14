/**
 * Create Vercel Project and Deploy Mini App
 * Uses existing Vercel integration
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const VERCEL_API_BASE = 'https://api.vercel.com';

async function makeVercelRequest(path: string, options: RequestInit = {}): Promise<any> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error('VERCEL_TOKEN not configured');
  }

  const teamId = process.env.VERCEL_TEAM_ID;
  const url = teamId
    ? `${VERCEL_API_BASE}${path}${path.includes('?') ? '&' : '?'}teamId=${teamId}`
    : `${VERCEL_API_BASE}${path}`;

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
    throw new Error(`Vercel API error: ${response.status} - ${error.message || error.error?.message || 'Unknown error'}`);
  }

  return response.json();
}

async function createProject(projectName: string): Promise<{ id: string; name: string }> {
  console.log(`📦 Creating Vercel project: ${projectName}...`);

  try {
    // Check if project already exists
    const projects = await makeVercelRequest('/v9/projects');
    const existing = projects.projects.find((p: any) => p.name === projectName);
    
    if (existing) {
      console.log(`✅ Project already exists: ${existing.id}`);
      return { id: existing.id, name: existing.name };
    }

    // Create new project
    const data = await makeVercelRequest('/v9/projects', {
      method: 'POST',
      body: JSON.stringify({
        name: projectName,
        framework: 'vite',
      }),
    });

    console.log(`✅ Project created: ${data.id}`);
    return { id: data.id, name: data.name };
  } catch (error: any) {
    console.error(`❌ Failed to create project:`, error.message);
    throw error;
  }
}

async function deployViaCLI(miniappPath: string, projectName: string): Promise<string> {
  console.log(`🚀 Deploying via Vercel CLI...`);
  console.log(`   Project: ${projectName}`);
  console.log(`   Path: ${miniappPath}\n`);

  // Check if vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    throw new Error('Vercel CLI not found. Install it with: npm i -g vercel');
  }

  // Link to project if not already linked
  const vercelDir = join(miniappPath, '.vercel');
  if (!existsSync(vercelDir)) {
    console.log(`🔗 Linking to Vercel project...`);
    try {
      execSync(`cd ${miniappPath} && vercel link --yes --project ${projectName}`, { 
        stdio: 'inherit',
        env: { ...process.env }
      });
    } catch (error) {
      console.warn(`⚠️  Link failed, continuing with deployment...`);
    }
  }

  // Deploy to production
  console.log(`\n📤 Deploying to production...\n`);
  try {
    const output = execSync(`cd ${miniappPath} && vercel --prod --yes`, { 
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
    throw error;
  }
}

export async function createAndDeployMiniApp(
  miniappName: string,
  miniappPath: string,
  projectName?: string
): Promise<{ projectId: string; url: string }> {
  const finalProjectName = projectName || `dreamnet-${miniappName}`;

  console.log(`\n🎯 Creating and Deploying Mini App: ${miniappName}`);
  console.log(`   Project Name: ${finalProjectName}`);
  console.log(`   Path: ${miniappPath}\n`);

  // Check if path exists
  if (!existsSync(miniappPath)) {
    throw new Error(`Mini App path does not exist: ${miniappPath}`);
  }

  // Create Vercel project via API
  const project = await createProject(finalProjectName);

  // Deploy via CLI (most reliable method)
  const url = await deployViaCLI(miniappPath, finalProjectName);

  console.log(`\n✨ Deployment Summary:`);
  console.log(`   Project ID: ${project.id}`);
  console.log(`   Project Name: ${project.name}`);
  console.log(`   URL: ${url}\n`);

  console.log(`📋 Next Steps:`);
  console.log(`   1. Update manifest at ${miniappPath}/public/.well-known/farcaster.json`);
  console.log(`      - Set homeUrl to: ${url}`);
  console.log(`      - Update all image URLs`);
  console.log(`   2. Add screenshots (required for featured apps):`);
  console.log(`      - ${url}/screenshot1.png`);
  console.log(`      - ${url}/screenshot2.png`);
  console.log(`   3. Setup account association:`);
  console.log(`      - Go to https://build.base.org/account-association`);
  console.log(`      - Paste URL: ${url}`);
  console.log(`      - Copy credentials to manifest`);
  console.log(`   4. Redeploy with updated manifest`);
  console.log(`   5. Test using Base Build Preview tool`);
  console.log(`   6. Post to Base App to publish\n`);

  return {
    projectId: project.id,
    url,
  };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const miniappName = args[0] || 'token-balance';
  const miniappPath = args[1] || `miniapps/${miniappName}`;
  const projectName = args[2];

  createAndDeployMiniApp(miniappName, miniappPath, projectName).catch((error) => {
    console.error(`\n❌ Failed:`, error.message);
    process.exit(1);
  });
}

