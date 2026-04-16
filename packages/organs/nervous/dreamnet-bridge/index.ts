/**
 * @dreamnet/dreamnet-bridge — Nervous System Bridge Adapter
 * 
 * The nervous system is the core signal relay of DreamNet.
 * This bridge connects the nervous subsystem (dream-cortex, halo-loop,
 * narrative-field, field-layer) to the Sovereign Bridge.
 * 
 * Responsibilities:
 *   - Relay cortex signals (thoughts, decisions) to other agents
 *   - Forward narrative events to the bridge audit trail
 *   - Sync halo-loop state across the swarm
 *   - Provide real-time neural activity feed via SSE
 */

const BRIDGE_URL = process.env.BRIDGE_URL || process.env.CLAWEDETTE_API_URL || 'http://clawedette-api:3100';
const ORGAN_ID = 'nervous-system';

export interface NeuralSignal {
  type: 'thought' | 'decision' | 'reflex' | 'dream' | 'narrative';
  source: string;
  content: string;
  intensity: number; // 0-1
  timestamp: number;
  data?: any;
}

async function post(path: string, body: any): Promise<any> {
  const res = await fetch(`${BRIDGE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(path: string): Promise<any> {
  const res = await fetch(`${BRIDGE_URL}${path}`);
  return res.json();
}

export async function registerNervousSystem(): Promise<void> {
  await post('/bridge/register', {
    agentId: ORGAN_ID,
    name: 'DreamNet Nervous System',
    type: 'sidecar',
    version: '1.0.0',
    capabilities: ['cortex-relay', 'narrative-sync', 'halo-loop', 'neural-feed'],
    metadata: { organ: 'nervous', subsystems: ['dream-cortex', 'halo-loop', 'narrative-field', 'field-layer'] },
  });
}

export async function emitSignal(signal: NeuralSignal): Promise<void> {
  await post('/bridge/broadcast', {
    from: ORGAN_ID,
    content: `[${signal.type.toUpperCase()}] ${signal.content}`,
    data: signal,
    priority: signal.intensity > 0.8 ? 'critical' : signal.intensity > 0.5 ? 'high' : 'normal',
  });
}

export async function relayToAgent(agentId: string, signal: NeuralSignal): Promise<void> {
  await post('/bridge/relay', {
    from: ORGAN_ID,
    to: agentId,
    content: `Neural relay: ${signal.content}`,
    data: signal,
  });
}

export async function heartbeat(metadata?: any): Promise<{ inbox: number; tasks: number }> {
  const result = await post('/bridge/heartbeat', { agentId: ORGAN_ID, status: 'online', metadata });
  return { inbox: result.inbox || 0, tasks: result.tasks || 0 };
}

export async function getSwarmState(): Promise<any> {
  return get('/bridge/agents');
}

export default { registerNervousSystem, emitSignal, relayToAgent, heartbeat, getSwarmState };
