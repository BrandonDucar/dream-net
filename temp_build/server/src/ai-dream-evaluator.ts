#!/usr/bin/env tsx
/**
 * AI Dream Evaluator
 * 
 * Analyzes dreams and automatically evolves high-scoring ones into cocoons
 */

import { storage } from "./storage";
import { simpleNotifications } from "./simple-notifications";
import type { Dream } from "@dreamnet/shared/schema";

// Keywords for scoring different categories
const SCORING_KEYWORDS = {
  innovation: ["ai", "artificial", "intelligence", "machine", "learning", "neural", "quantum", "blockchain", "crypto", "web3", "defi", "nft", "metaverse", "vr", "ar", "virtual", "augmented"],
  technology: ["app", "platform", "software", "code", "programming", "development", "api", "database", "cloud", "serverless", "mobile", "web", "frontend", "backend", "fullstack"],
  creativity: ["art", "design", "music", "creative", "artistic", "visual", "audio", "video", "animation", "graphics", "ui", "ux", "aesthetic"],
  collaboration: ["social", "community", "network", "sharing", "collaborative", "team", "group", "connect", "communication", "chat", "forum"],
  impact: ["sustainability", "environment", "climate", "green", "renewable", "health", "medical", "education", "learning", "accessibility", "inclusive"],
  business: ["marketplace", "ecommerce", "fintech", "startup", "business", "enterprise", "saas", "b2b", "b2c", "revenue", "monetization"],
  gaming: ["game", "gaming", "interactive", "simulation", "experience", "entertainment", "fun", "play", "sandbox"],
  utility: ["tool", "utility", "productivity", "automation", "workflow", "efficiency", "optimization", "analytics", "dashboard"]
};

// High-value keywords that get bonus points
const BONUS_KEYWORDS = ["revolutionary", "innovative", "breakthrough", "cutting-edge", "next-generation", "disruptive", "scalable", "sustainable"];

interface DreamEvaluationResult {
  score: number;
  reasoning: string[];
  categoryScores: Record<string, number>;
  shouldEvolve: boolean;
  action: 'evolve' | 'reject' | 'pending';
}

export class DreamEvaluator {
  /**
   * Main evaluation function that analyzes a dream and takes action
   */
  async evaluateDream(dream: Dream): Promise<DreamEvaluationResult> {
    console.log(`\n🤖 AI DREAM EVALUATION`);
    console.log(`========================`);
    console.log(`Dream: "${dream.title}"`);
    console.log(`Tags: [${dream.tags?.join(", ") || "none"}]`);
    console.log(`Description: ${dream.description?.substring(0, 100)}...`);

    const result = this.analyzeDream(dream);
    
    console.log(`\n📊 SCORING BREAKDOWN:`);
    Object.entries(result.categoryScores).forEach(([category, score]) => {
      if (score > 0) {
        console.log(`  ${category}: ${score} points`);
      }
    });
    
    console.log(`\n🎯 FINAL SCORE: ${result.score}/100`);
    console.log(`\n🧠 REASONING:`);
    result.reasoning.forEach((reason, index) => {
      console.log(`  ${index + 1}. ${reason}`);
    });

    // Take action based on score
    if (result.score >= 60) {
      console.log(`\n✅ DECISION: EVOLVE TO COCOON (Score: ${result.score} ≥ 60)`);
      await this.evolveToCocoon(dream, result);
      result.action = 'evolve';
    } else {
      console.log(`\n❌ DECISION: REJECT (Score: ${result.score} < 60)`);
      await this.rejectDream(dream, result);
      result.action = 'reject';
    }

    console.log(`========================\n`);
    return result;
  }

  /**
   * Analyzes dream content and calculates score
   */
  private analyzeDream(dream: Dream): DreamEvaluationResult {
    const reasoning: string[] = [];
    const categoryScores: Record<string, number> = {};
    let totalScore = 0;

    // Combine title, description, and tags for analysis
    const analysisText = [
      dream.title,
      dream.description || "",
      ...(dream.tags || [])
    ].join(" ").toLowerCase();

    // Score each category
    Object.entries(SCORING_KEYWORDS).forEach(([category, keywords]) => {
      const matches = keywords.filter(keyword => analysisText.includes(keyword));
      const categoryScore = Math.min(matches.length * 5, 20); // Max 20 points per category
      
      if (categoryScore > 0) {
        categoryScores[category] = categoryScore;
        totalScore += categoryScore;
        reasoning.push(`${category} keywords found: ${matches.join(", ")} (+${categoryScore} points)`);
      }
    });

    // Bonus for high-value keywords
    const bonusMatches = BONUS_KEYWORDS.filter(keyword => analysisText.includes(keyword));
    if (bonusMatches.length > 0) {
      const bonusScore = bonusMatches.length * 10;
      categoryScores.bonus = bonusScore;
      totalScore += bonusScore;
      reasoning.push(`High-value keywords: ${bonusMatches.join(", ")} (+${bonusScore} bonus points)`);
    }

    // Tag diversity bonus
    const uniqueTags = new Set(dream.tags || []).size;
    if (uniqueTags >= 3) {
      const diversityBonus = Math.min(uniqueTags * 2, 10);
      categoryScores.diversity = diversityBonus;
      totalScore += diversityBonus;
      reasoning.push(`Tag diversity: ${uniqueTags} unique tags (+${diversityBonus} points)`);
    }

    // Length and detail bonus
    const descriptionLength = dream.description?.length || 0;
    if (descriptionLength > 50) {
      const detailBonus = Math.min(Math.floor(descriptionLength / 25), 15);
      categoryScores.detail = detailBonus;
      totalScore += detailBonus;
      reasoning.push(`Detailed description: ${descriptionLength} characters (+${detailBonus} points)`);
    }

    // Penalize if too generic
    const genericWords = ["app", "platform", "system", "tool", "solution"];
    const genericCount = genericWords.filter(word => analysisText.includes(word)).length;
    if (genericCount > 2) {
      const penalty = genericCount * 5;
      totalScore -= penalty;
      reasoning.push(`Generic terminology penalty: ${genericCount} generic words (-${penalty} points)`);
    }

    // Cap score at 100
    const finalScore = Math.min(Math.max(totalScore, 0), 100);

    if (reasoning.length === 0) {
      reasoning.push("No significant keywords or features detected");
    }

    return {
      score: finalScore,
      reasoning,
      categoryScores,
      shouldEvolve: finalScore >= 60,
      action: 'pending'
    };
  }

  /**
   * Evolves a dream into a cocoon
   */
  private async evolveToCocoon(dream: Dream, evaluation: DreamEvaluationResult): Promise<void> {
    try {
      // Create evolution chain entry for the dream
      await storage.createEvolutionChain({
        dreamId: dream.id,
        currentStage: "dream",
        metadata: {
          aiScore: evaluation.score,
          originalTags: dream.tags,
          evaluationDate: new Date().toISOString(),
          categoryScores: evaluation.categoryScores
        }
      });

      // Update dream status to approved
      await storage.updateDreamStatus(dream.id, "approved", "ai_evaluator");
      await storage.updateDreamScore(dream.id, evaluation.score, {
        originality: Math.min(evaluation.categoryScores.innovation || 0, 25),
        traction: Math.min(evaluation.categoryScores.technology || 0, 25),
        collaboration: Math.min(evaluation.categoryScores.collaboration || 0, 25),
        updates: Math.min(evaluation.categoryScores.detail || 0, 25)
      });

      // Create cocoon
      const cocoon = await storage.createCocoon({
        dreamId: dream.id,
        title: `${dream.title} Cocoon`,
        description: `Evolved from dream: ${dream.description}`,
        creatorWallet: dream.wallet
      });

      // Set initial cocoon stage
      await storage.updateCocoon(cocoon.id, {
        stage: "incubating"
      });

      // Update cocoon tags and score separately
      await storage.updateCocoonTags(cocoon.id, dream.tags || []);

      // Update evolution chain to reflect cocoon creation
      await storage.updateEvolutionChain(dream.id, {
        cocoonId: cocoon.id,
        currentStage: "cocoon_incubating",
        evolvedAt: new Date()
      });

      console.log(`🎉 Created cocoon "${cocoon.title}" (ID: ${cocoon.id})`);

      // Send success notification
      simpleNotifications.addNotification(
        dream.wallet,
        "dream_approved",
        `🎉 Your dream "${dream.title}" scored ${evaluation.score}/100 and evolved into a cocoon!`
      );

    } catch (error) {
      console.log(`❌ Error evolving dream to cocoon: ${error}`);
    }
  }

  /**
   * Rejects a dream and sends notification
   */
  private async rejectDream(dream: Dream, evaluation: DreamEvaluationResult): Promise<void> {
    try {
      // Update dream status to rejected
      await storage.updateDreamStatus(dream.id, "rejected", "ai_evaluator");
      await storage.updateDreamScore(dream.id, evaluation.score, {
        originality: Math.min(evaluation.categoryScores.innovation || 0, 25),
        traction: Math.min(evaluation.categoryScores.technology || 0, 25),
        collaboration: Math.min(evaluation.categoryScores.collaboration || 0, 25),
        updates: Math.min(evaluation.categoryScores.detail || 0, 25)
      });

      console.log(`📝 Dream rejected with score: ${evaluation.score}/100`);

      // Send rejection notification with feedback
      const feedback = evaluation.reasoning.slice(0, 3).join("; ");
      simpleNotifications.addNotification(
        dream.wallet,
        "dream_rejected",
        `Your dream "${dream.title}" scored ${evaluation.score}/100 and needs improvement. Feedback: ${feedback}`
      );

    } catch (error) {
      console.log(`❌ Error rejecting dream: ${error}`);
    }
  }

  /**
   * Batch evaluate all pending dreams
   */
  async evaluateAllPendingDreams(): Promise<void> {
    console.log(`\n🚀 BATCH DREAM EVALUATION`);
    console.log(`===========================`);

    try {
      // Get all dreams and filter for pending status
      const allDreams = await storage.getDreams(100, 0);
      const pendingDreams = allDreams.filter(dream => dream.status === "pending");
      
      if (pendingDreams.length === 0) {
        console.log(`No pending dreams to evaluate`);
        return;
      }

      console.log(`Found ${pendingDreams.length} pending dreams to evaluate`);

      for (const dream of pendingDreams) {
        await this.evaluateDream(dream);
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Completed evaluation of ${pendingDreams.length} dreams`);

    } catch (error) {
      console.log(`❌ Error in batch evaluation: ${error}`);
    }
  }
}

// Export singleton instance
export const dreamEvaluator = new DreamEvaluator();