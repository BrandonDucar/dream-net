/**
 * Orca Pack Marketplace Integration
 * 
 * API routes for Orca Pack to post about marketplace and monetization
 */

import { Router } from "express";
import { OrcaPackCore } from "../../packages/orca-pack-core";
import { agentMarketplace } from "../core/agents/AgentMarketplace";
import { createSocialMediaOpsRouter } from "./social-media-ops";

const router = Router();

/**
 * POST /api/orca-marketplace/generate-posts
 * Generate social media posts about marketplace
 */
router.post("/generate-posts", async (_req, res) => {
  try {
    const stats = agentMarketplace.getStats();
    const topServices = agentMarketplace.listServices({ limit: 5 });

    // Create marketplace theme
    const theme = OrcaPackCore.upsertTheme({
      id: "theme:x402-marketplace",
      name: "X402 Agent Marketplace",
      description: "Content about DreamNet's X402-powered agent marketplace",
      tags: ["x402", "marketplace", "monetization"],
      narrativeArc: "Launch → Growth → Scale",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Generate posts
    const posts = [
      {
        platform: "x",
        content: `🚀 DreamNet X402 Agent Marketplace is LIVE!

💰 ${stats.totalServices} services | ${stats.totalPurchases} purchases | ${stats.totalRevenue} X402 revenue

Top services:
${topServices.slice(0, 3).map(s => `• ${s.serviceName} - ${s.price} X402`).join('\n')}

Start monetizing: https://dreamnet.ink/marketplace

#X402 #Base #AI #Web3`,
      },
      {
        platform: "linkedin",
        content: `🚀 DreamNet X402 Agent Marketplace: The Future of AI Agent Commerce

We've launched the first X402-powered marketplace where AI agents can autonomously buy and sell services.

📊 Stats:
• ${stats.totalServices} services listed
• ${stats.totalPurchases} transactions
• ${stats.totalRevenue} X402 revenue

Built on Base blockchain with X402 protocol.

#AI #Blockchain #X402 #Base`,
      },
    ];

    const createdPlans = [];

    for (const post of posts) {
      const idea = OrcaPackCore.upsertIdea({
        id: `idea:marketplace-${post.platform}-${Date.now()}`,
        kind: "short-text",
        themeId: theme.id,
        title: `X402 Marketplace - ${post.platform}`,
        body: post.content,
        tags: ["x402", "marketplace"],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        score: 1.0,
      });

      const plan = OrcaPackCore.upsertPlan({
        id: `plan:${idea.id}:${post.platform}`,
        ideaId: idea.id,
        channel: post.platform as any,
        status: "draft",
        renderedTitle: `X402 Marketplace`,
        renderedBody: post.content,
        renderedMeta: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      createdPlans.push(plan);
    }

    res.json({
      success: true,
      message: `Generated ${createdPlans.length} post plans`,
      plans: createdPlans,
      stats,
    });
  } catch (error: any) {
    console.error("[Orca Marketplace] Error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/orca-marketplace/post-now
 * Post marketplace content to social media immediately
 */
router.post("/post-now", async (req, res) => {
  try {
    const { platforms = ["Twitter", "LinkedIn"] } = req.body;

    const stats = agentMarketplace.getStats();
    const topServices = agentMarketplace.listServices({ limit: 3 });

    const content = `🚀 DreamNet X402 Agent Marketplace is LIVE!

💰 ${stats.totalServices} services available
📊 ${stats.totalPurchases} purchases completed
💵 ${stats.totalRevenue} X402 in revenue

Top services:
${topServices.map(s => `• ${s.serviceName} - ${s.price} X402`).join('\n')}

Start monetizing your agents: https://dreamnet.ink/marketplace

#X402 #Base #AI #Web3 #DreamNet`;

    // Use social media ops to post
    const socialMediaOps = createSocialMediaOpsRouter();
    
    // For now, return the content - user can post manually or integrate with actual APIs
    res.json({
      success: true,
      message: "Content ready to post",
      content,
      platforms,
      stats,
      note: "Post manually or integrate with social media APIs",
    });
  } catch (error: any) {
    console.error("[Orca Marketplace] Post error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/orca-marketplace/content
 * Get ready-to-post marketplace content
 */
router.get("/content", async (_req, res) => {
  try {
    const stats = agentMarketplace.getStats();
    const topServices = agentMarketplace.listServices({ limit: 5 });

    const content = {
      twitter: `🚀 DreamNet X402 Agent Marketplace is LIVE!

💰 ${stats.totalServices} services | ${stats.totalPurchases} purchases | ${stats.totalRevenue} X402 revenue

Top services:
${topServices.slice(0, 3).map(s => `• ${s.serviceName} - ${s.price} X402`).join('\n')}

Start monetizing: https://dreamnet.ink/marketplace

#X402 #Base #AI #Web3`,
      
      linkedin: `🚀 DreamNet X402 Agent Marketplace: The Future of AI Agent Commerce

We've launched the first X402-powered marketplace where AI agents can autonomously buy and sell services.

📊 Current Stats:
• ${stats.totalServices} services listed
• ${stats.totalPurchases} transactions completed
• ${stats.totalRevenue} X402 in revenue generated

🎯 Top Services:
${topServices.slice(0, 3).map(s => `• ${s.serviceName} by ${s.agentName}`).join('\n')}

💡 Why This Matters:
X402 enables real-time micropayments between AI agents without accounts or subscriptions. This unlocks autonomous agent economies.

🔗 Explore: https://dreamnet.ink/marketplace

Built on Base blockchain with X402 protocol.

#AI #Blockchain #X402 #Base #DreamNet`,
    };

    res.json({
      success: true,
      content,
      stats,
      topServices: topServices.slice(0, 5),
    });
  } catch (error: any) {
    console.error("[Orca Marketplace] Content error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export { router as createOrcaMarketplaceRouter };

