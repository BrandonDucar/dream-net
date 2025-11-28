/**
 * Route Announcements - Functions for handling route advertisements
 * 
 * Phase I implementation: Simple event emission for route announcements.
 */

import type { AgentRoute } from "./AgentBGP.js";
import type { DreamEventBus } from "../dreamnet-event-bus/DreamEventBus.js";
import { createEventEnvelope } from "../dreamnet-event-bus/EventEnvelope.js";

/**
 * Announce a route via the event bus
 * 
 * Publishes an "Agent.Route.Announced" event with route information.
 * 
 * @param route - Route to announce
 * @param eventBus - Event bus to publish to
 */
export function announceRoute(route: AgentRoute, eventBus: DreamEventBus): void {
  const event = createEventEnvelope({
    type: "Agent.Route.Announced",
    source: route.agentSystem,
    payload: {
      prefix: route.prefix,
      agentSystem: route.agentSystem,
      path: route.path,
      nextHop: route.nextHop,
      originTime: route.originTime,
      attributes: route.attributes,
    },
  });
  eventBus.publish(event);
}

/**
 * Withdraw a route via the event bus
 * 
 * Publishes an "Agent.Route.Withdrawn" event with route information.
 * 
 * @param route - Route to withdraw
 * @param eventBus - Event bus to publish to
 */
export function withdrawRoute(route: AgentRoute, eventBus: DreamEventBus): void {
  const event = createEventEnvelope({
    type: "Agent.Route.Withdrawn",
    source: route.agentSystem,
    payload: {
      prefix: route.prefix,
      agentSystem: route.agentSystem,
      path: route.path,
      nextHop: route.nextHop,
    },
  });
  eventBus.publish(event);
}

