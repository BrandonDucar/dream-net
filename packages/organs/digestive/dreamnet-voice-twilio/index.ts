/**
 * @dreamnet/dreamnet-voice-twilio — Voice I/O via Twilio
 * 
 * Handles voice calls, SMS, and WhatsApp messaging through Twilio.
 * Ingests voice transcriptions and routes them through the bridge.
 */

import { createBridge } from '../../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'voice-twilio',
  name: 'DreamNet Voice (Twilio)',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['voice-calls', 'sms', 'whatsapp', 'transcription', 'tts'],
  metadata: { organ: 'digestive', role: 'voice-io', provider: 'twilio' },
});

export interface VoiceEvent {
  type: 'call-incoming' | 'call-ended' | 'sms-received' | 'whatsapp-received' | 'transcription';
  from: string;
  to: string;
  body?: string;
  duration?: number;
  recordingUrl?: string;
  timestamp: number;
}

export async function connect(): Promise<boolean> {
  return bridge.connectWithRetry(10, 5_000);
}

export async function handleVoiceEvent(event: VoiceEvent): Promise<void> {
  await bridge.broadcast(
    `[VOICE] ${event.type}: ${event.from} → ${event.to}${event.body ? ': ' + event.body.slice(0, 100) : ''}`,
    event,
    event.type === 'call-incoming' ? 'high' : 'normal'
  );
}

export async function sendSMS(to: string, body: string): Promise<void> {
  // Twilio send would go here — requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
  await bridge.broadcast(`[VOICE] SMS sent to ${to}: ${body.slice(0, 80)}`, { to, body, type: 'sms-sent' }, 'low');
}

export { bridge };
export default { connect, handleVoiceEvent, sendSMS, bridge };
