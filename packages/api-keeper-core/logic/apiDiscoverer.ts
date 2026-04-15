import { APIProvider, APICategory } from "../types";
import { APIStore } from "../store/apiStore";

/**
 * Discover and register known API providers
 * In production, this could scrape API directories, read configs, etc.
 */
export function discoverAPIs(): APIProvider[] {
  const discovered: APIProvider[] = [];

  // SMS Providers
  discovered.push({
    id: "twilio",
    name: "Twilio",
    category: "sms",
    status: "active",
    description: "Cloud communications platform for SMS, voice, WhatsApp",
    website: "https://www.twilio.com",
    documentationUrl: "https://www.twilio.com/docs",
    pricing: {
      freeTier: {
        requests: 0,
        features: [],
      },
      paidTiers: [
        {
          name: "Pay-as-you-go",
          price: 0,
          requests: Infinity,
          pricePerRequest: 0.0075, // $0.0075 per SMS in US
          features: ["sms", "voice", "whatsapp"],
        },
      ],
      payPerUse: {
        pricePerRequest: 0.0075,
        pricePer1k: 7.5,
      },
    },
    features: ["sms", "voice", "whatsapp", "mms"],
    supportedRegions: ["US", "EU", "global"],
    rateLimits: {
      requestsPerSecond: 100,
      requestsPerMinute: 6000,
    },
    reliability: 0.99,
    latency: 200,
    quality: 0.95,
    discoveredAt: Date.now(),
    lastCheckedAt: Date.now(),
  });

  discovered.push({
    id: "sendgrid",
    name: "SendGrid",
    category: "email",
    status: "active",
    description: "Email delivery service",
    website: "https://sendgrid.com",
    documentationUrl: "https://docs.sendgrid.com",
    pricing: {
      freeTier: {
        requests: 100,
        features: ["email"],
      },
      paidTiers: [
        {
          name: "Essentials",
          price: 19.95,
          requests: 50000,
          pricePerRequest: 0.0004,
          features: ["email", "analytics"],
        },
      ],
    },
    features: ["email", "analytics"],
    reliability: 0.98,
    latency: 150,
    quality: 0.92,
    discoveredAt: Date.now(),
    lastCheckedAt: Date.now(),
  });

  discovered.push({
    id: "openai",
    name: "OpenAI",
    category: "ai",
    status: "active",
    description: "AI models (GPT-4, DALL-E, etc.)",
    website: "https://openai.com",
    documentationUrl: "https://platform.openai.com/docs",
    pricing: {
      paidTiers: [
        {
          name: "Pay-as-you-go",
          price: 0,
          requests: Infinity,
          pricePerRequest: 0.03, // Approximate for GPT-4
          features: ["text-generation", "embeddings", "images"],
        },
      ],
      payPerUse: {
        pricePerRequest: 0.03,
        pricePer1k: 30,
      },
    },
    features: ["text-generation", "embeddings", "images", "moderation"],
    reliability: 0.97,
    latency: 2000,
    quality: 0.98,
    discoveredAt: Date.now(),
    lastCheckedAt: Date.now(),
  });

  discovered.push({
    id: "anthropic",
    name: "Anthropic",
    category: "ai",
    status: "active",
    description: "Claude AI models",
    website: "https://anthropic.com",
    documentationUrl: "https://docs.anthropic.com",
    pricing: {
      paidTiers: [
        {
          name: "Pay-as-you-go",
          price: 0,
          requests: Infinity,
          pricePerRequest: 0.015, // Approximate for Claude
          features: ["text-generation"],
        },
      ],
      payPerUse: {
        pricePerRequest: 0.015,
        pricePer1k: 15,
      },
    },
    features: ["text-generation"],
    reliability: 0.98,
    latency: 1800,
    quality: 0.97,
    discoveredAt: Date.now(),
    lastCheckedAt: Date.now(),
  });

  discovered.push({
    id: "telegram-bot",
    name: "Telegram Bot API",
    category: "social",
    status: "active",
    description: "Telegram bot messaging",
    website: "https://core.telegram.org/bots",
    documentationUrl: "https://core.telegram.org/bots/api",
    pricing: {
      freeTier: {
        requests: Infinity,
        features: ["messaging", "files"],
      },
    },
    features: ["messaging", "files", "groups"],
    reliability: 0.99,
    latency: 300,
    quality: 0.95,
    discoveredAt: Date.now(),
    lastCheckedAt: Date.now(),
  });

  discovered.push({
    id: "twitter-api",
    name: "Twitter API v2",
    category: "social",
    status: "active",
    description: "Twitter/X API for tweets, mentions, etc.",
    website: "https://developer.twitter.com",
    documentationUrl: "https://developer.twitter.com/en/docs",
    pricing: {
      freeTier: {
        requests: 1500,
        features: ["read"],
      },
      paidTiers: [
        {
          name: "Basic",
          price: 100,
          requests: 10000,
          features: ["read", "write"],
        },
      ],
    },
    features: ["tweets", "mentions", "timeline"],
    reliability: 0.95,
    latency: 500,
    quality: 0.90,
    discoveredAt: Date.now(),
    lastCheckedAt: Date.now(),
  });

  discovered.push({
    id: "vercel",
    name: "Vercel API",
    category: "other",
    status: "active",
    description: "Vercel deployment and project management API",
    website: "https://vercel.com",
    documentationUrl: "https://vercel.com/docs/rest-api",
    pricing: {
      freeTier: {
        requests: Infinity,
        features: ["deployments", "projects"],
      },
    },
    features: ["deployments", "projects", "domains"],
    reliability: 0.99,
    latency: 200,
    quality: 0.95,
    discoveredAt: Date.now(),
    lastCheckedAt: Date.now(),
  });

  // Register all discovered providers
  for (const provider of discovered) {
    const existing = APIStore.getProvider(provider.id);
    if (!existing) {
      APIStore.addProvider(provider);
      console.log(`[APIDiscoverer] Discovered provider: ${provider.name} (${provider.category})`);
    } else {
      // Update last checked
      APIStore.updateProvider(provider.id, { lastCheckedAt: Date.now() });
    }
  }

  return discovered;
}

/**
 * Search for providers by category or feature
 */
export function searchProviders(
  category?: APICategory,
  feature?: string
): APIProvider[] {
  let results = APIStore.listProviders();

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  if (feature) {
    results = results.filter((p) => p.features.includes(feature));
  }

  return results;
}

