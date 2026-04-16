/**
 * @dreamnet/wolfpack-mailer-core — Email & Notification Engine
 * 
 * Handles outbound email campaigns, transactional emails,
 * and notification dispatch across the DreamNet swarm.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'wolfpack-mailer',
  name: 'DreamNet Wolfpack Mailer',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['email-send', 'email-template', 'notifications', 'campaigns'],
  metadata: { organ: 'digestive', role: 'mailer' },
});

export interface EmailMessage {
  to: string | string[];
  subject: string;
  body: string;
  html?: string;
  from?: string;
  replyTo?: string;
  tags?: string[];
}

export interface NotificationPayload {
  agentId: string;
  channel: 'email' | 'telegram' | 'discord' | 'push';
  title: string;
  body: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
  data?: any;
}

const sentLog: { to: string; subject: string; timestamp: number }[] = [];

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export async function sendEmail(msg: EmailMessage): Promise<{ sent: boolean; id?: string }> {
  // Actual send would use Resend, SendGrid, or SES
  const recipients = Array.isArray(msg.to) ? msg.to : [msg.to];
  sentLog.push({ to: recipients.join(','), subject: msg.subject, timestamp: Date.now() });
  await bridge.broadcast(`[MAIL] Sent to ${recipients.length} recipients: ${msg.subject}`, msg, 'low');
  return { sent: true };
}

export async function notify(payload: NotificationPayload): Promise<void> {
  await bridge.send(payload.agentId,
    `[NOTIFY] ${payload.title}: ${payload.body}`,
    'event', payload, payload.priority
  );
}

export function getSentLog(limit = 50): typeof sentLog {
  return sentLog.slice(-limit);
}

export { bridge };
export default { connect, sendEmail, notify, getSentLog, bridge };
