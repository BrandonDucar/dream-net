import { Dream } from '@/components/DreamNodeCard';

export async function runScoreAgent(): Promise<{ updatedDreams: Dream[]; scoreReport: any }> {
  try {
    // Call the backend API to trigger score agent processing
    const response = await fetch('/api/agents/score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to run score agent: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error running score agent:', error);
    
    // Fallback to mock scoring for development
    const scoreReport = {
      totalDreamsScored: 0,
      averageHealthScore: 0,
      averageEngagementScore: 0,
      trendingDreams: [],
      healthyDreams: [],
      atRiskDreams: [],
      scoringTimestamp: new Date().toISOString()
    };

    return {
      updatedDreams: [],
      scoreReport
    };
  }
}