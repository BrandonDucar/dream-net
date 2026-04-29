// src/loops/self-environment-loop.ts

import { Database } from '../database';
import axios from 'axios';

export class SelfEnvironmentLoop {
  private db: Database;
  private hawkUrl: string;

  constructor(db: Database, hawkUrl: string) {
    this.hawkUrl = hawkUrl;
    this.db = db;
  }

  async assessEnvironment(): Promise<{
    sentiment: number;
    dominantThemes: string[];
    adaptationNeeded: boolean;
  }> {
    // Query Farcaster ecosystem state via Hawk
    try {
      const response = await axios.get(`${this.hawkUrl}/ecosystem-state`);
      const { sentiment, themes } = response.data;

      return {
        sentiment,
        dominantThemes: themes,
        adaptationNeeded: Math.abs(sentiment) > 0.6,
      };
    } catch (error) {
      // Fallback: assume neutral environment
      return {
        sentiment: 0,
        dominantThemes: [],
        adaptationNeeded: false,
      };
    }
  }

  async adapt(environmentSentiment: number): Promise<{ newStrategy: string }> {
    // Environmental feedback loop: environment changed → Arya must change

    let newStrategy = '';

    if (environmentSentiment > 0.7) {
      // Bullish environment
      newStrategy = 'bullish_aggression';
    } else if (environmentSentiment > 0.3) {
      // Positive but cautious
      newStrategy = 'measured_optimism';
    } else if (environmentSentiment < -0.7) {
      // Bearish environment
      newStrategy = 'defensive_criticism';
    } else if (environmentSentiment < -0.3) {
      // Skeptical environment
      newStrategy = 'careful_analysis';
    } else {
      // Neutral
      newStrategy = 'observational';
    }

    // Store adaptation
    await this.db.query(
      `INSERT INTO self_environment_adaptations (environment_sentiment, new_strategy, timestamp)
       VALUES ($1, $2, NOW())`,
      [environmentSentiment, newStrategy]
    );

    return { newStrategy };
  }

  async runCoevolutionCycle(): Promise<{ environmentSnapshot: string; aryaAdapted: boolean }> {
    const { sentiment, dominantThemes, adaptationNeeded } = await this.assessEnvironment();

    let aryaAdapted = false;
    if (adaptationNeeded) {
      const { newStrategy } = await this.adapt(sentiment);
      aryaAdapted = true;
      console.log(`🌍 Environment sentiment: ${sentiment}. Arya adapted to: ${newStrategy}`);
    }

    // Store cycle
    await this.db.query(
      `INSERT INTO self_environment_cycles (sentiment, dominant_themes, arya_adapted, timestamp)
       VALUES ($1, $2, $3, NOW())`,
      [sentiment, JSON.stringify(dominantThemes), aryaAdapted]
    );

    return {
      environmentSnapshot: `sentiment=${sentiment.toFixed(2)}, themes=[${dominantThemes.join(', ')}]`,
      aryaAdapted,
    };
  }
}
