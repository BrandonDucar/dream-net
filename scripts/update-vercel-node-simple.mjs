/**
 * Simple script to update Vercel Node version via API
 * Requires VERCEL_TOKEN environment variable
 */

const projectId = 'prj_LADFPSWMoSgaHBxsaANzl3iQipBK';
const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error('❌ Set VERCEL_TOKEN environment variable');
  console.error('   Get token from: https://vercel.com/account/tokens');
  process.exit(1);
}

console.log('📦 Updating Vercel project Node.js version to 24.x...');

const response = await fetch(`https://api.vercel.com/v10/projects/${projectId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nodeVersion: '24.x',
  }),
});

if (!response.ok) {
  const error = await response.text();
  console.error(`❌ Failed: ${response.status}`);
  console.error(error);
  process.exit(1);
}

const result = await response.json();
console.log('✅ Success! Node.js version set to 24.x');
console.log(`   Project: ${result.name}`);
console.log(`   Node Version: ${result.nodeVersion}`);

