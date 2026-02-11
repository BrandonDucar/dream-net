import { Dream } from '@/components/DreamNodeCard';

export async function runDreamTagsAgent(): Promise<{ taggedDreams: Dream[]; taggingReport: any }> {
  try {
    const response = await fetch('/api/agents/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to run dream tags agent: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error running dream tags agent:', error);
    
    const taggingReport = {
      totalDreamsTagged: 0,
      uniqueTagsGenerated: 0,
      mostCommonTags: ['#ambition', '#trending', '#rising', '#impactful'],
      tagCategories: ['emotion', 'trend', 'network', 'generation', 'impact'],
      processingTimestamp: new Date().toISOString()
    };

    return {
      taggedDreams: [],
      taggingReport
    };
  }
}

export function generateDreamTags(dream: Dream): string[] {
  const tags: string[] = [];

  // Emotion-based tags
  tags.push(`#${dream.emotionalProfile.primaryEmotion}`);
  dream.emotionalProfile.secondaryEmotions.forEach(emotion => {
    tags.push(`#${emotion}`);
  });

  // Trend tags
  if (dream.viralityMetrics.currentTrend === 'explosive') tags.push('#viral');
  if (dream.viralityMetrics.currentTrend === 'rising') tags.push('#rising');
  if (dream.viralityMetrics.currentTrend === 'ascending') tags.push('#trending');
  if (dream.viralityMetrics.currentTrend === 'stable') tags.push('#stable');

  // Health tags
  if (dream.healthScore > 80) tags.push('#healthy');
  if (dream.healthScore < 50) tags.push('#struggling');

  // Network tags
  if (dream.communityImpact.networkConnections > 50) tags.push('#connected');
  if (dream.communityImpact.influenceRadius > 1500) tags.push('#influential');
  if (dream.communityImpact.collaborationRequests > 10) tags.push('#collaborative');

  // Generation tags
  if (dream.evolutionPath.generationLevel === 1) tags.push('#original');
  if (dream.evolutionPath.generationLevel > 3) tags.push('#evolved');
  if (dream.metrics.remixes > 20) tags.push('#remixable');

  // Impact tags
  if (dream.engagementScore > 80) tags.push('#engaging');
  if (dream.viralityMetrics.shareVelocity > 30) tags.push('#impactful');
  if (dream.emotionalProfile.intensityScore > 0.8) tags.push('#intense');

  // Unique identifiers
  tags.push(`#dream${dream.dreamId.slice(-2)}`);
  tags.push(`#node${Math.floor(Math.random() * 99) + 1}`);

  return tags.slice(0, 6); // Limit to 6 tags
}