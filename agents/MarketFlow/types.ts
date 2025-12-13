/**
 * MarketFlow Agent Types
 * Analyzes market trends and flow for culturecoins
 */

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


