/**
 * CultureScore Agent Types
 * Scores content for cultural resonance and virality potential
 */

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
    originalityScore: number; // 0-1
    viralityPotential: number; // 0-1
    culturalResonance: number; // 0-1
    overallScore: number; // 0-1
    suggestions: string[];
  };
  analyze: {
    sentiment: "positive" | "neutral" | "negative";
    themes: string[];
    culturalMarkers: string[];
    recommendations: string[];
  };
}

