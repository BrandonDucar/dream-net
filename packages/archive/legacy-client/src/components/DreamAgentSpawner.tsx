import React, { useState } from 'react';
import { Dream } from './DreamNodeCard.js';
import { runRemixAgent } from '@/agents/RemixAgent';
import { runScoreAgent } from '@/agents/ScoreAgent';
import { runLinkAgent } from '@/agents/LinkAgent';
import { runDecayAgent } from '@/agents/DecayAgent';
import { runNutrientEngine } from '@/agents/NutrientEngine';
import { runNarratorAgent } from '@/agents/NarratorAgent';
import { runDreamAttractor } from '@/agents/DreamAttractor';
import { runDreamTagsAgent } from '@/agents/DreamTagsAgent';
import { runDreamLoreEngine } from '@/agents/DreamLoreEngine';
import { runCreatorOnboarder } from '@/agents/creatorOnboarder';

type SpawnerProps = {
  onSpawn: (dream: Dream) => void;
  current: Dream[];
  baseDream?: Dream;
};

const emotions = ['ambition', 'curiosity', 'hope', 'joy', 'sadness', 'fear', 'chaos', 'love'];
const trends = ['ascending', 'stable', 'declining', 'explosive', 'rising'];

export default function DreamAgentSpawner({ onSpawn, current, baseDream }: SpawnerProps) {
  const [isSpawning, setIsSpawning] = useState(false);

  const generateRandomDream = (): Dream => {
    const dreamId = `dream${String(current.length + 1).padStart(3, '0')}`;
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    
    // If baseDream provided, use it as inspiration for the new dream
    const baseMetrics = baseDream ? baseDream.metrics : null;
    const baseEmotion = baseDream ? baseDream.emotionalProfile.primaryEmotion : emotion;
    
    return {
      dreamId,
      healthScore: Math.floor(Math.random() * 50) + 50, // 50-100
      engagementScore: Math.floor(Math.random() * 40) + 60, // 60-100
      remixLineage: baseDream ? [
        ...baseDream.remixLineage,
        { id: dreamId, title: `Remix of ${baseDream.remixLineage[0]?.title || 'Unknown'}` }
      ] : [
        { id: dreamId, title: `Generated Dream ${current.length + 1}` }
      ],
      metrics: {
        views: baseMetrics ? Math.floor(baseMetrics.views * 0.3) + Math.floor(Math.random() * 1000) : Math.floor(Math.random() * 3000) + 500,
        likes: baseMetrics ? Math.floor(baseMetrics.likes * 0.2) + Math.floor(Math.random() * 200) : Math.floor(Math.random() * 500) + 100,
        remixes: Math.floor(Math.random() * 30) + 5,
        shares: Math.floor(Math.random() * 200) + 50,
        comments: Math.floor(Math.random() * 300) + 100
      },
      emotionalProfile: {
        primaryEmotion: baseDream ? baseEmotion : emotion,
        secondaryEmotions: emotions.filter(e => e !== (baseDream ? baseEmotion : emotion)).slice(0, 2),
        intensityScore: baseDream ? 
          Math.min(1.0, baseDream.emotionalProfile.intensityScore + (Math.random() * 0.3 - 0.15)) : 
          Math.random() * 0.4 + 0.6 // 0.6-1.0
      },
      communityImpact: {
        influenceRadius: Math.floor(Math.random() * 800) + 200,
        networkConnections: Math.floor(Math.random() * 30) + 10,
        crossPlatformMentions: Math.floor(Math.random() * 15) + 5,
        collaborationRequests: Math.floor(Math.random() * 10) + 2
      },
      evolutionPath: {
        generationLevel: baseDream ? baseDream.evolutionPath.generationLevel + 1 : Math.floor(Math.random() * 4) + 1,
        branchingFactor: Math.floor(Math.random() * 6) + 2,
        divergenceScore: Math.random() * 0.8 + 0.2,
        convergencePoints: Math.floor(Math.random() * 3) + 1
      },
      viralityMetrics: {
        shareVelocity: Math.random() * 40 + 10,
        peakMomentum: new Date().toISOString(),
        currentTrend: trend,
        saturationLevel: Math.random() * 0.6 + 0.2
      },
      decayTags: {
        status: 'healthy',
        flags: [],
        lastChecked: new Date().toISOString()
      },
      narration: {
        summary: `A spontaneous dream manifesting from the collective unconscious, pulsing with ${emotion} energy at ${Math.round((baseDream ? Math.min(1.0, baseDream.emotionalProfile.intensityScore + (Math.random() * 0.3 - 0.15)) : Math.random() * 0.4 + 0.6) * 100)}% intensity.`,
        lastNarrated: new Date().toISOString()
      },
      tags: [`#${emotion}`, `#${trend}`, '#spontaneous', '#manifested', '#energy', `#dream${String(Date.now()).slice(-2)}`],
      lore: {
        content: `In the chronicles of the Dream Network, a thread of ${emotion} (${Math.round((baseDream ? Math.min(1.0, baseDream.emotionalProfile.intensityScore + (Math.random() * 0.3 - 0.15)) : Math.random() * 0.4 + 0.6) * 100)}%) wove its way through time: Stage 1: "Spontaneous Manifestation" → Stage 2: "Energy Resonance". This dream now stands as a beacon of pure intention — shaped by collective will and individual vision.`,
        lastUpdated: new Date().toISOString()
      }
    };
  };

  const handleSpawn = async () => {
    setIsSpawning(true);
    
    // Simulate AI agent processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newDream = generateRandomDream();
    onSpawn(newDream);
    setIsSpawning(false);
  };

  const handleRemixAgent = async () => {
    setIsSpawning(true);
    
    try {
      const remixedDreams = await runRemixAgent(5);
      
      // Add each remixed dream to the collection
      remixedDreams.forEach(dream => {
        onSpawn(dream);
      });
      
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run remix agent:', error);
      setIsSpawning(false);
    }
  };

  const handleScoreAgent = async () => {
    setIsSpawning(true);
    
    try {
      const { scoreReport } = await runScoreAgent();
      console.log('Score agent completed:', scoreReport);
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run score agent:', error);
      setIsSpawning(false);
    }
  };

  const handleLinkAgent = async () => {
    setIsSpawning(true);
    
    try {
      const linkDreams = await runLinkAgent(5);
      
      // Add each link dream to the collection
      linkDreams.forEach(dream => {
        onSpawn(dream);
      });
      
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run link agent:', error);
      setIsSpawning(false);
    }
  };

  const handleDecayAgent = async () => {
    setIsSpawning(true);
    
    try {
      const { decayReport } = await runDecayAgent();
      console.log('Decay agent completed:', decayReport);
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run decay agent:', error);
      setIsSpawning(false);
    }
  };

  const handleNutrientEngine = async () => {
    setIsSpawning(true);
    
    try {
      const { nutrientReport } = await runNutrientEngine();
      console.log('Nutrient engine completed:', nutrientReport);
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run nutrient engine:', error);
      setIsSpawning(false);
    }
  };

  const handleNarratorAgent = async () => {
    setIsSpawning(true);
    
    try {
      const { narrationReport } = await runNarratorAgent();
      console.log('Narrator agent completed:', narrationReport);
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run narrator agent:', error);
      setIsSpawning(false);
    }
  };

  const handleDreamAttractor = async () => {
    setIsSpawning(true);
    
    try {
      const attractedDreams = await runDreamAttractor();
      
      // Add each attracted dream to the collection
      attractedDreams.forEach(dream => {
        onSpawn(dream);
      });
      
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run dream attractor:', error);
      setIsSpawning(false);
    }
  };

  const handleDreamTagsAgent = async () => {
    setIsSpawning(true);
    
    try {
      const { taggingReport } = await runDreamTagsAgent();
      console.log('Dream tags agent completed:', taggingReport);
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run dream tags agent:', error);
      setIsSpawning(false);
    }
  };

  const handleDreamLoreEngine = async () => {
    setIsSpawning(true);
    
    try {
      const { loreReport } = await runDreamLoreEngine();
      console.log('Dream lore engine completed:', loreReport);
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run dream lore engine:', error);
      setIsSpawning(false);
    }
  };

  const handleCreatorOnboarder = async () => {
    setIsSpawning(true);
    
    try {
      const onboardingResult = await runCreatorOnboarder();
      console.log('Creator onboarding completed:', onboardingResult);
      console.log('🏆 Creator Tier Status:', onboardingResult.analytics.creatorTier);
      console.log('🏅 Tier Benefits:', onboardingResult.analytics.creatorTier.tierBenefits);
      console.log('📊 Weekly Analytics:', onboardingResult.analytics.weeklyPerformance);
      console.log('🎯 Content Insights:', onboardingResult.analytics.contentInsights);
      console.log('📈 Growth Metrics:', onboardingResult.analytics.growthMetrics);
      console.log('🚀 Data Optimizations:', onboardingResult.analytics.dataOptimizations);
      console.log('🕸 Network Collaboration:', onboardingResult.analytics.networkCollaboration);
      console.log('🌐 Landing Page Config:', onboardingResult.landingPage);
      console.log('🔗 Bio Link Protocol:', onboardingResult.landingPage.bioLink);
      console.log('📅 Content Schedule:', onboardingResult.contentSchedule);
      console.log('📦 Content Packs Generated:', onboardingResult.contentPacks);
      setIsSpawning(false);
    } catch (error) {
      console.error('Failed to run creator onboarder:', error);
      setIsSpawning(false);
    }
  };

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-600">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-semibold mb-1">🤖 Dream Agent Spawner</h3>
          <p className="text-gray-400 text-sm">
            {baseDream ? `Generate remix of ${baseDream.remixLineage[0]?.title}` : 'Generate new dreams using AI agents'}
          </p>
        </div>
        
        <button
          onClick={handleSpawn}
          disabled={isSpawning}
          className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white hover:shadow-lg'
          }`}
        >
          {isSpawning ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Spawning...
            </div>
          ) : (
            baseDream ? '🔁 Remix Dream' : '✨ Spawn Dream'
          )}
        </button>
      </div>

      {/* Agent Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleRemixAgent}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg'
          }`}
        >
          🔀 Remix Top 5
        </button>
        
        <button
          onClick={handleScoreAgent}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
          }`}
        >
          📊 Run Scoring
        </button>

        <button
          onClick={handleLinkAgent}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700 text-white hover:shadow-lg'
          }`}
        >
          🔗 Link Dreams
        </button>

        <button
          onClick={handleDecayAgent}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
          }`}
        >
          ⚠️ Decay Check
        </button>

        <button
          onClick={handleNutrientEngine}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
          }`}
        >
          💚 Nutrient Boost
        </button>

        <button
          onClick={handleNarratorAgent}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
          }`}
        >
          📖 Generate Narration
        </button>

        <button
          onClick={handleDreamAttractor}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg'
          }`}
        >
          🧲 Dream Attractor
        </button>

        <button
          onClick={handleDreamTagsAgent}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white hover:shadow-lg'
          }`}
        >
          🏷️ Generate Tags
        </button>

        <button
          onClick={handleDreamLoreEngine}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 text-white hover:shadow-lg'
          }`}
        >
          📜 Generate Lore
        </button>

        <button
          onClick={handleCreatorOnboarder}
          disabled={isSpawning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isSpawning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
          }`}
        >
          🎯 Creator Onboarding
        </button>
      </div>
      
      {isSpawning && (
        <div className="mt-3 text-xs text-cyan-400">
          AI agents are processing dreams...
        </div>
      )}
    </div>
  );
}