/**
 * @dreamnet/agent-gateway — Digestive Agent Gateway
 * 
 * Central ingestion point for all external agent requests.
 * Routes incoming messages to the correct internal organ/service.
 */

import { RuntimeBridge, createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'agent-gateway',
  name: 'DreamNet Agent Gateway',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['routing', 'ingestion', 'protocol-translation', 'rate-limiting'],
  metadata: { organ: 'digestive', role: 'gateway' },
});

export interface IncomingRequest {
  source: 'telegram' | 'discord' | 'farcaster' | 'lens' | 'web' | 'api' | 'bridge';
  agentId: string;
  payload: any;
  timestamp: number;
}

export interface RouteRule {
  pattern: string;
  target: string;
  priority: number;
}

const routes: RouteRule[] = [];

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export function addRoute(rule: RouteRule): void {
  routes.push(rule);
  routes.sort((a, b) => b.priority - a.priority);
}

export async function ingest(request: IncomingRequest): Promise<{ routed: boolean; target?: string }> {
  const matched = routes.find(r => request.payload?.type?.includes(r.pattern) || request.source === r.pattern);
  if (matched) {
    await bridge.send(matched.target, `Routed from ${request.source}: ${JSON.stringify(request.payload).slice(0, 200)}`, 'relay', request);
    return { routed: true, target: matched.target };
  }
  // Default: broadcast to all agents
  await bridge.broadcast(`Unrouted request from ${request.source}`, request, 'low');
  return { routed: false };
}

export async function getRoutes(): Promise<RouteRule[]> {
  return routes;
}

export { bridge };
export default { connect, addRoute, ingest, getRoutes, bridge };
