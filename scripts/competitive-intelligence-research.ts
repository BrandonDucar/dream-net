/**
 * Competitive Intelligence Deep Dive Research Script
 * Researches top companies in all verticals DreamNet impacts
 */

import { CompetitiveIntelligenceCore } from "@dreamnet/competitive-intelligence-core";

// Define companies to research by vertical
const COMPANIES_BY_VERTICAL = {
  "AI/ML Platforms": [
    "OpenAI",
    "Anthropic",
    "Google DeepMind",
    "LangChain",
    "AutoGPT",
    "Microsoft Copilot",
    "GitHub Copilot",
    "Amazon Bedrock",
  ],
  "Web3/Blockchain": [
    "Base",
    "Optimism",
    "Coinbase",
    "Uniswap",
    "Aave",
    "Polygon",
    "Solana",
  ],
  "Multi-Agent Systems": [
    "AutoGPT",
    "BabyAGI",
    "CrewAI",
    "Microsoft AutoGen",
    "LangGraph",
    "AgentGPT",
    "SuperAGI",
  ],
  "Security & Threat Detection": [
    "Cloudflare",
    "CrowdStrike",
    "SentinelOne",
    "Palo Alto Networks",
    "Akamai",
    "Snyk",
  ],
  "DevOps & Infrastructure": [
    "Vercel",
    "Netlify",
    "Railway",
    "Google Cloud",
    "AWS",
    "Azure",
    "Kubernetes",
  ],
  "Data Intelligence": [
    "Databricks",
    "Snowflake",
    "Tableau",
    "Splunk",
    "Elastic",
  ],
  "Travel & Hospitality": [
    "Booking.com",
    "Expedia",
    "Airbnb",
    "TripAdvisor",
    "Kayak",
    "Hopper",
  ],
  "OTT & Streaming": [
    "Netflix",
    "Disney+",
    "Hulu",
    "Amazon Prime Video",
    "YouTube",
    "Spotify",
  ],
  "Precious Metals": [
    "Kitco",
    "APMEX",
    "JM Bullion",
    "Goldmoney",
    "BullionVault",
  ],
  "Financial Services": [
    "Stripe",
    "Square",
    "PayPal",
    "Plaid",
    "Robinhood",
    "Bloomberg",
  ],
  "Social Media": [
    "Meta",
    "Twitter",
    "LinkedIn",
    "Discord",
    "Farcaster",
    "Lens Protocol",
  ],
  "E-commerce": [
    "Amazon",
    "eBay",
    "Shopify",
    "Etsy",
    "Alibaba",
  ],
  "Healthcare": [
    "Epic",
    "Cerner",
    "23andMe",
    "Teladoc",
  ],
  "Military & Defense": [
    "Palantir",
    "Anduril",
    "Lockheed Martin",
    "C3.ai",
  ],
  "Gaming": [
    "Epic Games",
    "Unity",
    "Roblox",
    "Steam",
  ],
};

async function researchAllCompanies() {
  const core = new CompetitiveIntelligenceCore();
  const results: Record<string, any[]> = {};

  console.log("🔍 Starting Competitive Intelligence Deep Dive Research...\n");

  for (const [vertical, companies] of Object.entries(COMPANIES_BY_VERTICAL)) {
    console.log(`\n📊 Researching ${vertical} vertical (${companies.length} companies)...`);
    results[vertical] = [];

    for (const company of companies) {
      try {
        console.log(`  🔎 Researching ${company}...`);
        
        // Research company
        const research = await core.researchCompany(company, {
          includePatents: true,
          includeFinancials: true,
          includeSocialMedia: true,
          includeJobPostings: true,
        });

        results[vertical].push({
          company,
          research,
        });

        console.log(`  ✅ ${company} research complete`);
      } catch (error: any) {
        console.error(`  ❌ Error researching ${company}:`, error.message);
        results[vertical].push({
          company,
          error: error.message,
        });
      }

      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log("\n✅ Research complete! Analyzing findings...\n");

  // Analyze all findings
  const analysis = await core.analyzeCompanies(
    Object.values(results).flat().map(r => r.research).filter(Boolean)
  );

  // Find opportunities
  const opportunities = await core.findOpportunities(analysis);

  // Generate roadmap
  const roadmap = await core.generateRoadmap(opportunities);

  return {
    research: results,
    analysis,
    opportunities,
    roadmap,
  };
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  researchAllCompanies()
    .then((results) => {
      console.log("\n📋 Research Summary:");
      console.log(`   Verticals: ${Object.keys(results.research).length}`);
      console.log(`   Companies: ${Object.values(results.research).flat().length}`);
      console.log(`   Opportunities: ${results.opportunities.length}`);
      console.log(`   Roadmap Items: ${results.roadmap.length}`);
      
      // Save results
      const fs = await import("fs");
      fs.writeFileSync(
        "competitive-intelligence-results.json",
        JSON.stringify(results, null, 2)
      );
      console.log("\n💾 Results saved to competitive-intelligence-results.json");
    })
    .catch((error) => {
      console.error("❌ Research failed:", error);
      process.exit(1);
    });
}

export { researchAllCompanies, COMPANIES_BY_VERTICAL };

