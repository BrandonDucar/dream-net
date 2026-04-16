/**
 * @dreamnet/muscular — Compute Execution Engine
 * 
 * Raw compute power. Executes heavy tasks, batch processing, and GPU workloads.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'muscular',
  name: 'DreamNet Muscular System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['compute-execution', 'batch-processing', 'gpu-dispatch', 'worker-pool'],
  metadata: { organ: 'muscular', role: 'compute-engine' },
});

export interface ComputeJob { id: string; type: string; payload: any; priority: number; status: 'queued' | 'running' | 'completed' | 'failed'; submittedAt: number; completedAt?: number; result?: any; }

const jobQueue: ComputeJob[] = [];
const completedJobs: ComputeJob[] = [];

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function submitJob(job: ComputeJob): void {
  jobQueue.push(job);
  jobQueue.sort((a, b) => b.priority - a.priority);
}

export async function processNext(): Promise<ComputeJob | undefined> {
  const job = jobQueue.shift();
  if (!job) return undefined;
  job.status = 'running';
  await bridge.broadcast(`[MUSCULAR] Processing: ${job.type} (${job.id})`, job, 'low');
  return job;
}

export function completeJob(id: string, result: any): void {
  const idx = jobQueue.findIndex(j => j.id === id);
  if (idx >= 0) {
    const job = jobQueue.splice(idx, 1)[0];
    job.status = 'completed'; job.result = result; job.completedAt = Date.now();
    completedJobs.push(job);
  }
}

export function getQueueDepth(): number { return jobQueue.length; }

export { bridge };
export default { connect, submitJob, processNext, completeJob, getQueueDepth, bridge };
