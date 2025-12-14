# Culture-Ingestion Engine - System Design

**Status**: 📋 Design Document  
**Priority**: 🔴 HIGH  
**Last Updated**: 2025-01-27

---

## Overview

The **Culture-Ingestion Engine** is DreamNet's upgraded equivalent of Meta's news AI—but built for culture, not news. It ingests, analyzes, transforms, and routes cultural content across the DreamNet ecosystem.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│              Culture-Ingestion Engine                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Signal Scraper Layer (SSL)                         │  │
│  │  - Memes, Trends, Micro-language                    │  │
│  │  - Market sentiment, On-chain moves                 │  │
│  │  - Creator momentum                                 │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Context Lens Engine (CLE)                          │  │
│  │  - Emotional score, Virality rating                │  │
│  │  - Archetype mapping, Narrative category           │  │
│  │  - Temporal relevance, Audience compatibility      │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Reconstruction Engine (RE)                         │  │
│  │  - Meme format, Explainer format                   │  │
│  │  - Story format, Educational format                 │  │
│  │  - Tokenized culture-coin format                    │  │
│  │  - Farcaster cast format, Zora mint format         │  │
│  └─────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Value Router (VR)                                   │  │
│  │  - Wolf Pack, Whale Pack, Orca Pack                │  │
│  │  - Dream Hubs, Creator dashboards                   │  │
│  │  - Dream evolution trees, AI agents                │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Signal Scraper Layer (SSL)

### Purpose

Collects cultural signals from various sources: memes, trends, micro-language, market sentiment, on-chain moves, and creator momentum.

### Data Sources

1. **Social Platforms**:
   - X (Twitter) - trending topics, viral tweets
   - Farcaster - casts, reactions, trends
   - TikTok - viral videos, sounds, trends
   - Instagram - reels, stories, trends
   - Reddit - trending posts, subreddits

2. **On-Chain Sources**:
   - NFT mints and sales
   - Token transactions
   - DAO proposals and votes
   - DeFi activity
   - Bridge transactions

3. **News & Media**:
   - News APIs (NewsAPI, etc.)
   - RSS feeds
   - Partner feeds

4. **Community Sources**:
   - Discord servers
   - Telegram channels
   - Community forums

### Signal Types

```typescript
interface CulturalSignal {
  signalId: string;
  type: "meme" | "trend" | "language" | "sentiment" | "onchain" | "creator";
  source: string; // Platform identifier
  content: {
    text?: string;
    image?: string;
    video?: string;
    audio?: string;
    metadata?: Record<string, any>;
  };
  metrics: {
    engagement: number; // Likes, shares, views
    velocity: number; // Rate of growth
    reach: number; // Audience size
  };
  timestamp: number;
  location?: {
    platform: string;
    url?: string;
    coordinates?: [number, number]; // Geo coordinates
  };
}
```

### Scraping Strategy

1. **Real-Time Monitoring**:
   - Webhook subscriptions
   - API polling (rate-limited)
   - Stream processing

2. **Batch Processing**:
   - Historical data ingestion
   - Periodic trend analysis
   - Pattern detection

3. **Intelligent Filtering**:
   - Relevance scoring
   - Duplicate detection
   - Quality thresholds

---

## Layer 2: Context Lens Engine (CLE)

### Purpose

DreamNet's intelligence module that analyzes cultural objects and assigns scores, ratings, and mappings.

### Analysis Dimensions

#### 1. Emotional Score (0-1)

**Purpose**: Measure emotional resonance

**Factors**:
- Sentiment analysis (positive/negative/neutral)
- Emotional intensity
- Emotional diversity
- Emotional authenticity

**Implementation**:
```typescript
interface EmotionalScore {
  overall: number; // 0-1
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
    intensity: number;
  };
  dominantEmotion: string; // "joy", "anger", "fear", etc.
}
```

#### 2. Virality Rating (0-1)

**Purpose**: Predict viral potential

**Factors**:
- Engagement velocity
- Network effects
- Novelty
- Relatability
- Timing

**Implementation**:
```typescript
interface ViralityRating {
  score: number; // 0-1
  factors: {
    velocity: number; // Growth rate
    networkEffect: number; // Spread potential
    novelty: number; // Uniqueness
    relatability: number; // Audience connection
    timing: number; // Current relevance
  };
  prediction: {
    peakEngagement: number;
    peakTime: number; // Timestamp
    duration: number; // Days
  };
}
```

#### 3. Archetype Mapping

**Purpose**: Classify content into cultural archetypes

**Archetypes**:
- Hero's Journey
- Underdog Story
- Revolution
- Community Building
- Innovation
- Nostalgia
- Satire
- Inspiration

**Implementation**:
```typescript
interface ArchetypeMapping {
  primary: string; // Primary archetype
  secondary: string[]; // Secondary archetypes
  confidence: number; // 0-1
  traits: string[]; // Identified traits
}
```

#### 4. Narrative Category

**Purpose**: Classify narrative structure

**Categories**:
- Origin Story
- Transformation
- Conflict/Resolution
- Discovery
- Celebration
- Warning
- Call to Action

#### 5. Temporal Relevance

**Purpose**: Assess time-sensitive relevance

**Factors**:
- Current events alignment
- Trend lifecycle stage
- Seasonal relevance
- Longevity potential

#### 6. Audience Compatibility

**Purpose**: Match content to audiences

**Factors**:
- Demographic fit
- Interest alignment
- Platform preferences
- Community fit

### CLE Output

```typescript
interface CLEAnalysis {
  signalId: string;
  emotionalScore: EmotionalScore;
  viralityRating: ViralityRating;
  archetypeMapping: ArchetypeMapping;
  narrativeCategory: string;
  temporalRelevance: {
    score: number; // 0-1
    current: boolean;
    longevity: number; // Days
  };
  audienceCompatibility: {
    primaryAudiences: string[];
    compatibilityScores: Record<string, number>;
  };
  metadata: {
    analyzedAt: number;
    modelVersion: string;
  };
}
```

---

## Layer 3: Reconstruction Engine (RE)

### Purpose

Transforms any cultural object into multiple formats optimized for different platforms and use cases.

### Output Formats

#### 1. Meme Format

**Purpose**: Convert content into meme format

**Process**:
- Extract key message
- Identify visual elements
- Generate caption variations
- Suggest image templates

**Output**:
```typescript
interface MemeFormat {
  format: "meme";
  variations: Array<{
    topText: string;
    bottomText: string;
    style: string;
    template?: string;
  }>;
}
```

#### 2. Explainer Format

**Purpose**: Educational explanation format

**Process**:
- Break down complex concepts
- Add context and background
- Create step-by-step guide
- Include examples

**Output**:
```typescript
interface ExplainerFormat {
  format: "explainer";
  title: string;
  sections: Array<{
    heading: string;
    content: string;
    examples?: string[];
  }>;
  keyTakeaways: string[];
}
```

#### 3. Story Format

**Purpose**: Narrative storytelling format

**Process**:
- Identify narrative arc
- Develop characters/entities
- Create plot structure
- Add emotional beats

**Output**:
```typescript
interface StoryFormat {
  format: "story";
  title: string;
  narrative: string;
  characters: string[];
  themes: string[];
  arc: "rising" | "falling" | "circular";
}
```

#### 4. Educational Format

**Purpose**: Learning and teaching format

**Process**:
- Extract key concepts
- Create learning objectives
- Develop exercises
- Add resources

#### 5. Tokenized Culture-Coin Format

**Purpose**: Convert to culturecoin token

**Process**:
- Extract cultural value
- Define token economics
- Create metadata
- Generate mint parameters

**Output**:
```typescript
interface CultureCoinFormat {
  format: "culturecoin";
  name: string;
  symbol: string;
  description: string;
  metadata: {
    image?: string;
    attributes: Array<{
      trait_type: string;
      value: string;
    }>;
  };
  economics: {
    supply: number;
    distribution: Record<string, number>;
  };
}
```

#### 6. Farcaster Cast Format

**Purpose**: Optimized for Farcaster

**Process**:
- Adapt to Farcaster style
- Add mentions/hashtags
- Optimize length
- Add embeds

#### 7. Zora Mint Format

**Purpose**: NFT mint format for Zora

**Process**:
- Create NFT metadata
- Generate cover image
- Define edition size
- Set pricing

### RE Output

```typescript
interface ReconstructionOutput {
  signalId: string;
  formats: Array<{
    type: string;
    content: any;
    optimizedFor: string;
  }>;
  metadata: {
    reconstructedAt: number;
    formatsGenerated: number;
  };
}
```

---

## Layer 4: Value Router (VR)

### Purpose

Determines where each cultural object should go based on analysis and routing rules.

### Routing Targets

#### 1. Wolf Pack

**Criteria**:
- Early signals
- High virality potential
- Niche appeal
- Rising creators

**Use Case**: Discovery and early amplification

#### 2. Whale Pack

**Criteria**:
- Major cultural forces
- High engagement
- Established creators
- Broad appeal

**Use Case**: Major current amplification

#### 3. Orca Pack

**Criteria**:
- Real-time trends
- High velocity
- Cross-platform presence
- Trend patrol targets

**Use Case**: Trend interception and conversion

#### 4. Dream Hubs

**Criteria**:
- Vertical-specific content
- Community-relevant
- Educational value
- Long-term value

**Use Case**: Community engagement

#### 5. Creator Dashboards

**Criteria**:
- Creator-owned content
- Performance metrics
- Revenue opportunities
- Analytics data

**Use Case**: Creator tools and insights

#### 6. Dream Evolution Trees

**Criteria**:
- Transformative content
- Evolution potential
- Narrative connections
- Long-term impact

**Use Case**: Content evolution tracking

#### 7. AI Agents

**Criteria**:
- Agent-relevant content
- Processing opportunities
- Learning potential
- Task alignment

**Use Case**: Agent training and execution

### Routing Logic

```typescript
interface RoutingDecision {
  signalId: string;
  targets: Array<{
    target: string; // "wolf-pack", "whale-pack", etc.
    priority: number; // 0-1
    reason: string;
    metadata?: Record<string, any>;
  }>;
  routingRules: {
    applied: string[];
    overrides?: Record<string, any>;
  };
}
```

### Routing Algorithm

1. **Score Calculation**:
   - Calculate scores for each target
   - Apply routing rules
   - Consider priority and capacity

2. **Multi-Target Routing**:
   - Content can route to multiple targets
   - Priority determines order
   - Capacity limits prevent overload

3. **Learning & Optimization**:
   - Track routing success
   - Adjust routing rules
   - Optimize for outcomes

---

## Integration with DreamNet Systems

### 1. Neural Mesh Integration

**Purpose**: Store embeddings and enable similarity search

**Usage**:
- Store signal embeddings
- Find similar signals
- Cluster related content
- Enable semantic search

### 2. WolfPackAnalystCore Integration

**Purpose**: Use analyst patterns for routing decisions

**Usage**:
- Pattern-based virality prediction
- Insight-driven routing
- Prediction-based timing
- Pattern-based scoring

### 3. DLP Integration

**Purpose**: Attribute and license content

**Usage**:
- Fingerprint content
- Attribute creators
- Track usage
- Route payments

### 4. Pack Integration

**Purpose**: Route to appropriate packs

**Usage**:
- Wolf Pack: Early signals
- Whale Pack: Major currents
- Orca Pack: Trend patrol

---

## Implementation Plan

### Phase 1: SSL Implementation (Week 1-2)

1. **Create `packages/culture-ingestion-core/`**
2. **Implement Signal Scraper Layer**
   - Social platform integrations
   - On-chain monitoring
   - Signal collection and filtering

### Phase 2: CLE Implementation (Week 3-4)

1. **Implement Context Lens Engine**
   - Emotional scoring
   - Virality rating
   - Archetype mapping
   - Neural Mesh integration

### Phase 3: RE Implementation (Week 5-6)

1. **Implement Reconstruction Engine**
   - Format generators
   - Platform-specific adapters
   - Content transformation

### Phase 4: VR Implementation (Week 7-8)

1. **Implement Value Router**
   - Routing algorithm
   - Pack integration
   - Learning system

### Phase 5: Integration & Optimization (Week 9+)

1. **System Integration**
   - DLP integration
   - Pack coordination
   - Agent integration

2. **Performance Optimization**
   - Caching
   - Batch processing
   - Real-time processing

---

## Data Flow

```
Signal Source → SSL → Signal
                ↓
Signal → CLE → Analysis
                ↓
Analysis → RE → Formats
                ↓
Formats → VR → Routing Targets
                ↓
Targets → Packs/Agents/Hubs
```

---

## Future Enhancements

1. **Real-Time Processing**: Stream processing for real-time signals
2. **Advanced ML Models**: Custom models for analysis
3. **Multi-Language Support**: Process content in multiple languages
4. **Visual Analysis**: Deep image/video analysis
5. **Audio Analysis**: Audio content analysis
6. **Predictive Routing**: ML-based routing optimization

---

**Status**: 📋 Design Complete - Ready for Implementation

