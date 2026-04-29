// src/loops/social-loop.ts

import { Database } from '../database';
import { Relationship } from './types';

export class SocialLoop {
  private db: Database;
  private relationships: Map<string, Relationship> = new Map();

  constructor(db: Database) {
    this.db = db;
  }

  async updateRelationship(person: string, interaction: string, response: string, sentimentShift: number): Promise<Relationship> {
    let relationship = this.relationships.get(person);

    if (!relationship) {
      // New relationship
      relationship = {
        person,
        sentiment: 0,
        interaction_count: 0,
        last_interaction: new Date(),
        history: [],
        created_at: new Date(),
      };
    }

    // Update sentiment
    relationship.sentiment = Math.max(-1, Math.min(1, relationship.sentiment + sentimentShift));
    relationship.interaction_count++;
    relationship.last_interaction = new Date();

    relationship.history.push({
      interaction,
      response,
      timestamp: new Date(),
      sentiment_shift: sentimentShift,
    });

    // Store in database
    await this.db.query(
      `INSERT INTO relationships (person, sentiment, interaction_count, last_interaction, history, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       ON CONFLICT (person) DO UPDATE SET
         sentiment = $2,
         interaction_count = $3,
         last_interaction = $4,
         history = $5,
         updated_at = NOW()`,
      [person, relationship.sentiment, relationship.interaction_count, relationship.last_interaction, JSON.stringify(relationship.history), relationship.created_at]
    );

    this.relationships.set(person, relationship);
    return relationship;
  }

  async getRelationshipPortfolio(): Promise<{
    allies: string[];
    neutral: string[];
    rivals: string[];
    enemies: string[];
  }> {
    const result = await this.db.query(
      'SELECT person, sentiment FROM relationships ORDER BY sentiment DESC'
    );

    const portfolio = {
      allies: [] as string[],
      neutral: [] as string[],
      rivals: [] as string[],
      enemies: [] as string[],
    };

    result.rows.forEach((row: any) => {
      if (row.sentiment > 0.6) portfolio.allies.push(row.person);
      else if (row.sentiment > 0.2) portfolio.neutral.push(row.person);
      else if (row.sentiment > -0.6) portfolio.rivals.push(row.person);
      else portfolio.enemies.push(row.person);
    });

    return portfolio;
  }

  async getStrategyForPerson(person: string): Promise<string> {
    const relationship = this.relationships.get(person);
    if (!relationship) return 'neutral_observation';

    if (relationship.sentiment > 0.6) return 'public_defense';
    if (relationship.sentiment > 0.2) return 'constructive_engagement';
    if (relationship.sentiment > -0.6) return 'sharp_roast';
    return 'public_opposition';
  }

  async getTotalRelationships(): Promise<number> {
    const result = await this.db.query('SELECT COUNT(*) as count FROM relationships');
    return result.rows[0]?.count || 0;
  }
}
