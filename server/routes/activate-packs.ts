/**
 * Activate Packs for Real-World Work
 * 
 * Routes to activate and seed Wolf Pack and Whale Pack with real data
 */

import { Router } from "express";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WhalePackCore } from "@dreamnet/whale-pack-core";

export function createActivatePacksRouter(): Router {
  const router = Router();

  // POST /api/packs/activate - Activate both packs with real data
  router.post("/packs/activate", async (req, res) => {
    try {
      console.log("🚀 [Activate Packs] Starting activation...");

      // ============================================
      // WOLF PACK - Seed Real Funding Opportunities
      // ============================================
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
          dreamFitScore: 0.95,
          email: "grants@base.org", // Example - replace with real
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

      let wolfLeadsAdded = 0;
      for (const lead of fundingLeads) {
        WolfPackFundingCore.upsertLead(lead);
        wolfLeadsAdded++;
      }

      // Run Wolf Pack cycle
      const wolfStatus = WolfPackFundingCore.run({
        spiderWebCore: undefined,
        dreamShop: undefined,
        economicEngineCore: undefined,
        narrativeField: undefined,
      });

      // ============================================
      // WHALE PACK - Seed Real Products & Audiences
      // ============================================
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

      let whaleProductsAdded = 0;
      for (const product of products) {
        WhalePackCore.upsertProduct(product);
        whaleProductsAdded++;
      }

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

      let whaleAudiencesAdded = 0;
      for (const audience of audiences) {
        WhalePackCore.upsertAudience(audience);
        whaleAudiencesAdded++;
      }

      // Run Whale Pack cycle
      const whaleStatus = await WhalePackCore.run({
        spiderWebCore: undefined,
        dreamShop: undefined,
        economicEngineCore: undefined,
      });

      res.json({
        ok: true,
        message: "Packs activated for real-world work",
        wolfPack: {
          leadsAdded: wolfLeadsAdded,
          totalLeads: wolfStatus.totalLeads,
          qualifiedLeads: wolfStatus.qualifiedLeads,
          hotLeads: wolfStatus.hotLeads,
          queueItems: wolfStatus.queueItems,
          grantDrafts: wolfStatus.grantDrafts,
        },
        whalePack: {
          productsAdded: whaleProductsAdded,
          audiencesAdded: whaleAudiencesAdded,
          totalProducts: whaleStatus.productCount,
          totalAudiences: whaleStatus.audienceCount,
          contentPlans: whaleStatus.planCount,
          insights: whaleStatus.insightCount,
        },
      });
    } catch (error) {
      console.error("Failed to activate packs:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/packs/status - Get status of both packs
  router.get("/packs/status", async (req, res) => {
    try {
      const wolfStatus = WolfPackFundingCore.status();
      const whaleStatus = WhalePackCore.status();

      res.json({
        ok: true,
        wolfPack: {
          totalLeads: wolfStatus.totalLeads,
          qualifiedLeads: wolfStatus.qualifiedLeads,
          hotLeads: wolfStatus.hotLeads,
          queueItems: wolfStatus.queueItems,
          grantDrafts: wolfStatus.grantDrafts,
        },
        whalePack: {
          productCount: whaleStatus.productCount,
          audienceCount: whaleStatus.audienceCount,
          planCount: whaleStatus.planCount,
          insightCount: whaleStatus.insightCount,
        },
      });
    } catch (error) {
      console.error("Failed to get pack status:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}

