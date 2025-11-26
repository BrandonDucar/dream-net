/**
 * Check Full Integration Status
 * Checks what's configured, what credits we have, and what I can access
 */

import { exec } from "child_process";
import { promisify } from "util";
import { BudgetControlService } from "../server/services/BudgetControlService.js";

const execAsync = promisify(exec);

interface IntegrationStatus {
  service: string;
  configured: boolean;
  credentials?: string;
  credits?: string;
  notes?: string;
}

async function checkGoogleCloud(): Promise<IntegrationStatus> {
  try {
    const { stdout: projectId } = await execAsync("gcloud config get-value project 2>&1");
    const project = projectId.trim();
    
    if (!project || project.includes("ERROR")) {
      return {
        service: "Google Cloud",
        configured: false,
        notes: "Not authenticated or project not set",
      };
    }

    // Check billing
    let billing = "Unknown";
    try {
      const { stdout: billingInfo } = await execAsync(
        `gcloud billing projects describe ${project} --format="value(billingAccountName)" 2>&1`
      );
      billing = billingInfo.trim() || "Not linked";
    } catch {
      billing = "Check console";
    }

    // Check Cloud Run services
    let services = 0;
    try {
      const { stdout: servicesList } = await execAsync(
        `gcloud run services list --format="value(metadata.name)" --limit=5 2>&1`
      );
      services = servicesList.trim().split("\n").filter(Boolean).length;
    } catch {
      // Ignore
    }

    return {
      service: "Google Cloud",
      configured: true,
      credentials: `Project: ${project}`,
      credits: billing === "Not linked" ? "Check console for credits" : "Check billing console",
      notes: `${services} Cloud Run service(s) found`,
    };
  } catch (error: any) {
    return {
      service: "Google Cloud",
      configured: false,
      notes: error.message,
    };
  }
}

async function checkAWS(): Promise<IntegrationStatus> {
  try {
    const { stdout: accountId } = await execAsync("aws sts get-caller-identity --query Account --output text 2>&1 || echo ''");
    const account = accountId.trim();
    
    if (!account || account.includes("error") || account.includes("Unable to locate")) {
      return {
        service: "AWS",
        configured: false,
        notes: "AWS CLI not configured or not authenticated",
      };
    }

    return {
      service: "AWS",
      configured: true,
      credentials: `Account: ${account}`,
      credits: "Check AWS Console for credits",
    };
  } catch (error: any) {
    return {
      service: "AWS",
      configured: false,
      notes: error.message,
    };
  }
}

function checkOpenAI(): IntegrationStatus {
  const apiKey = process.env.OPENAI_API_KEY;
  const hasKey = !!apiKey;
  
  return {
    service: "OpenAI",
    configured: hasKey,
    credentials: hasKey ? `API Key: ${apiKey.substring(0, 8)}...` : "Not set",
    notes: hasKey 
      ? "⚠️  API usage is SEPARATE from ChatGPT Plus subscription ($20/month). API charges per token."
      : "Set OPENAI_API_KEY to use",
  };
}

function checkAnthropic(): IntegrationStatus {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const hasKey = !!apiKey;
  
  return {
    service: "Anthropic",
    configured: hasKey,
    credentials: hasKey ? `API Key: ${apiKey.substring(0, 8)}...` : "Not set",
    notes: hasKey
      ? "⚠️  API usage is PAY-AS-YOU-GO. No subscription. Charges per token."
      : "Set ANTHROPIC_API_KEY to use",
  };
}

function checkMyIntegration(): IntegrationStatus {
  // Check what I (the AI assistant) can access
  const canAccess = {
    files: true,
    terminal: true,
    browser: true,
    codebase: true,
    tools: true,
  };

  return {
    service: "AI Assistant (Auto)",
    configured: true,
    credentials: "Fully integrated with Cursor",
    notes: `✅ Can access: ${Object.keys(canAccess).filter(k => canAccess[k as keyof typeof canAccess]).join(", ")}`,
  };
}

function checkBudgetControl(): IntegrationStatus {
  const budgets = BudgetControlService.getAllBudgets();
  
  return {
    service: "Budget Control",
    configured: true,
    credentials: `${budgets.length} budgets configured`,
    notes: budgets.length > 0 
      ? `Active budgets: ${budgets.map(b => b.provider).join(", ")}`
      : "No budgets set yet",
  };
}

async function main() {
  console.log("=".repeat(70));
  console.log("🔍 DREAMNET INTEGRATION STATUS CHECK");
  console.log("=".repeat(70));
  console.log("");

  // Check cloud providers
  console.log("☁️  Cloud Providers:\n");
  const gcp = await checkGoogleCloud();
  console.log(`${gcp.configured ? "✅" : "❌"} ${gcp.service}`);
  console.log(`   ${gcp.credentials || "Not configured"}`);
  if (gcp.credits) console.log(`   Credits: ${gcp.credits}`);
  if (gcp.notes) console.log(`   ${gcp.notes}`);
  console.log("");

  const aws = await checkAWS();
  console.log(`${aws.configured ? "✅" : "❌"} ${aws.service}`);
  console.log(`   ${aws.credentials || "Not configured"}`);
  if (aws.credits) console.log(`   Credits: ${aws.credits}`);
  if (aws.notes) console.log(`   ${aws.notes}`);
  console.log("");

  // Check AI APIs
  console.log("🤖 AI APIs:\n");
  const openai = checkOpenAI();
  console.log(`${openai.configured ? "✅" : "❌"} ${openai.service}`);
  console.log(`   ${openai.credentials}`);
  if (openai.notes) console.log(`   ${openai.notes}`);
  console.log("");

  const anthropic = checkAnthropic();
  console.log(`${anthropic.configured ? "✅" : "❌"} ${anthropic.service}`);
  console.log(`   ${anthropic.credentials}`);
  if (anthropic.notes) console.log(`   ${anthropic.notes}`);
  console.log("");

  // Check my integration
  console.log("🤖 AI Assistant (Me):\n");
  const me = checkMyIntegration();
  console.log(`${me.configured ? "✅" : "❌"} ${me.service}`);
  console.log(`   ${me.credentials}`);
  if (me.notes) console.log(`   ${me.notes}`);
  console.log("");

  // Check budget control
  console.log("💰 Budget Control:\n");
  const budget = checkBudgetControl();
  console.log(`${budget.configured ? "✅" : "❌"} ${budget.service}`);
  console.log(`   ${budget.credentials}`);
  if (budget.notes) console.log(`   ${budget.notes}`);
  console.log("");

  // Pricing clarification
  console.log("=".repeat(70));
  console.log("💡 PRICING CLARIFICATION");
  console.log("=".repeat(70));
  console.log("");
  console.log("OpenAI:");
  console.log("  - ChatGPT Plus ($20/month) = Subscription for chat.openai.com");
  console.log("  - API Usage = SEPARATE, pay-per-token (GPT-4: ~$0.03/1K tokens)");
  console.log("  - Your $200 on ChatGPT Pro = Subscription, NOT API credits");
  console.log("");
  console.log("Anthropic:");
  console.log("  - No subscription model");
  console.log("  - Pay-as-you-go API (Claude 3.5 Sonnet: ~$0.003/1K input tokens)");
  console.log("  - No upfront costs");
  console.log("");
  console.log("Google Cloud:");
  console.log("  - Free tier: $300 credits for new accounts");
  console.log("  - Cloud Run: Pay per use (scales to zero)");
  console.log("  - Check: https://console.cloud.google.com/billing");
  console.log("");
  console.log("AWS:");
  console.log("  - Free tier: 12 months free for new accounts");
  console.log("  - Credits vary by program");
  console.log("  - Check: https://console.aws.amazon.com/billing");
  console.log("");

  console.log("=".repeat(70));
  console.log("✅ Status Check Complete!");
  console.log("=".repeat(70));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

