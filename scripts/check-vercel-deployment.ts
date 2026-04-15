#!/usr/bin/env tsx
/**
 * Check Vercel Deployment Status
 * Monitors the latest Vercel deployment for the project
 * 
 * Usage:
 *   pnpm tsx scripts/check-vercel-deployment.ts
 * 
 * Requires:
 *   - VERCEL_TOKEN environment variable (get from vercel.com/account/tokens)
 *   - VERCEL_PROJECT_ID or VERCEL_ORG_ID (optional, will try to detect)
 */

const VERCEL_API = "https://api.vercel.com";
const VERCEL_TOKEN = process.env.VERCEL_TOKEN;

async function checkDeployment() {
  if (!VERCEL_TOKEN) {
    console.error("❌ VERCEL_TOKEN environment variable required");
    console.error("\nGet your token from: https://vercel.com/account/tokens");
    console.error("\nThen run:");
    console.error("  $env:VERCEL_TOKEN='your_token'; pnpm tsx scripts/check-vercel-deployment.ts");
    process.exit(1);
  }

  try {
    console.log("🔍 Checking Vercel deployment status...\n");

    // Get deployments
    const deploymentsRes = await fetch(
      `${VERCEL_API}/v6/deployments?limit=5`,
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
        },
      }
    );

    if (!deploymentsRes.ok) {
      const error = await deploymentsRes.text();
      throw new Error(`Vercel API error: ${deploymentsRes.status} ${error}`);
    }

    const deployments = await deploymentsRes.json();
    const latest = deployments.deployments?.[0];

    if (!latest) {
      console.log("⚠️  No deployments found");
      return;
    }

    console.log("📦 Latest Deployment:");
    console.log("─".repeat(60));
    console.log(`ID: ${latest.uid}`);
    console.log(`URL: https://${latest.url}`);
    console.log(`State: ${latest.state}`);
    console.log(`Created: ${new Date(latest.createdAt).toLocaleString()}`);
    console.log(`Target: ${latest.target || "production"}`);
    console.log(`Branch: ${latest.meta?.githubCommitRef || "N/A"}`);
    console.log(`Commit: ${latest.meta?.githubCommitSha?.substring(0, 7) || "N/A"}`);
    
    if (latest.readyState) {
      const states = {
        QUEUED: "⏳ Queued",
        BUILDING: "🔨 Building",
        READY: "✅ Ready",
        ERROR: "❌ Error",
        CANCELED: "🚫 Canceled",
      };
      console.log(`Status: ${states[latest.readyState] || latest.readyState}`);
    }

    if (latest.readyState === "ERROR") {
      console.log("\n❌ Build failed!");
      console.log("Check logs at: https://vercel.com/dashboard");
    } else if (latest.readyState === "READY") {
      console.log("\n✅ Deployment successful!");
      console.log(`🌐 Live at: https://${latest.url}`);
    } else if (latest.readyState === "BUILDING") {
      console.log("\n⏳ Still building...");
      console.log("Check progress at: https://vercel.com/dashboard");
    }

    console.log("─".repeat(60));
  } catch (error: any) {
    console.error("❌ Error checking deployment:");
    console.error(error.message);
    process.exit(1);
  }
}

checkDeployment();

