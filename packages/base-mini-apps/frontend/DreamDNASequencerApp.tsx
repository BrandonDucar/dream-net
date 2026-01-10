import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config.js';

export function DreamDNASequencerApp() {
  const [dreamDNAs, setDreamDNAs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDNA, setSelectedDNA] = useState<any>(null);

  const sequenceDream = async () => {
    // Placeholder - would integrate with contract
    alert('Dream sequencing coming soon! Contract: ' + CONTRACT_ADDRESSES.DreamDNASequencer);
  };

  const findSimilarDreams = async (dnaHash: string) => {
    // Placeholder - would integrate with contract
    alert(`Finding dreams similar to ${dnaHash}...`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Dream DNA Sequencer</h1>
      
      <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
        <p className="text-gray-400 text-sm">Contract:</p>
        <p className="text-cyan-400 font-mono text-sm">{CONTRACT_ADDRESSES.DreamDNASequencer}</p>
      </div>

      <div className="mb-6">
        <button
          onClick={sequenceDream}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Sequence New Dream
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dreamDNAs.length === 0 ? (
          <p className="text-gray-400 col-span-full">No dreams sequenced yet. Sequence your first dream!</p>
        ) : (
          dreamDNAs.map((dna) => (
            <div 
              key={dna.dreamHash} 
              className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20 cursor-pointer hover:border-cyan-500/40"
              onClick={() => setSelectedDNA(dna)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-white font-mono text-xs mb-1">{dna.dreamHash.slice(0, 16)}...</p>
                  <p className="text-cyan-400 font-mono text-xs">DNA: {dna.dnaHash.slice(0, 16)}...</p>
                </div>
                <span className="text-gray-400 text-xs">
                  {new Date(dna.sequencedAt * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-gray-300 text-xs mb-1">Traits:</p>
                <div className="flex flex-wrap gap-1">
                  {dna.traits.slice(0, 5).map((trait: number, i: number) => (
                    <span key={i} className="bg-gray-700 text-xs px-2 py-1 rounded">
                      {trait}
                    </span>
                  ))}
                  {dna.traits.length > 5 && (
                    <span className="text-gray-400 text-xs">+{dna.traits.length - 5} more</span>
                  )}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  findSimilarDreams(dna.dnaHash);
                }}
                className="mt-2 text-cyan-400 text-xs hover:text-cyan-300"
              >
                Find Similar →
              </button>
            </div>
          ))
        )}
      </div>

      {selectedDNA && (
        <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-xl font-semibold text-white mb-4">Dream DNA Details</h2>
          <div className="space-y-2">
            <p className="text-gray-300"><span className="text-gray-400">Dream Hash:</span> {selectedDNA.dreamHash}</p>
            <p className="text-gray-300"><span className="text-gray-400">DNA Hash:</span> {selectedDNA.dnaHash}</p>
            <p className="text-gray-300"><span className="text-gray-400">Sequenced:</span> {new Date(selectedDNA.sequencedAt * 1000).toLocaleString()}</p>
            <div className="mt-4">
              <p className="text-gray-400 mb-2">All Traits:</p>
              <div className="grid grid-cols-5 gap-2">
                {selectedDNA.traits.map((trait: number, i: number) => (
                  <div key={i} className="bg-gray-700 p-2 rounded text-center">
                    <p className="text-white text-sm">{trait}</p>
                    <p className="text-gray-400 text-xs">Trait {i + 1}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSelectedDNA(null)}
              className="mt-4 text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

