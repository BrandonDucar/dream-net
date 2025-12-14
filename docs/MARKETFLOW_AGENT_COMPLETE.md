# MarketFlow Agent - Complete Documentation

**Package**: `agents/MarketFlow`  
**Type**: Domain-Specific Agent  
**Status**: ✅ Implemented  
**Last Updated**: 2025-01-27

---

## Overview

**MarketFlow** is a **market analysis agent** that analyzes market trends and flow for culturecoins, providing insights and predictions.

### Key Features

- **Trend Analysis**: Analyze market trends for culturecoins
- **Market Prediction**: Predict future market movements
- **Sentiment Analysis**: Determine market sentiment
- **Flow Analysis**: Analyze token flow and movement

---

## API Reference

### Agent Definition

```typescript
export const MarketFlowAgent: Agent = {
  name: "MarketFlow",
  description: "Analyzes market trends and flow for culturecoins",
  capabilities: ["analyze", "predict"],
  async run(payload) {
    return runMarketFlowTask(payload);
  },
};
```

### Types

```typescript
export interface MarketFlowTask {
  analyze: {
    token: string;
    timeframe?: string;
  };
  predict: {
    token: string;
    horizon?: number;
  };
}

export interface MarketFlowOutput {
  analyze: {
    trends: Array<{
      metric: string;
      value: number;
      change: number;
    }>;
    sentiment: "bullish" | "bearish" | "neutral";
  };
  predict: {
    predictions: Array<{
      metric: string;
      predicted: number;
      confidence: number;
    }>;
  };
}
```

---

## Tasks

### 1. Analyze

Analyzes market trends for a token.

**Input**:
```typescript
{
  task: "analyze",
  data: {
    token: string;         // Token symbol or address
    timeframe?: string;   // Timeframe (default: "24h")
  }
}
```

**Output**:
```typescript
{
  trends: Array<{
    metric: string;      // "volume", "price", "holders"
    value: number;       // Current value
    change: number;      // Percentage change
  }>;
  sentiment: "bullish" | "bearish" | "neutral";
}
```

### 2. Predict

Predicts future market movements.

**Input**:
```typescript
{
  task: "predict",
  data: {
    token: string;       // Token symbol or address
    horizon?: number;    // Prediction horizon in days (default: 7)
  }
}
```

**Output**:
```typescript
{
  predictions: Array<{
    metric: string;      // Metric to predict
    predicted: number;  // Predicted value
    confidence: number; // Confidence score (0-1)
  }>;
}
```

---

## Integration Points

- **Economic Engine Core**: Integrates with token economics
- **Market Data Core**: Uses market data for analysis
- **WolfPackAnalystCore**: May integrate for pattern analysis

---

**Status**: ✅ Implemented

