# WolfPack Analyst Core - Complete Documentation

**Generated**: 2025-01-27  
**Status**: Complete System Documentation

---

## Overview

WolfPack Analyst Core provides **intelligent analysis and pattern learning** for WolfPack Funding operations. It learns patterns from historical data, generates insights, makes predictions about leads, analyzes email effectiveness, and provides actionable recommendations.

---

## Key Features

### Pattern Learning
- Lead quality patterns
- Email effectiveness patterns
- Timing patterns
- Stage progression patterns
- Scoring correlation patterns
- Confidence scoring
- Evidence tracking

### Insight Generation
- Predictions
- Recommendations
- Warnings
- Opportunities
- Pattern insights
- Severity classification
- Actionability scoring

### Lead Predictions
- Stage predictions
- Probability scoring
- Timeframe estimation
- Factor identification
- Confidence levels

### Email Effectiveness Analysis
- Response rate prediction
- Subject line scoring
- Body length scoring
- Timing scoring
- Personalization scoring
- Recommendations

---

## Architecture

### Components

1. **Analyst Store** (`store/analystStore.ts`)
   - Pattern storage
   - Insight storage
   - Prediction storage
   - Effectiveness storage

2. **Analyst Scheduler** (`scheduler/analystScheduler.ts`)
   - Cycle execution
   - Pattern learning
   - Insight generation

---

## API Reference

### Pattern Management

#### `listPatterns(): LearnedPattern[]`
Lists all learned patterns.

**Example**:
```typescript
import { WolfPackAnalystCore } from '@dreamnet/wolfpack-analyst-core';

const patterns = WolfPackAnalystCore.listPatterns();
patterns.forEach(pattern => {
  console.log(`${pattern.type}: ${pattern.pattern}`);
  console.log(`Confidence: ${pattern.confidence}`);
});
```

#### `getPattern(id: string): LearnedPattern | undefined`
Gets a pattern by ID.

### Insights

#### `listInsights(limit?: number): AnalystInsight[]`
Lists all insights.

**Example**:
```typescript
const insights = WolfPackAnalystCore.listInsights(10);
insights.forEach(insight => {
  console.log(`${insight.title}: ${insight.description}`);
  console.log(`Severity: ${insight.severity}`);
  console.log(`Actionable: ${insight.actionable}`);
});
```

#### `getInsight(id: string): AnalystInsight | undefined`
Gets an insight by ID.

### Predictions

#### `listPredictions(): LeadPrediction[]`
Lists all lead predictions.

**Example**:
```typescript
const predictions = WolfPackAnalystCore.listPredictions();
predictions.forEach(prediction => {
  console.log(`Lead: ${prediction.leadId}`);
  console.log(`Predicted Stage: ${prediction.predictedStage}`);
  console.log(`Probability: ${prediction.probability}`);
  console.log(`Confidence: ${prediction.confidence}`);
});
```

#### `getPrediction(leadId: string): LeadPrediction | undefined`
Gets prediction for a lead.

### Email Effectiveness

#### `listEmailEffectiveness(): EmailEffectiveness[]`
Lists all email effectiveness analyses.

**Example**:
```typescript
const effectiveness = WolfPackAnalystCore.listEmailEffectiveness();
effectiveness.forEach(eff => {
  console.log(`Queue Item: ${eff.queueItemId}`);
  console.log(`Predicted Response Rate: ${eff.predictedResponseRate}`);
  console.log(`Subject Score: ${eff.factors.subjectLineScore}`);
});
```

#### `getEmailEffectiveness(queueItemId: string): EmailEffectiveness | undefined`
Gets effectiveness for a queue item.

### Orchestration

#### `run(context: WolfPackAnalystContext): WolfPackAnalystStatus`
Runs WolfPack Analyst Core cycle.

#### `status(): WolfPackAnalystStatus`
Gets WolfPack Analyst Core status.

---

## Data Models

### LearnedPattern

```typescript
interface LearnedPattern {
  id: string;
  type: "lead_quality" | "email_effectiveness" | "timing" | "stage_progression" | "scoring_correlation";
  pattern: string;
  confidence: number; // 0-1
  evidence: {
    sampleSize: number;
    successRate?: number;
    examples: string[];
  };
  createdAt: number;
  lastValidated: number;
}
```

### AnalystInsight

```typescript
interface AnalystInsight {
  id: string;
  type: "prediction" | "recommendation" | "warning" | "opportunity" | "pattern";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  relatedLeadIds?: string[];
  relatedQueueIds?: string[];
  confidence: number; // 0-1
  actionable: boolean;
  suggestedAction?: string;
  createdAt: number;
}
```

### LeadPrediction

```typescript
interface LeadPrediction {
  leadId: string;
  predictedStage: LeadStage;
  probability: number; // 0-1
  timeframe?: string;
  factors: string[];
  confidence: number; // 0-1
}
```

### EmailEffectiveness

```typescript
interface EmailEffectiveness {
  queueItemId: string;
  leadId: string;
  predictedResponseRate: number; // 0-1
  factors: {
    subjectLineScore?: number;
    bodyLengthScore?: number;
    timingScore?: number;
    personalizationScore?: number;
  };
  recommendations?: string[];
}
```

---

## Pattern Types

### Lead Quality
- Quality indicators
- Success factors
- Risk factors

### Email Effectiveness
- Response patterns
- Engagement factors
- Optimization opportunities

### Timing
- Optimal timing
- Response windows
- Follow-up timing

### Stage Progression
- Progression patterns
- Stage transitions
- Bottlenecks

### Scoring Correlation
- Score relationships
- Predictive factors
- Correlation patterns

---

## Insight Types

### Prediction
- Future outcomes
- Likely scenarios
- Probability estimates

### Recommendation
- Actionable advice
- Optimization suggestions
- Best practices

### Warning
- Risk alerts
- Problem identification
- Cautionary notes

### Opportunity
- Growth opportunities
- Potential improvements
- Advantage identification

### Pattern
- Pattern identification
- Trend recognition
- Anomaly detection

---

## Integration Points

### DreamNet Systems
- **WolfPack Funding Core**: Lead data
- **Neural Mesh**: Pattern storage
- **Narrative Field**: Insight logging

### External Systems
- **Analytics**: Performance tracking
- **ML Systems**: Pattern learning
- **Dashboards**: Visualization

---

## Usage Examples

### List Patterns

```typescript
const patterns = WolfPackAnalystCore.listPatterns();
patterns.forEach(pattern => {
  console.log(`${pattern.type}: ${pattern.pattern}`);
  console.log(`Confidence: ${(pattern.confidence * 100).toFixed(1)}%`);
  console.log(`Sample Size: ${pattern.evidence.sampleSize}`);
});
```

### Get Insights

```typescript
const insights = WolfPackAnalystCore.listInsights(10);
insights.forEach(insight => {
  if (insight.actionable) {
    console.log(`${insight.title}: ${insight.suggestedAction}`);
  }
});
```

### Get Predictions

```typescript
const predictions = WolfPackAnalystCore.listPredictions();
predictions.forEach(prediction => {
  console.log(`Lead ${prediction.leadId}: ${prediction.predictedStage} (${(prediction.probability * 100).toFixed(1)}%)`);
});
```

### Get Email Effectiveness

```typescript
const effectiveness = WolfPackAnalystCore.listEmailEffectiveness();
effectiveness.forEach(eff => {
  console.log(`Queue Item ${eff.queueItemId}: ${(eff.predictedResponseRate * 100).toFixed(1)}% response rate`);
  if (eff.recommendations) {
    eff.recommendations.forEach(rec => console.log(`- ${rec}`));
  }
});
```

---

## Best Practices

1. **Pattern Learning**
   - Collect sufficient data
   - Validate patterns regularly
   - Track confidence levels
   - Update patterns frequently

2. **Insight Generation**
   - Generate actionable insights
   - Prioritize by severity
   - Track confidence
   - Provide recommendations

3. **Predictions**
   - Use multiple factors
   - Track accuracy
   - Update predictions
   - Monitor confidence

---

## Security Considerations

1. **Data Security**
   - Protect pattern data
   - Secure insights
   - Validate predictions
   - Audit analysis

2. **Privacy**
   - Protect lead data
   - Secure email data
   - Anonymize when needed
   - Control access

---

**Status**: ✅ Complete Documentation  
**Last Updated**: 2025-01-27

