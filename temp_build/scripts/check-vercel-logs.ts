#!/usr/bin/env tsx
/**
 * Check Vercel Deployment Logs
 * Reads latest deployment logs to diagnose build failures
 */

import { APIKeeperCore } from "@dreamnet/api-keeper-core";

const VERCEL_API_BASE = "https://api.vercel.com";

async function getVercelToken(): Promise<string | null> {
  const vercelKeys = APIKeeperCore.listKeys("vercel");
  const token = 
    vercelKeys.find(k => k.name.includes("TOKEN") || k.name.includes("API"))?.key ||
    process.env.VERCEL_TOKEN ||
    process.env.VERCEL_API_TOKEN;
  return token || null;
}

async function getProjectId(token: string): Promise<string | null> {
  try {
    const response = await fetch(`${VERCEL_API_BASE}/v9/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

async function getLatestDeployment(token: string, projectId: string) {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v6/deployments?projectId=${projectId}&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.deployments?.[0] || null;
  } catch (error) {
    console.error("Failed to get deployment:", error);
    return null;
  }
}

async function getDeploymentLogs(token: string, deploymentId: string) {
  try {
    const response = await fetch(
      `${VERCEL_API_BASE}/v2/deployments/${deploymentId}/events`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get logs:", error);
    return null;
  }
}

async function checkLogs() {
  console.log("🔍 Checking Vercel deployment logs...\n");

  const token = await getVercelToken();
  if (!token) {
    console.error("❌ No Vercel token found!");
    console.log("💡 Set VERCEL_TOKEN env var or add via API Keeper");
    process.exit(1);
  }

  const projectId = await getProjectId(token);
  if (!projectId) {
    console.error("❌ Could not find DreamNet project");
    process.exit(1);
  }

  console.log(`✅ Found project ID: ${projectId}\n`);

  const deployment = await getLatestDeployment(token, projectId);
  if (!deployment) {
    console.error("❌ Could not find latest deployment");
    process.exit(1);
  }

  console.log(`📦 Latest Deployment:`);
  console.log(`   ID: ${deployment.id}`);
  console.log(`   State: ${deployment.state}`);
  console.log(`   URL: ${deployment.url}`);
  console.log(`   Created: ${new Date(deployment.createdAt).toISOString()}\n`);

  if (deployment.state === "ERROR" || deployment.state === "READY") {
    console.log("📋 Fetching build logs...\n");
    const logs = await getDeploymentLogs(token, deployment.id);
    
    if (logs && logs.length > 0) {
      console.log("=== BUILD LOGS ===\n");
      logs.forEach((event: any) => {
        if (event.type === "command" || event.type === "stdout" || event.type === "stderr") {
          console.log(event.payload?.text || event.payload);
        }
      });
    } else {
      console.log("⚠️  Could not fetch logs via API");
      console.log("💡 Check logs in Vercel Dashboard:");
      console.log(`   https://vercel.com/dashboard`);
    }
  }

  console.log("\n✅ Check complete!");
}

checkLogs().catch(console.error);

