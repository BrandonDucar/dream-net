/**
 * Update Vercel project Node.js version to 22.x using Vercel API
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectJsonPath = join(__dirname, '../.vercel/project.json');
const projectJson = JSON.parse(readFileSync(projectJsonPath, 'utf-8'));
const projectId = projectJson.projectId;

const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error('❌ VERCEL_TOKEN environment variable not set');
  console.error('   Get your token from: https://vercel.com/account/tokens');
  process.exit(1);
}

console.log(`📦 Updating project: ${projectId}`);
console.log(`🔧 Setting Node.js version to 22.x...`);

try {
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
    console.error(`❌ Failed: ${response.status} ${response.statusText}`);
    console.error(`   ${error}`);
    process.exit(1);
  }

  const result = await response.json();
  console.log('✅ Node.js version updated successfully!');
  console.log(`📊 Project: ${result.name}`);
  console.log(`🔧 Node Version: ${result.nodeVersion || '22.x'}`);
  console.log('\n🚀 Next deployment will use Node.js 22.x');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

