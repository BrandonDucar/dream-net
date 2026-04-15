export interface Agent {
  id: string;
  name: string;
  codename: string;
  description: string;
  status: "online" | "idle" | "error";
  lastAction: string;
  lastActionAt: Date;
  errorCount: number;
  scope: string[];
  trustScore?: number;
  accessLevel?: string;
}

export const mockAgents: Agent[] = [
  {
    id: "dreamkeeper",
    name: "DreamKeeper",
    codename: "Health Monitor",
    description: "Monitors dream health and system status",
    status: "online",
    lastAction: "Scanned 127 dreams for health metrics",
    lastActionAt: new Date(Date.now() - 5 * 60 * 1000),
    errorCount: 0,
    scope: ["infra", "health"],
    trustScore: 95,
    accessLevel: "Core",
  },
  {
    id: "deploykeeper",
    name: "DeployKeeper",
    codename: "DevOps Automation",
    description: "Manages deployments and infrastructure",
    status: "online",
    lastAction: "Validated Vercel deployment configuration",
    lastActionAt: new Date(Date.now() - 15 * 60 * 1000),
    errorCount: 0,
    scope: ["infra", "deployment"],
    trustScore: 92,
    accessLevel: "Core",
  },
  {
    id: "coinsensei",
    name: "CoinSensei",
    codename: "Wallet Intelligence",
    description: "Read-only wallet and portfolio analytics",
    status: "online",
    lastAction: "Analyzed 89 wallets for portfolio metrics",
    lastActionAt: new Date(Date.now() - 2 * 60 * 1000),
    errorCount: 0,
    scope: ["wallets", "analytics"],
    trustScore: 87,
    accessLevel: "Standard",
  },
  {
    id: "envkeeper",
    name: "EnvKeeper",
    codename: "Environment Manager",
    description: "Manages environment variables and secrets",
    status: "online",
    lastAction: "Validated environment configuration",
    lastActionAt: new Date(Date.now() - 30 * 60 * 1000),
    errorCount: 0,
    scope: ["infra", "env"],
    trustScore: 90,
    accessLevel: "Core",
  },
  {
    id: "jaggy",
    name: "Jaggy",
    codename: "Task Coordinator",
    description: "Coordinates workflows and task routing",
    status: "online",
    lastAction: "Routed 12 tasks to appropriate agents",
    lastActionAt: new Date(Date.now() - 1 * 60 * 1000),
    errorCount: 0,
    scope: ["comms", "coordination"],
    trustScore: 88,
    accessLevel: "Standard",
  },
  {
    id: "webhook-nervous",
    name: "Webhook Nervous",
    codename: "Webhook Manager",
    description: "Manages webhooks and external API coordination",
    status: "idle",
    lastAction: "Processed 5 webhook events",
    lastActionAt: new Date(Date.now() - 10 * 60 * 1000),
    errorCount: 0,
    scope: ["comms", "webhooks"],
    trustScore: 85,
    accessLevel: "Standard",
  },
  {
    id: "api-keeper",
    name: "API Keeper",
    codename: "API Manager",
    description: "Manages API endpoints, rate limiting, and monitoring",
    status: "online",
    lastAction: "Monitored 1,247 API requests",
    lastActionAt: new Date(Date.now() - 30 * 1000),
    errorCount: 0,
    scope: ["infra", "api"],
    trustScore: 93,
    accessLevel: "Core",
  },
];

