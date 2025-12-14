/**
 * Observability
 * 
 * Session tracking, logs, traces, performance metrics
 */

import type { AgentSession, Interaction } from './types';

const sessions: Map<string, AgentSession> = new Map();

/**
 * Create agent session
 */
export function createSession(agentId: string, metadata?: Record<string, any>): string {
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  
  const session: AgentSession = {
    sessionId,
    agentId,
    startTime: Date.now(),
    interactions: [],
    metadata,
  };
  
  sessions.set(sessionId, session);
  
  return sessionId;
}

/**
 * Add interaction to session
 */
export function addInteraction(
  sessionId: string,
  input: string,
  output: string,
  latency: number,
  tokensUsed?: number
): void {
  const session = sessions.get(sessionId);
  if (!session) return;
  
  const interaction: Interaction = {
    id: `interaction-${Date.now()}`,
    timestamp: Date.now(),
    input,
    output,
    latency,
    tokensUsed,
  };
  
  session.interactions.push(interaction);
}

/**
 * End session
 */
export function endSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.endTime = Date.now();
  }
}

/**
 * Get session
 */
export function getSession(sessionId: string): AgentSession | undefined {
  return sessions.get(sessionId);
}

/**
 * Get all active sessions
 */
export function getActiveSessions(): AgentSession[] {
  return Array.from(sessions.values()).filter(s => !s.endTime);
}

