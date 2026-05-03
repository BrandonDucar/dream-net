/**
 * Port Definitions
 * Charged ports for Env Keeper, API Keeper, and Vercel Agent
 */

import type { PortProfile } from "./types.js";

export const PORT_PROFILES: Record<string, PortProfile> = {
  ENVKEEPER_PORT: {
    id: "ENVKEEPER_PORT",
    name: "Env Keeper Port",
    description: "Governed port for environment variable management",
    direction: "egress",
    allowedTiers: ["OPERATOR", "GOD_MODE"],
    requiredCabinetIds: ["DATA_PRIVACY_CABINET"],
    limits: {
      maxRequestsPerMinute: 30,
      maxRequestsPerHour: 500,
    },
    priorityLane: 5,
    defaultSampleRate: 1.0,
    clusterId: "ENVKEEPER_CORE",
  },
  APIKEEPER_PORT: {
    id: "APIKEEPER_PORT",
    name: "API Keeper Port",
    description: "Governed port for API key management and rotation",
    direction: "egress",
    allowedTiers: ["OPERATOR", "GOD_MODE"],
    requiredCabinetIds: ["TREASURY_CABINET"],
    limits: {
      maxRequestsPerMinute: 60,
      maxRequestsPerHour: 1000,
    },
    priorityLane: 5,
    defaultSampleRate: 1.0,
    clusterId: "API_KEEPER",
  },
  VERCEL_PORT: {
    id: "VERCEL_PORT",
    name: "Vercel Agent Port",
    description: "Governed port for Vercel deployment management",
    direction: "egress",
    allowedTiers: ["OPERATOR", "GOD_MODE"],
    requiredOfficeIds: ["FOUNDER", "MINISTER_OF_WOLF_OPERATIONS"],
    limits: {
      maxRequestsPerMinute: 20,
      maxRequestsPerHour: 200,
    },
    priorityLane: 5,
    defaultSampleRate: 1.0,
    clusterId: "DEPLOYKEEPER_CORE",
  },
  // 🚀 NEW: External Collaboration Ports
  NOTION_PORT: {
    id: "NOTION_PORT",
    name: "Notion Integration Port",
    description: "Governed port for Notion workspace access",
    direction: "egress",
    allowedTiers: ["OPERATOR", "GOD_MODE"],
    limits: {
      maxRequestsPerMinute: 10,
      maxRequestsPerHour: 100,
    },
    priorityLane: 4,
    defaultSampleRate: 1.0,
    clusterId: "EXTERNAL_INTEGRATION",
  },
  SLACK_PORT: {
    id: "SLACK_PORT",
    name: "Slack Comms Port",
    description: "Governed port for Slack messaging and status updates",
    direction: "egress",
    allowedTiers: ["OPERATOR", "GOD_MODE"],
    limits: {
      maxRequestsPerMinute: 20,
      maxRequestsPerHour: 500,
    },
    priorityLane: 4,
    defaultSampleRate: 1.0,
    clusterId: "EXTERNAL_INTEGRATION",
  },
  LINEAR_PORT: {
    id: "LINEAR_PORT",
    name: "Linear Task Port",
    description: "Governed port for Linear issue tracking and project management",
    direction: "egress",
    allowedTiers: ["OPERATOR", "GOD_MODE"],
    limits: {
      maxRequestsPerMinute: 30,
      maxRequestsPerHour: 1000,
    },
    priorityLane: 4,
    defaultSampleRate: 1.0,
    clusterId: "EXTERNAL_INTEGRATION",
  },
  NEON_DATABASE_PORT: {
    id: "NEON_DATABASE_PORT",
    name: "Neon Database Port",
    description: "Governed port for high-fidelity Neon database operations",
    direction: "egress",
    allowedTiers: ["OPERATOR", "GOD_MODE"],
    limits: {
      maxRequestsPerMinute: 200,
      maxRequestsPerHour: 10000,
    },
    priorityLane: 5,
    defaultSampleRate: 1.0,
    clusterId: "DATABASE_CORE",
  },
  SWARM_RESEARCH_PORT: {
    id: "SWARM_RESEARCH_PORT",
    name: "17k Swarm Research Port",
    description: "High-concurrency port for autonomous research task forces",
    direction: "egress",
    allowedTiers: ["OPERATOR", "GOD_MODE"],
    limits: {
      maxRequestsPerMinute: 1000,
      maxRequestsPerHour: 50000,
      maxConcurrentRequests: 500,
    },
    priorityLane: 3,
    defaultSampleRate: 0.1,
    clusterId: "SWARM_INTELLIGENCE",
  },
  AGENT_GATEWAY: {
    id: "AGENT_GATEWAY",
    name: "Agent Gateway",
    description: "High-bandwidth, AI-native ingress for ChatGPT, Cursor, Replit agents, and other DreamNet-integrated AIs",
    direction: "ingress",
    allowedTiers: ["BUILDER", "OPERATOR", "GOD_MODE"],
    requiredOfficeIds: [],
    requiredCabinetIds: [],
    limits: {
      maxRequestsPerMinute: 600,
      maxRequestsPerHour: 10000,
      maxConcurrentRequests: 100,
      costBudgetPerMinute: 0, // TODO: wire to real cost tracking later
    },
    priorityLane: 3,
    defaultSampleRate: 0.3,
    clusterId: "API_KEEPER",
  },
};

export function getPortProfile(portId: string): PortProfile | undefined {
  return PORT_PROFILES[portId];
}

