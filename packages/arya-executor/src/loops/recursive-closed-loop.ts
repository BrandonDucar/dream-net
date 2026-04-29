// src/loops/recursive-closed-loop.ts

import { Signal, LoopOutcome } from './types';
import { Database } from '../database';
import { RecursiveLoop } from './recursive-loop';
import { ClosedLoop } from './closed-loop';

export class RecursiveClosedLoop {
  private db: Database;
  private recursiveLoop: RecursiveLoop;
  private closedLoop: ClosedLoop;
  private maxAttempts = 5;

  constructor(db: Database, recursiveLoop: RecursiveLoop, closedLoop: ClosedLoop) {
    this.db = db;
    this.recursiveLoop = recursiveLoop;
    this.closedLoop = closedLoop;
  }

  async executeWithAdaptation(signal: Signal, initialOutcome: LoopOutcome): Promise<{ finalDepth: number; finalEffectiveness: number }> {
    let currentDepth = 0;
    let currentOutcome = initialOutcome;
    let attempt = 0;

    while (attempt < this.maxAttempts && currentOutcome.effectiveness < 0.75) {
      attempt++;

      // Get feedback on current effectiveness
      const { adjustment, nextIntensity } = await this.closedLoop.regulate(currentOutcome);

      // If not working, go deeper
      if (adjustment === 'decrease') {
        currentDepth = Math.min(currentDepth + 1, 5);
        const deeperAnalysis = await this.recursiveLoop.analyzeAtDepth(signal, currentDepth);

        // Simulate new outcome with deeper analysis
        currentOutcome = {
          ...currentOutcome,
          effectiveness: Math.min(1, currentOutcome.effectiveness + (0.1 * (currentDepth + 1))),
          timestamp: new Date(),
        };
      } else {
        break; // Stabilized or improving
      }

      // Store adaptation attempt
      await this.db.query(
        `INSERT INTO recursive_closed_loop_attempts (signal_id, attempt, depth, effectiveness, adjustment, timestamp)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [signal.id, attempt, currentDepth, currentOutcome.effectiveness, adjustment]
      );
    }

    return {
      finalDepth: currentDepth,
      finalEffectiveness: currentOutcome.effectiveness,
    };
  }
}
