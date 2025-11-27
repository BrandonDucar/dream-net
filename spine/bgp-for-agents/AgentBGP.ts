/**
 * Agent BGP (Border Gateway Protocol for Agents)
 * 
 * This module defines the core types and interfaces for agent routing,
 * inspired by the Border Gateway Protocol (BGP) used in network routing.
 * 
 * BGP Analogy:
 * - Agents = Autonomous Systems (AS) in BGP
 * - Agent Routes = Network routes in BGP
 * - Route Announcements = BGP route advertisements
 * - Next Hops = Next router in BGP path
 * - Capabilities Exchange = BGP capabilities negotiation
 * 
 * This is PURE TYPES - NO LOGIC IMPLEMENTATION
 */

/**
 * Agent Prefix - Identifies a capability or service namespace
 * Similar to IP prefix in BGP (e.g., "code.generation", "data.analysis")
 */
export type AgentPrefix = string;

/**
 * Agent Autonomous System - Unique identifier for an agent system
 * Similar to AS number in BGP (e.g., "dreamnet-lucid", "antigravity-core")
 */
export type AgentAutonomousSystem = string;

/**
 * Agent Capabilities - What an agent can do
 * Similar to BGP capabilities (e.g., ["code", "analysis", "deployment"])
 */
export interface AgentCapabilities {
  /** List of capability names */
  capabilities: string[];
  /** Version of capabilities */
  version?: string;
  /** Metadata about capabilities */
  metadata?: Record<string, unknown>;
}

/**
 * Agent Next Hop - Where to route a request next
 * Similar to BGP next hop (the next router in the path)
 */
export interface AgentNextHop {
  /** Agent system identifier */
  agentSystem: AgentAutonomousSystem;
  /** Priority/weight for this hop */
  priority?: number;
  /** Cost/metric for this hop */
  cost?: number;
  /** Additional routing metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Agent Route - A routing entry for agent requests
 * Similar to BGP route entry
 */
export interface AgentRoute {
  /** The prefix this route matches */
  prefix: AgentPrefix;
  /** The agent system that can handle this prefix */
  agentSystem: AgentAutonomousSystem;
  /** Path to reach this agent (list of AS hops) */
  path: AgentAutonomousSystem[];
  /** Next hop information */
  nextHop: AgentNextHop;
  /** Route origin timestamp */
  originTime: number;
  /** Route attributes */
  attributes?: Record<string, unknown>;
}

/**
 * Agent Route Announcement - Advertisement of routing capability
 * Similar to BGP UPDATE message
 */
export interface AgentRouteAnnouncement {
  /** Unique announcement ID */
  id: string;
  /** Agent system making the announcement */
  agentSystem: AgentAutonomousSystem;
  /** Routes being announced */
  routes: AgentRoute[];
  /** Timestamp of announcement */
  timestamp: number;
  /** Withdrawal flag (true = withdrawing routes) */
  withdrawn?: boolean;
}

/**
 * Agent Interchange Format - Standard format for agent communication
 * Similar to BGP message format
 */
export interface AgentInterchangeFormat {
  /** Message type */
  type: "announcement" | "withdrawal" | "capability" | "keepalive";
  /** Source agent system */
  source: AgentAutonomousSystem;
  /** Destination agent system (optional for broadcasts) */
  destination?: AgentAutonomousSystem;
  /** Message payload */
  payload: AgentRouteAnnouncement | AgentCapabilities | Record<string, unknown>;
  /** Message timestamp */
  timestamp: number;
  /** Message signature/authentication */
  signature?: string;
}

