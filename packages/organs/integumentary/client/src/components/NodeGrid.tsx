import React, { useState } from 'react';

interface Dream {
  id: string;
  title: string;
  tags: string[];
  score: number;
}

interface NodeGridProps {
  dreams: Dream[];
}

interface DreamModalProps {
  dream: Dream | null;
  onClose: () => void;
}

const DreamActions: React.FC<{ dream: Dream; activateNightmare?: (dreamId: string) => void }> = ({ dream, activateNightmare }) => {
  const handleMint = (dreamId: string) => {
    console.log(`💎 Mint initiated for Dream ID: ${dreamId}`);
    alert(`Stub: Mint action for dream ${dreamId}`);
  };

  const handleBounty = (dreamId: string) => {
    console.log(`💰 Bounty claim initiated for Dream ID: ${dreamId}`);
    alert(`Stub: Bounty claim for dream ${dreamId}`);
  };

  const remixDream = async (id: string) => {
    try {
      const res = await fetch(`/api/dreams/${id}/remix`, {
        method: "POST",
        body: JSON.stringify({ 
          userId: "user123",
          dreamId: id,
          title: `Remix of ${id}`,
          tags: ["remix", "defi"],
          content: `My remix of dream ${id}`,
          token: "SHEEP"
        }),
        headers: { "Content-Type": "application/json" }
      });
      const newDream = await res.json();
      console.log("✅ Remix Created:", newDream);
    } catch (error) {
      console.error("❌ Remix failed:", error);
    }
  };

  const handleEvolve = async (dreamId: string) => {
    try {
      const res = await fetch(`/api/evolution-tree?trust=high&bounty=true&collapse=false`);
      const evolutionTrees = await res.json();
      console.log(`🔄 Enhanced evolution trees:`, evolutionTrees);
      alert(`Evolution trees loaded - check console for enhanced data structure`);
    } catch (error) {
      console.error("❌ Failed to fetch evolution trees:", error);
    }
  };



  return (
    <div className="flex gap-2 mt-3">
      <button 
        className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" 
        onClick={(e) => { e.stopPropagation(); handleMint(dream.id); }}
      >
        Mint
      </button>
      {dream.score >= 85 && (
        <button 
          className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors" 
          onClick={(e) => { e.stopPropagation(); handleBounty(dream.id); }}
        >
          Bounty
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); remixDream(dream.id); }}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
      >
        Remix
      </button>
      <button 
        className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors" 
        onClick={(e) => { e.stopPropagation(); handleEvolve(dream.id); }}
      >
        Evolve
      </button>
      {activateNightmare && (
        <button
          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors border border-red-400"
          onClick={(e) => { e.stopPropagation(); activateNightmare(dream.id); }}
        >
          🌙 Nightmare
        </button>
      )}
      <select 
        className="px-2 py-1 text-xs bg-gray-800 text-white rounded border border-gray-600"
        onChange={(e) => { 
          if (e.target.value) {
            assignNightmareAgent(dream.id, e.target.value);
            e.target.value = "";
          }
        }}
        defaultValue=""
      >
        <option value="" disabled>Assign Agent</option>
        <option value="DREAD">DREAD - Fear Amplifier</option>
        <option value="SHADE">SHADE - Shadow Processor</option>
        <option value="WHISPER">WHISPER - Mind Infiltrator</option>
        <option value="ECHO">ECHO - Reality Distorter</option>
        <option value="CRYPT">CRYPT - Entropy Guardian</option>
      </select>
    </div>
  );
};

const DreamModal: React.FC<DreamModalProps> = ({ dream, onClose }) => {
  if (!dream) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-xl p-6 w-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-red-500 text-xl"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold">{dream.title}</h2>
        <p className="mt-2 text-gray-700">Tags: {dream.tags.join(', ')}</p>
        <p className="mt-2 text-sm text-gray-600">Score: {dream.score}</p>
        <DreamActions dream={dream} />
      </div>
    </div>
  );
};

const getGlowClass = (score: number, isNightmare?: boolean) => {
  if (isNightmare) {
    return "border-2 border-red-600 shadow-red-500/50 bg-gradient-to-br from-purple-900/20 to-red-900/20";
  }
  if (score >= 90) return "border-4 border-yellow-400 shadow-yellow-500/40";
  if (score >= 70) return "border-2 border-green-400 shadow-green-500/30";
  if (score >= 50) return "border border-blue-400 shadow-blue-500/20";
  return "border border-gray-600 opacity-60";
};

const NodeGrid: React.FC<NodeGridProps> = ({ dreams }) => {
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [search, setSearch] = useState('');
  const [minScore, setMinScore] = useState(0);

  const activateNightmare = async (dreamId: string) => {
    try {
      const res = await fetch('/api/network/nightmare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamId, trigger: 'manual_activation' })
      });
      const nightmareData = await res.json();
      console.log('🌙 Nightmare network activated:', nightmareData);
      alert(`Nightmare mode activated! SHADE and VOID agents unlocked. Trust inverted for ${nightmareData.affectedDreams} dreams.`);
    } catch (error) {
      console.error("❌ Failed to activate nightmare network:", error);
    }
  };

  const assignNightmareAgent = async (dreamId: string, agent: string) => {
    try {
      const res = await fetch('/api/nightmare/assign-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          dreamId, 
          agent, 
          assignedBy: "0x742d35cc6ce8a5657ad2D8Db3c90B1234567890" 
        })
      });
      const assignment = await res.json();
      console.log(`🌙 ${agent} assigned to dream ${dreamId}:`, assignment);
      alert(`${agent} agent assigned! Corruption level: ${assignment.assignment?.corruptionLevel}%`);
    } catch (error) {
      console.error("❌ Failed to assign nightmare agent:", error);
    }
  };

  return (
    <>
      <div className="flex gap-4 items-center p-4 bg-black bg-opacity-50 rounded-xl mb-4">
        <input
          type="text"
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="number"
          placeholder="Min Score"
          value={minScore}
          onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
          className="p-2 rounded text-black"
        />
        <div className="text-gray-300 text-sm">
          Showing {dreams.filter(dream => 
            dream.tags.join(',').toLowerCase().includes(search.toLowerCase()) &&
            dream.score >= minScore
          ).length} of {dreams.length} dreams
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 p-4">
        {dreams
          .filter((dream) =>
            dream.tags.join(',').toLowerCase().includes(search.toLowerCase()) &&
            dream.score >= minScore
          )
          .map((dream) => (
            <div key={dream.id} className={`node ${getGlowClass(dream.score, dream.isNightmare)} p-4 rounded-xl ${dream.isNightmare ? 'animate-pulse' : ''}`}>
              <h3 className={`text-xl font-bold ${dream.isNightmare ? 'text-red-400' : 'text-white'}`}>
                {dream.isNightmare && '🌙 '}{dream.title || dream.name}
              </h3>
              <p className="text-sm text-gray-400">{dream.tags.join(', ')}</p>
              <div className="flex justify-between text-xs mt-2">
                <span className="text-cyan-400">Score: {dream.score}</span>
                {dream.remixCount && <span className="text-blue-400">Remixes: {dream.remixCount}</span>}
              </div>
              {dream.trustLevel && (
                <div className={`text-xs mt-1 ${
                  dream.isNightmare 
                    ? dream.trustLevel === 'High' ? 'text-red-400' : 
                      dream.trustLevel === 'Medium' ? 'text-orange-400' : 'text-green-400'
                    : dream.trustLevel === 'High' ? 'text-green-400' : 
                      dream.trustLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {dream.isNightmare ? 'Inverted ' : ''}Trust: {dream.trustLevel}
                </div>
              )}
              {dream.bounties && dream.bounties > 0 && (
                <div className="text-xs text-gold-400 mt-1">
                  Bounty: {dream.bounties}
                </div>
              )}
              {dream.isNightmare && (
                <div className="text-xs text-red-400 mt-1">
                  Decay: {((dream.decayRate || 0) * 100).toFixed(1)}%/cycle
                </div>
              )}
              <DreamActions dream={dream} activateNightmare={activateNightmare} />
            </div>
        ))}
      </div>
      <DreamModal dream={selectedDream} onClose={() => setSelectedDream(null)} />
    </>
  );
};

export default NodeGrid;