/**
 * @dreamnet/octopus-executor — Parallel Task Executor
 * 
 * Executes multiple tasks in parallel across agents with result aggregation.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'octopus-executor',
  name: 'DreamNet Octopus Executor',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['parallel-execution', 'result-aggregation', 'fan-out', 'map-reduce'],
  metadata: { organ: 'respiratory', role: 'parallel-executor' },
});

export interface ExecutionTask { agentId: string; command: string; data?: any; timeoutMs?: number; }
export interface ExecutionResult { agentId: string; success: boolean; result?: any; error?: string; durationMs: number; }

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function fanOut(tasks: ExecutionTask[]): Promise<ExecutionResult[]> {
  const results: ExecutionResult[] = [];
  const promises = tasks.map(async (task) => {
    const start = Date.now();
    try {
      await bridge.send(task.agentId, task.command, 'command', task.data);
      results.push({ agentId: task.agentId, success: true, durationMs: Date.now() - start });
    } catch (err: any) {
      results.push({ agentId: task.agentId, success: false, error: err.message, durationMs: Date.now() - start });
    }
  });
  await Promise.allSettled(promises);
  return results;
}

export async function mapReduce(agentIds: string[], command: string, data?: any): Promise<{ results: ExecutionResult[]; successRate: number }> {
  const tasks = agentIds.map(agentId => ({ agentId, command, data }));
  const results = await fanOut(tasks);
  const successRate = results.filter(r => r.success).length / results.length;
  return { results, successRate };
}

export { bridge };
export default { connect, fanOut, mapReduce, bridge };
