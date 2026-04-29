// src/loops/synergy-loop.ts

import { Signal, LoopOutcome } from './types';
import { Database } from '../database';
import axios from 'axios';

export class SynergyLoop {
  private db: Database;
  private hawkUrl: string;

  constructor(db: Database, hawkUrl: string) {
    this.db = db;
    this.hawkUrl = hawkUrl;
  }

  async run(signal: Signal, outcome: LoopOutcome): Promise<{ synergyMultiplier: number }> {
    // Hawk found this pattern
    // Arya acted on it with the given outcome
    // Now: learn together

    const expectedEffectiveness = this.expectedEffectivenessForPattern(signal.type);
    const synergyMultiplier = outcome.effectiveness / expectedEffectiveness;

    // Tell Hawk whether this pattern worked
    if (outcome.effectiveness > expectedEffectiveness) {
      // THIS PATTERN WORKS - amplify it
      await this.notifyHawk('amplify', signal.type, synergyMultiplier);
    } else {
      // THIS PATTERN DOESN'T WORK - deprioritize
      await this.notifyHawk('deprioritize', signal.type, synergyMultiplier);
    }

    // Store synergy metric
    await this.db.query(
      `INSERT INTO synergy_metrics (pattern_type, effectiveness_multiplier, outcome_effectiveness, timestamp)
       VALUES ($1, $2, $3, NOW())`,
      [signal.type, synergyMultiplier, outcome.effectiveness]
    );

    return { synergyMultiplier };
  }

  private expectedEffectivenessForPattern(patternType: string): number {
    const baseEffectiveness: Record<string, number> = {
      criticism: 0.75,
      praise: 0.6,
      question: 0.55,
      announcement: 0.65,
    };
    return baseEffectiveness[patternType] || 0.5;
  }

  private async notifyHawk(action: 'amplify' | 'deprioritize', patternType: string, score: number): Promise<void> {
    try {
      await axios.post(`${this.hawkUrl}/feedback`, {
        action,
        patternType,
        synergyScore: score,
        timestamp: new Date(),
      });
    } catch (error) {
      console.warn('Hawk feedback failed:', error);
    }
  }

  async getSynergyScore(): Promise<number> {
    const result = await this.db.query(
      `SELECT AVG(effectiveness_multiplier) as avg_synergy FROM synergy_metrics 
       WHERE timestamp > NOW() - INTERVAL '24 hours'`
    );
    return result.rows[0]?.avg_synergy || 1;
  }
}
