/**
 * Instant Wormhole Delivery System
 * 
 * Zero-delay event routing - events flow instantly through wormholes.
 * No staging, no queuing - pure instant delivery.
 */

import { instantMesh } from "./InstantMesh";
import type { InstantEvent } from "./InstantMesh";

export interface WormholeRoute {
  id: string;
  from: {
    source?: string;
    type?: string;
    pattern?: string; // Regex pattern
  };
  to: {
    target: string;
    transform?: (event: InstantEvent) => InstantEvent;
  };
  enabled: boolean;
  priority: number;
}

class InstantWormhole {
  private routes: Map<string, WormholeRoute> = new Map();
  private routeIndex: WormholeRoute[] = [];

  constructor() {
    this.initializeDefaultRoutes();
    this.subscribeToMesh();
  }

  /**
   * Initialize default instant routes
   */
  private initializeDefaultRoutes(): void {
    // Dream events → All agents instantly
    this.addRoute({
      id: "dream-to-agents",
      from: { type: "dream.*" },
      to: { target: "*" }, // All agents
      enabled: true,
      priority: 10,
    });

    // Agent events → Super Spine instantly
    this.addRoute({
      id: "agent-to-spine",
      from: { type: "agent.*" },
      to: { target: "super-spine" },
      enabled: true,
      priority: 10,
    });

    // Reward events → Metrics instantly
    this.addRoute({
      id: "reward-to-metrics",
      from: { type: "reward.*" },
      to: { target: "metrics-engine" },
      enabled: true,
      priority: 10,
    });

    // Fleet events → All fleets instantly
    this.addRoute({
      id: "fleet-broadcast",
      from: { type: "fleet.*" },
      to: { target: "*" },
      enabled: true,
      priority: 10,
    });

    // Hybrid events → Mesh instantly
    this.addRoute({
      id: "hybrid-to-mesh",
      from: { type: "agent.hybrid.*" },
      to: { target: "*" },
      enabled: true,
      priority: 10,
    });
  }

  /**
   * Subscribe to instant mesh events
   */
  private subscribeToMesh(): void {
    instantMesh.subscribe("*", (event) => {
      this.routeInstantly(event);
    });
  }

  /**
   * Route event instantly through matching wormholes
   */
  private routeInstantly(event: InstantEvent): void {
    // Find matching routes (sorted by priority)
    const matches = this.routeIndex
      .filter((route) => this.matchesRoute(event, route))
      .sort((a, b) => b.priority - a.priority);

    // Deliver instantly through all matching wormholes
    for (const route of matches) {
      if (!route.enabled) continue;

      let transformedEvent = event;
      if (route.to.transform) {
        transformedEvent = route.to.transform(event);
      }

      // Instant delivery
      this.deliver(route.to.target, transformedEvent);
    }
  }

  /**
   * Check if event matches route
   */
  private matchesRoute(event: InstantEvent, route: WormholeRoute): boolean {
    if (route.from.source && event.source !== route.from.source) {
      return false;
    }

    if (route.from.type) {
      if (route.from.pattern) {
        const regex = new RegExp(route.from.pattern);
        if (!regex.test(event.type)) return false;
      } else if (route.from.type.endsWith(".*")) {
        const prefix = route.from.type.slice(0, -2);
        if (!event.type.startsWith(prefix)) return false;
      } else if (event.type !== route.from.type) {
        return false;
      }
    }

    return true;
  }

  /**
   * Deliver event instantly to target
   */
  private deliver(target: string, event: InstantEvent): void {
    // Instant delivery - emit to mesh for target
    instantMesh.emit({
      source: "wormhole",
      target,
      type: `wormhole.delivered.${event.type}`,
      payload: {
        originalEvent: event,
        deliveredAt: Date.now(),
      },
    });
  }

  /**
   * Add wormhole route
   */
  addRoute(route: WormholeRoute): void {
    this.routes.set(route.id, route);
    this.routeIndex.push(route);
    this.routeIndex.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Remove route
   */
  removeRoute(id: string): void {
    this.routes.delete(id);
    this.routeIndex = this.routeIndex.filter((r) => r.id !== id);
  }

  /**
   * Get all routes
   */
  getRoutes(): WormholeRoute[] {
    return Array.from(this.routes.values());
  }
}

// Export singleton
export const instantWormhole = new InstantWormhole();

