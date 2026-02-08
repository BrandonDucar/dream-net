import { Dream } from '@/components/DreamNodeCard';

export async function runLinkAgent(maxLinks: number = 5): Promise<Dream[]> {
  try {
    // Call the backend API to trigger link agent processing
    const response = await fetch('/api/agents/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ maxLinks })
    });

    if (!response.ok) {
      throw new Error(`Failed to run link agent: ${response.status}`);
    }

    const result = await response.json();
    return result.linkDreams || [];
  } catch (error) {
    console.error('Error running link agent:', error);
    
    // Fallback to mock data for development
    const mockLinkDreams: Dream[] = Array.from({ length: maxLinks }, (_, i) => ({
      dreamId: `link-${Date.now()}-${i}`,
      healthScore: 75 + (i * 3),
      engagementScore: 80 + (i * 2.5),
      remixLineage: [
        { id: `link-${Date.now()}-${i}`, title: `Link Dream ${i + 1}` },
        { id: `source-${i}`, title: `Connected Vision ${i + 1}` }
      ],
      metrics: {
        views: 1800 + (i * 250),
        likes: 120 + (i * 18),
        shares: 35 + (i * 4),
        remixes: 6 + i,
        comments: 28 + (i * 3)
      },
      emotionalProfile: {
        primaryEmotion: ['curiosity', 'hope', 'ambition', 'love', 'joy'][i % 5] as any,
        secondaryEmotions: ['curiosity', 'hope'],
        intensityScore: 0.65 + (i * 0.06)
      },
      communityImpact: {
        influenceRadius: 1200 + (i * 180),
        networkConnections: 38 + (i * 4),
        crossPlatformMentions: 9 + i,
        collaborationRequests: 6 + i
      },
      evolutionPath: {
        generationLevel: 1 + i,
        branchingFactor: 3 + i,
        divergenceScore: 0.5 + (i * 0.07),
        convergencePoints: 1 + i
      },
      viralityMetrics: {
        shareVelocity: 20 + (i * 2.5),
        peakMomentum: new Date().toISOString(),
        currentTrend: ['rising', 'stable', 'ascending', 'explosive', 'rising'][i % 5] as any,
        saturationLevel: 0.3 + (i * 0.08)
      },
      decayTags: {
        status: 'healthy',
        flags: [],
        lastChecked: new Date().toISOString()
      },
      narration: {
        summary: `A bridge dream connecting distant nodes in the network, weaving ${emotions[i % emotions.length]} energy through ${1 + i} convergence points to unite scattered visions.`,
        lastNarrated: new Date().toISOString()
      },
      tags: [`#${emotions[i % emotions.length]}`, '#bridge', '#connection', '#network', '#unity', `#node${20 + i}`],
      lore: {
        content: `From the depths of the collective unconscious, this bridge vision emerged as a beacon of ${emotions[i % emotions.length]}. Through ${45 + (i * 5)} connections and distributed harmony, it has grown beyond its original form. The network remembers its journey from isolation to unity, carrying the dreams of many within its connecting core.`,
        lastUpdated: new Date().toISOString()
      }
    }));

    return mockLinkDreams;
  }
}