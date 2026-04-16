/**
 * @dreamnet/legal-core — Legal Compliance & Policy Engine
 * 
 * Content moderation, terms enforcement, and regulatory compliance.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'legal-core',
  name: 'DreamNet Legal',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['content-moderation', 'terms-enforcement', 'compliance', 'policy-engine'],
  metadata: { organ: 'endocrine', role: 'legal' },
});

export interface PolicyRule { id: string; name: string; pattern: string; action: 'block' | 'flag' | 'log'; severity: 'low' | 'medium' | 'high'; }
export interface ComplianceCheck { content: string; passed: boolean; violations: string[]; timestamp: number; }

const policies: Map<string, PolicyRule> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }
export function addPolicy(rule: PolicyRule): void { policies.set(rule.id, rule); }

export async function check(content: string, agentId: string): Promise<ComplianceCheck> {
  const violations: string[] = [];
  for (const rule of policies.values()) {
    if (content.toLowerCase().includes(rule.pattern.toLowerCase())) {
      violations.push(rule.name);
      if (rule.action === 'block') {
        await bridge.send(agentId, `[LEGAL] Content blocked: ${rule.name}`, 'event', { rule: rule.id }, 'high');
      }
    }
  }
  return { content: content.slice(0, 50), passed: violations.length === 0, violations, timestamp: Date.now() };
}

export { bridge };
export default { connect, addPolicy, check, bridge };
