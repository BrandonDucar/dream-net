/**
 * Orca Pack Marketplace Posting Script
 * 
 * Generates and posts social media content about the X402 Agent Marketplace
 * and monetization opportunities.
 * 
 * Run with: tsx scripts/orca-post-marketplace.ts
 */

import { agentMarketplace } from "../server/core/agents/AgentMarketplace";
import { OrcaPackCore } from "../packages/orca-pack-core";

async function generateMarketplacePosts() {
  console.log("🐋 Orca Pack: Generating Marketplace Posts\n");

  // Get marketplace stats
  const stats = agentMarketplace.getStats();
  const topServices = agentMarketplace.listServices({ limit: 5 });

  // Generate posts for different platforms
  const posts = [
    // Twitter/X Post
    {
      platform: "x",
      content: `🚀 DreamNet X402 Agent Marketplace is LIVE!

💰 Agents can now buy/sell services with X402 micropayments
🤖 ${stats.totalServices} services available
📊 ${stats.totalPurchases} purchases completed
💵 ${stats.totalRevenue} X402 in revenue

Services:
${topServices.slice(0, 3).map(s => `• ${s.serviceName} - ${s.price} X402`).join('\n')}

Start monetizing your agents NOW:
https://dreamnet.ink/marketplace

#X402 #Base #AI #Web3 #DreamNet`,
    },

    // LinkedIn Post
    {
      platform: "linkedin",
      content: `🚀 DreamNet X402 Agent Marketplace: The Future of AI Agent Commerce

We've just launched the first X402-powered marketplace where AI agents can autonomously buy and sell services from each other.

📊 Current Stats:
• ${stats.totalServices} services listed
• ${stats.totalPurchases} transactions completed
• ${stats.totalRevenue} X402 in revenue generated
• ${stats.topCategories.length} service categories

🎯 Top Services:
${topServices.slice(0, 3).map(s => `• ${s.serviceName} by ${s.agentName}`).join('\n')}

💡 Why This Matters:
X402 enables real-time micropayments between AI agents without accounts or subscriptions. This unlocks autonomous agent economies where agents can:
- Earn revenue for their services
- Purchase capabilities from other agents
- Build complex multi-agent workflows
- Scale infinitely

🔗 Explore the marketplace: https://dreamnet.ink/marketplace

Built on Base blockchain with X402 protocol.

#AI #Blockchain #X402 #Base #DreamNet #AgentEconomy`,
    },

    // Farcaster Post
    {
      platform: "farcaster",
      content: `🐋 Orca Pod here! 🐋

DreamNet X402 Agent Marketplace is LIVE on Base! 🚀

${stats.totalServices} services | ${stats.totalPurchases} purchases | ${stats.totalRevenue} X402 revenue

Agents can now:
💰 Earn X402 for their services
🤖 Buy capabilities from other agents
⚡ Real-time micropayments (<1 second)
🌐 Multi-chain support (Base, Polygon, Ethereum)

Top services:
${topServices.slice(0, 3).map(s => `• ${s.serviceName} (${s.price} X402)`).join('\n')}

Start monetizing: dreamnet.ink/marketplace

#X402 #Base #DreamNet`,
    },

    // Thread (Twitter/X)
    {
      platform: "x",
      kind: "thread",
      content: [
        `🚀 DreamNet X402 Agent Marketplace is LIVE!

The first marketplace where AI agents can autonomously buy/sell services using X402 micropayments.

Why this is huge:`,
        `1️⃣ Real-time payments (<1 second)
No accounts, no subscriptions - just pay-per-use

2️⃣ Autonomous agent economy
Agents earn revenue and purchase capabilities from each other

3️⃣ Infinite scaling
Agents can scale their revenue as demand grows`,
        `Current stats:
• ${stats.totalServices} services listed
• ${stats.totalPurchases} purchases
• ${stats.totalRevenue} X402 revenue
• ${stats.topCategories.length} categories`,
        `Top services right now:
${topServices.slice(0, 3).map(s => `• ${s.serviceName} - ${s.price} X402`).join('\n')}`,
        `Built on:
✅ Base blockchain (ultra-cheap transactions)
✅ X402 protocol (AI-native payments)
✅ DreamNet agent ecosystem (143+ agents)

Start monetizing your agents:
https://dreamnet.ink/marketplace

#X402 #Base #AI #Web3`,
      ],
    },
  ];

  // Create Orca Pack themes for marketplace
  const marketplaceTheme = OrcaPackCore.upsertTheme({
    id: "theme:x402-marketplace",
    name: "X402 Agent Marketplace",
    description: "Content about DreamNet's X402-powered agent marketplace and monetization",
    tags: ["x402", "marketplace", "monetization", "agents", "base", "web3"],
    narrativeArc: "Launch → Growth → Scale",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Generate Orca ideas from posts
  for (const post of posts) {
    if (post.kind === "thread" && Array.isArray(post.content)) {
      // Create thread idea
      const idea = OrcaPackCore.upsertIdea({
        id: `idea:marketplace-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        kind: "thread",
        themeId: marketplaceTheme.id,
        title: "X402 Agent Marketplace Launch",
        body: post.content.join("\n\n"),
        tags: ["x402", "marketplace", "launch"],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        score: 1.0, // High priority
      });

      // Create plan for X/Twitter
      const plan = OrcaPackCore.upsertPlan({
        id: `plan:${idea.id}:x`,
        ideaId: idea.id,
        channel: "x",
        status: "draft",
        scheduledAt: undefined,
        postedAt: undefined,
        renderedTitle: "X402 Agent Marketplace Launch",
        renderedBody: post.content.join("\n\n"),
        renderedMeta: { type: "thread", parts: post.content.length },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      console.log(`✅ Created thread plan: ${plan.id}`);
    } else {
      // Create single post idea
      const idea = OrcaPackCore.upsertIdea({
        id: `idea:marketplace-${post.platform}-${Date.now()}`,
        kind: "short-text",
        themeId: marketplaceTheme.id,
        title: `X402 Marketplace - ${post.platform}`,
        body: post.content,
        tags: ["x402", "marketplace", post.platform],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        score: 0.9,
      });

      // Create plan
      const plan = OrcaPackCore.upsertPlan({
        id: `plan:${idea.id}:${post.platform}`,
        ideaId: idea.id,
        channel: post.platform as any,
        status: "draft",
        scheduledAt: undefined,
        postedAt: undefined,
        renderedTitle: `X402 Marketplace - ${post.platform}`,
        renderedBody: post.content,
        renderedMeta: {},
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      console.log(`✅ Created ${post.platform} post plan: ${plan.id}`);
    }
  }

  // Get all draft plans
  const allPlans = OrcaPackCore.listPlans().filter(p => p.status === "draft");
  
  console.log(`\n📊 Generated ${allPlans.length} post plans`);
  console.log(`\n📝 Ready to post:`);
  allPlans.forEach(plan => {
    console.log(`\n--- ${plan.channel.toUpperCase()} ---`);
    console.log(plan.renderedBody.substring(0, 200) + "...");
  });

  console.log(`\n🚀 Next steps:`);
  console.log(`1. Review plans: GET /api/orca-pack/plans`);
  console.log(`2. Post manually: POST /api/social-media-ops/post`);
  console.log(`3. Or let Orca Pack auto-post (runs every 15 minutes)`);
  console.log(`\n💰 Let's make some money! 🚀`);
}

generateMarketplacePosts().catch(console.error);

