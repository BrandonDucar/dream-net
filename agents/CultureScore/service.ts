/**
 * CultureScore Agent Service
 * Core logic for scoring cultural content
 */

import type { AgentPayload, AgentResult } from "../../core/types.js";
import type { CultureScoreOutput } from "./types.js";

export async function runCultureScoreTask(payload: AgentPayload): Promise<AgentResult> {
  const { task, data, context } = payload;
  const logs: string[] = [];

  try {
    switch (task) {
      case "score": {
        const { text, platform = "general" } = data || {};
        if (!text) {
          return {
            success: false,
            output: null,
            error: "Missing required field: text",
            logs: ["score requires 'text' field"],
          };
        }

        const scores = computeScores(text, platform);
        const output: CultureScoreOutput["score"] = scores;

        logs.push(`Scored content: ${(scores.overallScore * 100).toFixed(1)}%`);
        return {
          success: true,
          output,
          logs,
        };
      }

      case "analyze": {
        const { text, context: analysisContext } = data || {};
        if (!text) {
          return {
            success: false,
            output: null,
            error: "Missing required field: text",
            logs: ["analyze requires 'text' field"],
          };
        }

        const analysis = analyzeContent(text, analysisContext);
        const output: CultureScoreOutput["analyze"] = analysis;

        logs.push(`Analyzed content: ${analysis.themes.length} themes identified`);
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
          logs: [`Supported tasks: score, analyze`],
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

function computeScores(text: string, platform: string) {
  // Heuristic-based scoring
  const length = text.length;
  const wordCount = text.split(/\s+/).length;
  
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
  
  // Generate suggestions
  const suggestions: string[] = [];
  if (originalityScore < 0.5) {
    suggestions.push("Add more unique phrasing or cultural references");
  }
  if (viralityPotential < 0.5) {
    suggestions.push("Consider adding a question, emoji, or call-to-action");
  }
  if (culturalResonance < 0.5) {
    suggestions.push("Include more community-focused language");
  }
  if (length < 50) {
    suggestions.push("Expand content for better engagement");
  }
  if (length > 280) {
    suggestions.push("Consider shortening for better shareability");
  }
  
  return {
    originalityScore: Math.round(originalityScore * 100) / 100,
    viralityPotential: Math.round(viralityPotential * 100) / 100,
    culturalResonance: Math.round(culturalResonance * 100) / 100,
    overallScore: Math.round(overallScore * 100) / 100,
    suggestions: suggestions.length > 0 ? suggestions : ["Content looks good!"],
  };
}

function analyzeContent(text: string, context?: any) {
  // Sentiment analysis (simple heuristic)
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
  
  // Theme extraction (simple keyword matching)
  const themeKeywords: Record<string, string[]> = {
    "technology": ["tech", "code", "ai", "blockchain", "crypto", "web3"],
    "culture": ["culture", "community", "vibe", "movement"],
    "finance": ["money", "token", "coin", "trade", "invest", "hodl"],
    "philosophy": ["meaning", "purpose", "truth", "reality", "existence"],
  };
  
  const themes: string[] = [];
  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(kw => text.toLowerCase().includes(kw))) {
      themes.push(theme);
    }
  }
  
  // Cultural markers
  const culturalMarkers: string[] = [];
  const markers = ["based", "cringe", "fire", "mid", "vibes", "slaps", "hits different", "wagmi", "degen"];
  markers.forEach(marker => {
    if (text.toLowerCase().includes(marker)) {
      culturalMarkers.push(marker);
    }
  });
  
  // Recommendations
  const recommendations: string[] = [];
  if (sentiment === "neutral") {
    recommendations.push("Consider adding more emotional language");
  }
  if (themes.length === 0) {
    recommendations.push("Add more specific themes or topics");
  }
  if (culturalMarkers.length === 0) {
    recommendations.push("Include cultural markers for better resonance");
  }
  
  return {
    sentiment,
    themes: themes.length > 0 ? themes : ["general"],
    culturalMarkers,
    recommendations: recommendations.length > 0 ? recommendations : ["Content analysis complete"],
  };
}

