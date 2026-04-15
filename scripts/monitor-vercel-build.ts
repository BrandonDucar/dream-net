#!/usr/bin/env tsx
/**
 * Monitor Vercel Build in Real-Time
 * Tracks deployment status and shows build logs
 */

import https from 'https';

// Try multiple sources for token
let VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN;

// Try to read from command line arg
if (!VERCEL_TOKEN && process.argv[2]) {
  VERCEL_TOKEN = process.argv[2];
}

const TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional
const PROJECT_NAME = process.argv[3] || 'dream-net'; // Can override via arg

if (!VERCEL_TOKEN) {
  console.error('❌ VERCEL_TOKEN not found!');
  console.log('\n💡 Usage:');
  console.log('   pnpm tsx scripts/monitor-vercel-build.ts <your_token> [project_name]');
  console.log('\n   Or set: $env:VERCEL_TOKEN="your_token"');
  console.log('\n   Get token: https://vercel.com/account/tokens');
  process.exit(1);
}

interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED' | 'QUEUED';
  readyState: string;
  createdAt: number;
  buildingAt?: number;
  readyAt?: number;
  errorAt?: number;
}

interface VercelProject {
  id: string;
  name: string;
  accountId: string;
}

async function makeVercelRequest(path: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    https.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(parsed);
          } else {
            reject(new Error(`Vercel API error: ${res.statusCode} - ${parsed.error?.message || data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function getLatestDeployment(): Promise<VercelDeployment | null> {
  try {
    // First, get project ID
    const projects = await makeVercelRequest('/v9/projects');
    const project = (projects.projects as VercelProject[]).find(
      (p) => p.name === PROJECT_NAME || p.name.includes('dream-net')
    );

    if (!project) {
      console.log('📋 Available projects:');
      (projects.projects as VercelProject[]).forEach((p) => {
        console.log(`   - ${p.name} (${p.id})`);
      });
      throw new Error(`Project "${PROJECT_NAME}" not found. Available projects listed above.`);
    }

    console.log(`✅ Found project: ${project.name} (${project.id})`);

    // Get latest deployment
    const path = TEAM_ID 
      ? `/v6/deployments?projectId=${project.id}&teamId=${TEAM_ID}&limit=1`
      : `/v6/deployments?projectId=${project.id}&limit=1`;
    
    const deployments = await makeVercelRequest(path);
    
    if (!deployments.deployments || deployments.deployments.length === 0) {
      return null;
    }

    return deployments.deployments[0] as VercelDeployment;
  } catch (error: any) {
    console.error('❌ Error fetching deployment:', error.message);
    throw error;
  }
}

async function getBuildLogs(deploymentId: string): Promise<string[]> {
  try {
    const path = TEAM_ID
      ? `/v2/deployments/${deploymentId}/events?teamId=${TEAM_ID}`
      : `/v2/deployments/${deploymentId}/events`;
    
    const events = await makeVercelRequest(path);
    return events.map((e: any) => e.payload?.text || '').filter(Boolean);
  } catch (error: any) {
    console.error('⚠️  Could not fetch build logs:', error.message);
    return [];
  }
}

function formatState(state: string): string {
  const states: Record<string, string> = {
    'BUILDING': '🔨 BUILDING',
    'READY': '✅ READY',
    'ERROR': '❌ ERROR',
    'CANCELED': '🚫 CANCELED',
    'QUEUED': '⏳ QUEUED',
  };
  return states[state] || state;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

async function monitorBuild() {
  console.log('🔍 Monitoring Vercel Build...\n');
  console.log(`📦 Project: ${PROJECT_NAME}`);
  console.log(`🔑 Token: ${VERCEL_TOKEN.substring(0, 10)}...`);
  if (TEAM_ID) console.log(`👥 Team ID: ${TEAM_ID}`);
  console.log('');

  let lastState: string | null = null;
  let lastLogs: string[] = [];

  const checkInterval = setInterval(async () => {
    try {
      const deployment = await getLatestDeployment();

      if (!deployment) {
        console.log('⏳ No deployments found yet. Waiting...');
        return;
      }

      const state = deployment.state;
      const url = `https://${deployment.url}`;

      // Show state change
      if (state !== lastState) {
        console.log(`\n${formatState(state)} - ${formatTime(deployment.createdAt)}`);
        console.log(`🌐 URL: ${url}`);
        
        if (deployment.buildingAt) {
          console.log(`⏱️  Building since: ${formatTime(deployment.buildingAt)}`);
        }
        if (deployment.readyAt) {
          console.log(`✅ Ready at: ${formatTime(deployment.readyAt)}`);
        }
        if (deployment.errorAt) {
          console.log(`❌ Error at: ${formatTime(deployment.errorAt)}`);
        }

        lastState = state;
      }

      // Show build logs if building
      if (state === 'BUILDING' || state === 'QUEUED') {
        try {
          const logs = await getBuildLogs(deployment.uid);
          const newLogs = logs.slice(lastLogs.length);
          if (newLogs.length > 0) {
            newLogs.forEach((log) => {
              console.log(`   ${log}`);
            });
            lastLogs = logs;
          }
        } catch (e) {
          // Logs might not be available yet
        }
      }

      // Stop monitoring if deployment is done (success or error)
      if (state === 'READY' || state === 'ERROR' || state === 'CANCELED') {
        clearInterval(checkInterval);
        console.log('\n' + '='.repeat(50));
        if (state === 'READY') {
          console.log('✅ Deployment successful!');
          console.log(`🌐 Live at: ${url}`);
        } else if (state === 'ERROR') {
          console.log('❌ Deployment failed!');
          console.log('💡 Check Vercel dashboard for detailed error logs');
        } else {
          console.log('🚫 Deployment canceled');
        }
        console.log('='.repeat(50));
        process.exit(state === 'READY' ? 0 : 1);
      }
    } catch (error: any) {
      console.error('❌ Error monitoring:', error.message);
      clearInterval(checkInterval);
      process.exit(1);
    }
  }, 5000); // Check every 5 seconds

  // Initial check
  try {
    const deployment = await getLatestDeployment();
    if (deployment) {
      console.log(`📋 Latest deployment: ${deployment.uid}`);
      console.log(`   State: ${formatState(deployment.state)}`);
      console.log(`   URL: https://${deployment.url}`);
      console.log('\n⏳ Monitoring for updates...\n');
    } else {
      console.log('⏳ Waiting for deployment to start...\n');
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run monitor
monitorBuild().catch(console.error);

