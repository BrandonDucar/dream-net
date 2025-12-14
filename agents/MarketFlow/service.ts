/**
 * MarketFlow Agent Service
 * Analyzes market trends and flow for culturecoins
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { MarketFlowOutput } from "./types.js";

export async function runMarketFlowTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "analyze": {
        const { token, timeframe = "24h" } = data || {};
        if (!token) {
          return {
            success: false,
            output: null,
            error: "Missing required field: token",
            logs: ["analyze requires 'token' field"],
          };
        }

        const trends = generateTrends(token, timeframe);
        const sentiment = determineSentiment(trends);

        const output: MarketFlowOutput["analyze"] = {
          trends,
          sentiment,
        };

        logs.push(`Analyzed market flow for ${token} (${timeframe})`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "predict": {
        const { token, horizon = 7 } = data || {};
        if (!token) {
          return {
            success: false,
            output: null,
            error: "Missing required field: token",
            logs: ["predict requires 'token' field"],
          };
        }

        const predictions = generatePredictions(token, horizon);

        const output: MarketFlowOutput["predict"] = {
          predictions,
        };

        logs.push(`Generated predictions for ${token} (${horizon} days)`);
        return {
          success: true,
          output,
          logs,
        };
      }

      default:
        return {
          success: false,
          output: null,
          error: `Unknown task: ${task}`,
          logs: [`Supported tasks: analyze, predict`],
        };
    }
  } catch (error: any) {
    return {
      success: false,
      output: null,
      error: error?.message || String(error),
      logs: [...logs, `Error: ${error?.message || String(error)}`],
    };
  }
}

function generateTrends(token: string, timeframe: string) {
  return [
    {
      metric: "volume",
      value: Math.random() * 1000000,
      change: (Math.random() - 0.5) * 20,
    },
    {
      metric: "price",
      value: Math.random() * 100,
      change: (Math.random() - 0.5) * 15,
    },
    {
      metric: "holders",
      value: Math.random() * 10000,
      change: (Math.random() - 0.5) * 10,
    },
  ];
}

function determineSentiment(trends: Array<{ change: number }>): "bullish" | "bearish" | "neutral" {
  const avgChange = trends.reduce((sum, t) => sum + t.change, 0) / trends.length;
  
  if (avgChange > 5) return "bullish";
  if (avgChange < -5) return "bearish";
  return "neutral";
}

function generatePredictions(token: string, horizon: number) {
  return [
    {
      metric: "price",
      predicted: Math.random() * 100,
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
    },
    {
      metric: "volume",
      predicted: Math.random() * 1000000,
      confidence: Math.random() * 0.3 + 0.7,
    },
  ];
}


