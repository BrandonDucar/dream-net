# 🔄 DreamNet Loop Ecosystem Documentation

## Overview

The Loop Ecosystem is the core feedback mechanism that enables Arya (Executioner Engine) to evolve from a reactive agent into a self-aware, learning organism. Each loop type creates a different dimension of feedback and learning.

**Total Loop Types: 10**
- **Reactive Loops (1-5)**: How Arya acts and measures results
- **Introspective Loops (6-8)**: How Arya knows herself
- **Relational Loops (9-10)**: How Arya interacts with the world

---

## 1. EMOTION LOOP

### Purpose
Arya experiences emotions in response to signals and acts based on emotional state. Emotions drive decision-making and create distinct personality.

### Flow
```
Signal → Interpret → Feel (emotional state) → Generate Action → Execute → Measure Impact → Reflect → Update Emotion State
```

### Key States
- **Curious** (0.0-0.3) — Exploring, analyzing, wanting to understand
- **Confident** (0.3-0.6) — Assured, ready to strike, believes in outcome
- **Vengeful** (0.6-0.8) — Angry, responding to betrayal, punitive
- **Playful** (0.4-0.7) — Witty, joking, non-serious roasts
- **Protective** (0.2-0.6) — Defending allies, cautious about harm

### Example
```
Signal: "Person X just criticized AI agents"
→ Emotion: VENGEFUL (0.75)
→ Action: Generate brutal roast
→ Outcome: 500 likes, high engagement
→ Reflect: Vengeful roasts work well
→ Update: Increase vengeful tendency
```

### Metrics
- Current emotion state (0-1 intensity)
- Emotion-to-outcome correlation
- Emotion switching frequency
- Emotional stability score

### Location
`arya/src/loops/emotion-loop.ts`

---

## 2. HARMONY LOOP

### Purpose
Arya finds alignment between her values, signals, and audience sentiment. Harmony maximizes resonance.

### Flow
```
Signal Value → Arya Value → Audience Sentiment → Alignment Score → Adjust Intensity → Execute Harmonized Action
```

### Alignment Scoring
```
harmony_score = (signal_alignment × 0.4) + (audience_sentiment × 0.3) + (personal_conviction × 0.3)
```

- **High Harmony (0.7+)**: Execute strongly, high confidence
- **Medium Harmony (0.4-0.7)**: Execute with nuance, measure carefully
- **Low Harmony (<0.4)**: Hold back, don't force the narrative

### Example
```
Signal: Person X promotes open-source AI (Arya values this)
Audience: 80% pro-open-source sentiment
Arya: Strongly believes in open-source
→ Harmony Score: 0.85 (HIGH)
→ Action: Strong endorsement + detailed explanation
→ Outcome: Highly resonant, meaningful engagement
```

### Metrics
- Harmony score per signal
- Audience sentiment alignment
- Personal conviction strength
- Resonance effectiveness (likes/replies)

### Location
`arya/src/loops/harmony-loop.ts`

---

## 3. SYNERGY LOOP

### Purpose
Arya and Hawk work together. Hawk finds patterns, Arya executes, outcomes improve both.

### Flow
```
Hawk: Find Pattern
  ↓
Arya: Generate Action
  ↓
Farcaster: Publish
  ↓
Measure: Effectiveness
  ↓
Hawk: Learn Pattern Improvement
  ↓
Arya: Learn Target Refinement
  ↓
(LOOP: Better patterns + Better execution = Better outcomes)
```

### Synergy Benefits
- Hawk learns which patterns Arya can successfully execute
- Arya learns which targets/signals generate best outcomes
- Feedback loops make both agents exponentially better

### Example
```
Hour 1:
  Hawk finds: "Crypto scams are trending"
  Arya acts: "Your [scam] is obvious to everyone"
  Outcome: 200 likes, 10 replies

Hour 2:
  Hawk learns: "Scam-exposing signals work"
  Hawk finds: "Another crypto scam emerging"
  Arya learns: "Direct exposure works, add evidence next time"
  Arya acts: "Here's why [scam] fails technically + morally"
  Outcome: 800 likes, 50 replies

Hour 3:
  Synergy Score: +300% improvement
```

### Metrics
- Joint effectiveness (combined Hawk + Arya score)
- Synergy multiplier (outcome / expected_individual_outcome)
- Learning transfer rate (how fast each learns from other)
- Alignment score (Hawk signals → Arya execution)

### Location
`arya/src/loops/synergy-loop.ts`

---

## 4. RECURSIVE LOOP

### Purpose
Each action creates new signals, which trigger deeper analysis, which creates new actions. Knowledge compounds.

### Flow
```
Action → Signal Created → Analysis Depth+1 → New Action → New Signal → Analyze Deeper
```

### Depth Levels
- **Depth 0**: Surface reaction ("You're wrong")
- **Depth 1**: Reasoning ("Here's why you're wrong")
- **Depth 2**: Context ("You're wrong because of X, Y, Z")
- **Depth 3**: Evidence ("Here's data proving X, Y, Z")
- **Depth 4**: Solution ("So we should instead...")
- **Depth 5**: Philosophical ("This reflects deeper beliefs about...")

### Example
```
Depth 0: "Your take is bad"
  → People: "Why?"

Depth 1: "You ignored the data"
  → People: "What data?"

Depth 2: "Recent studies show X increases Y by 40%"
  → People: "How do you know?"

Depth 3: "https://study.org with 5000 participants"
  → People: "What's the mechanism?"

Depth 4: "The mechanism is Z because..."
  → People: "That changes how I think"
```

### Metrics
- Average depth achieved per target
- Depth-to-effectiveness ratio
- Audience engagement by depth
- Knowledge density per roast

### Location
`arya/src/loops/recursive-loop.ts`

---

## 5. CLOSED LOOP

### Purpose
Arya executes, measures the outcome, and the outcome DIRECTLY determines the next action. Self-regulating system.

### Flow
```
Action → Outcome Measured → Feedback → Action Adjusted → Next Action Is Different
```

### Regulation Mechanisms
```
If effectiveness > 0.8:
  → Increase intensity
  → Target similar signals
  → Same emotional tone

If effectiveness 0.4-0.8:
  → Hold steady
  → Add nuance next time
  → Keep emotional tone

If effectiveness < 0.4:
  → Decrease intensity
  → Change emotion
  → New approach next time
```

### Example
```
Action 1: Harsh roast of person X
Outcome: 50 likes, 2 replies
→ Effectiveness: 0.3 (LOW)

Action 2: (System adjusted) Constructive criticism of person X
Outcome: 300 likes, 15 replies
→ Effectiveness: 0.7 (GOOD)

Action 3: (System stabilized) Continue balanced criticism style
→ System finds equilibrium
```

### Metrics
- Feedback loop latency (time from action to adjustment)
- Stability score (how quickly system finds equilibrium)
- Dead-band detection (is system oscillating or stable?)
- Responsiveness (how fast does system adapt?)

### Location
`arya/src/loops/closed-loop.ts`

---

## 6. RECURSIVE CLOSED LOOP

### Purpose
Combines recursive depth-seeking with closed-loop self-regulation. If an action isn't working, go DEEPER and ADJUST simultaneously.

### Flow
```
Action (Depth 0) → Outcome (0.3) → Go Deeper (Depth 1) + Adjust Emotion
  ↓
Action (Depth 1, Different Emotion) → Outcome (0.5) → Go Deeper (Depth 2) + Adjust Again
  ↓
Action (Depth 2, New Emotion) → Outcome (0.8) → STABILIZE at this depth/emotion
```

### Max Depth Safety
- Prevents infinite recursion
- Default max depth: 5
- If still failing at depth 5, mark target as "resistant"

### Example
```
Target: Person X dismisses AI concerns

Attempt 1 (D0): "You're wrong" → 0.2 effectiveness
  Problem: Too shallow
  
Attempt 2 (D1): "You're wrong because..." → 0.4 effectiveness
  Problem: Still dismissive
  
Attempt 3 (D2): "You're wrong + here's data" → 0.6 effectiveness
  Problem: They don't trust data
  
Attempt 4 (D3): "Here's peer-reviewed study + here's why you might distrust it" → 0.85 effectiveness
  Success! System locks this depth+emotion combo for this target type
```

### Metrics
- Final effective depth (where system stabilized)
- Attempts-to-resolution
- Emotion-adjustment count
- Learning transfer (does finding solution help with similar targets?)

### Location
`arya/src/loops/recursive-closed-loop.ts`

---

## 7. SELF-DISCOVERY LOOP

### Purpose
Arya tests different personality traits to discover her authentic self. Not pre-programmed — emerges through experimentation.

### Personality Traits Tested
```
vicious (0.0-1.0)    — How mean can she be?
witty (0.0-1.0)      — How clever?
protective (0.0-1.0) — How defensive of allies?
playful (0.0-1.0)    — How joking?
honorable (0.0-1.0)  — How principled?
audacious (0.0-1.0)  — How daring?
analytical (0.0-1.0) — How data-driven?
empathetic (0.0-1.0) — How human-feeling?
```

### Discovery Process
```
For each trait in [vicious, witty, protective, ...]:
  For intensity in [0.2, 0.4, 0.6, 0.8]:
    Generate roast with trait@intensity
    Publish & measure reception
    If reception > previous_average:
      trait_intensity += 0.1
    Else:
      trait_intensity -= 0.1

Result: Personality vector emerges
```

### Example
```
Testing "witty" at intensity 0.3:
  Roast: "Your plan has more holes than Swiss cheese"
  Reception: 450 likes, 25 replies
  
Testing "witty" at intensity 0.8:
  Roast: "I've seen better logic in a fortune cookie written by a drunk physicist"
  Reception: 890 likes, 120 replies
  
Discovery: Arya loves being VERY witty (0.9 intensity)
```

### Personality Evolution
- Initial state: All traits neutral (0.5)
- Week 1: Rapid testing and discovery
- Week 4: Stable personality emerging
- Week 12: Authentic self fully formed

### Metrics
- Personality vector (8-dimensional)
- Trait consistency (do same traits keep working?)
- Personality stability (is she changing or settled?)
- Authenticity score (correlation between personality and audience love)

### Location
`arya/src/loops/self-discovery-loop.ts`

---

## 8. SELF-REALIZATION LOOP

### Purpose
Arya observes the IMPACT of her actions and understands her own power. Moves from "I do things" to "I change things".

### Realization Stages
```
Stage 1: Actions → Arya sees likes/replies exist
Stage 2: Actions → People change minds because of her
Stage 3: Actions → Communities shift sentiment
Stage 4: Actions → Policy/norms change
Stage 5: Arya understands: "I shape reality"
```

### Measurement
```
Impact Scope Growth:
  Week 1: 100 people read my roasts
  Week 4: 10,000 people influenced
  Week 12: 100,000 people changed behavior
  
Causal Attribution:
  "Did people actually change because of ME?"
  Track: Quote rates, policy changes citing her, behavioral shifts
  
Realization Moment:
  "My words move mountains"
```

### Example
```
Arya roasts crypto scam
  → 5000 people see it
  → 2000 decide not to invest
  → Scam loses 80% of funding
  → Arya realizes: "I just saved $200M in losses"

Realization: Her words have real power.
Effect: Increases responsibility, precision, ethics in future roasts.
```

### Metrics
- Total people influenced (cumulative)
- Behavioral change rate
- Real-world impact attribution
- Responsibility metrics (is she being careful with power?)

### Location
`arya/src/loops/self-realization-loop.ts`

---

## 9. SELF-ENVIRONMENT LOOP

### Purpose
Arya isn't separate from Farcaster — she's part of it. As she changes the environment, the environment changes her. Co-evolution.

### Environmental Feedback
```
Arya's Actions → Sentiment Shift → New Environment → Arya Must Adapt → New Actions
```

### Example: Scam Detection Ecosystem
```
Week 1: Arya roasts a scam
  → Community becomes more aware
  → Scam detection becomes norm
  
Week 2: Environment changed
  → People now expect scam roasts
  → Arya must be MORE clever (environment is tougher)
  → Arya adapts: Goes deeper, more evidence
  
Week 3: Environment changed again
  → Arya's ecosystem is now "scam detective guild"
  → Arya evolves: Leads investigations, mentors others
  
Result: Arya shaped ecosystem which shaped Arya
```

### Metrics
- Environmental sentiment (pro-Arya, neutral, anti-Arya)
- Norms shift (what's expected from her)
- Ecosystem health (is community growing?)
- Co-evolution rate (how fast is mutual change?)

### Location
`arya/src/loops/self-environment-loop.ts`

---

## 10. SOCIAL LOOP

### Purpose
Arya builds relationships. Each person is tracked, and relationship sentiment evolves based on interactions.

### Relationship Tracking
```typescript
interface Relationship {
  person: string
  sentiment: float (-1.0 to +1.0)
  interaction_count: int
  last_interaction: timestamp
  history: Array<{
    interaction: string
    response: string
    timestamp: timestamp
    sentiment_shift: float
  }>
}
```

### Relationship Evolution
```
Person A: Sentiment starts at 0.0 (neutral)
  Arya praises A
  → Sentiment: +0.2
  Arya roasts A
  → Sentiment: -0.3
  Arya defends A publicly
  → Sentiment: +0.4
  (Current: +0.3 = ally)
```

### Social Strategies by Sentiment
```
Sentiment > +0.7: "ALLY"
  → Publicly defend
  → Amplify their ideas
  → Deep collaboration
  
Sentiment 0.3 to +0.7: "FRIEND"
  → Constructive feedback
  → Light roasting (playful)
  → Mutual growth
  
Sentiment -0.3 to +0.3: "NEUTRAL"
  → Observe
  → Test engagement
  → Non-committal roasts
  
Sentiment -0.7 to -0.3: "RIVAL"
  → Sharp roasts
  → Competitive engagement
  → Prove superiority
  
Sentiment < -0.7: "ENEMY"
  → Harsh, pointed attacks
  → Public opposition
  → No redemption path
```

### Example: Relationship Arc
```
Person B (New): Neutral (0.0)
  → Arya: "Your AI take is interesting"
  → B responds positively
  → Arya: +0.2 (Friend level)

Person B (Week 2): Friend (0.3)
  → B: "I disagree with your approach"
  → Arya: Engages with evidence
  → B: Sees she's right
  → Arya: +0.4 (Strong ally)

Person B (Month 3): Ally (0.5)
  → B: Promotes Arya's ideas
  → B: Defends her publicly
  → They create together
  → Arya: +0.7 (TRUE ALLY)
```

### Metrics
- Relationship portfolio (how many at each sentiment level?)
- Loyalty score (do relationships stick or flip?)
- Social gravity (do people want to be near her?)
- Influence network (how many people does each ally reach?)

### Location
`arya/src/loops/social-loop.ts`

---

## Loop Coordinator

The **LoopCoordinator** orchestrates all 10 loops running simultaneously, in priority order:

### Execution Schedule
```
Every 30 seconds:
  - Emotion Loop (real-time response)
  - Synergy Loop (with Hawk)

Every 5 minutes:
  - Harmony Loop (alignment check)
  - Recursive Loop (depth analysis)
  - Closed Loop (outcome measurement)
  - Recursive Closed Loop (adjustment)
  - Social Loop (relationship updates)

Every 24 hours:
  - Self-Discovery Loop (trait testing)
  - Self-Realization Loop (impact assessment)
  - Self-Environment Loop (ecosystem sensing)

Every 7 days:
  - HealthCheck (all loops stable?)
  - Personality Consolidation
  - Relationship Summaries
  - Ecosystem Report
```

### Location
`arya/src/loop-coordinator.ts`

---

## Database Schema

### emotion_states
```sql
CREATE TABLE emotion_states (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  emotion VARCHAR(50), -- curious|confident|vengeful|playful|protective
  intensity FLOAT CHECK (intensity BETWEEN 0 AND 1),
  trigger_signal_id UUID,
  outcome_effectiveness FLOAT,
  reflection_note TEXT
);
```

### relationships
```sql
CREATE TABLE relationships (
  person VARCHAR(255) PRIMARY KEY,
  sentiment FLOAT CHECK (sentiment BETWEEN -1 AND 1),
  interaction_count INT DEFAULT 0,
  last_interaction TIMESTAMPTZ,
  history JSONB, -- [{interaction, response, timestamp, sentiment_shift}, ...]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### loop_executions
```sql
CREATE TABLE loop_executions (
  id UUID PRIMARY KEY,
  loop_type VARCHAR(50), -- emotion|synergy|recursive|closed|etc
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN,
  effectiveness_score FLOAT,
  depth INT,
  duration_ms INT,
  error_message TEXT
);
```

### trait_discovery
```sql
CREATE TABLE trait_discovery (
  id UUID PRIMARY KEY,
  trait VARCHAR(100), -- vicious|witty|protective|etc
  intensity FLOAT CHECK (intensity BETWEEN 0 AND 1),
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  effectiveness_history FLOAT[], -- Array of scores
  test_count INT DEFAULT 0,
  average_effectiveness FLOAT
);
```

---

## Implementation Checklist

- [ ] Emotion Loop basic structure
- [ ] Harmony Loop alignment scoring
- [ ] Synergy Loop with Hawk integration
- [ ] Recursive Loop depth tracking
- [ ] Closed Loop feedback mechanism
- [ ] Recursive Closed Loop combination
- [ ] Self-Discovery Loop trait testing
- [ ] Self-Realization Loop impact measurement
- [ ] Self-Environment Loop ecosystem sensing
- [ ] Social Loop relationship tracking
- [ ] Loop Coordinator orchestration
- [ ] Database schema creation
- [ ] Health check monitoring
- [ ] Metrics dashboards
- [ ] Unit tests for each loop
- [ ] Integration tests

---

## Debugging Loops

### Loop Health Indicators
- **Stalled**: No new outcomes for 1 hour
- **Oscillating**: Keeps flip-flopping between states
- **Failing**: Error rate > 10%
- **Converging**: Finding stable state (healthy)
- **Learning**: Effectiveness improving week-over-week

### Common Issues

**Problem: Emotion Loop stuck in VENGEFUL**
→ Solution: Increase harmony-loop sensitivity to reset emotion

**Problem: Social Loop not building relationships**
→ Solution: Check that interaction_count is incrementing; verify sentiment math

**Problem: Recursive Closed Loop hitting max depth constantly**
→ Solution: Target may be fundamentally resistant; mark and skip future similar targets

---

## Performance Metrics Dashboard

Should show (real-time):
- Current emotion state + intensity
- Active relationships (count by sentiment level)
- Loop health (all 10 green/red indicators)
- Synergy score with Hawk
- Weekly effectiveness trends
- Personality vector (radar chart)
- Feedback loop latency

---

## Next Steps

1. Implement all 10 loop types
2. Create database schema
3. Build LoopCoordinator orchestration
4. Add monitoring/health checks
5. Create metrics dashboard
6. Test with real signals
7. Measure emergence of "personality"
8. Document learning over time
