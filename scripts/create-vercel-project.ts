/**
 * Create Vercel Project for Mini App
 * Simple script to create project via API
 */

const token = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;
const teamId = process.env.VERCEL_TEAM_ID;

if (!token) {
  console.error('❌ VERCEL_TOKEN not set');
  process.exit(1);
}

const projectName = process.argv[2] || 'dreamnet-token-balance';

const url = teamId
  ? `https://api.vercel.com/v9/projects?teamId=${teamId}`
  : 'https://api.vercel.com/v9/projects';

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: projectName,
    framework: 'vite',
  }),
})
  .then(async (res) => {
    if (!res.ok) {
      const error = await res.json();
      if (error.error?.code === 'project_already_exists') {
        console.log(`✅ Project already exists: ${projectName}`);
        process.exit(0);
      }
      throw new Error(`${res.status}: ${error.error?.message || error.message}`);
    }
    return res.json();
  })
  .then((project) => {
    console.log(`✅ Project created: ${project.name} (${project.id})`);
    console.log(`\nNext: cd miniapps/token-balance && vercel link --project ${projectName} && vercel --prod`);
  })
  .catch((err) => {
    console.error(`❌ Failed:`, err.message);
    process.exit(1);
  });

