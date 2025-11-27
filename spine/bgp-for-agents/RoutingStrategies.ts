/**
 * Routing Strategies - Stubs for different routing algorithms
 * 
 * This will be filled by Antigravity with actual routing strategies.
 */

import type { AgentRoute, AgentPrefix } from "./AgentBGP.js";

/**
 * Routing strategy interface
 */
export interface RoutingStrategy {
  /**
   * Select best route from available routes
   * @param routes - Available routes
   * @param prefix - Prefix being routed
   * @returns Best route or undefined
   */
  selectRoute(routes: AgentRoute[], prefix: AgentPrefix): AgentRoute | undefined;
}

/**
 * Shortest Path Strategy - selects route with shortest path
 * Empty implementation - Antigravity will fill this
 */
export class ShortestPathStrategy implements RoutingStrategy {
  selectRoute(routes: AgentRoute[], prefix: AgentPrefix): AgentRoute | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

/**
 * Lowest Cost Strategy - selects route with lowest cost
 * Empty implementation - Antigravity will fill this
 */
export class LowestCostStrategy implements RoutingStrategy {
  selectRoute(routes: AgentRoute[], prefix: AgentPrefix): AgentRoute | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

/**
 * Highest Priority Strategy - selects route with highest priority
 * Empty implementation - Antigravity will fill this
 */
export class HighestPriorityStrategy implements RoutingStrategy {
  selectRoute(routes: AgentRoute[], prefix: AgentPrefix): AgentRoute | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

/**
 * Weighted Strategy - selects route using weighted combination
 * Empty implementation - Antigravity will fill this
 */
export class WeightedStrategy implements RoutingStrategy {
  selectRoute(routes: AgentRoute[], prefix: AgentPrefix): AgentRoute | undefined {
    throw new Error("Not implemented - Antigravity will implement");
  }
}

