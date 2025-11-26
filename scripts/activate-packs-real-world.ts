/**
 * Activate Wolf Pack and Whale Pack for Real-World Work
 * 
 * This script:
 * 1. Seeds Wolf Pack with real funding opportunities
 * 2. Seeds Whale Pack with real products and audiences
 * 3. Activates their cycles to start working
 */

import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WhalePackCore } from "@dreamnet/whale-pack-core";

async function activatePacks() {
  console.log("🚀 Activating Wolf Pack and Whale Pack for Real-World Work...\n");

  // ============================================
  // WOLF PACK - Funding Discovery & Outreach
  // ============================================
  console.log("🐺 WOLF PACK - Setting up funding hunting...\n");

  // Seed real funding opportunities
  const fundingLeads = [
    {
      id: "base-builder-grant-2025",
      name: "Base Builder Grants",
      type: "grant" as const,
      source: "Base",
      url: "https://base.org/grants",
      amount: "1-5 ETH",
      description: "Base Builder Grants support developers building on Base",
      stage: "discovered" as const,
      priority: 0.9,
      dreamFitScore: 0.95, // DreamNet is perfect for Base!
    },
    {
      id: "optimism-retro-funding",
      name: "Optimism Retroactive Public Goods Funding",
      type: "ecosystem-fund" as const,
      source: "Optimism",
      url: "https://optimism.io/retropgf",
      amount: "Varies",
      description: "Retroactive funding for public goods on Optimism",
      stage: "discovered" as const,
      priority: 0.85,
      dreamFitScore: 0.9,
    },
    {
      id: "ethereum-foundation-grants",
      name: "Ethereum Foundation Grants",
      type: "grant" as const,
      source: "Ethereum Foundation",
      url: "https://ethereum.org/en/community/grants/",
      amount: "Varies",
      description: "Grants for Ethereum ecosystem development",
      stage: "discovered" as const,
      priority: 0.8,
      dreamFitScore: 0.85,
    },
    {
      id: "a16z-crypto-startup-school",
      name: "a16z Crypto Startup School",
      type: "accelerator" as const,
      source: "a16z",
      url: "https://a16zcrypto.com/startup-school/",
      amount: "Program + Network",
      description: "Accelerator program for crypto startups",
      stage: "discovered" as const,
      priority: 0.75,
      dreamFitScore: 0.8,
    },
  ];

  // Add leads to Wolf Pack
  for (const lead of fundingLeads) {
    WolfPackFundingCore.upsertLead(lead);
    console.log(`  ✅ Added: ${lead.name} (${lead.source}) - ${lead.amount}`);
  }

  // Run Wolf Pack cycle to score leads and generate drafts
  console.log("\n  🔄 Running Wolf Pack cycle...");
  const wolfStatus = WolfPackFundingCore.run({
    spiderWebCore: undefined, // Will be provided by orchestrator
    dreamShop: undefined,
    economicEngineCore: undefined,
  });

  console.log(`  📊 Status:`);
  console.log(`     - Total Leads: ${wolfStatus.totalLeads}`);
  console.log(`     - Qualified Leads: ${wolfStatus.qualifiedLeads}`);
  console.log(`     - Hot Leads: ${wolfStatus.hotLeads}`);
  console.log(`     - Queue Items: ${wolfStatus.queueItems}`);
  console.log(`     - Grant Drafts: ${wolfStatus.grantDrafts}`);

  // ============================================
  // WHALE PACK - Commerce & Product Management
  // ============================================
  console.log("\n🐳 WHALE PACK - Setting up commerce operations...\n");

  // Seed real products
  const products = [
    {
      id: "dreamnet-hub",
      name: "DreamNet Hub",
      description: "The central hub for all DreamNet mini-apps",
      category: "platform",
      channels: ["web", "base"] as const,
      metrics: {
        activeUsers: 0,
        revenue: 0,
        engagement: 0,
      },
    },
    {
      id: "x402-payment-gateway",
      name: "X402 Payment Gateway",
      description: "Multi-chain X402 payment processing",
      category: "infrastructure",
      channels: ["web", "base", "ethereum"] as const,
      metrics: {
        activeUsers: 0,
        revenue: 0,
        engagement: 0,
      },
    },
    {
      id: "agent-marketplace",
      name: "Agent Marketplace",
      description: "Marketplace for AI agents and services",
      category: "marketplace",
      channels: ["web", "base"] as const,
      metrics: {
        activeUsers: 0,
        revenue: 0,
        engagement: 0,
      },
    },
    {
      id: "orca-pack-social",
      name: "Orca Pack Social Media",
      description: "Automated social media posting across platforms",
      category: "service",
      channels: ["twitter", "instagram", "facebook", "linkedin", "farcaster"] as const,
      metrics: {
        activeUsers: 0,
        revenue: 0,
        engagement: 0,
      },
    },
  ];

  // Add products to Whale Pack
  for (const product of products) {
    WhalePackCore.upsertProduct(product);
    console.log(`  ✅ Added Product: ${product.name} (${product.category})`);
  }

  // Seed real audiences
  const audiences = [
    {
      id: "web3-developers",
      name: "Web3 Developers",
      description: "Developers building on Base, Ethereum, and other chains",
      size: "large",
      channels: ["twitter", "github", "farcaster", "base"] as const,
      interests: ["blockchain", "defi", "nft", "ai"],
    },
    {
      id: "ai-builders",
      name: "AI Builders",
      description: "Developers and entrepreneurs building AI products",
      size: "large",
      channels: ["twitter", "linkedin", "github"] as const,
      interests: ["ai", "ml", "agents", "automation"],
    },
    {
      id: "crypto-entrepreneurs",
      name: "Crypto Entrepreneurs",
      description: "Founders and builders in the crypto space",
      size: "medium",
      channels: ["twitter", "linkedin", "farcaster"] as const,
      interests: ["startups", "funding", "grants", "ecosystem"],
    },
  ];

  // Add audiences to Whale Pack
  for (const audience of audiences) {
    WhalePackCore.upsertAudience(audience);
    console.log(`  ✅ Added Audience: ${audience.name} (${audience.size})`);
  }

  // Run Whale Pack cycle
  console.log("\n  🔄 Running Whale Pack cycle...");
  const whaleStatus = await WhalePackCore.run({
    spiderWebCore: undefined, // Will be provided by orchestrator
    dreamShop: undefined,
    economicEngineCore: undefined,
  });

  console.log(`  📊 Status:`);
  console.log(`     - Products: ${whaleStatus.productCount}`);
  console.log(`     - Audiences: ${whaleStatus.audienceCount}`);
  console.log(`     - Content Plans: ${whaleStatus.planCount}`);
  console.log(`     - Insights: ${whaleStatus.insightCount}`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log("\n" + "=".repeat(60));
  console.log("✅ PACKS ACTIVATED FOR REAL-WORLD WORK");
  console.log("=".repeat(60));
  console.log("\n🐺 WOLF PACK:");
  console.log(`   - ${wolfStatus.totalLeads} funding leads discovered`);
  console.log(`   - ${wolfStatus.qualifiedLeads} qualified for outreach`);
  console.log(`   - ${wolfStatus.hotLeads} hot leads (high priority)`);
  console.log(`   - ${wolfStatus.queueItems} emails queued`);
  console.log(`   - ${wolfStatus.grantDrafts} grant drafts generated`);
  console.log("\n🐳 WHALE PACK:");
  console.log(`   - ${whaleStatus.productCount} products registered`);
  console.log(`   - ${whaleStatus.audienceCount} audiences defined`);
  console.log(`   - ${whaleStatus.planCount} content plans created`);
  console.log(`   - ${whaleStatus.insightCount} insights generated`);
  console.log("\n🚀 Both packs are now running in the background!");
  console.log("   - Wolf Pack: Hunting funding every cycle");
  console.log("   - Whale Pack: Analyzing commerce every 20 minutes");
  console.log("\n📊 View status at:");
  console.log("   - Wolf Pack: /api/wolf-pack/status");
  console.log("   - Whale Pack: /api/whale-pack/status");
  console.log("\n");
}

// Run if called directly
if (require.main === module) {
  activatePacks().catch(console.error);
}

export { activatePacks };

