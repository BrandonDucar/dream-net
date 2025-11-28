/**
 * Route Table - In-memory routing table for agent routes
 * 
 * Phase I implementation: Simple in-memory storage with basic lookup.
 */

import type { AgentRoute, AgentPrefix, AgentAutonomousSystem } from "./AgentBGP.js";

/**
 * Route Table - Manages agent routing table
 * 
 * Phase I: Simple in-memory storage with first-match lookup.
 * Can evolve to longest-prefix matching in Phase II.
 */
export class RouteTable {
  private routes: Map<AgentPrefix, AgentRoute[]> = new Map();

  constructor() {
    // In-memory only, no initialization needed
  }

  /**
   * Add a route to the table
   * @param route - Route to add
   */
  addRoute(route: AgentRoute): void {
    const prefix = route.prefix;
    if (!this.routes.has(prefix)) {
      this.routes.set(prefix, []);
    }
    const routesForPrefix = this.routes.get(prefix)!;
    
    // Check if route already exists (same agentSystem and prefix)
    const exists = routesForPrefix.some(
      r => r.prefix === route.prefix && r.agentSystem === route.agentSystem
    );
    
    if (!exists) {
      routesForPrefix.push(route);
    }
  }

  /**
   * Remove a route from the table
   * @param prefix - Prefix to remove routes for
   * @param agentSystem - Optional: only remove routes for this agent system
   */
  removeRoute(prefix: AgentPrefix, agentSystem?: AgentAutonomousSystem): void {
    const routesForPrefix = this.routes.get(prefix);
    if (!routesForPrefix) {
      return;
    }

    if (agentSystem) {
      // Remove only routes for this agent system
      const filtered = routesForPrefix.filter(r => r.agentSystem !== agentSystem);
      if (filtered.length === 0) {
        this.routes.delete(prefix);
      } else {
        this.routes.set(prefix, filtered);
      }
    } else {
      // Remove all routes for this prefix
      this.routes.delete(prefix);
    }
  }

  /**
   * Lookup route for a prefix
   * 
   * Phase I: Simple first-match lookup.
   * Phase II: Can evolve to longest-prefix matching.
   * 
   * @param prefix - Prefix to lookup
   * @returns First matching route or undefined
   */
  lookup(prefix: AgentPrefix): AgentRoute | undefined {
    // Exact match first
    const exactRoutes = this.routes.get(prefix);
    if (exactRoutes && exactRoutes.length > 0) {
      return exactRoutes[0];
    }

    // Simple prefix matching: find routes where prefix starts with the lookup prefix
    // or where the lookup prefix starts with the route prefix
    for (const [routePrefix, routes] of this.routes.entries()) {
      if (prefix.startsWith(routePrefix) || routePrefix.startsWith(prefix)) {
        if (routes.length > 0) {
          return routes[0];
        }
      }
    }

    return undefined;
  }

  /**
   * Get all routes for a prefix
   * @param prefix - Prefix to lookup
   * @returns Array of routes for this prefix
   */
  getRoutesForPrefix(prefix: AgentPrefix): AgentRoute[] {
    return this.routes.get(prefix) ?? [];
  }

  /**
   * Get all routes in table
   * @returns Array of all routes
   */
  getAllRoutes(): AgentRoute[] {
    const allRoutes: AgentRoute[] = [];
    for (const routes of this.routes.values()) {
      allRoutes.push(...routes);
    }
    return allRoutes;
  }

  /**
   * Clear all routes
   */
  clear(): void {
    this.routes.clear();
  }

  /**
   * Get count of prefixes in table
   */
  getPrefixCount(): number {
    return this.routes.size;
  }

  /**
   * Get count of total routes
   */
  getRouteCount(): number {
    let count = 0;
    for (const routes of this.routes.values()) {
      count += routes.length;
    }
    return count;
  }
}

