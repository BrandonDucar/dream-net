/**
 * Prometheus Metrics Collection
 * 
 * Provides metrics collection for DreamNet systems
 */

import { Registry, Counter, Histogram, Gauge } from "prom-client";

// Create default registry
export const register = new Registry();

// Default metrics (CPU, memory, etc.)
register.setDefaultLabels({
  app: "dreamnet",
});

// Collect default metrics
import { collectDefaultMetrics } from "prom-client";
collectDefaultMetrics({ register });

/**
 * HTTP Request Metrics
 */
export const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
});

export const httpRequestTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

/**
 * Agent Metrics
 */
export const agentExecutionsTotal = new Counter({
  name: "agent_executions_total",
  help: "Total number of agent executions",
  labelNames: ["agent_id", "status"],
  registers: [register],
});

export const agentExecutionDuration = new Histogram({
  name: "agent_execution_duration_seconds",
  help: "Duration of agent executions in seconds",
  labelNames: ["agent_id"],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register],
});

export const activeAgents = new Gauge({
  name: "active_agents",
  help: "Number of active agents",
  labelNames: ["agent_id"],
  registers: [register],
});

/**
 * Event Bus Metrics
 */
export const eventsPublishedTotal = new Counter({
  name: "events_published_total",
  help: "Total number of events published",
  labelNames: ["event_type", "source"],
  registers: [register],
});

export const eventsSubscribedTotal = new Counter({
  name: "events_subscribed_total",
  help: "Total number of events subscribed",
  labelNames: ["event_type"],
  registers: [register],
});

/**
 * Deployment Metrics
 */
export const deploymentsTotal = new Counter({
  name: "deployments_total",
  help: "Total number of deployments",
  labelNames: ["platform", "status"],
  registers: [register],
});

export const deploymentDuration = new Histogram({
  name: "deployment_duration_seconds",
  help: "Duration of deployments in seconds",
  labelNames: ["platform"],
  buckets: [10, 30, 60, 120, 300, 600],
  registers: [register],
});

/**
 * Database Metrics
 */
export const databaseQueriesTotal = new Counter({
  name: "database_queries_total",
  help: "Total number of database queries",
  labelNames: ["operation", "table"],
  registers: [register],
});

export const databaseQueryDuration = new Histogram({
  name: "database_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["operation", "table"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2],
  registers: [register],
});

/**
 * Get metrics as Prometheus format
 */
export async function getMetrics(): Promise<string> {
  return register.metrics();
}

