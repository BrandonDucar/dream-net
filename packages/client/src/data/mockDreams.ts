import { Dream } from '@/components/DreamNodeCard';

const mockDreams: Dream[] = [
  {
    dreamId: 'dream001',
    healthScore: 87,
    engagementScore: 91,
    remixLineage: [
      { id: 'dream001', title: 'Original Spark' },
      { id: 'dream045', title: 'Echo Reboot' }
    ],
    metrics: { views: 2847, likes: 523, remixes: 34, shares: 156, comments: 287 },
    emotionalProfile: { primaryEmotion: 'ambition', secondaryEmotions: ['curiosity', 'hope'], intensityScore: 0.84 },
    communityImpact: { influenceRadius: 847, networkConnections: 23, crossPlatformMentions: 12, collaborationRequests: 7 },
    evolutionPath: { generationLevel: 3, branchingFactor: 5, divergenceScore: 0.72, convergencePoints: 2 },
    viralityMetrics: { shareVelocity: 34.2, peakMomentum: '2024-08-20T15:30:00Z', currentTrend: 'ascending', saturationLevel: 0.43 }
  },
  {
    dreamId: 'dream002',
    healthScore: 63,
    engagementScore: 78,
    remixLineage: [
      { id: 'dream002', title: 'Quiet Bloom' },
      { id: 'dream099', title: 'Sonic Petal' }
    ],
    metrics: { views: 1122, likes: 192, remixes: 12, shares: 64, comments: 81 },
    emotionalProfile: { primaryEmotion: 'hope', secondaryEmotions: ['joy', 'patience'], intensityScore: 0.66 },
    communityImpact: { influenceRadius: 514, networkConnections: 12, crossPlatformMentions: 5, collaborationRequests: 2 },
    evolutionPath: { generationLevel: 2, branchingFactor: 2, divergenceScore: 0.31, convergencePoints: 1 },
    viralityMetrics: { shareVelocity: 11.5, peakMomentum: '2024-07-15T13:00:00Z', currentTrend: 'stable', saturationLevel: 0.59 }
  },
  {
    dreamId: 'dream003',
    healthScore: 95,
    engagementScore: 89,
    remixLineage: [
      { id: 'dream003', title: 'Digital Genesis' },
      { id: 'dream156', title: 'Code Symphony' },
      { id: 'dream203', title: 'Neural Harmony' }
    ],
    metrics: { views: 4521, likes: 812, remixes: 47, shares: 289, comments: 403 },
    emotionalProfile: { primaryEmotion: 'curiosity', secondaryEmotions: ['wonder', 'excitement'], intensityScore: 0.92 },
    communityImpact: { influenceRadius: 1204, networkConnections: 38, crossPlatformMentions: 19, collaborationRequests: 14 },
    evolutionPath: { generationLevel: 4, branchingFactor: 7, divergenceScore: 0.88, convergencePoints: 3 },
    viralityMetrics: { shareVelocity: 52.8, peakMomentum: '2024-08-22T09:15:00Z', currentTrend: 'explosive', saturationLevel: 0.31 }
  },
  {
    dreamId: 'dream004',
    healthScore: 42,
    engagementScore: 55,
    remixLineage: [
      { id: 'dream004', title: 'Fading Echo' }
    ],
    metrics: { views: 687, likes: 89, remixes: 3, shares: 21, comments: 45 },
    emotionalProfile: { primaryEmotion: 'sadness', secondaryEmotions: ['melancholy', 'reflection'], intensityScore: 0.48 },
    communityImpact: { influenceRadius: 298, networkConnections: 7, crossPlatformMentions: 2, collaborationRequests: 1 },
    evolutionPath: { generationLevel: 1, branchingFactor: 1, divergenceScore: 0.15, convergencePoints: 0 },
    viralityMetrics: { shareVelocity: 3.2, peakMomentum: '2024-07-08T18:45:00Z', currentTrend: 'declining', saturationLevel: 0.78 }
  },
  {
    dreamId: 'dream005',
    healthScore: 76,
    engagementScore: 83,
    remixLineage: [
      { id: 'dream005', title: 'Crimson Vision' },
      { id: 'dream087', title: 'Ruby Transformation' }
    ],
    metrics: { views: 2103, likes: 367, remixes: 28, shares: 142, comments: 198 },
    emotionalProfile: { primaryEmotion: 'love', secondaryEmotions: ['passion', 'devotion'], intensityScore: 0.79 },
    communityImpact: { influenceRadius: 623, networkConnections: 18, crossPlatformMentions: 8, collaborationRequests: 5 },
    evolutionPath: { generationLevel: 2, branchingFactor: 4, divergenceScore: 0.54, convergencePoints: 1 },
    viralityMetrics: { shareVelocity: 18.7, peakMomentum: '2024-08-10T16:20:00Z', currentTrend: 'rising', saturationLevel: 0.52 }
  }
];

export default mockDreams;