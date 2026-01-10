import { SEOInsight, SEOOptimization, SEOKeyword } from "../types";
import { SEOStore } from "../store/seoStore";

let insightCounter = 0;
function nextInsightId() {
  insightCounter += 1;
  return `seo:insight:${Date.now()}:${insightCounter}`;
}

/**
 * Generate SEO insights
 */
export function generateSEOInsights(): SEOInsight[] {
  const insights: SEOInsight[] = [];
  const optimizations = SEOStore.listOptimizations();
  const keywords = SEOStore.listKeywords();

  // Check for low SEO scores
  const lowScoreOptimizations = optimizations.filter((o) => o.score < 50);
  if (lowScoreOptimizations.length > 0) {
    insights.push({
      id: nextInsightId(),
      type: "warning",
      title: `${lowScoreOptimizations.length} content piece(s) have low SEO scores`,
      description: "Consider optimizing titles, descriptions, and keyword usage to improve search visibility.",
      priority: "medium",
      createdAt: Date.now(),
      meta: { lowScoreCount: lowScoreOptimizations.length },
    });
  }

  // Check for keyword opportunities
  const highVolumeKeywords = keywords.filter((k) => k.volume > 1000 && k.difficulty < 0.5);
  if (highVolumeKeywords.length > 0) {
    insights.push({
      id: nextInsightId(),
      type: "opportunity",
      title: `${highVolumeKeywords.length} high-opportunity keyword(s) identified`,
      description: "These keywords have high search volume and low competition. Consider creating content around them.",
      priority: "high",
      createdAt: Date.now(),
      meta: { keywords: highVolumeKeywords.map((k) => k.keyword) },
    });
  }

  // Check for missing optimizations
  const avgScore = optimizations.length > 0
    ? optimizations.reduce((sum, o) => sum + o.score, 0) / optimizations.length
    : 0;

  if (avgScore < 70) {
    insights.push({
      id: nextInsightId(),
      type: "recommendation",
      title: "Overall SEO score below target",
      description: `Average SEO score is ${avgScore.toFixed(1)}. Focus on improving title optimization, keyword usage, and meta tags.`,
      priority: "medium",
      createdAt: Date.now(),
      meta: { avgScore },
    });
  }

  // Trend: New keywords discovered
  const recentKeywords = keywords.filter((k) => Date.now() - k.discoveredAt < 24 * 60 * 60 * 1000);
  if (recentKeywords.length > 5) {
    insights.push({
      id: nextInsightId(),
      type: "trend",
      title: `${recentKeywords.length} new keywords discovered in last 24h`,
      description: "New keyword opportunities are being identified. Review and prioritize for content creation.",
      priority: "low",
      createdAt: Date.now(),
      meta: { keywordCount: recentKeywords.length },
    });
  }

  for (const insight of insights) {
    SEOStore.addInsight(insight);
  }

  return insights;
}

