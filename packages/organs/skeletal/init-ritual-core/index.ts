/**
 * @dreamnet/init-ritual-core — System Bootstrap & Initialization
 * 
 * Orchestrates the boot sequence for all organs and services.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'init-ritual',
  name: 'DreamNet Init Ritual',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['boot-sequence', 'dependency-resolution', 'health-gates', 'rollback'],
  metadata: { organ: 'skeletal', role: 'init-ritual' },
});

export interface BootStep { name: string; organ: string; init: () => Promise<boolean>; required: boolean; order: number; }
export interface BootResult { step: string; success: boolean; durationMs: number; error?: string; }

const bootSteps: BootStep[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function registerStep(step: BootStep): void {
  bootSteps.push(step);
  bootSteps.sort((a, b) => a.order - b.order);
}

export async function executeBootSequence(): Promise<BootResult[]> {
  const results: BootResult[] = [];
  for (const step of bootSteps) {
    const start = Date.now();
    try {
      const ok = await step.init();
      results.push({ step: step.name, success: ok, durationMs: Date.now() - start });
      if (!ok && step.required) {
        await bridge.broadcast(`[BOOT] FAILED required step: ${step.name}`, { step: step.name }, 'critical');
        break;
      }
    } catch (err: any) {
      results.push({ step: step.name, success: false, durationMs: Date.now() - start, error: err.message });
      if (step.required) break;
    }
  }
  await bridge.broadcast(`[BOOT] Sequence complete: ${results.filter(r => r.success).length}/${results.length} steps`, results);
  return results;
}

export { bridge };
export default { connect, registerStep, executeBootSequence, bridge };
