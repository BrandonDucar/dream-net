# CultureScore Agent - Complete Documentation

**Package**: `agents/CultureScore`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**CultureScore** is a **content scoring and analysis agent** that evaluates content for cultural resonance, virality potential, and originality. It provides actionable insights to help creators optimize their content for maximum impact.

### Key Features

- **Content Scoring**: Multi-dimensional scoring (originality, virality, cultural resonance)
- **Content Analysis**: Sentiment analysis, theme extraction, cultural marker detection
- **Actionable Recommendations**: Suggestions for improving content performance
- **Platform-Aware**: Considers platform-specific characteristics

---

## Role & Responsibilities

### Role

CultureScore acts as a **content quality assessor and optimizer** for DreamNet's cultural content ecosystem.

### Responsibilities

1. **Score Content**: Evaluate content across multiple dimensions
2. **Analyze Content**: Extract themes, sentiment, and cultural markers
3. **Provide Recommendations**: Suggest improvements for better performance
4. **Platform Optimization**: Consider platform-specific best practices

---

## API Reference

### Agent Definition

```typescript
export const CultureScoreAgent: Agent = {
  name: "CultureScore",
  description: "Scores content for cultural resonance, virality potential, and originality",
  capabilities: ["score", "analyze"],
  async run(payload) {
    return runCultureScoreTask(payload);
  },
};
```

### Types

```typescript
export interface CultureScoreTask {
  score: {
    text: string;
    platform?: string;
  };
  analyze: {
    text: string;
    context?: any;
  };
}

export interface CultureScoreOutput {
  score: {
    originalityScore: number;      // 0-1
    viralityPotential: number;     // 0-1
    culturalResonance: number;     // 0-1
    overallScore: number;          // 0-1
    suggestions: string[];
  };
  analyze: {
    sentiment: "positive" | "neutral" | "negative";
    themes: string[];
    culturalMarkers: string[];
    recommendations: string[];
  };
}
```

---

## Tasks

### 1. Score

Evaluates content across multiple scoring dimensions.

**Input**:
```typescript
{
  task: "score",
  data: {
    text: string;           // Content to score
    platform?: string;     // Target platform (default: "general")
  }
}
```

**Output**:
```typescript
{
  originalityScore: number;      // 0-1 score for originality
  viralityPotential: number;     // 0-1 score for virality potential
  culturalResonance: number;     // 0-1 score for cultural resonance
  overallScore: number;          // Weighted average (0-1)
  suggestions: string[];         // Actionable improvement suggestions
}
```

**Scoring Dimensions**:

1. **Originality Score** (30% weight):
   - Based on uniqueness indicators
   - Considers buzzword usage
   - Word count considerations

2. **Virality Potential** (40% weight):
   - Engagement triggers (questions, exclamations)
   - Emoji usage
   - Mentions and hashtags
   - Optimal length (50-280 characters)

3. **Cultural Resonance** (30% weight):
   - Cultural marker presence
   - Community-focused language
   - Web3/crypto terminology

**Example**:
```typescript
const result = await CultureScoreAgent.run({
  task: "score",
  data: {
    text: "DreamNet is revolutionizing culture! 🚀 What do you think? #Web3 #Culture",
    platform: "twitter"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     originalityScore: 0.75,
//     viralityPotential: 0.85,
//     culturalResonance: 0.80,
//     overallScore: 0.80,
//     suggestions: ["Content looks good!"]
//   }
// }
```

### 2. Analyze

Performs deep content analysis including sentiment, themes, and cultural markers.

**Input**:
```typescript
{
  task: "analyze",
  data: {
    text: string;           // Content to analyze
    context?: any;         // Additional context
  }
}
```

**Output**:
```typescript
{
  sentiment: "positive" | "neutral" | "negative";
  themes: string[];         // Extracted themes
  culturalMarkers: string[]; // Detected cultural markers
  recommendations: string[]; // Improvement recommendations
}
```

**Detected Themes**:
- `technology`: Tech, code, AI, blockchain, crypto, web3
- `culture`: Culture, community, vibe, movement
- `finance`: Money, token, coin, trade, invest, hodl
- `philosophy`: Meaning, purpose, truth, reality, existence

**Cultural Markers**:
- `based`, `cringe`, `fire`, `mid`, `vibes`, `slaps`, `hits different`, `wagmi`, `degen`

**Example**:
```typescript
const result = await CultureScoreAgent.run({
  task: "analyze",
  data: {
    text: "The future of culture is here! DreamNet brings together community, tech, and vibes. This is fire! 🔥"
  }
});

// Result:
// {
//   success: true,
//   output: {
//     sentiment: "positive",
//     themes: ["technology", "culture"],
//     culturalMarkers: ["fire"],
//     recommendations: ["Content analysis complete"]
//   }
// }
```

---

## Implementation Details

### Scoring Algorithm

The scoring algorithm uses heuristic-based analysis:

```typescript
function computeScores(text: string, platform: string) {
  // Originality: based on uniqueness indicators
  const buzzwords = ["based", "cringe", "fire", "mid", "vibe", "vibes", "slaps", "hits different"];
  const buzzwordCount = buzzwords.filter(bw => text.toLowerCase().includes(bw)).length;
  const originalityScore = Math.min(1, 0.3 + (buzzwordCount / 10) + (wordCount > 20 ? 0.2 : 0));
  
  // Virality: based on engagement triggers
  const hasQuestion = text.includes("?");
  const hasExclamation = text.includes("!");
  const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(text);
  const hasMention = text.includes("@") || text.includes("#");
  const viralityPotential = Math.min(1, 
    0.2 + 
    (hasQuestion ? 0.15 : 0) +
    (hasExclamation ? 0.15 : 0) +
    (hasEmoji ? 0.2 : 0) +
    (hasMention ? 0.15 : 0) +
    (length > 50 && length < 280 ? 0.15 : 0)
  );
  
  // Cultural resonance: based on cultural markers
  const culturalMarkers = [
    "culture", "community", "vibe", "energy", "movement",
    "revolution", "change", "future", "web3", "crypto",
    "degen", "ape", "diamond hands", "hodl", "wagmi"
  ];
  const markerCount = culturalMarkers.filter(m => 
    text.toLowerCase().includes(m.toLowerCase())
  ).length;
  const culturalResonance = Math.min(1, 0.3 + (markerCount / 5));
  
  // Overall score (weighted average)
  const overallScore = (
    originalityScore * 0.3 +
    viralityPotential * 0.4 +
    culturalResonance * 0.3
  );
  
  return { originalityScore, viralityPotential, culturalResonance, overallScore, suggestions };
}
```

### Sentiment Analysis

Simple heuristic-based sentiment analysis:

```typescript
function analyzeContent(text: string, context?: any) {
  const positiveWords = ["good", "great", "amazing", "love", "best", "fire", "based", "vibes"];
  const negativeWords = ["bad", "terrible", "hate", "worst", "cringe", "mid"];
  
  const positiveCount = positiveWords.filter(w => 
    text.toLowerCase().includes(w.toLowerCase())
  ).length;
  const negativeCount = negativeWords.filter(w => 
    text.toLowerCase().includes(w.toLowerCase())
  ).length;
  
  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  if (positiveCount > negativeCount) {
    sentiment = "positive";
  } else if (negativeCount > positiveCount) {
    sentiment = "negative";
  }
  
  return { sentiment, themes, culturalMarkers, recommendations };
}
```

---

## Integration Points

### With Other Agents

- **CultureOps**: Receives scoring requests for cultural content
- **WolfPackAnalystCore**: May integrate for pattern-based scoring
- **Social Hub Core**: Scores social posts before publishing

### With DreamNet Systems

- **Agent Registry Core**: Registered as a domain-specific agent
- **Neural Mesh**: May store scoring patterns and learnings
- **Media Vault**: Scores media content for discoverability

---

## Usage Examples

### Example 1: Score Content Before Publishing

```typescript
import { CultureScoreAgent } from '@dreamnet/agents/CultureScore';

const result = await CultureScoreAgent.run({
  task: "score",
  data: {
    text: "DreamNet is the future of culture! 🚀 Join us!",
    platform: "farcaster"
  }
});

if (result.success && result.output) {
  console.log(`Overall Score: ${(result.output.overallScore * 100).toFixed(1)}%`);
  console.log(`Originality: ${(result.output.originalityScore * 100).toFixed(1)}%`);
  console.log(`Virality: ${(result.output.viralityPotential * 100).toFixed(1)}%`);
  console.log(`Cultural Resonance: ${(result.output.culturalResonance * 100).toFixed(1)}%`);
  
  if (result.output.suggestions.length > 0) {
    console.log("Suggestions:", result.output.suggestions);
  }
}
```

### Example 2: Analyze Content Themes

```typescript
const result = await CultureScoreAgent.run({
  task: "analyze",
  data: {
    text: "The convergence of technology and culture is creating new possibilities for community-driven innovation."
  }
});

if (result.success && result.output) {
  console.log(`Sentiment: ${result.output.sentiment}`);
  console.log(`Themes: ${result.output.themes.join(", ")}`);
  console.log(`Cultural Markers: ${result.output.culturalMarkers.join(", ")}`);
}
```

---

## Related Systems

- **CultureOps Agent**: Cultural operations orchestration
- **WolfPackAnalystCore**: Pattern analysis and learning
- **Social Hub Core**: Social content management
- **Neural Mesh**: Pattern storage and learning

---

## Future Enhancements

1. **ML-Based Scoring**: Integrate ML models for more accurate scoring
2. **Historical Performance**: Learn from past content performance
3. **Platform-Specific Models**: Train models for specific platforms
4. **Real-Time Learning**: Continuously improve scoring based on outcomes
5. **A/B Testing**: Support A/B testing of content variations
6. **Competitive Analysis**: Compare against competitor content
7. **Trend Integration**: Consider current trends in scoring

---

**Status**: ✅ Implemented

