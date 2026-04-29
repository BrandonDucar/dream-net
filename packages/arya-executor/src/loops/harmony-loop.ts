// src/loops/harmony-loop.ts

import { Signal } from './types';
import { Database } from '../database';

export class HarmonyLoop {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async calculateHarmony(
    signal: Signal,
    personalConviction: number,
    audienceSentiment: number
  ): Promise<{ harmonyScore: number; shouldAct: boolean }> {
    const signalAlignment = signal.confidence;
    const harmonyScore = signalAlignment * 0.4 + audienceSentiment * 0.3 + personalConviction * 0.3;

    const shouldAct = harmonyScore > 0.4;

    // Store harmony calculation
    await this.db.query(
      `INSERT INTO harmony_states (signal_alignment, audience_sentiment, personal_conviction, harmony_score, should_act, timestamp)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [signalAlignment, audienceSentiment, personalConviction, harmonyScore, shouldAct]
    );

    return { harmonyScore, shouldAct };
  }

  async getAudienceSentiment(topic: string): Promise<number> {
    // Placeholder: in production, this queries real sentiment data
    // For now, return random sentiment for testing
    return Math.random() * 2 - 1; // -1 to 1
  }
}
