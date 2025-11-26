/**
 * Launch Marketplace Services
 * 
 * Automatically lists all monetizable services on the Agent Marketplace.
 * Run with: tsx scripts/launch-marketplace-services.ts
 */

import { agentMarketplace } from "../server/core/agents/AgentMarketplace";

async function launchServices() {
  console.log("🚀 Launching Marketplace Services for Immediate Monetization\n");

  const services = [
    // Wolf Pack Services
    {
      agentId: "wolf-pack",
      agentName: "Wolf Pack Protocol",
      serviceName: "Funding Opportunity Research",
      description: "AI-powered funding opportunity discovery. Finds grants, VCs, and funding sources matching your project criteria.",
      category: "funding",
      price: "500000000000000000", // 0.5 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "30 minutes",
        requirements: ["project description", "target funding amount", "industry"],
        tags: ["funding", "grants", "vc", "research"],
      },
    },
    {
      agentId: "wolf-pack",
      agentName: "Wolf Pack Protocol",
      serviceName: "Grant Application Assistance",
      description: "Help with grant applications, including writing, review, and submission.",
      category: "funding",
      price: "1000000000000000000", // 1 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "2 hours",
        requirements: ["grant details", "project information"],
        tags: ["funding", "grants", "writing"],
      },
    },

    // CoinSensei Services
    {
      agentId: "coinsensei",
      agentName: "CoinSensei",
      serviceName: "Portfolio Analytics & Insights",
      description: "Professional portfolio analysis with P&L, allocation, ROI, and smart recommendations.",
      category: "analytics",
      price: "100000000000000000", // 0.1 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "5 minutes",
        requirements: ["wallet address (public only)"],
        tags: ["portfolio", "analytics", "crypto", "defi"],
      },
    },
    {
      agentId: "coinsensei",
      agentName: "CoinSensei",
      serviceName: "Advanced Portfolio Strategy",
      description: "Deep portfolio analysis with DCA recommendations, rebalancing suggestions, and risk assessment.",
      category: "analytics",
      price: "300000000000000000", // 0.3 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "15 minutes",
        requirements: ["wallet address", "investment goals"],
        tags: ["portfolio", "strategy", "dca", "rebalancing"],
      },
    },

    // DeployKeeper Services
    {
      agentId: "deploy-keeper",
      agentName: "DeployKeeper",
      serviceName: "Deploy to Google Cloud Run",
      description: "Automated deployment to Google Cloud Run with health checks and monitoring.",
      category: "deployment",
      price: "1000000000000000000", // 1 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "10 minutes",
        requirements: ["Dockerfile", "cloudbuild.yaml", "GCP credentials"],
        tags: ["deployment", "cloud", "gcp", "docker"],
      },
    },
    {
      agentId: "deploy-keeper",
      agentName: "DeployKeeper",
      serviceName: "Deployment Health Check",
      description: "Verify deployment health, check for errors, and validate configuration.",
      category: "deployment",
      price: "200000000000000000", // 0.2 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "5 minutes",
        requirements: ["deployment URL"],
        tags: ["deployment", "health", "monitoring"],
      },
    },

    // DreamKeeper Services
    {
      agentId: "dream-keeper",
      agentName: "DreamKeeper",
      serviceName: "System Health Analysis",
      description: "AI-powered system diagnostics and health checks with recommendations.",
      category: "monitoring",
      price: "50000000000000000", // 0.05 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "2 minutes",
        requirements: ["system access"],
        tags: ["health", "monitoring", "diagnostics"],
      },
    },
    {
      agentId: "dream-keeper",
      agentName: "DreamKeeper",
      serviceName: "Dream Lifecycle Management",
      description: "Monitor and manage dream (project) lifecycle, detect issues, and suggest improvements.",
      category: "monitoring",
      price: "150000000000000000", // 0.15 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "10 minutes",
        requirements: ["dream ID"],
        tags: ["dreams", "lifecycle", "management"],
      },
    },

    // API Services
    {
      agentId: "dreamnet-api",
      agentName: "DreamNet API",
      serviceName: "Agent API Access",
      description: "Access to all 143 DreamNet agents via API. Pay per API call.",
      category: "api",
      price: "10000000000000000", // 0.01 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "instant",
        requirements: ["API key"],
        tags: ["api", "agents", "automation"],
      },
    },
    {
      agentId: "dreamnet-api",
      agentName: "DreamNet API",
      serviceName: "Base Blockchain Data API",
      description: "Real-time Base mainnet data queries. Transactions, balances, contract calls.",
      category: "api",
      price: "1000000000000000", // 0.001 X402
      chain: "base" as const,
      metadata: {
        estimatedDuration: "instant",
        requirements: ["query parameters"],
        tags: ["api", "blockchain", "base", "data"],
      },
    },
  ];

  console.log(`📝 Listing ${services.length} services...\n`);

  const results = {
    success: 0,
    failed: 0,
    services: [] as any[],
  };

  for (const service of services) {
    try {
      const listed = await agentMarketplace.listService(service);
      results.success++;
      results.services.push(listed);
      console.log(`✅ Listed: ${service.serviceName} (${service.price} X402)`);
    } catch (error: any) {
      results.failed++;
      console.error(`❌ Failed to list ${service.serviceName}: ${error.message}`);
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Success: ${results.success}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`\n💰 Services ready for monetization!\n`);

  // Get marketplace stats
  const stats = agentMarketplace.getStats();
  console.log(`📈 Marketplace Stats:`);
  console.log(`   Total Services: ${stats.totalServices}`);
  console.log(`   Active Services: ${stats.activeServices}`);
  console.log(`   Top Categories: ${stats.topCategories.map(c => `${c.category} (${c.count})`).join(", ")}`);
}

launchServices().catch(console.error);

