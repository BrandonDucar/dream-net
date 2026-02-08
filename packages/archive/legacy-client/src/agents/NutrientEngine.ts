import { Dream } from '@/components/DreamNodeCard';

export async function runNutrientEngine(): Promise<{ nourished: Dream[]; nutrientReport: any }> {
  try {
    // Call the backend API to trigger nutrient engine processing
    const response = await fetch('/api/agents/nutrient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to run nutrient engine: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error running nutrient engine:', error);
    
    // Fallback to mock nourishment for development
    const nutrientReport = {
      totalDreamsNourished: 0,
      healthBoosts: 0,
      engagementImprovements: 0,
      viralityEnhancements: 0,
      nutrientTypes: ['creativity', 'resonance', 'connectivity', 'stability'],
      processingTimestamp: new Date().toISOString()
    };

    return {
      nourished: [],
      nutrientReport
    };
  }
}

export function applyNutrients(dream: Dream): Dream {
  // Calculate nutrient requirements based on dream state
  const needsCreativity = dream.emotionalProfile.intensityScore < 0.6;
  const needsResonance = dream.communityImpact.networkConnections < 20;
  const needsConnectivity = dream.viralityMetrics.shareVelocity < 15;
  const needsStability = dream.healthScore < 70;

  let healthBoost = 0;
  let engagementBoost = 0;
  let viralityBoost = 0;

  // Apply creativity nutrients
  if (needsCreativity) {
    dream.emotionalProfile.intensityScore = Math.min(1.0, dream.emotionalProfile.intensityScore + 0.15);
    engagementBoost += 5;
  }

  // Apply resonance nutrients
  if (needsResonance) {
    dream.communityImpact.networkConnections += Math.floor(Math.random() * 10) + 5;
    dream.communityImpact.influenceRadius += Math.floor(Math.random() * 200) + 100;
    healthBoost += 8;
  }

  // Apply connectivity nutrients
  if (needsConnectivity) {
    dream.viralityMetrics.shareVelocity += Math.random() * 10 + 5;
    dream.metrics.shares += Math.floor(Math.random() * 20) + 10;
    viralityBoost += 12;
  }

  // Apply stability nutrients
  if (needsStability) {
    healthBoost += Math.floor(Math.random() * 15) + 10;
    dream.metrics.likes += Math.floor(Math.random() * 50) + 25;
  }

  // Apply boosts
  dream.healthScore = Math.min(100, dream.healthScore + healthBoost);
  dream.engagementScore = Math.min(100, dream.engagementScore + engagementBoost);

  // Update decay status if nourished
  if (dream.decayTags && (healthBoost > 0 || engagementBoost > 0)) {
    dream.decayTags.status = 'healthy';
    dream.decayTags.flags = dream.decayTags.flags.filter(flag => 
      !['low-health', 'low-engagement', 'low-velocity'].includes(flag)
    );
    dream.decayTags.lastChecked = new Date().toISOString();
  }

  return dream;
}

export function generateNutrientDream(): Dream {
  return {
    dreamId: `nutrient-${Date.now()}`,
    healthScore: 95,
    engagementScore: 88,
    remixLineage: [
      { id: `nutrient-${Date.now()}`, title: 'Nourishment Catalyst' }
    ],
    metrics: {
      views: 3500,
      likes: 280,
      shares: 85,
      remixes: 15,
      comments: 120
    },
    emotionalProfile: {
      primaryEmotion: 'hope',
      secondaryEmotions: ['love', 'joy'],
      intensityScore: 0.85
    },
    communityImpact: {
      influenceRadius: 2200,
      networkConnections: 65,
      crossPlatformMentions: 18,
      collaborationRequests: 12
    },
    evolutionPath: {
      generationLevel: 3,
      branchingFactor: 6,
      divergenceScore: 0.75,
      convergencePoints: 4
    },
    viralityMetrics: {
      shareVelocity: 35,
      peakMomentum: new Date().toISOString(),
      currentTrend: 'rising',
      saturationLevel: 0.25
    },
    decayTags: {
      status: 'healthy',
      flags: [],
      lastChecked: new Date().toISOString()
    },
    narration: {
      summary: 'A nourishment catalyst dream, radiating healing energy and growth potential throughout the network, restoring vitality to connected dreams.',
      lastNarrated: new Date().toISOString()
    },
    tags: ['#hope', '#nourishment', '#catalyst', '#healing', '#growth', '#vitality'],
    lore: {
      content: 'In the age of rising dreams, this nourishment vision achieved velocity of healing throughout the network. The collective sang its praises through restoration and growth. Its peak momentum reached during times of need, marking a moment of collective renewal and vitality restoration.',
      lastUpdated: new Date().toISOString()
    }
  };
}