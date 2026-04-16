/**
 * @dreamnet/voice — Voice & Audio Processing
 * 
 * Text-to-speech, speech-to-text, and audio processing for agent communication.
 */

import { createBridge } from '../nervous/runtime-bridge-core/index.js';

const bridge = createBridge({
  agentId: 'voice',
  name: 'DreamNet Voice System',
  type: 'sidecar',
  version: '1.0.0',
  capabilities: ['tts', 'stt', 'audio-processing', 'voice-cloning'],
  metadata: { organ: 'voice', role: 'audio' },
});

export async function connect(): Promise<boolean> { return bridge.connectWithRetry(10, 5_000); }

export async function textToSpeech(text: string, voice = 'default'): Promise<string> {
  await bridge.broadcast(`[VOICE] TTS: ${text.slice(0, 60)}`, { text, voice }, 'low');
  return '';
}

export async function speechToText(audioUrl: string): Promise<string> {
  await bridge.broadcast(`[VOICE] STT: ${audioUrl}`, { audioUrl }, 'low');
  return '';
}

export { bridge };
export default { connect, textToSpeech, speechToText, bridge };
