import { useState, useEffect } from 'react';

interface DreamEvolutionProps {
  dreamId: string;
  evolutionType: string;
  evolved: boolean;
  level: number;
  remixCount: number;
  fusionCount: number;
  blessCount: number;
  nightmareEscapes: number;
  className?: string;
}

interface EvolutionPreview {
  type: string;
  probability: number;
  description: string;
}

const evolutionData = {
  Fractal: {
    description: "Born from countless remixes, this dream fragments and recombines in infinite patterns.",
    color: "#ff6b9d",
    icon: "🌀"
  },
  Chimera: {
    description: "Forged through fusion, this dream embodies multiple essences in perfect harmony.",
    color: "#c77dff", 
    icon: "🐲"
  },
  Divine: {
    description: "Blessed by the network, this dream radiates pure creative energy.",
    color: "#ffd23f",
    icon: "✨"
  },
  Shadow: {
    description: "Emerged from nightmares, this dream harnesses the power of the void.",
    color: "#e63946",
    icon: "🌑"
  },
  Ethereal: {
    description: "A balanced dream that exists between all states of being.",
    color: "#06ffa5",
    icon: "👻"
  }
};

function predictEvolutionType(remixCount: number, fusionCount: number, blessCount: number, nightmareEscapes: number): EvolutionPreview[] {
  const stats = [
    { type: "Fractal", count: remixCount, threshold: 3 },
    { type: "Chimera", count: fusionCount, threshold: 2 },
    { type: "Divine", count: blessCount, threshold: 5 },
    { type: "Shadow", count: nightmareEscapes, threshold: 1 }
  ];
  
  const total = remixCount + fusionCount + blessCount + nightmareEscapes;
  if (total === 0) return [{ type: "Ethereal", probability: 100, description: evolutionData.Ethereal.description }];
  
  return stats
    .map(stat => ({
      type: stat.type,
      probability: Math.round((stat.count / total) * 100),
      description: evolutionData[stat.type as keyof typeof evolutionData].description
    }))
    .filter(p => p.probability > 0)
    .sort((a, b) => b.probability - a.probability);
}

function getDominantEvolutionType(remixCount: number, fusionCount: number, blessCount: number, nightmareEscapes: number): string {
  const stats = [
    { type: "Fractal", count: remixCount },
    { type: "Chimera", count: fusionCount },
    { type: "Divine", count: blessCount },
    { type: "Shadow", count: nightmareEscapes }
  ];
  
  const highest = stats.reduce((max, current) => current.count > max.count ? current : max);
  return highest.count > 0 ? highest.type : "Ethereal";
}

export default function DreamEvolution({ 
  dreamId, 
  evolutionType, 
  evolved, 
  level, 
  remixCount, 
  fusionCount, 
  blessCount, 
  nightmareEscapes,
  className = "" 
}: DreamEvolutionProps) {
  const [showPreview, setShowPreview] = useState(false);
  const evolutionInfo = evolutionData[evolutionType as keyof typeof evolutionData] || evolutionData.Ethereal;
  const previews = predictEvolutionType(remixCount, fusionCount, blessCount, nightmareEscapes);
  const predictedType = previews[0]?.type || "Ethereal";

  // Auto-evolution check
  useEffect(() => {
    if (level >= 3 && !evolved) {
      const dominantType = getDominantEvolutionType(remixCount, fusionCount, blessCount, nightmareEscapes);
      // Trigger evolution assignment
      fetch(`/api/dreams/${dreamId}/evolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evolutionType: dominantType })
      }).catch(console.error);
    }
  }, [level, evolved, dreamId, remixCount, fusionCount, blessCount, nightmareEscapes]);

  if (!evolved && level < 3) {
    return (
      <div className={`dream-evolution-preview ${className}`}>
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
          <h4 className="text-gray-400 mb-2">🌱 Evolution Preview</h4>
          <p className="text-sm text-gray-500 mb-3">
            Reach Level 3 to evolve this dream
          </p>
          
          {previews.length > 0 && (
            <div className="evo-path-preview">
              <p className="text-sm text-cyan-400 mb-2">
                Most Likely: <strong>{predictedType}</strong> ({previews[0].probability}%)
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{evolutionData[predictedType as keyof typeof evolutionData]?.icon}</span>
                <span>Based on current activity patterns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`dream-evolution-container ${evolutionType.toLowerCase()} ${className}`}
      style={{
        border: `2px solid ${evolutionInfo.color}`,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.9))',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: `0 0 20px ${evolutionInfo.color}40`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>{`
        .dream-evolution-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, ${evolutionInfo.color}10, transparent);
          z-index: 0;
        }
        .evolution-content {
          position: relative;
          z-index: 1;
        }
        .evolution-glow {
          animation: evolutionPulse 3s ease-in-out infinite;
        }
        @keyframes evolutionPulse {
          0%, 100% { box-shadow: 0 0 20px ${evolutionInfo.color}40; }
          50% { box-shadow: 0 0 30px ${evolutionInfo.color}60, 0 0 40px ${evolutionInfo.color}30; }
        }
      `}</style>
      
      <div className="evolution-content">
        <h3 className="text-2xl font-bold mb-4" style={{ color: evolutionInfo.color }}>
          {evolutionInfo.icon} Dream Evolution: {evolutionType}
        </h3>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="evolution-image w-24 h-24 bg-black border border-gray-600 rounded-lg flex items-center justify-center">
            <span className="text-4xl">{evolutionInfo.icon}</span>
          </div>
          
          <div className="flex-1">
            <p className="text-gray-300 text-sm leading-relaxed">
              {evolutionInfo.description}
            </p>
          </div>
        </div>

        <div className="evolution-stats grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-black rounded p-2 text-center">
            <div className="text-cyan-400 font-semibold">{remixCount}</div>
            <div className="text-gray-400">Remixes</div>
          </div>
          <div className="bg-black rounded p-2 text-center">
            <div className="text-purple-400 font-semibold">{fusionCount}</div>
            <div className="text-gray-400">Fusions</div>
          </div>
          <div className="bg-black rounded p-2 text-center">
            <div className="text-gold-400 font-semibold">{blessCount}</div>
            <div className="text-gray-400">Blessings</div>
          </div>
          <div className="bg-black rounded p-2 text-center">
            <div className="text-red-400 font-semibold">{nightmareEscapes}</div>
            <div className="text-gray-400">Escapes</div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {showPreview ? 'Hide' : 'Show'} Evolution Path
          </button>
        </div>

        {showPreview && (
          <div className="evolution-paths mt-4 p-3 bg-black rounded border border-gray-700">
            <h5 className="text-sm font-semibold text-gray-300 mb-2">Evolution Probabilities:</h5>
            {previews.map((preview, index) => (
              <div key={preview.type} className="flex justify-between items-center py-1">
                <span className="text-xs text-gray-400">{preview.type}</span>
                <span className="text-xs font-mono text-cyan-400">{preview.probability}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}