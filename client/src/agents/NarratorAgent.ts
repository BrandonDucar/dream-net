import { Dream } from '@/components/DreamNodeCard';

export async function runNarratorAgent(): Promise<{ narratedDreams: Dream[]; narrationReport: any }> {
  try {
    // Call the backend API to trigger narrator agent processing
    const response = await fetch('/api/agents/narrator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to run narrator agent: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error running narrator agent:', error);
    
    // Fallback to mock narration for development
    const narrationReport = {
      totalDreamsNarrated: 0,
      summariesGenerated: 0,
      averageSummaryLength: 0,
      narrationStyles: ['poetic', 'analytical', 'mystical', 'technical'],
      processingTimestamp: new Date().toISOString()
    };

    return {
      narratedDreams: [],
      narrationReport
    };
  }
}

export function generateNarration(dream: Dream): string {
  const narratives = [
    `A ${dream.emotionalProfile.primaryEmotion} dream pulsing with ${Math.round(dream.emotionalProfile.intensityScore * 100)}% intensity, weaving through ${dream.communityImpact.networkConnections} connections in the dream network.`,
    
    `This dream resonates at generation ${dream.evolutionPath.generationLevel}, branching into ${dream.evolutionPath.branchingFactor} possibilities while maintaining a health score of ${Math.round(dream.healthScore)}%.`,
    
    `Born from ${dream.emotionalProfile.primaryEmotion}, this vision has sparked ${dream.metrics.remixes} remixes and captured ${dream.metrics.likes} hearts across the network.`,
    
    `A ${dream.viralityMetrics.currentTrend} force in the dream ecosystem, carrying ${dream.emotionalProfile.secondaryEmotions.join(' and ')} undertones through its ${dream.communityImpact.influenceRadius}-unit radius.`,
    
    `Emerging from the depths of collective consciousness, this dream bridges ${dream.evolutionPath.convergencePoints} convergence points with ${Math.round(dream.emotionalProfile.intensityScore * 100)}% emotional clarity.`
  ];

  // Select narrative based on dream characteristics
  let narrativeIndex = 0;
  if (dream.healthScore > 80) narrativeIndex = 1;
  if (dream.metrics.remixes > 10) narrativeIndex = 2;
  if (dream.viralityMetrics.currentTrend === 'explosive') narrativeIndex = 3;
  if (dream.evolutionPath.generationLevel > 3) narrativeIndex = 4;

  return narratives[narrativeIndex % narratives.length];
}

export function addNarrationToDream(dream: Dream): Dream {
  const summary = generateNarration(dream);
  
  return {
    ...dream,
    narration: {
      summary,
      lastNarrated: new Date().toISOString()
    }
  };
}