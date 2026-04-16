/**
 * @dreamnet/dreamnet-shield-health-bridge — Immune System Health Bridge
 * 
 * The immune system monitors threats, reputation, and system health.
 * This bridge connects security/health signals to the Sovereign Bridge.
 * 
 * Responsibilities:
 *   - Broadcast security alerts (unauthorized access, anomalies)
 *   - Report agent health scores to the swarm
 *   - Relay reputation lattice updates
 *   - Trigger circuit breakers on unhealthy agents
 *   - Snail-core intrusion detection signals
 */

import { RuntimeBridge, createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'immune-shield',
  name: 'DreamNet Shield Health Bridge',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['security-alerts', 'health-scores', 'reputation', 'circuit-breaker', 'intrusion-detection'],
  metadata: { organ: 'immune', subsystems: ['reputation-lattice', 'identity-grid', 'snail-core', 'shield'] },
});

export type ThreatLevel = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface SecurityAlert {
  type: 'unauthorized' | 'anomaly' | 'intrusion' | 'rate-limit' | 'token-leak' | 'replay';
  source: string;
  target: string;
  threatLevel: ThreatLevel;
  detail: string;
  timestamp: number;
}

export interface HealthScore {
  agentId: string;
  score: number; // 0-100
  factors: { name: string; score: number; weight: number }[];
  timestamp: number;
}

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export async function alertSecurity(alert: SecurityAlert): Promise<void> {
  const priority = alert.threatLevel === 'critical' ? 'critical'
    : alert.threatLevel === 'high' ? 'high' : 'normal';
  await bridge.broadcast(
    `[SHIELD] ${alert.type.toUpperCase()}: ${alert.detail}`,
    alert, priority as any
  );
}

export async function reportHealth(score: HealthScore): Promise<void> {
  await bridge.send(score.agentId,
    `Health score: ${score.score}/100`,
    'event', score, score.score < 50 ? 'high' : 'low'
  );

  // Auto-trip circuit breaker if health is critical
  if (score.score < 20) {
    await bridge.send('clawedette',
      `CRITICAL: ${score.agentId} health at ${score.score}/100 — recommend circuit breaker`,
      'command', { action: 'trip-circuit', agentId: score.agentId }, 'critical'
    );
  }
}

export async function updateReputation(agentId: string, delta: number, reason: string): Promise<void> {
  await bridge.broadcast(
    `[REPUTATION] ${agentId}: ${delta > 0 ? '+' : ''}${delta} (${reason})`,
    { agentId, delta, reason }, 'low'
  );
}

export { bridge };
export default { connect, alertSecurity, reportHealth, updateReputation, bridge };
