/**
 * Event Types - Typed event definitions for DreamNet event bus
 * 
 * Defines standard event types for agent-to-agent communication
 */

/**
 * Event Type - Type of event
 */
export type EventType =
  | "agent.task"
  | "agent.response"
  | "agent.capability"
  | "agent.status"
  | "agent.error"
  | "system.health"
  | "system.event"
  | "custom";

/**
 * Event Priority
 */
export type EventPriority = "low" | "normal" | "high" | "critical";

/**
 * DreamNet Event - Standard event structure
 */
export interface DreamNetEvent {
  /** Event ID */
  id: string;
  /** Event type */
  type: EventType;
  /** Event source */
  source: string;
  /** Event destination (optional for broadcasts) */
  destination?: string;
  /** Event payload */
  payload: Record<string, unknown>;
  /** Event priority */
  priority?: EventPriority;
  /** Event timestamp */
  timestamp: number;
  /** Event metadata */
  metadata?: Record<string, unknown>;
}

