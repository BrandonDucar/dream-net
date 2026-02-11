import React from 'react';
import NodeGrid from '@/components/NodeGrid';

const NodeGridDemo = () => {
  const sampleDreams = [
    {
      id: 'dream-1',
      title: 'Quantum Dreams',
      tags: ['sci-fi', 'quantum', 'future'],
      score: 95
    },
    {
      id: 'dream-2',
      title: 'Forest Whispers',
      tags: ['nature', 'mystical', 'adventure'],
      score: 85
    },
    {
      id: 'dream-3',
      title: 'Digital Awakening',
      tags: ['cyberpunk', 'AI', 'consciousness'],
      score: 92
    },
    {
      id: 'dream-4',
      title: 'Ocean Depths',
      tags: ['underwater', 'exploration', 'mystery'],
      score: 78
    },
    {
      id: 'dream-5',
      title: 'Time Spiral',
      tags: ['time-travel', 'paradox', 'loops'],
      score: 88
    },
    {
      id: 'dream-6',
      title: 'Crystal Harmony',
      tags: ['crystals', 'music', 'resonance'],
      score: 91
    },
    {
      id: 'dream-7',
      title: 'Neon Cities',
      tags: ['cyberpunk', 'urban', 'neon'],
      score: 76
    },
    {
      id: 'dream-8',
      title: 'Ancient Wisdom',
      tags: ['history', 'wisdom', 'ancient'],
      score: 84
    },
    {
      id: 'dream-9',
      title: 'Space Odyssey',
      tags: ['space', 'sci-fi', 'exploration'],
      score: 89
    },
    {
      id: 'dream-10',
      title: 'Dream Weaver',
      tags: ['mystical', 'weaving', 'dreams'],
      score: 93
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-300">
          Dream Node Grid
        </h1>
        <NodeGrid dreams={sampleDreams} />
      </div>
    </div>
  );
};

export default NodeGridDemo;