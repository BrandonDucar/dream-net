#!/usr/bin/env tsx
/**
 * Auto-Promote Latest Vercel Deployment to Production
 * Fixes issue where old site is being served
 */

const VERCEL_API_BASE = "https://api.vercel.com";

async function getVercelToken(): Promise<string | null> {
  // Check environment variables
  return process.env.VERCEL_TOKEN || process.env.VERCEL_API_TOKEN || null;
}

async function getProjectId(token: string): Promise<{ id: string; name: string } | null> {
  try {
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const project = data.projects?.find((p: any) => 
      p.name.includes("dreamnet") || 
      p.name.includes("dream-net") ||
      p.domains?.some((d: string) => d.includes("dreamnet.ink"))
    );
    
    if (project) {
      return { id: project.id, name: project.name };
    }
    return null;
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
    
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.deployments || [];
  } catch (error) {
    console.error("Failed to get deployments:", error);
    return [];
  }
}

async function promoteDeployment(token: string, deploymentId: string): Promise<boolean> {
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
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Promote failed: ${response.status} ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to promote:", error);
    return false;
  }
}

async function main() {
  console.log("🚀 Auto-Promote Latest Vercel Deployment\n");
  console.log("=" .repeat(50) + "\n");

  // Get token
  const token = await getVercelToken();
  if (!token) {
    console.error("❌ No Vercel token found!");
    console.log("\n💡 Options to set token:");
    console.log("   1. Set VERCEL_TOKEN environment variable");
    console.log("   2. Add via API Keeper: APIKeeperCore.addKey('vercel', 'VERCEL_TOKEN', 'your_token')");
    console.log("   3. Get token from: https://vercel.com/account/tokens\n");
    process.exit(1);
  }

  console.log("✅ Vercel token found\n");

  // Get project
  const project = await getProjectId(token);
  if (!project) {
    console.error("❌ Could not find DreamNet project");
    console.log("💡 Make sure your project is connected to Vercel");
    process.exit(1);
  }

  console.log(`✅ Found project: ${project.name}`);
  console.log(`   Project ID: ${project.id}\n`);

  // Get deployments
  console.log("📦 Fetching deployments...\n");
  const deployments = await getDeployments(token, project.id);
  
  if (deployments.length === 0) {
    console.error("❌ No deployments found");
    process.exit(1);
  }

  // Show recent deployments
  console.log("Recent Deployments:\n");
  deployments.slice(0, 5).forEach((d: any, i: number) => {
    const isProd = d.target === "production";
    const status = d.state;
    const date = new Date(d.createdAt).toLocaleString();
    const commit = d.meta?.githubCommitRef || d.meta?.gitlabCommitRef || "unknown";
    console.log(`${i + 1}. ${isProd ? "🌟 PRODUCTION" : "   "} [${status}] ${date}`);
    console.log(`   ID: ${d.id.substring(0, 12)}...`);
    console.log(`   URL: ${d.url}`);
    console.log(`   Commit: ${commit}\n`);
  });

  // Find latest and production
  const latest = deployments[0];
  const production = deployments.find((d: any) => d.target === "production");

  console.log("=" .repeat(50) + "\n");

  if (production?.id === latest.id) {
    console.log("✅ Latest deployment is already in production!");
    console.log(`   URL: ${latest.url}`);
    console.log(`   State: ${latest.state}`);
    console.log("\n💡 If you're still seeing old site:");
    console.log("   - Clear browser cache");
    console.log("   - Try incognito/private window");
    console.log("   - Wait 2-3 minutes for DNS propagation");
  } else {
    console.log("⚠️  Latest deployment is NOT in production!");
    console.log(`   Latest: ${latest.id.substring(0, 12)}... (${latest.state})`);
    if (production) {
      console.log(`   Current Production: ${production.id.substring(0, 12)}... (${production.state})`);
    } else {
      console.log(`   No production deployment found`);
    }
    
    console.log("\n🚀 Promoting latest deployment to production...\n");
    
    const promoted = await promoteDeployment(token, latest.id);
    if (promoted) {
      console.log("✅ Successfully promoted latest deployment!");
      console.log(`   New production URL: ${latest.url}`);
      console.log(`   State: ${latest.state}`);
      console.log("\n⏳ Wait 1-2 minutes for DNS propagation");
      console.log("💡 Then test: https://dreamnet.ink (use incognito window)");
    } else {
      console.error("❌ Failed to promote deployment");
      console.log("\n💡 Manual fix:");
      console.log("   1. Go to https://vercel.com/dashboard");
      console.log("   2. Open your project → Deployments");
      console.log("   3. Find latest deployment");
      console.log("   4. Click '...' → 'Promote to Production'");
    }
  }

  console.log("\n" + "=" .repeat(50));
}

main().catch((error) => {
  console.error("\n❌ Error:", error.message);
  process.exit(1);
});

