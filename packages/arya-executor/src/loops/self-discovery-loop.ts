// src/loops/self-discovery-loop.ts

import { Database } from '../database';
import { Personality, LoopOutcome } from './types';
import { Ollama } from 'ollama';

export class SelfDiscoveryLoop {
  private db: Database;
  private ollama: Ollama;
  private personality: Personality = {
    vicious: 0.5,
    witty: 0.5,
    protective: 0.5,
    playful: 0.5,
    honorable: 0.5,
    audacious: 0.5,
    analytical: 0.5,
    empathetic: 0.5,
  };

  private traits = Object.keys(this.personality) as (keyof Personality)[];

  constructor(db: Database, ollama: Ollama) {
    this.db = db;
    this.ollama = ollama;
  }

  async runDiscoverySession(testSignal: string): Promise<Personality> {
    console.log('🔍 Self-Discovery: Testing personality traits...');

    for (const trait of this.traits) {
      const intensity = this.personality[trait];

      // Generate response using this trait
      const testResponse = await this.generateWithTrait(trait, intensity, testSignal);

      // Simulate effectiveness measurement
      const effectiveness = Math.random() * 0.8 + 0.2;

      // Update trait based on effectiveness
      if (effectiveness > 0.7) {
        this.personality[trait] = Math.min(1, intensity + 0.1);
        console.log(`📈 ${trait}: ${intensity.toFixed(2)} → ${this.personality[trait].toFixed(2)}`);
      } else if (effectiveness < 0.4) {
        this.personality[trait] = Math.max(0, intensity - 0.1);
        console.log(`📉 ${trait}: ${intensity.toFixed(2)} → ${this.personality[trait].toFixed(2)}`);
      }

      // Store discovery
      await this.db.query(
        `INSERT INTO trait_discovery (trait, intensity, effectiveness_score, test_count, timestamp)
         VALUES ($1, $2, $3, 1, NOW())
         ON CONFLICT (trait) DO UPDATE SET
           intensity = $2,
           test_count = test_count + 1,
           updated_at = NOW()`,
        [trait, this.personality[trait], effectiveness]
      );
    }

    console.log('✨ Personality vector discovered:', this.personality);
    return this.personality;
  }

  private async generateWithTrait(trait: string, intensity: number, signal: string): Promise<string> {
    const traitDefs: Record<string, string> = {
      vicious: 'Cruel, brutal, cutting without mercy',
      witty: 'Clever wordplay, humorous, intelligent',
      protective: 'Defensive, caring for allies, shielding',
      playful: 'Joking, teasing, light-hearted',
      honorable: 'Principled, ethical, truthful',
      audacious: 'Bold, daring, risk-taking',
      analytical: 'Data-driven, logical, evidence-based',
      empathetic: 'Understanding, compassionate, human-feeling',
    };

    const prompt = `You are Arya, emphasizing the "${trait}" trait at intensity ${intensity}.
Definition: ${traitDefs[trait]}
Signal: "${signal}"

Respond in character. Keep it under 280 characters.`;

    try {
      const response = await this.ollama.generate({
        model: process.env.OLLAMA_MODEL || 'phi:3.5',
        prompt,
        stream: false,
      });
      return response.response;
    } catch (error) {
      return 'Response unavailable.';
    }
  }

  getPersonality(): Personality {
    return this.personality;
  }

  async loadPersonalityFromDB(): Promise<void> {
    const result = await this.db.query(
      'SELECT trait, intensity FROM trait_discovery ORDER BY updated_at DESC'
    );

    result.rows.forEach((row: any) => {
      if (row.trait in this.personality) {
        this.personality[row.trait as keyof Personality] = row.intensity;
      }
    });
  }
}
