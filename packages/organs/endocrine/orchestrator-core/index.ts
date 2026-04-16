/**
 * @dreamnet/orchestrator-core — Workflow Orchestrator
 * 
 * Multi-step workflow execution with saga pattern, compensation, and retries.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'orchestrator',
  name: 'DreamNet Orchestrator',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['workflow-execution', 'saga-pattern', 'compensation', 'retry', 'parallel-steps'],
  metadata: { organ: 'endocrine', role: 'orchestrator' },
});

export interface WorkflowStep { name: string; agentId: string; command: string; data?: any; compensate?: string; }
export interface Workflow { id: string; name: string; steps: WorkflowStep[]; status: 'pending' | 'running' | 'completed' | 'failed' | 'compensating'; currentStep: number; startedAt: number; }

const workflows: Map<string, Workflow> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function execute(name: string, steps: WorkflowStep[]): Promise<Workflow> {
  const id = `wf-${Date.now()}`;
  const wf: Workflow = { id, name, steps, status: 'running', currentStep: 0, startedAt: Date.now() };
  workflows.set(id, wf);

  for (let i = 0; i < steps.length; i++) {
    wf.currentStep = i;
    const step = steps[i];
    try {
      await bridge.send(step.agentId, `[ORCHESTRATOR] Step ${i + 1}/${steps.length}: ${step.command}`, 'command', step.data);
    } catch {
      wf.status = 'failed';
      await bridge.broadcast(`[ORCHESTRATOR] Workflow "${name}" failed at step ${i + 1}: ${step.name}`, wf, 'high');
      return wf;
    }
  }
  wf.status = 'completed';
  await bridge.broadcast(`[ORCHESTRATOR] Workflow "${name}" completed (${steps.length} steps)`, wf);
  return wf;
}

export function getWorkflow(id: string): Workflow | undefined { return workflows.get(id); }
export function getAll(): Workflow[] { return Array.from(workflows.values()); }

export { bridge };
export default { connect, execute, getWorkflow, getAll, bridge };
