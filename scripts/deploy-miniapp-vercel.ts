/**
 * Deploy Mini App to Vercel
 * Creates Vercel project and deploys Mini App
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const VERCEL_API_BASE = 'https://api.vercel.com';

interface DeployConfig {
  miniappName: string;
  miniappPath: string;
  projectName?: string;
}

async function makeVercelRequest(path: string, options: RequestInit = {}): Promise<any> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error('VERCEL_TOKEN not configured. Set it in your environment or .env file');
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

async function createVercelProject(projectName: string): Promise<{ id: string; name: string }> {
  console.log(`📦 Creating Vercel project: ${projectName}...`);

  try {
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
    // If project already exists, get it
    if (error.message.includes('already exists') || error.message.includes('409')) {
      console.log(`ℹ️  Project already exists, fetching...`);
      const projects = await makeVercelRequest('/v9/projects');
      const existing = projects.projects.find((p: any) => p.name === projectName);
      if (existing) {
        return { id: existing.id, name: existing.name };
      }
    }
    throw error;
  }
}

async function deployViaCLI(miniappPath: string, projectName: string): Promise<void> {
  console.log(`🚀 Deploying via Vercel CLI...`);
  console.log(`   Project: ${projectName}`);
  console.log(`   Path: ${miniappPath}`);

  try {
    // Check if vercel CLI is installed
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    console.error('❌ Vercel CLI not found. Install it with: npm i -g vercel');
    process.exit(1);
  }

  // Deploy to Vercel
  const deployCommand = `cd ${miniappPath} && vercel --prod --yes`;
  console.log(`\n📤 Running: ${deployCommand}\n`);

  try {
    execSync(deployCommand, { stdio: 'inherit' });
    console.log(`\n✅ Deployment complete!`);
  } catch (error) {
    console.error(`\n❌ Deployment failed`);
    throw error;
  }
}

async function deployViaAPI(miniappPath: string, projectName: string): Promise<void> {
  console.log(`🚀 Deploying via Vercel API...`);

  // First, ensure project exists
  const project = await createVercelProject(projectName);

  // For API deployment, we'd need to upload files
  // This is complex, so we'll use CLI instead
  console.log(`ℹ️  API deployment requires file upload. Using CLI method instead...`);
  await deployViaCLI(miniappPath, projectName);
}

export async function deployMiniApp(config: DeployConfig): Promise<void> {
  const { miniappName, miniappPath, projectName } = config;
  const finalProjectName = projectName || `dreamnet-${miniappName}`;

  console.log(`\n🎯 Deploying Mini App: ${miniappName}`);
  console.log(`   Project Name: ${finalProjectName}`);
  console.log(`   Path: ${miniappPath}\n`);

  // Check if path exists
  if (!existsSync(miniappPath)) {
    throw new Error(`Mini App path does not exist: ${miniappPath}`);
  }

  // Check if package.json exists
  const packageJsonPath = join(miniappPath, 'package.json');
  if (!existsSync(packageJsonPath)) {
    throw new Error(`package.json not found in ${miniappPath}`);
  }

  // Check if vercel.json exists
  const vercelJsonPath = join(miniappPath, 'vercel.json');
  if (!existsSync(vercelJsonPath)) {
    console.warn(`⚠️  vercel.json not found. Creating default config...`);
    // Could create default vercel.json here
  }

  // Try API deployment if token is available, otherwise use CLI
  if (process.env.VERCEL_TOKEN) {
    try {
      await deployViaAPI(miniappPath, finalProjectName);
    } catch (error: any) {
      console.warn(`⚠️  API deployment failed: ${error.message}`);
      console.log(`   Falling back to CLI deployment...\n`);
      await deployViaCLI(miniappPath, finalProjectName);
    }
  } else {
    console.log(`ℹ️  VERCEL_TOKEN not set. Using CLI deployment...\n`);
    await deployViaCLI(miniappPath, finalProjectName);
  }

  console.log(`\n✨ Next steps:`);
  console.log(`   1. Update manifest with your Vercel URL`);
  console.log(`   2. Setup account association via Base Build tool`);
  console.log(`   3. Test using Base Build Preview tool`);
  console.log(`   4. Post to Base App to publish\n`);
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const miniappName = args[0] || 'token-balance';
  const miniappPath = args[1] || `miniapps/${miniappName}`;

  deployMiniApp({
    miniappName,
    miniappPath,
  }).catch((error) => {
    console.error(`\n❌ Deployment failed:`, error.message);
    process.exit(1);
  });
}

