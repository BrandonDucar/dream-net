export type APICategory = 
  | "sms" 
  | "email" 
  | "social" 
  | "ai" 
  | "blockchain" 
  | "payment" 
  | "storage" 
  | "analytics" 
  | "search" 
  | "other";

export type APIProviderStatus = "active" | "inactive" | "deprecated" | "testing";

export type APIKeyStatus = "active" | "expired" | "rate-limited" | "quota-exceeded" | "invalid";

export interface APIPricing {
  freeTier?: {
    requests: number;      // Requests per month
    features: string[];    // What's included
  };
  paidTiers: {
    name: string;          // "Starter", "Pro", "Enterprise"
    price: number;          // Monthly price in USD
    requests: number;       // Requests per month
    pricePerRequest?: number; // Cost per request (if pay-per-use)
    features: string[];
  }[];
  payPerUse?: {
    pricePerRequest: number;  // USD per request
    pricePer1k?: number;      // USD per 1k requests
  };
}

export interface APIProvider {
  id: string;
  name: string;              // "Twilio", "SendGrid", "OpenAI", etc.
  category: APICategory;
  status: APIProviderStatus;
  description: string;
  website: string;
  documentationUrl: string;
  pricing: APIPricing;
  
  // Capabilities
  features: string[];         // ["sms", "voice", "whatsapp"]
  supportedRegions?: string[]; // ["US", "EU", "global"]
  rateLimits?: {
    requestsPerSecond?: number;
    requestsPerMinute?: number;
    requestsPerHour?: number;
    requestsPerDay?: number;
  };
  
  // Quality metrics
  reliability: number;        // 0-1 (uptime, success rate)
  latency: number;            // Average response time in ms
  quality: number;           // 0-1 (overall quality score)
  
  // Discovery
  discoveredAt: number;
  lastCheckedAt: number;
  meta?: Record<string, any>;
}

export interface APIKey {
  id: string;
  providerId: string;         // Which provider this key belongs to
  name: string;               // User-friendly name
  key: string;                // Encrypted API key
  secret?: string;            // Encrypted secret (if needed)
  status: APIKeyStatus;
  
  // Usage tracking
  usageCount: number;         // Total requests made
  usageThisMonth: number;    // Requests this month
  quotaLimit?: number;        // Monthly quota limit
  quotaUsed?: number;         // Quota used this month
  
  // Cost tracking
  costThisMonth: number;      // USD spent this month
  costTotal: number;          // Total USD spent
  
  // Rate limiting
  rateLimitResetAt?: number;  // When rate limit resets
  rateLimitRemaining?: number;
  
  // Metadata
  createdAt: number;
  lastUsedAt: number;
  expiresAt?: number;
  tags?: string[];           // ["production", "testing", "backup"]
  meta?: Record<string, any>;
}

export interface APIRequest {
  id: string;
  category: APICategory;
  operation: string;          // "send-sms", "send-email", "generate-text"
  params: Record<string, any>;
  
  // Routing
  preferredProvider?: string; // Provider ID if specified
  requiredFeatures?: string[]; // Features needed
  maxCost?: number;           // Maximum cost willing to pay
  priority: "low" | "medium" | "high" | "critical";
  
  // Result
  providerUsed?: string;
  keyUsed?: string;
  success: boolean;
  response?: any;
  error?: string;
  cost?: number;             // Actual cost of this request
  latency?: number;          // Response time in ms
  
  requestedAt: number;
  completedAt?: number;
}

export interface APIRoutingDecision {
  providerId: string;
  keyId: string;
  reason: string;             // Why this provider/key was chosen
  estimatedCost: number;
  confidence: number;        // 0-1 (how confident we are this is best)
  alternatives?: {
    providerId: string;
    keyId: string;
    estimatedCost: number;
    reason: string;
  }[];
}

export interface APIRailGuard {
  id: string;
  name: string;
  type: "daily-cost" | "monthly-cost" | "rate-limit" | "quota" | "quality" | "custom";
  limit: number;             // Limit value
  current: number;           // Current value
  action: "block" | "warn" | "route-to-backup" | "throttle";
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface APIKeeperContext {
  dreamStateCore?: any;      // For governance integration
  spiderWebCore?: any;       // For thread creation
  economicEngineCore?: any;  // For cost tracking
}

export interface APIKeeperStatus {
  lastRunAt: number | null;
  providerCount: number;
  activeProviderCount: number;
  keyCount: number;
  activeKeyCount: number;
  totalRequests: number;
  requestsToday: number;
  costToday: number;
  costThisMonth: number;
  railGuardsActive: number;
  recentRequests: APIRequest[];
  topProviders: {
    providerId: string;
    requestCount: number;
    cost: number;
  }[];
}

