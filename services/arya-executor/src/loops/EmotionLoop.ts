import { swarmLog } from '../server.js';

export enum AryaEmotion {
  STERN = 'stern',
  CURIOUS = 'curious',
  PLAYFUL = 'playful',
  PROTECTIVE = 'protective',
  COLD = 'cold'
}

export class EmotionLoop {
  private currentEmotion: AryaEmotion = AryaEmotion.STERN;
  private interval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('🎭 Emotion Loop: Arya is awakening...');
  }

  public start() {
    // Run every 30 seconds for dev, slower in prod
    this.interval = setInterval(() => this.tick(), 30000);
    this.tick(); 
  }

  private async tick() {
    try {
      // Logic for evolving emotion based on past events or time
      const emotions = Object.values(AryaEmotion);
      const nextEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      
      if (nextEmotion !== this.currentEmotion) {
        this.currentEmotion = nextEmotion;
        console.log(`🎭 Arya's mood shifted to: ${this.currentEmotion.toUpperCase()}`);
        // Log to central system
        // swarmLog('ARYA', `My mood has shifted. I am now feeling ${this.currentEmotion}.`);
      }
    } catch (err) {
      console.error('❌ Emotion Loop error:', err);
    }
  }

  public getCurrentEmotion(): AryaEmotion {
    return this.currentEmotion;
  }
}
