/**
 * Port Definitions
 * Charged ports for Env Keeper, API Keeper, and Vercel Agent
 */

import type { PortProfile } from "./types";

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

