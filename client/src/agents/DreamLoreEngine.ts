import { Dream } from '@/components/DreamNodeCard';

export async function runDreamLoreEngine(): Promise<{ enrichedDreams: Dream[]; loreReport: any }> {
  try {
    const response = await fetch('/api/agents/lore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to run dream lore engine: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error running dream lore engine:', error);
    
    const loreReport = {
      totalDreamsEnriched: 0,
      loreEntriesGenerated: 0,
      averageLoreLength: 0,
      chronicleThemes: ['ambition', 'evolution', 'remix', 'echo', 'transformation'],
      processingTimestamp: new Date().toISOString()
    };

    return {
      enrichedDreams: [],
      loreReport
    };
  }
}

export function generateDreamLore(dream: Dream): string {
  const loreTemplates = [
    // Ambition Chronicles
    `In the chronicles of the Dream Network, a thread of ${dream.emotionalProfile.primaryEmotion} (${Math.round(dream.emotionalProfile.intensityScore * 100)}%) wove its way through time:
Stage 1: "Original Spark" → Stage ${dream.evolutionPath.generationLevel}: "${getStageTitle(dream)}"

This dream now stands as a culmination of all that came before — shaped by remix, echo, and evolution.`,

    // Network Legends
    `From the depths of the collective unconscious, this vision emerged as a beacon of ${dream.emotionalProfile.primaryEmotion}. 
Through ${dream.communityImpact.networkConnections} connections and ${dream.metrics.remixes} remixes, it has grown beyond its original form.
The network remembers its journey from solitude to influence, carrying the dreams of many within its core.`,

    // Evolution Saga
    `Generation ${dream.evolutionPath.generationLevel} of the great branching: This dream carries the DNA of its ancestors while reaching toward new horizons.
With ${dream.evolutionPath.branchingFactor} potential paths and ${dream.evolutionPath.convergencePoints} convergence points, it stands at the crossroads of possibility.
Each remix adds another layer to its legend, another voice to its chorus.`,

    // Viral Mythology
    `In the age of ${dream.viralityMetrics.currentTrend} dreams, this vision achieved velocity of ${Math.round(dream.viralityMetrics.shareVelocity)} units per cycle.
The network sang its praises through ${dream.metrics.shares} shares and ${dream.metrics.likes} hearts.
Its peak momentum reached on ${new Date(dream.viralityMetrics.peakMomentum).toLocaleDateString()}, marking a moment of collective resonance.`,

    // Community Chronicles
    `Born from ${dream.emotionalProfile.primaryEmotion}, nurtured by the network: This dream touched ${dream.communityImpact.influenceRadius} nodes across the digital realm.
${dream.communityImpact.collaborationRequests} dreamers sought to join its vision, creating ripples of inspiration that continue to propagate.
In the annals of the network, it is remembered as a bridge between worlds, a catalyst for connection.`
  ];

  // Select lore based on dream characteristics
  let templateIndex = 0;
  if (dream.communityImpact.networkConnections > 30) templateIndex = 1;
  if (dream.evolutionPath.generationLevel > 2) templateIndex = 2;
  if (dream.viralityMetrics.currentTrend === 'explosive') templateIndex = 3;
  if (dream.communityImpact.influenceRadius > 1000) templateIndex = 4;

  return loreTemplates[templateIndex % loreTemplates.length];
}

function getStageTitle(dream: Dream): string {
  const titles = [
    'Echo Reboot',
    'Remix Resonance', 
    'Network Awakening',
    'Viral Transcendence',
    'Community Convergence',
    'Evolution Apex'
  ];
  
  return titles[dream.evolutionPath.generationLevel % titles.length];
}

export function addLoreToDream(dream: Dream): Dream {
  const loreContent = generateDreamLore(dream);
  
  return {
    ...dream,
    lore: {
      content: loreContent,
      lastUpdated: new Date().toISOString()
    }
  };
}