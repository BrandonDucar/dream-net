#!/usr/bin/env tsx
/**
 * Check Vercel Deployment Status and Cancel Stuck Builds
 */

const VERCEL_API_BASE = "https://api.vercel.com";

function getVercelToken(): string | null {
  return process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN || null;
}

async function getProjectId(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
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

async function getDeployments(token: string, projectId: string) {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v6/deployments?projectId=${projectId}&limit=5`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data.deployments || [];
  } catch (error) {
    console.error("Failed to get deployments:", error);
    return [];
  }
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
    return response.ok;
  } catch (error) {
    console.error("Failed to cancel:", error);
    return false;
  }
}

async function checkStatus() {
  console.log("🔍 Checking Vercel Deployment Status...\n");

  const token = getVercelToken();
  if (!token) {
    console.error("❌ No Vercel token found!");
    console.log("\n💡 Set VERCEL_TOKEN env var:");
    console.log("   export VERCEL_TOKEN=your_token_here");
    console.log("\n   Or get token from: https://vercel.com/account/tokens");
    process.exit(1);
  }

  const projectId = await getProjectId(token);
  if (!projectId) {
    console.error("❌ Could not find DreamNet project");
    process.exit(1);
  }

  console.log(`✅ Found project ID: ${projectId}\n`);

  const deployments = await getDeployments(token, projectId);
  if (deployments.length === 0) {
    console.error("❌ No deployments found");
    process.exit(1);
  }

  console.log("📦 Recent Deployments:\n");
  
  const stuckStates = ["BUILDING", "QUEUED", "INITIALIZING"];
  let hasStuck = false;

  deployments.forEach((d: any, i: number) => {
    const state = d.state;
    const isStuck = stuckStates.includes(state);
    const age = Math.floor((Date.now() - new Date(d.createdAt).getTime()) / 1000 / 60); // minutes
    const isOld = age > 10; // older than 10 minutes
    
    const statusIcon = state === "READY" ? "✅" : state === "ERROR" ? "❌" : isStuck && isOld ? "⚠️" : "🔄";
    
    console.log(`${i + 1}. ${statusIcon} [${state}] ${age} min ago`);
    console.log(`   ID: ${d.id.substring(0, 12)}...`);
    console.log(`   URL: ${d.url}`);
    console.log(`   Target: ${d.target || "preview"}`);
    
    if (isStuck && isOld) {
      console.log(`   ⚠️  STUCK: ${state} for ${age} minutes`);
      hasStuck = true;
    }
    console.log("");
  });

  const latest = deployments[0];
  const isLatestStuck = stuckStates.includes(latest.state) && 
    Math.floor((Date.now() - new Date(latest.createdAt).getTime()) / 1000 / 60) > 10;

  if (isLatestStuck) {
    console.log("⚠️  Latest deployment appears to be STUCK!\n");
    console.log("💡 Options:");
    console.log("   1. Cancel this deployment (will stop the spinner)");
    console.log("   2. Wait a bit longer (sometimes builds take 15-20 min)");
    console.log("   3. Check Vercel dashboard for more details\n");
    
    console.log("🚫 To cancel stuck deployment, run:");
    console.log(`   tsx scripts/cancel-vercel-deployment.ts ${latest.id.substring(0, 12)}`);
  } else if (latest.state === "READY") {
    console.log("✅ Latest deployment is READY!");
    console.log(`   URL: ${latest.url}`);
    if (latest.target !== "production") {
      console.log("\n💡 To promote to production:");
      console.log(`   tsx scripts/promote-latest.ts`);
    }
  } else if (latest.state === "ERROR") {
    console.log("❌ Latest deployment FAILED");
    console.log("\n💡 Check logs in Vercel Dashboard:");
    console.log(`   https://vercel.com/dashboard`);
  } else {
    console.log(`🔄 Latest deployment is ${latest.state}...`);
    console.log("   This is normal, wait for it to complete.");
  }
}

checkStatus().catch(console.error);

