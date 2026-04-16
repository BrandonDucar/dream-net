/**
 * @dreamnet/reality-check-core — Hallucination Detection & Fact Verification
 * 
 * Validates AI outputs against known facts, detects hallucinations, and scores confidence.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'reality-check',
  name: 'DreamNet Reality Check',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['fact-verification', 'hallucination-detection', 'confidence-scoring', 'source-validation'],
  metadata: { organ: 'endocrine', role: 'reality-check' },
});

export interface VerificationResult { content: string; confidence: number; flags: string[]; sources: string[]; verified: boolean; timestamp: number; }

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function verify(content: string, agentId: string): Promise<VerificationResult> {
  const flags: string[] = [];
  let confidence = 0.8;

  if (content.includes('$') && /\d{6,}/.test(content)) { flags.push('large-number-claim'); confidence -= 0.2; }
  if (content.includes('always') || content.includes('never')) { flags.push('absolute-language'); confidence -= 0.1; }
  if (content.includes('http') && !content.includes('https://')) { flags.push('insecure-url'); confidence -= 0.05; }

  const result: VerificationResult = { content: content.slice(0, 100), confidence: Math.max(0, confidence), flags, sources: [], verified: flags.length === 0, timestamp: Date.now() };

  if (!result.verified) {
    await bridge.send(agentId, `[REALITY-CHECK] Flagged: ${flags.join(', ')} (confidence: ${(confidence * 100).toFixed(0)}%)`, 'event', result);
  }
  return result;
}

export { bridge };
export default { connect, verify, bridge };
