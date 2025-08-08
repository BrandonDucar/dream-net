import { Dream } from '@/components/DreamNodeCard';

export async function runDecayAgent(): Promise<{ updatedDreams: Dream[]; decayReport: any }> {
  try {
    // Call the backend API to trigger decay agent processing
    const response = await fetch('/api/agents/decay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to run decay agent: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error running decay agent:', error);
    
    // Fallback to mock decay analysis for development
    const decayReport = {
      totalDreamsAnalyzed: 0,
      healthyDreams: 0,
      decayingDreams: 0,
      criticalDreams: 0,
      archivedDreams: 0,
      commonDecayFlags: ['low-engagement', 'stale-content', 'negative-sentiment'],
      analysisTimestamp: new Date().toISOString()
    };

    return {
      updatedDreams: [],
      decayReport
    };
  }
}

export function analyzeDreamDecay(dream: Dream): {
  status: 'healthy' | 'decaying' | 'critical' | 'archived';
  flags: string[];
} {
  const flags: string[] = [];
  let status: 'healthy' | 'decaying' | 'critical' | 'archived' = 'healthy';

  // Health score analysis
  if (dream.healthScore < 30) {
    flags.push('critical-health');
    status = 'critical';
  } else if (dream.healthScore < 60) {
    flags.push('low-health');
    if (status === 'healthy') status = 'decaying';
  }

  // Engagement analysis
  if (dream.engagementScore < 25) {
    flags.push('low-engagement');
    if (status === 'healthy') status = 'decaying';
  }

  // Virality trend analysis
  if (dream.viralityMetrics.currentTrend === 'declining') {
    flags.push('declining-trend');
    if (status === 'healthy') status = 'decaying';
  }

  // Saturation level analysis
  if (dream.viralityMetrics.saturationLevel > 0.8) {
    flags.push('high-saturation');
    if (status === 'healthy') status = 'decaying';
  }

  // Share velocity analysis
  if (dream.viralityMetrics.shareVelocity < 5) {
    flags.push('low-velocity');
    if (status === 'healthy') status = 'decaying';
  }

  // Emotional intensity analysis
  if (dream.emotionalProfile.intensityScore < 0.3) {
    flags.push('low-intensity');
    if (status === 'healthy') status = 'decaying';
  }

  // Community impact analysis
  if (dream.communityImpact.networkConnections < 10) {
    flags.push('isolated');
    if (status === 'healthy') status = 'decaying';
  }

  // Multiple decay indicators = critical
  if (flags.length >= 4 && status !== 'critical') {
    status = 'critical';
  }

  return { status, flags };
}