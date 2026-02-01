import type { Dream } from "@dreamnet/shared/schema";

// Predefined keywords for AI tag matching
const IMPACT_KEYWORDS = ["ai", "web3", "automation", "token", "community", "education", "privacy", "open-source"];
const TECH_KEYWORDS = ["blockchain", "machine learning", "neural", "digital", "quantum", "virtual", "augmented", "crypto", "DeFi", "NFT", "metaverse"];

interface AIScoringResult {
  aiScore: number;
  aiTags: string[];
}

export function calculateAIScore(dream: Pick<Dream, 'title' | 'description' | 'tags' | 'urgency' | 'origin'>): AIScoringResult {
  let score = 0;
  const foundTags: string[] = [];
  
  // Base score calculation
  
  // +20 if urgency = 5
  if (dream.urgency === 5) {
    score += 20;
    foundTags.push("high-urgency");
  }
  
  // +10 if origin = "flutterbye"
  if (dream.origin === "flutterbye") {
    score += 10;
    foundTags.push("flutterbye-origin");
  }
  
  // Keyword scoring - prioritize impact keywords
  const allText = `${dream.title} ${dream.description} ${dream.tags?.join(' ') || ''}`.toLowerCase();
  
  // +10 per impact keyword matched (max 80 points for all 8 keywords)
  IMPACT_KEYWORDS.forEach(keyword => {
    if (allText.includes(keyword.toLowerCase())) {
      score += 10;
      foundTags.push(`impact-${keyword.toLowerCase()}`);
    }
  });
  
  // +3 per tech keyword matched (additional scoring)
  TECH_KEYWORDS.forEach(keyword => {
    if (allText.includes(keyword.toLowerCase())) {
      score += 3;
      foundTags.push(`tech-${keyword.toLowerCase()}`);
    }
  });
  
  // Additional scoring based on content analysis
  
  // Innovation indicators
  if (allText.includes('innovation') || allText.includes('revolutionary') || allText.includes('breakthrough')) {
    score += 8;
    foundTags.push("innovation");
  }
  
  // Technology keywords
  if (allText.includes('technology') || allText.includes('tech') || allText.includes('digital')) {
    score += 6;
    foundTags.push("technology");
  }
  
  // Future-oriented language
  if (allText.includes('future') || allText.includes('tomorrow') || allText.includes('next-gen')) {
    score += 4;
    foundTags.push("future-oriented");
  }
  
  // Complexity indicators
  if (allText.includes('complex') || allText.includes('algorithm') || allText.includes('system')) {
    score += 3;
    foundTags.push("complex-system");
  }
  
  // Cap at 100
  score = Math.min(score, 100);
  
  return {
    aiScore: score,
    aiTags: foundTags
  };
}

export function getScoreBadge(score: number | null | undefined): { label: string; color: string; emoji: string } {
  if (!score && score !== 0) {
    return { label: "Not Scored", color: "gray", emoji: "❓" };
  }
  
  if (score >= 80) {
    return { label: "Hot Dream", color: "red", emoji: "🔥" };
  } else if (score >= 60) {
    return { label: "Promising", color: "green", emoji: "🌱" };
  } else {
    return { label: "Needs Work", color: "blue", emoji: "💤" };
  }
}