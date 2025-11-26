/**
 * Seed Competitive Intelligence Core with all companies to research
 * This populates the database with companies across all verticals
 */

import { CompetitiveIntelligenceCore } from "@dreamnet/competitive-intelligence-core";
import type { Company } from "@dreamnet/competitive-intelligence-core";

const COMPANIES: Company[] = [
  // AI/ML Platforms
  { id: "openai", name: "OpenAI", vertical: "AI/ML Platforms", website: "https://openai.com", description: "AI research and deployment company", status: "active", lastUpdated: Date.now() },
  { id: "anthropic", name: "Anthropic", vertical: "AI/ML Platforms", website: "https://anthropic.com", description: "AI safety and research company", status: "active", lastUpdated: Date.now() },
  { id: "google-deepmind", name: "Google DeepMind", vertical: "AI/ML Platforms", website: "https://deepmind.google", description: "AI research lab", status: "active", lastUpdated: Date.now() },
  { id: "langchain", name: "LangChain", vertical: "AI/ML Platforms", website: "https://langchain.com", description: "LLM application framework", status: "active", lastUpdated: Date.now() },
  { id: "autogpt", name: "AutoGPT", vertical: "AI/ML Platforms", website: "https://autogpt.net", description: "Autonomous AI agent", status: "active", lastUpdated: Date.now() },
  { id: "microsoft-copilot", name: "Microsoft Copilot", vertical: "AI/ML Platforms", website: "https://copilot.microsoft.com", description: "AI assistant", status: "active", lastUpdated: Date.now() },
  { id: "github-copilot", name: "GitHub Copilot", vertical: "AI/ML Platforms", website: "https://github.com/features/copilot", description: "AI pair programmer", status: "active", lastUpdated: Date.now() },
  { id: "amazon-bedrock", name: "Amazon Bedrock", vertical: "AI/ML Platforms", website: "https://aws.amazon.com/bedrock", description: "Foundation model service", status: "active", lastUpdated: Date.now() },

  // Web3/Blockchain
  { id: "base", name: "Base", vertical: "Web3/Blockchain", website: "https://base.org", description: "Coinbase L2 blockchain", status: "active", lastUpdated: Date.now() },
  { id: "optimism", name: "Optimism", vertical: "Web3/Blockchain", website: "https://optimism.io", description: "Ethereum L2", status: "active", lastUpdated: Date.now() },
  { id: "arbitrum", name: "Arbitrum", vertical: "Web3/Blockchain", website: "https://arbitrum.io", description: "Ethereum L2", status: "active", lastUpdated: Date.now() },
  { id: "coinbase", name: "Coinbase", vertical: "Web3/Blockchain", website: "https://coinbase.com", description: "Cryptocurrency exchange", status: "active", lastUpdated: Date.now() },
  { id: "uniswap", name: "Uniswap", vertical: "Web3/Blockchain", website: "https://uniswap.org", description: "Decentralized exchange", status: "active", lastUpdated: Date.now() },
  { id: "aave", name: "Aave", vertical: "Web3/Blockchain", website: "https://aave.com", description: "DeFi lending protocol", status: "active", lastUpdated: Date.now() },
  { id: "polygon", name: "Polygon", vertical: "Web3/Blockchain", website: "https://polygon.technology", description: "Ethereum scaling solution", status: "active", lastUpdated: Date.now() },
  { id: "solana", name: "Solana", vertical: "Web3/Blockchain", website: "https://solana.com", description: "High-performance blockchain", status: "active", lastUpdated: Date.now() },

  // Security & Threat Detection
  { id: "cloudflare", name: "Cloudflare", vertical: "Security & Threat Detection", website: "https://cloudflare.com", description: "CDN and security services", status: "active", lastUpdated: Date.now() },
  { id: "crowdstrike", name: "CrowdStrike", vertical: "Security & Threat Detection", website: "https://crowdstrike.com", description: "Endpoint detection and response", status: "active", lastUpdated: Date.now() },
  { id: "sentinelone", name: "SentinelOne", vertical: "Security & Threat Detection", website: "https://sentinelone.com", description: "AI-powered security platform", status: "active", lastUpdated: Date.now() },
  { id: "palo-alto", name: "Palo Alto Networks", vertical: "Security & Threat Detection", website: "https://paloaltonetworks.com", description: "Cybersecurity company", status: "active", lastUpdated: Date.now() },
  { id: "akamai", name: "Akamai", vertical: "Security & Threat Detection", website: "https://akamai.com", description: "CDN and cloud services", status: "active", lastUpdated: Date.now() },
  { id: "snyk", name: "Snyk", vertical: "Security & Threat Detection", website: "https://snyk.io", description: "DevSecOps platform", status: "active", lastUpdated: Date.now() },

  // DevOps & Infrastructure
  { id: "vercel", name: "Vercel", vertical: "DevOps & Infrastructure", website: "https://vercel.com", description: "Frontend cloud platform", status: "active", lastUpdated: Date.now() },
  { id: "netlify", name: "Netlify", vertical: "DevOps & Infrastructure", website: "https://netlify.com", description: "JAMstack platform", status: "active", lastUpdated: Date.now() },
  { id: "railway", name: "Railway", vertical: "DevOps & Infrastructure", website: "https://railway.app", description: "Deployment platform", status: "active", lastUpdated: Date.now() },
  { id: "google-cloud", name: "Google Cloud", vertical: "DevOps & Infrastructure", website: "https://cloud.google.com", description: "Cloud computing platform", status: "active", lastUpdated: Date.now() },
  { id: "aws", name: "AWS", vertical: "DevOps & Infrastructure", website: "https://aws.amazon.com", description: "Amazon Web Services", status: "active", lastUpdated: Date.now() },
  { id: "azure", name: "Azure", vertical: "DevOps & Infrastructure", website: "https://azure.microsoft.com", description: "Microsoft cloud platform", status: "active", lastUpdated: Date.now() },

  // Travel & Hospitality
  { id: "booking", name: "Booking.com", vertical: "Travel & Hospitality", website: "https://booking.com", description: "Travel booking platform", status: "active", lastUpdated: Date.now() },
  { id: "expedia", name: "Expedia", vertical: "Travel & Hospitality", website: "https://expedia.com", description: "Travel booking platform", status: "active", lastUpdated: Date.now() },
  { id: "airbnb", name: "Airbnb", vertical: "Travel & Hospitality", website: "https://airbnb.com", description: "Short-term rental platform", status: "active", lastUpdated: Date.now() },
  { id: "tripadvisor", name: "TripAdvisor", vertical: "Travel & Hospitality", website: "https://tripadvisor.com", description: "Travel review platform", status: "active", lastUpdated: Date.now() },
  { id: "kayak", name: "Kayak", vertical: "Travel & Hospitality", website: "https://kayak.com", description: "Travel search engine", status: "active", lastUpdated: Date.now() },
  { id: "hopper", name: "Hopper", vertical: "Travel & Hospitality", website: "https://hopper.com", description: "AI travel booking app", status: "active", lastUpdated: Date.now() },

  // OTT & Streaming
  { id: "netflix", name: "Netflix", vertical: "OTT & Streaming", website: "https://netflix.com", description: "Streaming service", status: "active", lastUpdated: Date.now() },
  { id: "disney-plus", name: "Disney+", vertical: "OTT & Streaming", website: "https://disneyplus.com", description: "Streaming service", status: "active", lastUpdated: Date.now() },
  { id: "hulu", name: "Hulu", vertical: "OTT & Streaming", website: "https://hulu.com", description: "Streaming service", status: "active", lastUpdated: Date.now() },
  { id: "amazon-prime", name: "Amazon Prime Video", vertical: "OTT & Streaming", website: "https://primevideo.com", description: "Streaming service", status: "active", lastUpdated: Date.now() },
  { id: "youtube", name: "YouTube", vertical: "OTT & Streaming", website: "https://youtube.com", description: "Video platform", status: "active", lastUpdated: Date.now() },
  { id: "spotify", name: "Spotify", vertical: "OTT & Streaming", website: "https://spotify.com", description: "Music streaming", status: "active", lastUpdated: Date.now() },

  // Precious Metals
  { id: "kitco", name: "Kitco", vertical: "Precious Metals", website: "https://kitco.com", description: "Precious metals news and prices", status: "active", lastUpdated: Date.now() },
  { id: "apmex", name: "APMEX", vertical: "Precious Metals", website: "https://apmex.com", description: "Bullion dealer", status: "active", lastUpdated: Date.now() },
  { id: "jm-bullion", name: "JM Bullion", vertical: "Precious Metals", website: "https://jmbullion.com", description: "Bullion dealer", status: "active", lastUpdated: Date.now() },
  { id: "goldmoney", name: "Goldmoney", vertical: "Precious Metals", website: "https://goldmoney.com", description: "Digital gold platform", status: "active", lastUpdated: Date.now() },

  // Financial Services
  { id: "stripe", name: "Stripe", vertical: "Financial Services", website: "https://stripe.com", description: "Payment processing", status: "active", lastUpdated: Date.now() },
  { id: "square", name: "Square", vertical: "Financial Services", website: "https://squareup.com", description: "Payment and POS systems", status: "active", lastUpdated: Date.now() },
  { id: "paypal", name: "PayPal", vertical: "Financial Services", website: "https://paypal.com", description: "Payment platform", status: "active", lastUpdated: Date.now() },
  { id: "plaid", name: "Plaid", vertical: "Financial Services", website: "https://plaid.com", description: "Banking API platform", status: "active", lastUpdated: Date.now() },
  { id: "robinhood", name: "Robinhood", vertical: "Financial Services", website: "https://robinhood.com", description: "Trading platform", status: "active", lastUpdated: Date.now() },
  { id: "bloomberg", name: "Bloomberg", vertical: "Financial Services", website: "https://bloomberg.com", description: "Financial data and news", status: "active", lastUpdated: Date.now() },

  // Social Media
  { id: "meta", name: "Meta", vertical: "Social Media", website: "https://meta.com", description: "Social media company", status: "active", lastUpdated: Date.now() },
  { id: "twitter", name: "Twitter/X", vertical: "Social Media", website: "https://twitter.com", description: "Social network", status: "active", lastUpdated: Date.now() },
  { id: "linkedin", name: "LinkedIn", vertical: "Social Media", website: "https://linkedin.com", description: "Professional network", status: "active", lastUpdated: Date.now() },
  { id: "discord", name: "Discord", vertical: "Social Media", website: "https://discord.com", description: "Community platform", status: "active", lastUpdated: Date.now() },
  { id: "farcaster", name: "Farcaster", vertical: "Social Media", website: "https://farcaster.xyz", description: "Decentralized social protocol", status: "active", lastUpdated: Date.now() },

  // E-commerce
  { id: "amazon", name: "Amazon", vertical: "E-commerce", website: "https://amazon.com", description: "E-commerce marketplace", status: "active", lastUpdated: Date.now() },
  { id: "ebay", name: "eBay", vertical: "E-commerce", website: "https://ebay.com", description: "Online marketplace", status: "active", lastUpdated: Date.now() },
  { id: "shopify", name: "Shopify", vertical: "E-commerce", website: "https://shopify.com", description: "E-commerce platform", status: "active", lastUpdated: Date.now() },
  { id: "etsy", name: "Etsy", vertical: "E-commerce", website: "https://etsy.com", description: "Handmade marketplace", status: "active", lastUpdated: Date.now() },

  // Healthcare
  { id: "epic", name: "Epic", vertical: "Healthcare", website: "https://epic.com", description: "EHR systems", status: "active", lastUpdated: Date.now() },
  { id: "23andme", name: "23andMe", vertical: "Healthcare", website: "https://23andme.com", description: "Genetic testing", status: "active", lastUpdated: Date.now() },
  { id: "teladoc", name: "Teladoc", vertical: "Healthcare", website: "https://teladoc.com", description: "Telemedicine platform", status: "active", lastUpdated: Date.now() },

  // Military & Defense
  { id: "palantir", name: "Palantir", vertical: "Military & Defense", website: "https://palantir.com", description: "Data analytics platform", status: "active", lastUpdated: Date.now() },
  { id: "anduril", name: "Anduril", vertical: "Military & Defense", website: "https://anduril.com", description: "Defense technology", status: "active", lastUpdated: Date.now() },
  { id: "c3-ai", name: "C3.ai", vertical: "Military & Defense", website: "https://c3.ai", description: "Enterprise AI platform", status: "active", lastUpdated: Date.now() },

  // Gaming
  { id: "epic-games", name: "Epic Games", vertical: "Gaming", website: "https://epicgames.com", description: "Game engine and store", status: "active", lastUpdated: Date.now() },
  { id: "unity", name: "Unity", vertical: "Gaming", website: "https://unity.com", description: "Game engine", status: "active", lastUpdated: Date.now() },
  { id: "roblox", name: "Roblox", vertical: "Gaming", website: "https://roblox.com", description: "User-generated games platform", status: "active", lastUpdated: Date.now() },
];

async function seedCompanies() {
  const core = new CompetitiveIntelligenceCore();

  console.log(`🌱 Seeding ${COMPANIES.length} companies into Competitive Intelligence Core...\n`);

  for (const company of COMPANIES) {
    core.addCompany(company);
    console.log(`  ✅ Added ${company.name} (${company.vertical})`);
  }

  console.log(`\n✅ Seeded ${COMPANIES.length} companies across ${new Set(COMPANIES.map(c => c.vertical)).size} verticals`);

  // Store globally for API access
  (global as any).competitiveIntelligenceCore = core;

  return core;
}

// Run if executed directly
if (import.meta.url.endsWith(process.argv[1]) || import.meta.url.includes("seed-competitive-companies")) {
  seedCompanies()
    .then(() => {
      console.log("\n🎉 Company seeding complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export { seedCompanies, COMPANIES };

