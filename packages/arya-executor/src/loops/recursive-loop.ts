// src/loops/recursive-loop.ts

import { Signal } from './types';
import { Database } from '../database';
import { Ollama } from 'ollama';

export class RecursiveLoop {
  private db: Database;
  private ollama: Ollama;
  private maxDepth = 5;

  constructor(db: Database, ollama: Ollama) {
    this.db = db;
    this.ollama = ollama;
  }

  async analyzeAtDepth(signal: Signal, currentDepth: number = 0): Promise<string> {
    if (currentDepth >= this.maxDepth) {
      return 'Analysis complete at max depth.';
    }

    const depthPrompts: Record<number, string> = {
      0: `Surface reaction to: "${signal.text}"`,
      1: `Reasoning behind the reaction to: "${signal.text}"`,
      2: `Detailed context and evidence for: "${signal.text}"`,
      3: `Philosophical underpinnings of: "${signal.text}"`,
      4: `Systemic implications and meta-analysis of: "${signal.text}"`,
    };

    const prompt = depthPrompts[currentDepth] || 'Deep analysis';

    try {
      const response = await this.ollama.generate({
        model: process.env.OLLAMA_MODEL || 'phi:3.5',
        prompt,
        stream: false,
      });

      // Store this depth level
      await this.db.query(
        `INSERT INTO recursive_analyses (signal_id, depth, analysis, timestamp)
         VALUES ($1, $2, $3, NOW())`,
        [signal.id, currentDepth, response.response]
      );

      return response.response;
    } catch (error) {
      console.error(`Recursive depth ${currentDepth} failed:`, error);
      return 'Analysis interrupted.';
    }
  }

  async findOptimalDepth(signal: Signal, targetEffectiveness: number = 0.7): Promise<number> {
    // Run analyses at increasing depths until we hit target effectiveness
    for (let depth = 0; depth < this.maxDepth; depth++) {
      const analysis = await this.analyzeAtDepth(signal, depth);
      const effectiveness = this.estimateEffectiveness(analysis);

      if (effectiveness >= targetEffectiveness) {
        console.log(`Optimal depth found: ${depth}`);
        return depth;
      }
    }

    return this.maxDepth - 1;
  }

  private estimateEffectiveness(analysis: string): number {
    // Placeholder: score based on analysis length and complexity
    const wordCount = analysis.split(' ').length;
    return Math.min(1, wordCount / 100); // Longer analysis = higher depth effectiveness
  }
}
