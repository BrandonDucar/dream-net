/**
 * List X402 Services and Start Social Media Posting
 * 
 * This script:
 * 1. Lists all DreamNet services in X402 marketplace
 * 2. Activates social media posting
 * 3. Checks Ohara AI integration
 */

import { x402PaymentGateway } from "../server/core/agents/X402PaymentGateway.js";
import { SocialMediaPoster } from "../packages/social-media-poster/SocialMediaPoster.js";
import { oharaClient } from "../server/integrations/oharaClient.js";

const DREAMNET_SERVICES = [
  {
    agentId: "dreamnet-api-access",
    serviceName: "DreamNet API Access",
    description: "Full access to DreamNet API with 1000 requests/month. Includes all endpoints, agents, and mini-apps.",
    price: "1000",
    chain: "base" as const,
  },
  {
    agentId: "wolf-pack-funding",
    serviceName: "Wolf Pack Funding Discovery",
    description: "AI-powered funding opportunity discovery. Finds grants, VCs, and funding sources tailored to your project.",
    price: "500",
    chain: "base" as const,
  },
  {
    agentId: "social-media-posting",
    serviceName: "Multi-Platform Social Media Posting",
    description: "Post to 13+ platforms simultaneously: X, Instagram, Facebook, LinkedIn, TikTok, GitHub, Notion, Slack, Discord, YouTube, Telegram, Reddit, Farcaster.",
    price: "250",
    chain: "base" as const,
  },
  {
    agentId: "dreamops-orchestration",
    serviceName: "DreamOps Constellation Orchestration",
    description: "Autonomous orchestration service. BrainHub, DeployKeeper, DreamMemory, and SocialWeaver coordination.",
    price: "2000",
    chain: "base" as const,
  },
];

async function listX402Services() {
  console.log("💰 Listing DreamNet Services in X402 Marketplace...\n");

  for (const service of DREAMNET_SERVICES) {
    try {
      const listedService = await x402PaymentGateway.listService({
        serviceId: service.agentId,
        agentId: service.agentId,
        serviceName: service.serviceName,
        description: service.description,
        price: service.price,
        chain: service.chain,
        active: true,
      });
      console.log(`✅ Listed: ${service.serviceName} (${service.price} X402)`);
    } catch (error: any) {
      console.error(`❌ Failed: ${service.serviceName}:`, error.message);
    }
  }

  const allServices = x402PaymentGateway.listServices();
  console.log(`\n📊 Total Active Services: ${allServices.length}\n`);
}

async function startSocialMediaPosting() {
  console.log("📱 Starting Social Media Posting...\n");

  const poster = new SocialMediaPoster();
  
  const initialPost = {
    content: "🚀 DreamNet is live! Access 55+ mini-apps, AI agents, and Web3 tools. Built on Base. Powered by X402 micropayments. dreamnet.ink #DreamNet #Base #X402 #Web3 #AI",
    platforms: ["twitter", "facebook", "linkedin", "reddit"] as any[],
    hashtags: ["#DreamNet", "#Base", "#X402", "#Web3", "#AI"],
  };

  for (const platform of initialPost.platforms) {
    try {
      const result = await poster.post({
        content: initialPost.content,
        platform: platform,
        hashtags: initialPost.hashtags,
      });

      if (result.success) {
        console.log(`✅ Posted to ${platform}: ${result.postUrl || result.postId}`);
      } else {
        console.log(`⚠️  ${platform}: ${result.error || "Failed"}`);
      }
    } catch (error: any) {
      console.log(`❌ ${platform} error: ${error.message}`);
    }
  }
}

async function checkOharaIntegration() {
  console.log("\n🔍 Checking Ohara AI Integration...\n");

  try {
    const apps = await oharaClient.listApps();
    console.log(`✅ Found ${apps.length} Ohara apps`);
    
    if (apps.length > 0) {
      console.log("\n📱 Your Ohara Apps:");
      apps.slice(0, 10).forEach((app, i) => {
        console.log(`   ${i + 1}. ${app.name} (${app.status || "active"})`);
      });
      
      if (apps.length > 10) {
        console.log(`   ... and ${apps.length - 10} more`);
      }
    }
  } catch (error: any) {
    console.log(`⚠️  Ohara integration: ${error.message}`);
    console.log("   Set OHARA_API_KEY to enable integration");
  }
}

async function main() {
  await listX402Services();
  await startSocialMediaPosting();
  await checkOharaIntegration();
  
  console.log("\n✅ Complete!");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { listX402Services, startSocialMediaPosting, checkOharaIntegration };

