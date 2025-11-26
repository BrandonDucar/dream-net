/**
 * Update Vercel project Node.js version to 22.x
 * Uses Vercel API to update project settings
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateVercelNodeVersion() {
  try {
    // Read project ID from .vercel/project.json
    const projectJsonPath = path.join(__dirname, '../../.vercel/project.json');
    if (!fs.existsSync(projectJsonPath)) {
      console.error('❌ .vercel/project.json not found. Run "vercel link" first.');
      process.exit(1);
    }

    const projectJson = JSON.parse(fs.readFileSync(projectJsonPath, 'utf-8'));
    const projectId = projectJson.projectId;
    const orgId = projectJson.orgId;

    console.log(`📦 Project ID: ${projectId}`);
    console.log(`🏢 Org ID: ${orgId}`);

    // Get Vercel token from environment or CLI
    let token = process.env.VERCEL_TOKEN;
    if (!token) {
      // Try to get token from vercel CLI config
      try {
        const configPath = path.join(process.env.HOME || process.env.USERPROFILE || '', '.vercel/auth.json');
        if (fs.existsSync(configPath)) {
          const auth = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          token = Object.values(auth)[0]?.token;
        }
      } catch (e) {
        // Ignore
      }
    }

    if (!token) {
      console.error('❌ VERCEL_TOKEN not found. Set it as environment variable or run "vercel login"');
      process.exit(1);
    }

    // Update project via Vercel API
    const response = await fetch(`https://api.vercel.com/v10/projects/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodeVersion: '22.x',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Failed to update Node version: ${response.status} ${error}`);
      process.exit(1);
    }

    const result = await response.json();
    console.log('✅ Node.js version updated to 22.x');
    console.log(`📊 Project: ${result.name}`);
    console.log(`🔧 Node Version: ${result.nodeVersion || '22.x'}`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateVercelNodeVersion();

