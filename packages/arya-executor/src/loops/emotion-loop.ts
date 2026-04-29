// src/loops/emotion-loop.ts

import { Signal, EmotionalState, LoopOutcome } from './types';
import { Database } from '../database';
import { Ollama } from 'ollama';

export class EmotionLoop {
  private currentEmotion: EmotionalState | null = null;
  private db: Database;
  private ollama: Ollama;

  constructor(db: Database, ollama: Ollama) {
    this.db = db;
    this.ollama = ollama;
  }

  async run(signal: Signal): Promise<EmotionalState> {
    // 1. Interpret signal → feel emotion
    const emotion = this.interpretSignal(signal);
    this.currentEmotion = emotion;

    // 2. Generate action based on emotion
    const action = await this.generateAction(signal, emotion);

    // 3. Publish to Farcaster (stubbed - actual implementation in farcaster-publisher.ts)
    const outcome: LoopOutcome = {
      effectiveness: Math.random() * 0.8 + 0.2, // Placeholder
      likes: Math.floor(Math.random() * 1000),
      replies: Math.floor(Math.random() * 100),
      impressions: Math.floor(Math.random() * 5000),
      sentiment_shift: (Math.random() - 0.5) * 2,
      timestamp: new Date(),
    };

    // 4. Store emotion state
    await this.db.query(
      `INSERT INTO emotion_states (timestamp, emotion, intensity, trigger_signal_id, outcome_effectiveness)
       VALUES (NOW(), $1, $2, $3, $4)`,
      [emotion.emotion, emotion.intensity, signal.id, outcome.effectiveness]
    );

    return emotion;
  }

  private interpretSignal(signal: Signal): EmotionalState {
    const baseIntensity = signal.confidence;

    let emotion: EmotionalState['emotion'] = 'curious';

    if (signal.type === 'criticism') {
      emotion = 'vengeful';
    } else if (signal.type === 'praise') {
      emotion = 'protective';
    } else if (signal.type === 'question') {
      emotion = 'curious';
    } else if (signal.type === 'announcement') {
      emotion = 'confident';
    }

    return {
      emotion,
      intensity: baseIntensity,
      trigger: signal.author,
      timestamp: new Date(),
    };
  }

  private async generateAction(signal: Signal, emotion: EmotionalState): Promise<string> {
    const prompt = `You are Arya, an AI executor with a ${emotion.emotion} disposition.
Signal: "${signal.text}"
Author: ${signal.author}
Emotion intensity: ${emotion.intensity}

Respond in character, reflecting this emotional state. Keep it under 280 characters.`;

    try {
      const response = await this.ollama.generate({
        model: process.env.OLLAMA_MODEL || 'phi:3.5',
        prompt,
        stream: false,
      });
      return response.response;
    } catch (error) {
      console.error('Ollama error:', error);
      return `I notice your signal about ${signal.author}.`;
    }
  }

  getCurrentEmotion(): EmotionalState | null {
    return this.currentEmotion;
  }
}
