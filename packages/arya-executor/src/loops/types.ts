// src/loops/types.ts

export interface Signal {
  id: string;
  text: string;
  author: string;
  type: 'criticism' | 'praise' | 'question' | 'announcement';
  confidence: number; // 0-1
  timestamp: Date;
  source?: string;
}

export interface EmotionalState {
  emotion: 'curious' | 'confident' | 'vengeful' | 'playful' | 'protective';
  intensity: number; // 0-1
  trigger: string;
  timestamp: Date;
}

export interface LoopOutcome {
  effectiveness: number; // 0-1
  likes: number;
  replies: number;
  impressions: number;
  sentiment_shift: number;
  castHash?: string;
  timestamp: Date;
}

export interface Relationship {
  person: string;
  sentiment: number; // -1 to 1
  interaction_count: number;
  last_interaction: Date;
  history: Array<{
    interaction: string;
    response: string;
    timestamp: Date;
    sentiment_shift: number;
  }>;
  created_at: Date;
}

export interface Personality {
  vicious: number;
  witty: number;
  protective: number;
  playful: number;
  honorable: number;
  audacious: number;
  analytical: number;
  empathetic: number;
}

export interface LoopHealth {
  name: string;
  success_rate: number;
  error_rate: number;
  effectiveness_score: number;
  last_execution: Date;
  status: 'healthy' | 'warning' | 'error';
}

export interface Action {
  text: string;
  emotion: string;
  intensity: number;
  target?: string;
  depth?: number;
  personalityUsed?: Partial<Personality>;
  timestamp: Date;
}
