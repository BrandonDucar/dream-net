import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { getDreamById, saveDream } from '@/lib/db';
import DreamLineageModal from '@/components/DreamLineageModal';
import DreamAgentSpawner from '@/components/DreamAgentSpawner';
import { Dream } from '@/components/DreamNodeCard';

export default function DreamDetail() {
  const { dreamId } = useParams();
  const [showLineage, setShowLineage] = useState(false);
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDream = async () => {
      if (dreamId) {
        setLoading(true);
        const dreamData = await getDreamById(dreamId);
        setDream(dreamData);
        setLoading(false);
      }
    };
    fetchDream();
  }, [dreamId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white">Loading dream...</p>
        </div>
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Dream Not Found</h1>
          <Link href="/dream-node-test">
            <a className="text-cyan-400 hover:text-cyan-300">← Back to Gallery</a>
          </Link>
        </div>
      </div>
    );
  }

  const emotionColors: Record<string, string> = {
    ambition: 'from-yellow-400 via-red-500 to-pink-500',
    curiosity: 'from-blue-400 via-purple-500 to-indigo-600',
    hope: 'from-green-300 via-emerald-400 to-teal-500',
    joy: 'from-yellow-300 via-pink-300 to-red-400',
    sadness: 'from-blue-800 via-indigo-800 to-purple-800',
    fear: 'from-gray-700 via-red-700 to-black',
    chaos: 'from-rose-500 via-yellow-600 to-indigo-600',
    love: 'from-pink-400 via-rose-500 to-red-500',
  };

  const glow = emotionColors[dream.emotionalProfile.primaryEmotion] || 'from-gray-300 via-gray-400 to-gray-500';

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* Navigation */}
      <div className="mb-6">
        <Link href="/dream-node-test">
          <a className="text-cyan-400 hover:text-cyan-300">← Back to Gallery</a>
        </Link>
      </div>

      {/* Dream Header */}
      <div className={`bg-gradient-to-r ${glow} p-1 rounded-2xl mb-8`}>
        <div className="bg-gray-900 p-8 rounded-xl">
          <h1 className="text-white text-4xl font-bold mb-4">🌟 {dream.remixLineage[0]?.title}</h1>
          <p className="text-gray-400 text-lg mb-6">Dream ID: {dream.dreamId}</p>
          
          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">🔁 Remix This Dream</button>
            <button 
              onClick={() => setShowLineage(true)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              🧬 View Lineage
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">⭐ Save Dream</button>
          </div>

          {/* Dream Spawner for Remixes */}
          <div className="mb-6">
            <DreamAgentSpawner baseDream={dream} onSpawn={async (newDream) => {
              await saveDream(newDream);
              // Optionally navigate to the new dream or show success message
            }} current={[]} />
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Engagement Metrics */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white text-xl font-bold mb-4">📊 Engagement</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Views:</span>
              <span className="text-white font-bold">{dream.metrics.views.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Likes:</span>
              <span className="text-white font-bold">{dream.metrics.likes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Remixes:</span>
              <span className="text-white font-bold">{dream.metrics.remixes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Comments:</span>
              <span className="text-white font-bold">{dream.metrics.comments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Shares:</span>
              <span className="text-white font-bold">{dream.metrics.shares}</span>
            </div>
          </div>
        </div>

        {/* Emotional Profile */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white text-xl font-bold mb-4">🎭 Emotional Profile</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400">Primary Emotion:</span>
              <p className="text-white font-bold capitalize">{dream.emotionalProfile.primaryEmotion}</p>
            </div>
            <div>
              <span className="text-gray-400">Intensity Score:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${dream.emotionalProfile.intensityScore * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">{(dream.emotionalProfile.intensityScore * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div>
              <span className="text-gray-400">Secondary Emotions:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {dream.emotionalProfile.secondaryEmotions.map(emotion => (
                  <span key={emotion} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Health & Performance */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white text-xl font-bold mb-4">🧠 Health & Performance</h3>
          <div className="space-y-4">
            <div>
              <span className="text-gray-400">Health Score:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${dream.healthScore}%` }}
                  />
                </div>
                <span className="text-white font-bold">{dream.healthScore}%</span>
              </div>
            </div>
            <div>
              <span className="text-gray-400">Engagement Score:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${dream.engagementScore}%` }}
                  />
                </div>
                <span className="text-white font-bold">{dream.engagementScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evolution & Community */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Evolution Path */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white text-xl font-bold mb-4">🧬 Evolution Path</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Generation Level</p>
              <p className="text-cyan-400 text-2xl font-bold">{dream.evolutionPath.generationLevel}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Branching Factor</p>
              <p className="text-green-400 text-2xl font-bold">{dream.evolutionPath.branchingFactor}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Divergence Score</p>
              <p className="text-yellow-400 text-2xl font-bold">{dream.evolutionPath.divergenceScore.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm">Convergence Points</p>
              <p className="text-purple-400 text-2xl font-bold">{dream.evolutionPath.convergencePoints}</p>
            </div>
          </div>
        </div>

        {/* Community Impact */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white text-xl font-bold mb-4">🌐 Community Impact</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Influence Radius:</span>
              <span className="text-white font-bold">{dream.communityImpact.influenceRadius}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Connections:</span>
              <span className="text-white font-bold">{dream.communityImpact.networkConnections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cross-platform Mentions:</span>
              <span className="text-white font-bold">{dream.communityImpact.crossPlatformMentions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Collaboration Requests:</span>
              <span className="text-white font-bold">{dream.communityImpact.collaborationRequests}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Virality Metrics */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-white text-xl font-bold mb-4">🚀 Virality Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">Share Velocity</p>
            <p className="text-cyan-400 text-xl font-bold">{dream.viralityMetrics.shareVelocity.toFixed(1)}/hr</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Current Trend</p>
            <p className="text-green-400 text-xl font-bold capitalize">{dream.viralityMetrics.currentTrend}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Saturation Level</p>
            <p className="text-yellow-400 text-xl font-bold">{(dream.viralityMetrics.saturationLevel * 100).toFixed(0)}%</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm">Peak Momentum</p>
            <p className="text-purple-400 text-sm">{new Date(dream.viralityMetrics.peakMomentum).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Lineage Modal */}
      {showLineage && (
        <DreamLineageModal
          dream={dream}
          isOpen={showLineage}
          onClose={() => setShowLineage(false)}
        />
      )}
    </div>
  );
}