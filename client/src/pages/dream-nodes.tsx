import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DreamNode {
  id: string;
  name: string;
  token: string;
  creator: string;
  createdAt: number;
  isolation: boolean;
  trustBoundary: number;
  usageCount: number;
  inboxEnabled: boolean;
  mintEnabled: boolean;
  public: boolean;
  agentVisibility: string[];
  allowedAccess: string[];
  description: string;
  version: string;
}

interface NodesResponse {
  success: boolean;
  nodes: DreamNode[];
  totalCount: number;
  dreamNodeInterface: string;
}

function shortenWallet(wallet: string): string {
  if (!wallet || wallet.length < 10) return wallet;
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

export default function DreamNodes() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Fetch all public nodes
  const { data: nodesData, isLoading, error } = useQuery<NodesResponse>({
    queryKey: ['/api/nodes'],
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch specific node details when one is selected
  const { data: nodeDetails } = useQuery<{
    success: boolean;
    node: DreamNode;
    usageStats: {
      nodeId: string;
      totalRequests: number;
      successfulRequests: number;
      failedRequests: number;
      averageResponseTime: number;
      lastUsed: number;
      topUsers: Array<{ wallet: string; requestCount: number }>;
    };
  }>({
    queryKey: ['/api/nodes', selectedNode],
    enabled: !!selectedNode
  });

  const dreamNodes = nodesData?.nodes || [];

  const openNode = (nodeId: string) => {
    setSelectedNode(nodeId);
    console.log(`Opening node: ${nodeId}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-cyan-400">Loading DreamNodes...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-400">
          Error loading DreamNodes: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">DreamNodes Registry</h1>
        <p className="text-gray-400">
          Explore available nodes in the Dream Network ecosystem
        </p>
        <div className="text-sm text-gray-500 mt-2">
          {dreamNodes.length} public nodes available
        </div>
      </div>

      <ul className="dream-node-grid grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dreamNodes.map(node => (
          <li key={node.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-cyan-400 transition-colors">
            <h3 className="text-xl font-semibold text-white mb-2">
              {node.name} ({node.token})
            </h3>
            <p className="text-gray-400 mb-2">
              🌐 {node.public ? 'Public' : 'Private'} • 🧱 Isolated: {node.isolation ? 'Yes' : 'No'}
            </p>
            <p className="text-gray-400 mb-2">
              Created by: {shortenWallet(node.creator)}
            </p>
            <p className="text-gray-400 mb-4">
              Trust Required: {node.trustBoundary}+
            </p>
            
            {/* Additional node info */}
            <div className="text-sm text-gray-500 mb-4">
              <div>Usage Count: {node.usageCount}</div>
              <div>Agents: {node.agentVisibility.join(', ')}</div>
              <div>Capabilities: {node.allowedAccess.slice(0, 2).join(', ')}{node.allowedAccess.length > 2 ? '...' : ''}</div>
            </div>
            
            <button 
              onClick={() => openNode(node.id)}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Visit Node
            </button>
          </li>
        ))}
      </ul>

      {dreamNodes.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p>No public DreamNodes are currently available.</p>
          <p className="text-sm mt-2">Check back later or contact an administrator.</p>
        </div>
      )}

      {/* Selected Node Details Modal/Panel */}
      {selectedNode && nodeDetails && nodeDetails.node && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-cyan-400 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">
                {nodeDetails.node.name}
              </h2>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-3 text-gray-300">
              <div><strong>Token:</strong> {nodeDetails.node.token}</div>
              <div><strong>Creator:</strong> {nodeDetails.node.creator}</div>
              <div><strong>Trust Boundary:</strong> {nodeDetails.node.trustBoundary}+</div>
              <div><strong>Isolation:</strong> {nodeDetails.node.isolation ? 'Enabled' : 'Disabled'}</div>
              <div><strong>Public Access:</strong> {nodeDetails.node.public ? 'Yes' : 'No'}</div>
              <div><strong>Description:</strong> {nodeDetails.node.description}</div>
              <div><strong>Capabilities:</strong> {nodeDetails.node.allowedAccess.join(', ')}</div>
              <div><strong>Agent Visibility:</strong> {nodeDetails.node.agentVisibility.join(', ')}</div>
              
              {nodeDetails.usageStats && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Usage Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Total Requests: {nodeDetails.usageStats.totalRequests}</div>
                    <div>Success Rate: {nodeDetails.usageStats.totalRequests > 0 ? 
                      Math.round((nodeDetails.usageStats.successfulRequests / nodeDetails.usageStats.totalRequests) * 100) : 0}%</div>
                    <div>Failed Requests: {nodeDetails.usageStats.failedRequests}</div>
                    <div>Avg Response: {Math.round(nodeDetails.usageStats.averageResponseTime)}ms</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}