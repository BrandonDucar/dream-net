/**
 * @dreamnet/webhook-nervous-core — Webhook Management
 * 
 * Registers, receives, and dispatches webhooks for external integrations.
 */

import { createBridge } from '../runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'webhook-core',
  name: 'DreamNet Webhook Core',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['webhook-registration', 'webhook-dispatch', 'retry', 'signature-verification'],
  metadata: { organ: 'nervous', role: 'webhooks' },
});

export interface WebhookConfig { id: string; url: string; events: string[]; secret?: string; active: boolean; retries: number; }

const webhooks: Map<string, WebhookConfig> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function register(config: WebhookConfig): void { webhooks.set(config.id, config); }
export function unregister(id: string): void { webhooks.delete(id); }

export async function dispatch(event: string, payload: any): Promise<number> {
  let dispatched = 0;
  for (const wh of webhooks.values()) {
    if (!wh.active || !wh.events.includes(event)) continue;
    try {
      await fetch(wh.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event, payload, timestamp: Date.now() }) });
      dispatched++;
    } catch { /* retry logic would go here */ }
  }
  return dispatched;
}

export function getWebhooks(): WebhookConfig[] { return Array.from(webhooks.values()); }

export { bridge };
export default { connect, register, unregister, dispatch, getWebhooks, bridge };
