/**
 * @dreamnet/dreamnet-os-core — DreamNet Operating System Core
 * 
 * Core OS primitives: process management, IPC, filesystem abstraction.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'os-core',
  name: 'DreamNet OS Core',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['process-management', 'ipc', 'filesystem', 'resource-limits'],
  metadata: { organ: 'skeletal', role: 'os-core' },
});

export interface Process { pid: string; name: string; agentId: string; status: 'running' | 'stopped' | 'crashed'; startedAt: number; memoryMB: number; cpuPercent: number; }

const processes: Map<string, Process> = new Map();

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export function registerProcess(proc: Process): void { processes.set(proc.pid, proc); }
export function killProcess(pid: string): void { const p = processes.get(pid); if (p) p.status = 'stopped'; }
export function getProcess(pid: string): Process | undefined { return processes.get(pid); }
export function listProcesses(): Process[] { return Array.from(processes.values()); }

export function getSystemLoad(): { totalMemoryMB: number; totalCpuPercent: number; processCount: number } {
  const running = Array.from(processes.values()).filter(p => p.status === 'running');
  return {
    totalMemoryMB: running.reduce((s, p) => s + p.memoryMB, 0),
    totalCpuPercent: running.reduce((s, p) => s + p.cpuPercent, 0),
    processCount: running.length,
  };
}

export { bridge };
export default { connect, registerProcess, killProcess, getProcess, listProcesses, getSystemLoad, bridge };
