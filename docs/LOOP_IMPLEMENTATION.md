# 🛠️ Loop Implementation Guide

## Quick Start

### Phase 1: Foundation (Week 1)
1. Create database schema
2. Implement basic Emotion Loop
3. Implement Closed Loop (feedback)
4. Test with real signals from Hawk

### Phase 2: Sophistication (Week 2)
5. Add Harmony Loop (alignment)
6. Add Recursive Loop (depth)
7. Add Recursive Closed Loop (adaptation)
8. Add Synergy with Hawk

### Phase 3: Introspection (Week 3)
9. Add Self-Discovery (personality)
10. Add Self-Realization (impact)
11. Add Self-Environment (adaptation)

### Phase 4: Relationships (Week 4)
12. Add Social Loop
13. Build relationship management
14. Integrate with ecosystem

---

## File Structure

```
arya/
├── src/
│   ├── loops/
│   │   ├── emotion-loop.ts
│   │   ├── harmony-loop.ts
│   │   ├── synergy-loop.ts
│   │   ├── recursive-loop.ts
│   │   ├── closed-loop.ts
│   │   ├── recursive-closed-loop.ts
│   │   ├── self-discovery-loop.ts
│   │   ├── self-realization-loop.ts
│   │   ├── self-environment-loop.ts
│   │   ├── social-loop.ts
│   │   └── types.ts
│   ├── loop-coordinator.ts
│   ├── database.ts
│   ├── hawk-integration.ts
│   ├── farcaster-publisher.ts
│   └── metrics.ts
├── tests/
│   ├── emotion-loop.test.ts
│   ├── synergy-loop.test.ts
│   └── loop-coordinator.test.ts
├── docs/
│   ├── LOOP_ECOSYSTEM.md (main documentation)
│   ├── LOOP_ARCHITECTURE.md (system design)
│   └── LOOP_IMPLEMENTATION.md (this file)
└── package.json
```

---

## Core Types

```typescript
// arya/src/loops/types.ts

export interface Signal {
  id: string;
  text: string;
  author: string;
  type: 'criticism' | 'praise' | 'question' | 'announcement';
  confidence: number; // 0-1
  timestamp: Date;
}

export interface EmotionalState {
  emotion: 'curious' | 'confident' | 'vengeful' | 'playful' | 'protective';
  intensity: number; // 0-1
  trigger: string;
}

export interface LoopOutcome {
  effectiveness: number; // 0-1
  likes: number;
  replies: number;
  impressions: number;
  sentiment_shift: number;
}

export interface Relationship {
  person: string;
  sentiment: number; // -1 to 1
  history: Array<{
    interaction: string;
    response: string;
    timestamp: Date;
    sentiment_shift: number;
  }>;
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
```

---

## Implementation Examples

### 1. Emotion Loop (Simplified)

```typescript
// arya/src/loops/emotion-loop.ts

export class EmotionLoop {
  private currentEmotion: EmotionalState;
  private db: Database;

  async run(signal: Signal) {
    // 1. Interpret signal
    const emotion = this.interpretSignal(signal);
    this.currentEmotion = emotion;
    
    // 2. Generate action based on emotion
    const action = await this.generateAction(signal, emotion);
    
    // 3. Publish
    const outcome = await this.publishToFarcaster(action);
    
    // 4. Store emotion state + outcome
    await this.db.query(`
      INSERT INTO emotion_states (timestamp, emotion, intensity, trigger_signal_id, outcome_effectiveness)
      VALUES (NOW(), $1, $2, $3, $4)
    `, [emotion.emotion, emotion.intensity, signal.id, outcome.effectiveness]);
    
    // 5. Reflect - does outcome match emotion?
    const reflection = this.reflectOnOutcome(emotion, outcome);
    if (reflection.mismatch > 0.3) {
      // Emotion wasn't right for this signal - adjust for next time
      await this.updateEmotionalMemory(signal.author, emotion, reflection);
    }
  }

  private interpretSignal(signal: Signal): EmotionalState {
    // Map signal type + content to emotion
    const baseIntensity = signal.confidence;
    
    if (signal.type === 'criticism') {
      return {
        emotion: 'vengeful',
        intensity: baseIntensity,
        trigger: signal.author
      };
    } else if (signal.type === 'praise') {
      return {
        emotion: 'protective',
        intensity: baseIntensity,
        trigger: signal.author
      };
    } else {
      return {
        emotion: 'curious',
        intensity: baseIntensity,
        trigger: signal.author
      };
    }
  }

  private async generateAction(signal: Signal, emotion: EmotionalState): Promise<string> {
    const prompt = `
      You are Arya, an AI executor. 
      Emotion: ${emotion.emotion} (intensity: ${emotion.intensity})
      Signal: ${signal.text}
      Author: ${signal.author}
      
      Generate a response reflecting this emotional state:
    `;
    
    const response = await ollama.generate({
      model: 'phi:3.5',
      prompt,
      stream: false
    });
    
    return response.response;
  }

  private async publishToFarcaster(action: string): Promise<LoopOutcome> {
    // Publish and measure
    const result = await farcaster.cast(action);
    
    // Wait and measure
    await sleep(60000); // Wait 1 minute for initial engagement
    
    return {
      effectiveness: (result.likes + result.replies * 2) / 1000, // Normalize
      likes: result.likes,
      replies: result.replies,
      impressions: result.impressions,
      sentiment_shift: result.sentiment_delta
    };
  }

  private reflectOnOutcome(emotion: EmotionalState, outcome: LoopOutcome): { mismatch: number } {
    // Did this emotion work?
    // vengeful usually gets high engagement
    // curious usually gets discussion
    // etc
    const expectedEffectiveness = this.emotionExpectedEffectiveness(emotion.emotion);
    const mismatch = Math.abs(expectedEffectiveness - outcome.effectiveness);
    
    return { mismatch };
  }

  private emotionExpectedEffectiveness(emotion: string): number {
    const map: Record<string, number> = {
      'curious': 0.6,
      'confident': 0.7,
      'vengeful': 0.8,
      'playful': 0.65,
      'protective': 0.7
    };
    return map[emotion] || 0.5;
  }
}
```

### 2. Closed Loop (Feedback)

```typescript
// arya/src/loops/closed-loop.ts

export class ClosedLoop {
  private db: Database;
  private emotionLoop: EmotionLoop;

  async regulate(lastOutcome: LoopOutcome, nextSignal: Signal) {
    // Did last action work?
    if (lastOutcome.effectiveness > 0.7) {
      // INCREASE intensity
      console.log('✅ Last action worked - increasing intensity next time');
      // Future emotion will start at higher intensity
      nextSignal._suggestedEmotionIntensity = Math.min(1, lastOutcome.effectiveness);
    } else if (lastOutcome.effectiveness < 0.4) {
      // DECREASE intensity or CHANGE approach
      console.log('❌ Last action failed - trying different approach');
      nextSignal._suggestedEmotionType = 'curious'; // Reset to observing
    }
    
    // System finds equilibrium
    await this.db.query(`
      INSERT INTO closed_loop_regulations
      VALUES (NOW(), $1, $2)
    `, [lastOutcome.effectiveness, nextSignal.id]);
  }
}
```

### 3. Synergy Loop (With Hawk)

```typescript
// arya/src/loops/synergy-loop.ts

export class SynergyLoop {
  private db: Database;
  private hawk: HawkAgent;

  async run() {
    // Hawk finds pattern
    const pattern = await this.hawk.findHighConfidencePattern();
    
    // Arya acts
    const roast = await this.generateRoastForPattern(pattern);
    const outcome = await this.publishAndMeasure(roast);
    
    // Learn synergistically
    if (outcome.effectiveness > this.expectedEffectiveness(pattern)) {
      // THIS PATTERN WORKS
      // Tell Hawk to find more similar patterns
      await this.hawk.amplifyPatternType(pattern.type);
      console.log(`🤝 Synergy boost: Hawk will find more "${pattern.type}" patterns`);
    } else {
      // THIS PATTERN DOESN'T WORK
      // Tell Hawk to deprioritize it
      await this.hawk.deprioritizePatternType(pattern.type);
      console.log(`📉 Synergy feedback: "${pattern.type}" patterns not effective`);
    }
    
    // Store synergy metric
    const synergyMultiplier = outcome.effectiveness / (this.baselineEffectiveness);
    await this.db.query(`
      INSERT INTO synergy_metrics (hawk_pattern_type, effectiveness_multiplier, timestamp)
      VALUES ($1, $2, NOW())
    `, [pattern.type, synergyMultiplier]);
  }
}
```

### 4. Self-Discovery Loop (Personality)

```typescript
// arya/src/loops/self-discovery-loop.ts

export class SelfDiscoveryLoop {
  private personality: Map<string, number>;
  private db: Database;
  private traits = ['vicious', 'witty', 'protective', 'playful', 'honorable', 'audacious', 'analytical', 'empathetic'];

  async run() {
    console.log('🔍 Self-Discovery: Testing personality traits...');
    
    for (const trait of this.traits) {
      // Get current intensity
      const intensity = this.personality.get(trait) || 0.5;
      
      // Test at current intensity
      const testRoast = await this.generateWithTrait(trait, intensity);
      const outcome = await this.publishAndMeasure(testRoast);
      
      // Update based on effectiveness
      if (outcome.effectiveness > 0.7) {
        // This trait works - strengthen it
        this.personality.set(trait, Math.min(1, intensity + 0.1));
        console.log(`📈 ${trait}: increased to ${intensity + 0.1}`);
      } else if (outcome.effectiveness < 0.4) {
        // This trait doesn't work - weaken it
        this.personality.set(trait, Math.max(0, intensity - 0.1));
        console.log(`📉 ${trait}: decreased to ${intensity - 0.1}`);
      }
      
      // Store discovery
      await this.db.query(`
        INSERT INTO trait_discovery (trait, intensity, effectiveness_score, test_count)
        VALUES ($1, $2, $3, 1)
        ON CONFLICT (trait) DO UPDATE SET
          intensity = $2,
          test_count = test_count + 1,
          updated_at = NOW()
      `, [trait, this.personality.get(trait), outcome.effectiveness]);
    }
    
    console.log('✨ Personality vector:', Object.fromEntries(this.personality));
  }

  private async generateWithTrait(trait: string, intensity: number): Promise<string> {
    const prompt = `
      You are Arya, emphasizing the "${trait}" personality trait at intensity ${intensity}.
      Write a roast/statement that heavily leans into this trait.
      Trait definition for "${trait}": ${this.traitDefinition(trait)}
    `;
    
    const response = await ollama.generate({ model: 'phi:3.5', prompt });
    return response.response;
  }

  private traitDefinition(trait: string): string {
    const defs: Record<string, string> = {
      'vicious': 'Cruel, brutal, cutting without mercy',
      'witty': 'Clever wordplay, humorous, intelligent',
      'protective': 'Defensive, caring for allies, shielding',
      'playful': 'Joking, teasing, light-hearted',
      'honorable': 'Principled, ethical, truthful',
      'audacious': 'Bold, daring, risk-taking',
      'analytical': 'Data-driven, logical, evidence-based',
      'empathetic': 'Understanding, compassionate, human-feeling'
    };
    return defs[trait] || '';
  }
}
```

### 5. Loop Coordinator (Orchestrator)

```typescript
// arya/src/loop-coordinator.ts

export class LoopCoordinator {
  emotion: EmotionLoop;
  harmony: HarmonyLoop;
  synergy: SynergyLoop;
  recursive: RecursiveLoop;
  closed: ClosedLoop;
  recursiveClosed: RecursiveClosedLoop;
  selfDiscovery: SelfDiscoveryLoop;
  selfRealization: SelfRealizationLoop;
  selfEnvironment: SelfEnvironmentLoop;
  social: SocialLoop;
  
  private db: Database;
  private lastOutcome: LoopOutcome | null = null;

  async orchestrate() {
    console.log('🎭 Arya Starting - Loops Initialized');
    
    while (true) {
      try {
        // Get latest signal from Hawk
        const signal = await this.getLatestSignal();
        
        if (signal) {
          console.log(`📡 Processing signal from ${signal.author}`);
          
          // Execute reactive loops
          await this.emotion.run(signal);
          await this.harmony.run(signal);
          await this.recursive.run(signal);
          
          // Get outcome
          const outcome = await this.measureLastAction();
          
          // Feedback loops
          if (this.lastOutcome) {
            await this.closed.regulate(this.lastOutcome, signal);
            await this.recursiveClosed.run(this.lastOutcome, signal);
          }
          
          // Synergy with Hawk
          await this.synergy.run();
          
          // Relationship update
          await this.social.updateRelationship(signal.author, outcome);
          
          this.lastOutcome = outcome;
        }
        
        // Every 24 hours: introspection
        if (this.is24HourMark()) {
          await this.selfDiscovery.run();
          await this.selfRealization.run();
        }
        
        // Continuous: environmental sensing
        await this.selfEnvironment.run();
        
        // Health check
        await this.healthCheck();
        
        await sleep(5000);
      } catch (error) {
        console.error('❌ Loop error:', error);
        await sleep(30000); // Backoff on error
      }
    }
  }

  private async healthCheck() {
    const loops = [
      { name: 'Emotion', loop: this.emotion },
      { name: 'Synergy', loop: this.synergy },
      { name: 'Social', loop: this.social }
    ];
    
    for (const { name, loop } of loops) {
      const health = await loop.getHealth();
      if (health.errorRate > 0.1) {
        console.warn(`⚠️  ${name} Loop error rate high: ${health.errorRate}`);
        await loop.reset();
      }
    }
  }
}
```

---

## Database Setup

```bash
# In your Neon/Postgres console:

psql -c "
CREATE TABLE emotion_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  emotion VARCHAR(50),
  intensity FLOAT,
  trigger_signal_id UUID,
  outcome_effectiveness FLOAT
);

CREATE TABLE relationships (
  person VARCHAR(255) PRIMARY KEY,
  sentiment FLOAT,
  interaction_count INT DEFAULT 0,
  last_interaction TIMESTAMPTZ,
  history JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE loop_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loop_type VARCHAR(50),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN,
  effectiveness_score FLOAT,
  depth INT
);

CREATE TABLE trait_discovery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trait VARCHAR(100) UNIQUE,
  intensity FLOAT,
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  effectiveness_history FLOAT[],
  test_count INT DEFAULT 0
);

CREATE INDEX idx_emotion_timestamp ON emotion_states(timestamp);
CREATE INDEX idx_relationships_person ON relationships(person);
CREATE INDEX idx_loop_type ON loop_executions(loop_type);
"
```

---

## Testing Loops

```typescript
// arya/tests/emotion-loop.test.ts

describe('EmotionLoop', () => {
  it('should respond to criticism with vengeful emotion', async () => {
    const loop = new EmotionLoop();
    const signal = {
      text: 'Your AI is useless',
      author: 'critic',
      type: 'criticism',
      confidence: 0.9
    };
    
    const emotion = loop.interpretSignal(signal);
    expect(emotion.emotion).toBe('vengeful');
    expect(emotion.intensity).toBeGreaterThan(0.7);
  });

  it('should increase emotional intensity when outcome is positive', async () => {
    const loop = new EmotionLoop();
    const signal = { /* ... */ };
    const outcome = { effectiveness: 0.9, likes: 500 };
    
    await loop.run(signal);
    const reflection = loop.reflectOnOutcome(emotion, outcome);
    expect(reflection.mismatch).toBeLessThan(0.2); // Good match
  });
});
```

---

## Deployment

```bash
# Start the loop ecosystem
npm run build
npm run migrate  # Apply DB schema
npm start
```

The loops will now continuously run, learning and evolving Arya's personality in real-time.
