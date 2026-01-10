import React, { useState } from 'react';

interface IdeaOrb {
  id: number;
  emoji: string;
  name: string;
  color: string;
}

interface Cloud {
  id: number;
  name: string;
  orbs: IdeaOrb[];
  evolved: boolean;
}

const AVAILABLE_ORBS: IdeaOrb[] = [
  { id: 1, emoji: '💡', name: 'Light', color: 'yellow' },
  { id: 2, emoji: '🔥', name: 'Fire', color: 'red' },
  { id: 3, emoji: '💧', name: 'Water', color: 'blue' },
  { id: 4, emoji: '🌱', name: 'Growth', color: 'green' },
  { id: 5, emoji: '⚡', name: 'Energy', color: 'purple' },
  { id: 6, emoji: '🌟', name: 'Star', color: 'cyan' },
  { id: 7, emoji: '💎', name: 'Crystal', color: 'pink' },
  { id: 8, emoji: '🌀', name: 'Vortex', color: 'indigo' },
];

const EVOLUTION_COMBOS: Record<string, { name: string; emoji: string }> = {
  '💡🔥': { name: 'Innovation', emoji: '✨' },
  '💧🌱': { name: 'Life', emoji: '🌿' },
  '⚡🌟': { name: 'Supernova', emoji: '💫' },
  '💎🌀': { name: 'Portal', emoji: '🌌' },
  '🔥💧': { name: 'Steam', emoji: '☁️' },
  '💡⚡': { name: 'Spark', emoji: '⚡' },
};

export function DreamCloudBuilder() {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [selectedCloud, setSelectedCloud] = useState<number | null>(null);
  const [draggedOrb, setDraggedOrb] = useState<IdeaOrb | null>(null);

  const createCloud = () => {
    const newCloud: Cloud = {
      id: Date.now(),
      name: `Cloud ${clouds.length + 1}`,
      orbs: [],
      evolved: false,
    };
    setClouds(prev => [...prev, newCloud]);
    setSelectedCloud(newCloud.id);
  };

  const addOrbToCloud = (cloudId: number, orb: IdeaOrb) => {
    setClouds(prev =>
      prev.map(cloud => {
        if (cloud.id === cloudId) {
          const newOrbs = [...cloud.orbs, orb];
          const evolved = checkEvolution(newOrbs);
          return { ...cloud, orbs: newOrbs, evolved };
        }
        return cloud;
      })
    );
  };

  const checkEvolution = (orbs: IdeaOrb[]): boolean => {
    if (orbs.length < 2) return false;

    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {
        const combo = `${orbs[i].emoji}${orbs[j].emoji}`;
        const reverseCombo = `${orbs[j].emoji}${orbs[i].emoji}`;
        if (EVOLUTION_COMBOS[combo] || EVOLUTION_COMBOS[reverseCombo]) {
          return true;
        }
      }
    }
    return false;
  };

  const getEvolutionResult = (orbs: IdeaOrb[]) => {
    for (let i = 0; i < orbs.length; i++) {
      for (let j = i + 1; j < orbs.length; j++) {
        const combo = `${orbs[i].emoji}${orbs[j].emoji}`;
        const reverseCombo = `${orbs[j].emoji}${orbs[i].emoji}`;
        if (EVOLUTION_COMBOS[combo]) return EVOLUTION_COMBOS[combo];
        if (EVOLUTION_COMBOS[reverseCombo]) return EVOLUTION_COMBOS[reverseCombo];
      }
    }
    return null;
  };

  const removeOrb = (cloudId: number, orbIndex: number) => {
    setClouds(prev =>
      prev.map(cloud => {
        if (cloud.id === cloudId) {
          const newOrbs = cloud.orbs.filter((_, idx) => idx !== orbIndex);
          const evolved = checkEvolution(newOrbs);
          return { ...cloud, orbs: newOrbs, evolved };
        }
        return cloud;
      })
    );
  };

  const currentCloud = clouds.find(c => c.id === selectedCloud);
  const evolutionResult = currentCloud && currentCloud.evolved ? getEvolutionResult(currentCloud.orbs) : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ☁️ Dream Cloud Builder
          </h1>
          <p className="text-gray-400 mb-6">Combine idea orbs to create evolved cloud states!</p>

          <div className="mb-6">
            <button
              onClick={createCloud}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              + Create New Cloud
            </button>
          </div>

          {clouds.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>Create a cloud to start building!</p>
            </div>
          )}

          {clouds.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {clouds.map(cloud => (
                <div
                  key={cloud.id}
                  onClick={() => setSelectedCloud(cloud.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedCloud === cloud.id
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-gray-700/30 hover:border-gray-600'
                  }`}
                >
                  <h3 className="font-bold mb-2">{cloud.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {cloud.orbs.map((orb, idx) => (
                      <div
                        key={idx}
                        className="relative group"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOrb(cloud.id, idx);
                        }}
                      >
                        <div className="text-2xl cursor-pointer hover:scale-110 transition-transform">
                          {orb.emoji}
                        </div>
                        <div className="absolute -top-8 left-0 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 pointer-events-none">
                          {orb.name} (click to remove)
                        </div>
                      </div>
                    ))}
                  </div>
                  {cloud.evolved && evolutionResult && (
                    <div className="mt-2 p-2 bg-green-500/20 rounded border border-green-500">
                      <p className="text-sm text-green-400">
                        ✨ Evolved: {evolutionResult.emoji} {evolutionResult.name}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentCloud && (
            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <h3 className="font-bold mb-4">Add Orbs to {currentCloud.name}</h3>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                {AVAILABLE_ORBS.map(orb => (
                  <button
                    key={orb.id}
                    onClick={() => addOrbToCloud(currentCloud.id, orb)}
                    className="p-4 bg-gray-600 hover:bg-gray-500 rounded-lg text-3xl transition-colors"
                    title={orb.name}
                  >
                    {orb.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <h4 className="font-bold mb-2">Evolution Combos:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {Object.entries(EVOLUTION_COMBOS).map(([combo, result]) => (
                <div key={combo} className="flex items-center gap-2">
                  <span>{combo}</span>
                  <span>→</span>
                  <span>{result.emoji} {result.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

