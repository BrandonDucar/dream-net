/**
 * Simple Vercel Integration Test
 * Tests basic API connection
 */

const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;

console.log('\n🔍 Testing Vercel Integration...\n');
console.log('📋 Configuration:');
console.log(`   VERCEL_TOKEN: ${token ? '✅ Set' : '❌ Not set'}`);
console.log(`   VERCEL_TEAM_ID: ${teamId || 'Not set'}\n`);

if (!token) {
  console.error('❌ VERCEL_TOKEN not found!');
  console.log('\n💡 Get token from: https://vercel.com/account/tokens\n');
  process.exit(1);
}

const url = teamId
  ? `https://api.vercel.com/v9/projects?teamId=${teamId}`
  : 'https://api.vercel.com/v9/projects';

console.log('🔌 Testing API connection...\n');

fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
})
  .then(async (response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`API Error: ${response.status} - ${error.message || error.error?.message}`);
    }
    return response.json();
  })
  .then((data) => {
    const projects = data.projects || [];
    console.log(`✅ Successfully connected to Vercel API!`);
    console.log(`\n📊 Found ${projects.length} project(s):\n`);
    
    if (projects.length === 0) {
      console.log('   (No projects found - blank slate! ✅)\n');
    } else {
      projects.forEach((project, index) => {
        console.log(`   ${index + 1}. ${project.name}`);
        console.log(`      ID: ${project.id}`);
        console.log();
      });
    }
    
    console.log('✨ Vercel Integration Status: ✅ WORKING\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error(`❌ Connection failed:`, error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Verify token is valid');
    console.log('   - Check token permissions');
    console.log('   - Verify network connection\n');
    process.exit(1);
  });

