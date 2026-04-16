/**
 * @dreamnet/inbox-squared-core — Unified Inbox Aggregator
 * 
 * Aggregates messages from all channels (Telegram, Discord, Farcaster, email, bridge)
 * into a single prioritized inbox per agent.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'inbox-squared',
  name: 'DreamNet Inbox²',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['inbox-aggregation', 'priority-sorting', 'dedup', 'threading'],
  metadata: { organ: 'digestive', role: 'inbox-aggregator' },
});

export interface InboxItem {
  id: string;
  channel: 'telegram' | 'discord' | 'farcaster' | 'lens' | 'email' | 'bridge' | 'web';
  from: string;
  subject?: string;
  body: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  read: boolean;
  timestamp: number;
  threadId?: string;
}

const inboxes: Map<string, InboxItem[]> = new Map();

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export function pushToInbox(agentId: string, item: InboxItem): void {
  if (!inboxes.has(agentId)) inboxes.set(agentId, []);
  const inbox = inboxes.get(agentId)!;
  // Dedup by id
  if (!inbox.find(i => i.id === item.id)) {
    inbox.push(item);
    inbox.sort((a, b) => {
      const p = { critical: 0, high: 1, normal: 2, low: 3 };
      return (p[a.priority] - p[b.priority]) || (b.timestamp - a.timestamp);
    });
  }
}

export function getInbox(agentId: string, unreadOnly = false): InboxItem[] {
  const inbox = inboxes.get(agentId) || [];
  return unreadOnly ? inbox.filter(i => !i.read) : inbox;
}

export function markRead(agentId: string, itemId: string): void {
  const inbox = inboxes.get(agentId) || [];
  const item = inbox.find(i => i.id === itemId);
  if (item) item.read = true;
}

export function getStats(agentId: string): { total: number; unread: number; byChannel: Record<string, number> } {
  const inbox = inboxes.get(agentId) || [];
  const byChannel: Record<string, number> = {};
  inbox.forEach(i => { byChannel[i.channel] = (byChannel[i.channel] || 0) + 1; });
  return { total: inbox.length, unread: inbox.filter(i => !i.read).length, byChannel };
}

export { bridge };
export default { connect, pushToInbox, getInbox, markRead, getStats, bridge };
