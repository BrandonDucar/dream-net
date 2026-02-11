import React from 'react';
import { Dream } from './DreamNodeCard.js';

type LineageModalProps = {
  dream: Dream | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function DreamLineageModal({ dream, isOpen, onClose }: LineageModalProps) {
  if (!isOpen || !dream) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">🧬 Dream Lineage</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Dream Info */}
          <div className="mb-6">
            <h3 className="text-xl text-white mb-2">{dream.remixLineage[0]?.title}</h3>
            <p className="text-gray-400 text-sm">ID: {dream.dreamId}</p>
          </div>

          {/* Lineage Chain */}
          <div className="mb-6">
            <h4 className="text-lg text-white mb-3">Evolution Chain</h4>
            <div className="space-y-3">
              {dream.remixLineage.map((ancestor, index) => (
                <div key={ancestor.id} className="flex items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-white font-medium">{ancestor.title}</p>
                      <p className="text-gray-400 text-xs">ID: {ancestor.id}</p>
                    </div>
                  </div>
                  {index < dream.remixLineage.length - 1 && (
                    <div className="ml-4 text-gray-500">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evolution Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h5 className="text-white font-medium mb-2">Generation Level</h5>
              <p className="text-cyan-400 text-2xl font-bold">{dream.evolutionPath.generationLevel}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h5 className="text-white font-medium mb-2">Branching Factor</h5>
              <p className="text-green-400 text-2xl font-bold">{dream.evolutionPath.branchingFactor}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h5 className="text-white font-medium mb-2">Divergence Score</h5>
              <p className="text-yellow-400 text-2xl font-bold">{dream.evolutionPath.divergenceScore.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h5 className="text-white font-medium mb-2">Convergence Points</h5>
              <p className="text-purple-400 text-2xl font-bold">{dream.evolutionPath.convergencePoints}</p>
            </div>
          </div>

          {/* Community Impact */}
          <div className="mb-6">
            <h4 className="text-lg text-white mb-3">Community Impact</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Influence Radius</p>
                <p className="text-white font-medium">{dream.communityImpact.influenceRadius}</p>
              </div>
              <div>
                <p className="text-gray-400">Network Connections</p>
                <p className="text-white font-medium">{dream.communityImpact.networkConnections}</p>
              </div>
              <div>
                <p className="text-gray-400">Cross-platform Mentions</p>
                <p className="text-white font-medium">{dream.communityImpact.crossPlatformMentions}</p>
              </div>
              <div>
                <p className="text-gray-400">Collaboration Requests</p>
                <p className="text-white font-medium">{dream.communityImpact.collaborationRequests}</p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}