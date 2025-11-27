/**
 * Agent BGP - Border Gateway Protocol for Agents
 * 
 * Exports all types and interfaces for agent routing
 */

export type {
  AgentPrefix,
  AgentAutonomousSystem,
  AgentCapabilities,
  AgentNextHop,
  AgentRoute,
  AgentRouteAnnouncement,
  AgentInterchangeFormat,
} from "./AgentBGP.js";

export { RouteTable } from "./RouteTable.js";
export { RouteAnnouncementManager } from "./RouteAnnouncements.js";
export type { RoutingStrategy } from "./RoutingStrategies.js";
export {
  ShortestPathStrategy,
  LowestCostStrategy,
  HighestPriorityStrategy,
  WeightedStrategy,
} from "./RoutingStrategies.js";

