#!/usr/bin/env tsx
/**
 * Promote Latest Vercel Deployment to Production
 * Fixes issue where old site is being served
 */

const VERCEL_API_BASE = "https://api.vercel.com";

async function getVercelToken(): Promise<string | null> {
  return process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN || null;
}

async function getProjectId(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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
      `${VERCEL_API_BASE}/v6/deployments?projectId=${projectId}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await response.json();
    return data.deployments || [];
  } catch (error) {
    console.error("Failed to get deployments:", error);
    return [];
  }
}

async function promoteDeployment(token: string, deploymentId: string) {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v13/deployments/${deploymentId}/promote`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target: "production" }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error("Failed to promote:", error);
    return false;
  }
}

async function main() {
  console.log("🔍 Checking Vercel deployments...\n");

  const token = await getVercelToken();
  if (!token) {
    console.error("❌ No VERCEL_TOKEN found!");
    console.log("💡 Set VERCEL_TOKEN env var or run: vercel login");
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
  deployments.forEach((d: any, i: number) => {
    const isProd = d.target === "production";
    const status = d.state;
    const date = new Date(d.createdAt).toLocaleString();
    console.log(`${i + 1}. ${isProd ? "🌟 PRODUCTION" : "   "} [${status}] ${date}`);
    console.log(`   ID: ${d.id}`);
    console.log(`   URL: ${d.url}\n`);
  });

  const latest = deployments[0];
  const production = deployments.find((d: any) => d.target === "production");

  if (production?.id === latest.id) {
    console.log("✅ Latest deployment is already in production!");
    console.log(`   URL: ${latest.url}`);
  } else {
    console.log("⚠️  Latest deployment is NOT in production!");
    console.log(`   Latest: ${latest.id} (${latest.state})`);
    if (production) {
      console.log(`   Production: ${production.id} (${production.state})`);
    }
    console.log("\n🚀 Promoting latest deployment to production...");
    
    const promoted = await promoteDeployment(token, latest.id);
    if (promoted) {
      console.log("✅ Successfully promoted latest deployment!");
      console.log(`   New production URL: ${latest.url}`);
      console.log("\n💡 Wait 1-2 minutes for DNS propagation");
    } else {
      console.error("❌ Failed to promote deployment");
      console.log("\n💡 Manual fix:");
      console.log("   1. Go to https://vercel.com/dashboard");
      console.log("   2. Open your project → Deployments");
      console.log("   3. Find latest deployment");
      console.log("   4. Click '...' → 'Promote to Production'");
    }
  }
}

main().catch(console.error);

