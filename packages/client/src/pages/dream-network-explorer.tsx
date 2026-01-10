import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface DreamNode {
  id: string;
  type: 'dream' | 'cloud' | 'fossil' | 'agent';
  x: number;
  y: number;
  status: 'active' | 'fossilized' | 'infected' | 'quarantined';
  level: number;
  tags: string[];
  connections: string[];
  cloud: string;
  title?: string;
  description?: string;
}

interface NodeEvolution {
  original: string;
  remix: string;
  fossil: string;
  resurrected: string;
  evolutionPath: string[];
}

export default function DreamNetworkExplorer() {
  const queryClient = useQueryClient();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'network' | 'evolution'>('network');
  const [zoomLevel, setZoomLevel] = useState(1);

  const { data: networkData, isLoading } = useQuery<{nodes: DreamNode[], evolutions: NodeEvolution[]}>({
    queryKey: ['/api/dream-clouds/network'],
    queryFn: async () => {
      const response = await fetch('/api/dream-clouds/network');
      if (!response.ok) {
        throw new Error('Failed to fetch dream network');
      }
      return response.json();
    }
  });

  const getNodeIcon = (type: string, status: string) => {
    if (type === 'fossil') return '🦴';
    if (type === 'agent') return '🤖';
    if (type === 'cloud') return '☁️';
    if (status === 'infected') return '🦠';
    if (status === 'fossilized') return '💀';
    return '💭';
  };

  const getNodeColor = (type: string, status: string) => {
    if (status === 'fossilized') return 'border-gray-500 bg-gray-800';
    if (status === 'infected') return 'border-red-500 bg-red-900';
    if (type === 'agent') return 'border-purple-500 bg-purple-900';
    if (type === 'cloud') return 'border-blue-500 bg-blue-900';
    return 'border-cyan-500 bg-gray-900';
  };

  const getCloudColor = (cloudId: string) => {
    const colors: Record<string, string> = {
      'zk-guardians': 'text-purple-400',
      'defi-vaults': 'text-green-400',
      'ai-research': 'text-blue-400',
      'meme-factory': 'text-yellow-400'
    };
    return colors[cloudId] || 'text-gray-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading dream network...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
          🌐 Dream Network Explorer
        </h1>

        {/* View Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('network')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              viewMode === 'network' 
                ? 'bg-cyan-600 text-black' 
                : 'bg-gray-700 text-cyan-400 hover:bg-gray-600'
            }`}
          >
            🗺️ Network View
          </button>
          <button
            onClick={() => setViewMode('evolution')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              viewMode === 'evolution' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-cyan-400 hover:bg-gray-600'
            }`}
          >
            🧬 Evolution Paths
          </button>
        </div>

        {viewMode === 'network' ? (
          /* Network View */
          <div className="bg-gray-900 border border-cyan-500 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">Dream Node Network</h3>
            
            <div className="relative bg-black border border-gray-700 rounded-lg p-6 overflow-hidden" style={{ height: '600px' }}>
              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={() => setZoomLevel(z => Math.min(z + 0.2, 2))}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                >
                  +
                </button>
                <button
                  onClick={() => setZoomLevel(z => Math.max(z - 0.2, 0.5))}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                >
                  -
                </button>
              </div>

              {/* Network Visualization */}
              <div 
                className="relative w-full h-full"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
              >
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {networkData?.nodes.map(node => 
                    node.connections.map(connectionId => {
                      const targetNode = networkData.nodes.find(n => n.id === connectionId);
                      if (!targetNode) return null;
                      
                      return (
                        <line
                          key={`${node.id}-${connectionId}`}
                          x1={node.x}
                          y1={node.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke="rgb(34, 197, 94)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.6"
                        />
                      );
                    })
                  )}
                </svg>

                {/* Dream Nodes */}
                {networkData?.nodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${getNodeColor(node.type, node.status)} border-2 rounded-lg p-3 ${
                      selectedNode === node.id ? 'ring-2 ring-gold-400' : ''
                    }`}
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{getNodeIcon(node.type, node.status)}</div>
                      <div className="text-xs font-bold text-white">{node.id}</div>
                      <div className={`text-xs ${getCloudColor(node.cloud)}`}>
                        {node.cloud.replace('-', ' ')}
                      </div>
                      <div className="text-xs text-gray-400">Lv.{node.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Node Details */}
            {selectedNode && (
              <div className="mt-6 bg-black border border-cyan-600 rounded-lg p-6">
                {(() => {
                  const node = networkData?.nodes.find(n => n.id === selectedNode);
                  if (!node) return null;
                  
                  return (
                    <div>
                      <h4 className="text-xl font-bold text-cyan-400 mb-4">
                        {getNodeIcon(node.type, node.status)} {node.id}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><span className="text-gray-400">Type:</span> <span className="text-purple-400 capitalize">{node.type}</span></p>
                          <p><span className="text-gray-400">Status:</span> <span className="text-green-400 capitalize">{node.status}</span></p>
                          <p><span className="text-gray-400">Level:</span> <span className="text-gold-400">{node.level}</span></p>
                          <p><span className="text-gray-400">Cloud:</span> <span className={`${getCloudColor(node.cloud)} capitalize`}>{node.cloud.replace('-', ' ')}</span></p>
                        </div>
                        
                        <div>
                          <p className="text-gray-400 mb-2">Tags:</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {node.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-purple-800 text-purple-300 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <p className="text-gray-400 mb-1">Connections: {node.connections.length}</p>
                          <div className="text-xs text-cyan-300">
                            {node.connections.map(conn => (
                              <span key={conn} className="mr-2">{conn}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Evolution Paths View */
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-purple-400 text-center mb-8">🧬 Dream Evolution Paths</h3>
            
            {networkData?.evolutions.map((evolution, index) => (
              <div key={index} className="bg-gray-900 border border-purple-500 rounded-lg p-8">
                <div className="flex flex-col items-center space-y-6">
                  {/* Original Dream */}
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-900 border-2 border-blue-500 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">💭</div>
                      <div className="text-blue-400 font-bold">DREAM NODE</div>
                      <div className="text-sm text-blue-300">{evolution.original}</div>
                    </div>
                    <div className="text-2xl text-gray-400">——→</div>
                    <div className="bg-green-900 border-2 border-green-500 rounded-lg p-4 text-center">
                      <div className="text-2xl mb-2">🧪</div>
                      <div className="text-green-400 font-bold">REMIX 001</div>
                      <div className="text-sm text-green-300">{evolution.remix}</div>
                    </div>
                  </div>

                  {/* Downward Arrow */}
                  <div className="text-3xl text-gray-400">↓</div>

                  {/* Fossil State */}
                  <div className="bg-gray-800 border-2 border-gray-500 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">🦴</div>
                    <div className="text-gray-400 font-bold">FOSSIL</div>
                    <div className="text-sm text-gray-300">{evolution.fossil}</div>
                  </div>

                  {/* Downward Arrow */}
                  <div className="text-3xl text-gray-400">↓</div>

                  {/* Resurrected Dream */}
                  <div className="bg-gold-900 border-2 border-gold-500 rounded-lg p-4 text-center">
                    <div className="text-2xl mb-2">✨</div>
                    <div className="text-gold-400 font-bold">RESURRECTED</div>
                    <div className="text-sm text-gold-300">{evolution.resurrected}</div>
                  </div>
                </div>

                {/* Evolution Timeline */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <h4 className="text-lg font-semibold text-purple-400 mb-4">Evolution Timeline</h4>
                  <div className="flex flex-wrap gap-2">
                    {evolution.evolutionPath.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center">
                        <span className="px-3 py-1 bg-purple-800 text-purple-300 rounded text-sm">
                          {step}
                        </span>
                        {stepIndex < evolution.evolutionPath.length - 1 && (
                          <span className="mx-2 text-gray-400">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Network Statistics */}
        <div className="bg-gray-900 border border-gold-500 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gold-400 mb-6">📊 Network Statistics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {networkData?.nodes.filter(n => n.type === 'dream').length || 0}
              </div>
              <div className="text-gray-400">Dream Nodes</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {networkData?.nodes.filter(n => n.status === 'fossilized').length || 0}
              </div>
              <div className="text-gray-400">Fossilized</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {networkData?.nodes.filter(n => n.status === 'active').length || 0}
              </div>
              <div className="text-gray-400">Active Nodes</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">
                {networkData?.evolutions.length || 0}
              </div>
              <div className="text-gray-400">Evolution Paths</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-center gap-4">
          <button 
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
            onClick={() => window.history.back()}
          >
            ← Back to Dashboard
          </button>
          <button 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            onClick={() => window.location.href = '/dream-graveyard'}
          >
            🦴 Dream Graveyard
          </button>
        </div>
      </div>
    </div>
  );
}