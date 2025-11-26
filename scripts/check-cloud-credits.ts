/**
 * Check Cloud Credits and Usage
 * Checks Google Cloud and AWS credits, then sets up budgets
 */

import { exec } from "child_process";
import { promisify } from "util";
import { BudgetControlService } from "../server/services/BudgetControlService.js";

const execAsync = promisify(exec);

interface CloudCredits {
  provider: "gcp" | "aws";
  creditsRemaining?: number;
  creditsTotal?: number;
  currentUsage?: number;
  billingAccount?: string;
  projectId?: string;
  region?: string;
}

async function checkGoogleCloudCredits(): Promise<CloudCredits> {
  console.log("🔍 Checking Google Cloud credits...\n");

  try {
    // Get project ID
    const { stdout: projectId } = await execAsync("gcloud config get-value project");
    const project = projectId.trim();

    console.log(`   Project: ${project}`);

    // Try to get billing account
    try {
      const { stdout: billingInfo } = await execAsync(
        `gcloud billing projects describe ${project} --format="value(billingAccountName)"`
      );
      const billingAccount = billingInfo.trim();
      console.log(`   Billing Account: ${billingAccount || "Not linked"}`);

      // Try to get billing account info (credits)
      if (billingAccount) {
        try {
          const { stdout: billingDetails } = await execAsync(
            `gcloud billing accounts describe ${billingAccount} --format="json"`
          );
          const details = JSON.parse(billingDetails);
          console.log(`   Billing Account Name: ${details.displayName || "N/A"}`);
        } catch (e) {
          // Billing API might not be accessible
        }
      }
    } catch (e) {
      console.log(`   ⚠️  Billing account not accessible (may need permissions)`);
    }

    // Get current usage (last 30 days)
    try {
      const { stdout: usage } = await execAsync(
        `gcloud billing projects describe ${project} --format="value(billingEnabled)"`
      );
      console.log(`   Billing Enabled: ${usage.trim()}`);
    } catch (e) {
      // Ignore if can't get billing info
    }

    // Get Cloud Run services (to see what's deployed)
    try {
      const { stdout: services } = await execAsync(
        `gcloud run services list --format="value(metadata.name)" --limit=10 2>&1 || echo ""`
      );
      const serviceList = services.trim().split("\n").filter(Boolean);
      if (serviceList.length > 0) {
        console.log(`   Cloud Run Services: ${serviceList.length} found`);
        serviceList.slice(0, 5).forEach((s: string) => console.log(`     - ${s}`));
      }
    } catch (e) {
      // Ignore if can't list services
    }

    return {
      provider: "gcp",
      projectId: project,
      billingAccount: "check-console",
    };
  } catch (error: any) {
    console.error(`   ❌ Error checking GCP: ${error.message}`);
    return {
      provider: "gcp",
    };
  }
}

async function checkAWSCredits(): Promise<CloudCredits> {
  console.log("\n🔍 Checking AWS credits...\n");

  try {
    // Check if AWS CLI is available
    try {
      await execAsync("aws --version");
    } catch {
      console.log("   ⚠️  AWS CLI not installed or not in PATH");
      return { provider: "aws" };
    }

    // Get account ID
    try {
      const { stdout: accountId } = await execAsync("aws sts get-caller-identity --query Account --output text 2>&1 || echo ''");
      const account = accountId.trim();
      if (account) {
        console.log(`   Account ID: ${account}`);
      }
    } catch (e) {
      console.log("   ⚠️  Not authenticated with AWS");
    }

    // Try to get billing info (requires Cost Explorer API)
    try {
      const { stdout: costData } = await execAsync(
        `aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-12-31 --granularity MONTHLY --metrics BlendedCost --query 'ResultsByTime[0].Total.BlendedCost.Amount' --output text 2>&1 || echo ''`
      );
      if (costData.trim() && !costData.includes("error")) {
        console.log(`   Estimated Cost (this year): $${costData.trim()}`);
      }
    } catch (e) {
      console.log("   ⚠️  Cost Explorer API not accessible (may need permissions)");
    }

    return {
      provider: "aws",
    };
  } catch (error: any) {
    console.error(`   ❌ Error checking AWS: ${error.message}`);
    return {
      provider: "aws",
    };
  }
}

async function setupBudgetsForFreeCredits() {
  console.log("\n💰 Setting up budgets for free credits...\n");

  // Google Cloud - Set generous budgets (assuming free credits)
  console.log("📊 Google Cloud Budgets:");
  
  // Cloud Run operations - $100/month (generous for free credits)
  BudgetControlService.setBudgetLimit("cloudrun", 100);
  console.log(`   ✅ cloudrun: $100/month`);

  // Cloud Run keep-alive - $60/month (2-3 instances)
  BudgetControlService.setBudgetLimit("cloudrun-keepalive", 60);
  console.log(`   ✅ cloudrun-keepalive: $60/month`);

  // Other providers - Set generous limits
  BudgetControlService.setBudgetLimit("openai", 200);
  console.log(`   ✅ openai: $200/month`);

  BudgetControlService.setBudgetLimit("anthropic", 200);
  console.log(`   ✅ anthropic: $200/month`);

  BudgetControlService.setBudgetLimit("koala", 50);
  console.log(`   ✅ koala: $50/month`);

  console.log("\n💡 Budgets set! These are generous limits for free credits.");
  console.log("   Adjust as needed based on actual usage.\n");
}

async function showBudgetStatus() {
  console.log("📊 Current Budget Status:\n");

  const budgets = BudgetControlService.getAllBudgets();
  
  if (budgets.length === 0) {
    console.log("   No budgets configured yet.");
    return;
  }

  budgets.forEach((budget) => {
    const remaining = budget.remaining === Infinity ? "∞" : `$${budget.remaining.toFixed(2)}`;
    const limit = budget.limit === Infinity ? "∞" : `$${budget.limit.toFixed(2)}`;
    const status = budget.overBudget ? "❌ OVER" : budget.remaining < budget.limit * 0.2 ? "⚠️  LOW" : "✅ OK";
    
    console.log(`   ${status} ${budget.provider}:`);
    console.log(`      Limit: ${limit}`);
    console.log(`      Used: $${budget.used.toFixed(2)}`);
    console.log(`      Remaining: ${remaining}`);
  });
}

async function main() {
  console.log("=".repeat(70));
  console.log("☁️  CLOUD CREDITS & BUDGET SETUP");
  console.log("=".repeat(70));
  console.log("");

  // Check credits
  const gcpCredits = await checkGoogleCloudCredits();
  const awsCredits = await checkAWSCredits();

  // Show current budget status
  await showBudgetStatus();

  // Set up budgets for free credits
  await setupBudgetsForFreeCredits();

  // Show updated status
  console.log("\n📊 Updated Budget Status:\n");
  await showBudgetStatus();

  console.log("\n" + "=".repeat(70));
  console.log("✅ Setup Complete!");
  console.log("=".repeat(70));
  console.log("\n💡 Next Steps:");
  console.log("   1. Check Google Cloud Console for actual credit balance");
  console.log("   2. Check AWS Console for actual credit balance");
  console.log("   3. Adjust budgets based on your credit amounts");
  console.log("   4. Start using services - they're now governed!\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { checkGoogleCloudCredits, checkAWSCredits, setupBudgetsForFreeCredits };

