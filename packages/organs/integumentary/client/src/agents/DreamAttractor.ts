import { Dream } from '@/components/DreamNodeCard';

export async function runDreamAttractor(): Promise<Dream[]> {
  try {
    // Call the backend API to trigger dream attractor processing
    const response = await fetch('/api/agents/attractor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to run dream attractor: ${response.status}`);
    }

    const result = await response.json();
    return result.attractedDreams || [];
  } catch (error) {
    console.error('Error running dream attractor:', error);
    
    // Generate attracted dreams using the scoring algorithm
    return generateAttractedDreams();
  }
}

function calculateDreamScore(dream: Dream): number {
  // Extract scoring components
  const trust = calculateTrust(dream);
  const potential = calculatePotential(dream);
  const remixability = calculateRemixability(dream);
  const freshness = calculateFreshness(dream);
  const decay = calculateDecay(dream);

  // Apply scoring formula: score = trust × 0.3 + potential × 0.4 + remixability × 0.2 + freshness × 0.1 − decay × 0.2
  const score = (trust * 0.3) + (potential * 0.4) + (remixability * 0.2) + (freshness * 0.1) - (decay * 0.2);
  
  return Math.max(0, Math.min(100, score)); // Clamp between 0-100
}

function calculateTrust(dream: Dream): number {
  // Trust based on community impact and network connections
  const networkStrength = Math.min(100, dream.communityImpact.networkConnections * 2);
  const influenceRadius = Math.min(100, dream.communityImpact.influenceRadius / 20);
  const collaborationFactor = Math.min(100, dream.communityImpact.collaborationRequests * 10);
  
  return (networkStrength + influenceRadius + collaborationFactor) / 3;
}

function calculatePotential(dream: Dream): number {
  // Potential based on emotional intensity and virality metrics
  const emotionalPower = dream.emotionalProfile.intensityScore * 100;
  const viralVelocity = Math.min(100, dream.viralityMetrics.shareVelocity * 2);
  const trendMomentum = getTrendScore(dream.viralityMetrics.currentTrend);
  
  return (emotionalPower + viralVelocity + trendMomentum) / 3;
}

function calculateRemixability(dream: Dream): number {
  // Remixability based on branching factor and divergence
  const branchingPower = Math.min(100, dream.evolutionPath.branchingFactor * 12.5);
  const divergenceFlexibility = dream.evolutionPath.divergenceScore * 100;
  const remixHistory = Math.min(100, dream.metrics.remixes * 5);
  
  return (branchingPower + divergenceFlexibility + remixHistory) / 3;
}

function calculateFreshness(dream: Dream): number {
  // Freshness based on generation level and recent activity
  const generationBonus = Math.max(0, 100 - (dream.evolutionPath.generationLevel * 20));
  const activityLevel = Math.min(100, (dream.metrics.likes + dream.metrics.shares) / 10);
  
  return (generationBonus + activityLevel) / 2;
}

function calculateDecay(dream: Dream): number {
  // Decay based on health score and decay flags
  const healthDecay = 100 - dream.healthScore;
  const flagPenalty = dream.decayTags ? dream.decayTags.flags.length * 15 : 0;
  const statusPenalty = dream.decayTags ? getStatusPenalty(dream.decayTags.status) : 0;
  
  return Math.min(100, healthDecay + flagPenalty + statusPenalty);
}

function getTrendScore(trend: string): number {
  const trendScores: Record<string, number> = {
    'explosive': 95,
    'rising': 80,
    'ascending': 70,
    'stable': 50,
    'declining': 20
  };
  return trendScores[trend] || 50;
}

function getStatusPenalty(status: string): number {
  const statusPenalties: Record<string, number> = {
    'healthy': 0,
    'decaying': 20,
    'critical': 40,
    'archived': 60
  };
  return statusPenalties[status] || 0;
}

function generateAttractedDreams(): Dream[] {
  const attractedDreams: Dream[] = [];
  const emotions = ['ambition', 'curiosity', 'hope', 'joy', 'love'];
  const trends = ['explosive', 'rising', 'ascending'];

  for (let i = 0; i < 3; i++) {
    const emotion = emotions[i % emotions.length];
    const trend = trends[i % trends.length];
    
    const dream: Dream = {
      dreamId: `attracted-${Date.now()}-${i}`,
      healthScore: 85 + Math.random() * 15,
      engagementScore: 80 + Math.random() * 20,
      remixLineage: [
        { id: `attracted-${Date.now()}-${i}`, title: `Attracted Dream ${i + 1}` }
      ],
      metrics: {
        views: Math.floor(Math.random() * 8000) + 2000,
        likes: Math.floor(Math.random() * 800) + 200,
        shares: Math.floor(Math.random() * 300) + 100,
        remixes: Math.floor(Math.random() * 80) + 20,
        comments: Math.floor(Math.random() * 400) + 100
      },
      emotionalProfile: {
        primaryEmotion: emotion,
        secondaryEmotions: emotions.filter(e => e !== emotion).slice(0, 2),
        intensityScore: 0.7 + Math.random() * 0.3
      },
      communityImpact: {
        influenceRadius: Math.floor(Math.random() * 2000) + 1000,
        networkConnections: Math.floor(Math.random() * 80) + 40,
        crossPlatformMentions: Math.floor(Math.random() * 30) + 15,
        collaborationRequests: Math.floor(Math.random() * 20) + 10
      },
      evolutionPath: {
        generationLevel: Math.floor(Math.random() * 3) + 1,
        branchingFactor: Math.floor(Math.random() * 10) + 5,
        divergenceScore: 0.6 + Math.random() * 0.4,
        convergencePoints: Math.floor(Math.random() * 6) + 3
      },
      viralityMetrics: {
        shareVelocity: 30 + Math.random() * 40,
        peakMomentum: new Date().toISOString(),
        currentTrend: trend,
        saturationLevel: 0.2 + Math.random() * 0.4
      },
      decayTags: {
        status: 'healthy',
        flags: [],
        lastChecked: new Date().toISOString()
      },
      narration: {
        summary: `An attracted dream manifesting from the collective unconscious, drawn by the gravitational pull of ${emotion} energy and ${trend} momentum, scoring high on the attraction algorithm.`,
        lastNarrated: new Date().toISOString()
      },
      tags: [`#${emotion}`, `#${trend}`, '#attracted', '#algorithmic', '#gravity', `#node${50 + i}`],
      lore: {
        content: `Generation ${Math.floor(Math.random() * 3) + 1} of the great branching: This attracted dream carries the DNA of algorithmic selection while reaching toward new horizons. With ${Math.floor(Math.random() * 10) + 5} potential paths and ${Math.floor(Math.random() * 6) + 3} convergence points, it stands at the crossroads of possibility. Each attraction adds another layer to its legend, another force to its momentum.`,
        lastUpdated: new Date().toISOString()
      }
    };

    // Calculate and log the attraction score
    const score = calculateDreamScore(dream);
    console.log(`Dream ${dream.dreamId} attraction score: ${score.toFixed(2)}`);
    
    attractedDreams.push(dream);
  }

  return attractedDreams;
}

export { calculateDreamScore };