/**
 * @dreamnet/env-keeper-core — Environment & Secrets Manager
 * 
 * Centralized env var management, secret rotation, and config distribution.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'env-keeper',
  name: 'DreamNet Env Keeper',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['env-management', 'secret-rotation', 'config-distribution', 'validation'],
  metadata: { organ: 'endocrine', role: 'env-keeper' },
});

const configs: Map<string, Record<string, string>> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function setConfig(agentId: string, key: string, value: string): void {
  if (!configs.has(agentId)) configs.set(agentId, {});
  configs.get(agentId)![key] = value;
}

export function getConfig(agentId: string, key: string): string | undefined {
  return configs.get(agentId)?.[key];
}

export function getAllConfig(agentId: string): Record<string, string> {
  return { ...configs.get(agentId) };
}

export async function rotateSecret(agentId: string, key: string, newValue: string): Promise<void> {
  setConfig(agentId, key, newValue);
  await bridge.send(agentId, `[ENV] Secret rotated: ${key}`, 'event', { key, rotatedAt: Date.now() }, 'high');
}

export function validate(agentId: string, requiredKeys: string[]): { valid: boolean; missing: string[] } {
  const cfg = configs.get(agentId) || {};
  const missing = requiredKeys.filter(k => !cfg[k]);
  return { valid: missing.length === 0, missing };
}

export { bridge };
export default { connect, setConfig, getConfig, getAllConfig, rotateSecret, validate, bridge };
