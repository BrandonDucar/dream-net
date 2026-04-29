// src/loops/closed-loop.ts

import { LoopOutcome } from './types';
import { Database } from '../database';

export class ClosedLoop {
  private db: Database;
  private lastOutcome: LoopOutcome | null = null;

  constructor(db: Database) {
    this.db = db;
  }

  async regulate(outcome: LoopOutcome): Promise<{ adjustment: string; nextIntensity: number }> {
    this.lastOutcome = outcome;

    let adjustment = 'hold';
    let nextIntensity = 0.5;

    // Self-regulation: did the action work?
    if (outcome.effectiveness > 0.7) {
      // INCREASE intensity for similar targets
      adjustment = 'increase';
      nextIntensity = Math.min(1, outcome.effectiveness);
    } else if (outcome.effectiveness < 0.4) {
      // DECREASE intensity or change approach
      adjustment = 'decrease';
      nextIntensity = Math.max(0, outcome.effectiveness - 0.2);
    } else {
      // Hold steady
      adjustment = 'hold';
      nextIntensity = 0.5;
    }

    // Store regulation decision
    await this.db.query(
      `INSERT INTO closed_loop_regulations (effectiveness, adjustment, next_intensity, timestamp)
       VALUES ($1, $2, $3, NOW())`,
      [outcome.effectiveness, adjustment, nextIntensity]
    );

    return { adjustment, nextIntensity };
  }

  async calculateFeedbackLatency(): Promise<number> {
    if (!this.lastOutcome) return 0;
    return Date.now() - this.lastOutcome.timestamp.getTime();
  }

  getLastOutcome(): LoopOutcome | null {
    return this.lastOutcome;
  }
}
