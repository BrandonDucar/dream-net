import { Dream } from '@/components/DreamNodeCard';

export async function runRemixAgent(topCount: number = 5): Promise<Dream[]> {
  try {
    // Call the backend API to trigger remix agent processing
    const response = await fetch('/api/agents/remix', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topCount })
    });

    if (!response.ok) {
      throw new Error(`Failed to run remix agent: ${response.status}`);
    }

    const result = await response.json();
    return result.remixedDreams || [];
  } catch (error) {
    console.error('Error running remix agent:', error);
    
    // Fallback to mock data for development
    const mockRemixedDreams: Dream[] = Array.from({ length: topCount }, (_, i) => ({
      dreamId: `remix-${Date.now()}-${i}`,
      healthScore: 85 + (i * 2),
      engagementScore: 90 + (i * 1.5),
      remixLineage: [
        { id: `remix-${Date.now()}-${i}`, title: `Remixed Vision ${i + 1}` }
      ],
      metrics: {
        views: 2000 + (i * 300),
        likes: 150 + (i * 20),
        shares: 45 + (i * 5),
        remixes: 8 + i,
        comments: 32 + (i * 4)
      },
      emotionalProfile: {
        primaryEmotion: ['curiosity', 'ambition', 'hope'][i % 3] as any,
        secondaryEmotions: ['joy', 'love'],
        intensityScore: 0.7 + (i * 0.05)
      },
      communityImpact: {
        influenceRadius: 1500 + (i * 200),
        networkConnections: 45 + (i * 5),
        crossPlatformMentions: 12 + i,
        collaborationRequests: 8 + i
      },
      evolutionPath: {
        generationLevel: 2 + i,
        branchingFactor: 4 + i,
        divergenceScore: 0.6 + (i * 0.05),
        convergencePoints: 2 + i
      },
      viralityMetrics: {
        shareVelocity: 25 + (i * 3),
        peakMomentum: new Date().toISOString(),
        currentTrend: ['rising', 'explosive', 'ascending'][i % 3] as any,
        saturationLevel: 0.4 + (i * 0.1)
      },
      decayTags: {
        status: 'healthy',
        flags: [],
        lastChecked: new Date().toISOString()
      },
      narration: {
        summary: `A remix dream born from ${baseDream ? baseDream.remixLineage[0]?.title : 'collective inspiration'}, carrying forward the essence of ${emotions[i % emotions.length]} through ${2 + i} generational layers.`,
        lastNarrated: new Date().toISOString()
      },
      tags: [`#${emotions[i % emotions.length]}`, '#remix', '#evolution', `#gen${2 + i}`, '#network', `#dream${String(i).padStart(2, '0')}`],
      lore: {
        content: `In the chronicles of the Dream Network, a thread of ${emotions[i % emotions.length]} (${Math.round((0.6 + (i * 0.05)) * 100)}%) wove its way through time: Stage 1: "Original Spark" → Stage ${2 + i}: "Remix Evolution". This dream now stands as a culmination of all that came before — shaped by remix, echo, and evolution.`,
        lastUpdated: new Date().toISOString()
      }
    }));

    return mockRemixedDreams;
  }
}