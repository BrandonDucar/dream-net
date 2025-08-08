import React, { useState } from 'react';
import { Link } from 'wouter';
import DreamLineageModal from './DreamLineageModal';

export type Dream = {
  dreamId: string;
  healthScore: number;
  engagementScore: number;
  remixLineage: { id: string; title: string }[];
  metrics: { views: number; likes: number; remixes: number; shares: number; comments: number };
  emotionalProfile: { primaryEmotion: string; secondaryEmotions: string[]; intensityScore: number };
  communityImpact: { influenceRadius: number; networkConnections: number; crossPlatformMentions: number; collaborationRequests: number };
  evolutionPath: { generationLevel: number; branchingFactor: number; divergenceScore: number; convergencePoints: number };
  viralityMetrics: { shareVelocity: number; peakMomentum: string; currentTrend: string; saturationLevel: number };
  decayTags?: {
    status: 'healthy' | 'decaying' | 'critical' | 'archived';
    flags: string[];
    lastChecked: string;
  };
  narration?: {
    summary: string;
    lastNarrated: string;
  };
  tags?: string[];
  lore?: {
    content: string;
    lastUpdated: string;
  };
};

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

function getPulseSpeed(intensity: number) {
  if (intensity >= 0.8) return 'animate-[pulseGlow_1.4s_ease-in-out_infinite]';
  if (intensity >= 0.5) return 'animate-[pulseGlow_2s_ease-in-out_infinite]';
  return 'animate-[pulseGlow_3s_ease-in-out_infinite]';
}

export default function DreamNodeCard({ dream }: { dream: Dream }) {
  const glow = emotionColors[dream.emotionalProfile.primaryEmotion] || 'from-gray-300 via-gray-400 to-gray-500';
  const [hovered, setHovered] = useState(false);
  const [showLineage, setShowLineage] = useState(false);
  const pulseClass = getPulseSpeed(dream.emotionalProfile.intensityScore);

  return (
    <div
      className={`relative w-80 p-1 rounded-2xl transition-transform duration-300 transform hover:scale-105 ${pulseClass}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`bg-gradient-to-r ${glow} p-1 rounded-2xl`}>
        <div className="bg-gray-900 p-4 rounded-xl text-white relative overflow-hidden cursor-pointer">
          <Link href={`/dreams/${dream.dreamId}`}>
            <div className="block">
              <h2 className="text-xl font-bold mb-1">🌟 {dream.remixLineage[0]?.title}</h2>
              <p className="text-xs text-gray-400 mb-3">ID: {dream.dreamId}</p>

              <div className="text-sm space-y-1">
                <p>❤️ Likes: {dream.metrics.likes}</p>
                <p>🔁 Remixes: {dream.metrics.remixes}</p>
                <p>📈 Trend: {dream.viralityMetrics.currentTrend}</p>
                <p>🎭 Emotion: {dream.emotionalProfile.primaryEmotion}</p>
                <p>🔥 Intensity: {dream.emotionalProfile.intensityScore}</p>
                <p>💥 Engagement: {dream.engagementScore}</p>
                
                {/* Decay Status */}
                {dream.decayTags && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className={`text-xs ${
                      dream.decayTags.status === 'healthy' ? 'text-green-400' :
                      dream.decayTags.status === 'decaying' ? 'text-yellow-400' :
                      dream.decayTags.status === 'critical' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                      🏥 Status: {dream.decayTags.status.toUpperCase()}
                    </p>
                    {dream.decayTags.flags.length > 0 && (
                      <p className="text-xs text-gray-400">
                        🚨 Flags: {dream.decayTags.flags.slice(0, 2).join(', ')}
                        {dream.decayTags.flags.length > 2 && '...'}
                      </p>
                    )}
                  </div>
                )}

                {/* Narration */}
                {dream.narration && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-cyan-400 mb-1">📖 Dream Narrative:</p>
                    <p className="text-xs text-gray-300 italic leading-relaxed">
                      "{dream.narration.summary}"
                    </p>
                  </div>
                )}

                {/* Attraction Score */}
                {dream.dreamId.includes('attracted') && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-purple-400 mb-1">🧲 Attraction Analysis:</p>
                    <p className="text-xs text-gray-300">
                      High-scoring dream drawn by algorithmic forces
                    </p>
                  </div>
                )}

                {/* Tags */}
                {dream.tags && dream.tags.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-cyan-400 mb-1">🏷️ Tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {dream.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-cyan-900/30 text-cyan-300 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {dream.tags.length > 4 && (
                        <span className="text-xs text-gray-400">+{dream.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Lore */}
                {dream.lore && (
                  <div className="mt-2 pt-2 border-t border-gray-700">
                    <p className="text-xs text-amber-400 mb-1">📜 Chronicle:</p>
                    <p className="text-xs text-gray-300 italic leading-relaxed">
                      {dream.lore.content.slice(0, 120)}...
                    </p>
                  </div>
                )}
              </div>

              {/* Health Bar */}
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">🧠 Health</p>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${dream.healthScore}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Hover Buttons */}
          {hovered && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center gap-2 rounded-xl transition-all duration-300 z-10">
              <button className="px-4 py-1 bg-white text-black rounded-full text-sm hover:bg-gray-200">🔁 Remix</button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowLineage(true);
                }}
                className="px-4 py-1 bg-white text-black rounded-full text-sm hover:bg-gray-200"
              >
                🧬 Lineage
              </button>
              <button className="px-4 py-1 bg-white text-black rounded-full text-sm hover:bg-gray-200">⭐ Save</button>
            </div>
          )}

          {/* Lineage Modal */}
          {showLineage && (
            <DreamLineageModal
              dream={dream}
              isOpen={showLineage}
              onClose={() => setShowLineage(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}