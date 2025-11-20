#!/usr/bin/env tsx
/**
 * Cancel a Stuck Vercel Deployment
 * Usage: tsx scripts/cancel-vercel-deployment.ts [deployment-id]
 */

const VERCEL_API_BASE = "https://api.vercel.com";

function getVercelToken(): string | null {
  return process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN || null;
}

async function cancelDeployment(token: string, deploymentId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v13/deployments/${deploymentId}/cancel`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`API error: ${response.status} - ${error}`);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Failed to cancel:", error);
    return false;
  }
}

async function getLatestDeployment(token: string, projectId: string) {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v6/deployments?projectId=${projectId}&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.deployments?.[0] || null;
  } catch (error) {
    console.error("Failed to get deployment:", error);
    return null;
  }
}

async function getProjectId(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    const project = data.projects?.find((p: any) => 
      p.name.includes("dreamnet") || 
      p.name.includes("dream-net") ||
      p.domains?.some((d: string) => d.includes("dreamnet.ink"))
    );
    return project?.id || null;
  } catch (error) {
    console.error("Failed to get project:", error);
    return null;
  }
}

async function main() {
  const deploymentId = process.argv[2];

  const token = getVercelToken();
  if (!token) {
    console.error("❌ No Vercel token found!");
    console.log("\n💡 Set VERCEL_TOKEN env var");
    process.exit(1);
  }

  let targetDeploymentId = deploymentId;

  // If no ID provided, get latest deployment
  if (!targetDeploymentId) {
    console.log("🔍 Finding latest deployment...\n");
    const projectId = await getProjectId(token);
    if (!projectId) {
      console.error("❌ Could not find project");
      process.exit(1);
    }
    const latest = await getLatestDeployment(token, projectId);
    if (!latest) {
      console.error("❌ Could not find latest deployment");
      process.exit(1);
    }
    targetDeploymentId = latest.id;
    console.log(`📦 Found latest deployment: ${targetDeploymentId.substring(0, 12)}...`);
    console.log(`   State: ${latest.state}\n`);
  }

  console.log(`🚫 Cancelling deployment: ${targetDeploymentId.substring(0, 12)}...\n`);

  const cancelled = await cancelDeployment(token, targetDeploymentId);
  
  if (cancelled) {
    console.log("✅ Successfully cancelled deployment!");
    console.log("\n💡 Next steps:");
    console.log("   1. Fix any build issues");
    console.log("   2. Push a new commit to trigger fresh deployment");
    console.log("   3. Or manually redeploy from Vercel dashboard");
  } else {
    console.error("❌ Failed to cancel deployment");
    console.log("\n💡 Try manually:");
    console.log("   1. Go to https://vercel.com/dashboard");
    console.log("   2. Open your project → Deployments");
    console.log("   3. Find the stuck deployment");
    console.log("   4. Click '...' → 'Cancel'");
  }
}

main().catch(console.error);

