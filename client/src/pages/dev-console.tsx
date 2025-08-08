import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SimulationResult {
  remixXP: number;
  teamXP: number;
  chainDepth: number;
  projectedGrowth: string;
  evolutionPath: string[];
}

interface BountyTestResult {
  success: boolean;
  claimedAmount: number;
  tokenType: string;
  gasCost: number;
  transactionId: string;
}

interface DevTool {
  id: string;
  name: string;
  description: string;
  category: 'simulation' | 'testing' | 'debugging' | 'analytics';
  status: 'active' | 'beta' | 'deprecated';
}

export default function DevConsole() {
  const queryClient = useQueryClient();
  
  // Remix Chain Simulator State
  const [startDreamId, setStartDreamId] = useState('');
  const [chainDepth, setChainDepth] = useState<number>(3);
  const [simulationOutput, setSimulationOutput] = useState('Remix XP Projection: 1500 | Team XP: +320');
  
  // Bounty Engine State
  const [selectedToken, setSelectedToken] = useState('SHEEP');
  const [bountyAmount, setBountyAmount] = useState<number>(500);
  const [bountyOutput, setBountyOutput] = useState('');
  
  // Dynamic Tools State
  const [activeTools, setActiveTools] = useState<DevTool[]>([
    {
      id: 'dream-analyzer',
      name: '🔍 Dream Analyzer',
      description: 'Analyze dream patterns and performance metrics',
      category: 'analytics',
      status: 'active'
    },
    {
      id: 'agent-debugger',
      name: '🤖 Agent Debugger',
      description: 'Debug agent responses and decision trees',
      category: 'debugging',
      status: 'beta'
    },
    {
      id: 'xp-calculator',
      name: '📊 XP Calculator',
      description: 'Calculate XP distributions and team bonuses',
      category: 'simulation',
      status: 'active'
    },
    {
      id: 'network-tester',
      name: '🌐 Network Tester',
      description: 'Test dream network connections and latency',
      category: 'testing',
      status: 'active'
    }
  ]);

  const remixSimulatorMutation = useMutation({
    mutationFn: async ({ dreamId, depth }: { dreamId: string; depth: number }): Promise<SimulationResult> => {
      const response = await apiRequest('/api/dev-console/simulate-remix', {
        method: 'POST',
        body: JSON.stringify({ dreamId, chainDepth: depth })
      });
      return response;
    },
    onSuccess: (data: SimulationResult) => {
      setSimulationOutput(
        `Remix XP Projection: ${data.remixXP} | Team XP: +${data.teamXP} | Growth: ${data.projectedGrowth}`
      );
    }
  });

  const bountyTestMutation = useMutation({
    mutationFn: async ({ token, amount }: { token: string; amount: number }): Promise<BountyTestResult> => {
      const response = await apiRequest('/api/dev-console/test-bounty', {
        method: 'POST',
        body: JSON.stringify({ tokenType: token, amount })
      });
      return response;
    },
    onSuccess: (data: BountyTestResult) => {
      setBountyOutput(
        data.success 
          ? `✅ Claimed ${data.claimedAmount} ${data.tokenType} | Gas: ${data.gasCost} | TX: ${data.transactionId}`
          : `❌ Claim failed for ${data.claimedAmount} ${data.tokenType}`
      );
    }
  });

  const handleRemixSimulation = () => {
    if (!startDreamId.trim()) {
      setSimulationOutput('❌ Error: Dream ID required');
      return;
    }
    
    remixSimulatorMutation.mutate({ 
      dreamId: startDreamId, 
      depth: chainDepth 
    });
  };

  const handleBountyTest = () => {
    if (!bountyAmount || bountyAmount <= 0) {
      setBountyOutput('❌ Error: Valid amount required');
      return;
    }
    
    bountyTestMutation.mutate({ 
      token: selectedToken, 
      amount: bountyAmount 
    });
  };

  const getToolStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'text-green-400',
      'beta': 'text-yellow-400',
      'deprecated': 'text-red-400'
    };
    return colors[status] || 'text-gray-400';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'simulation': '🔄',
      'testing': '🧪',
      'debugging': '🐛',
      'analytics': '📈'
    };
    return icons[category] || '🔧';
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <section className="dev-console">
          <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
            🧰 Dream Dev Console
          </h1>

          {/* Primary Tools Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            
            {/* Remix Chain Simulator */}
            <div className="tool bg-gray-900 border border-cyan-500 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">🔄 Remix Chain Simulator</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Start Dream ID"
                  value={startDreamId}
                  onChange={(e) => setStartDreamId(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                />
                
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Chain Depth"
                  value={chainDepth}
                  onChange={(e) => setChainDepth(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                />
                
                <button
                  onClick={handleRemixSimulation}
                  disabled={remixSimulatorMutation.isPending}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {remixSimulatorMutation.isPending ? 'Simulating...' : 'Simulate'}
                </button>
                
                <pre className="output bg-black border border-gray-700 rounded p-4 text-green-400 font-mono text-sm overflow-x-auto">
                  {simulationOutput}
                </pre>
              </div>
            </div>

            {/* Bounty Engine */}
            <div className="tool bg-gray-900 border border-purple-500 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-6">💰 Bounty Engine</h3>
              
              <div className="space-y-4">
                <select
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="SHEEP">Token: SHEEP</option>
                  <option value="FLBY">Token: FLBY</option>
                  <option value="CORE">Token: CORE</option>
                </select>
                
                <input
                  type="number"
                  placeholder="Amount"
                  value={bountyAmount}
                  onChange={(e) => setBountyAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
                
                <button
                  onClick={handleBountyTest}
                  disabled={bountyTestMutation.isPending}
                  className="w-full px-6 py-3 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-700 text-black font-semibold rounded-lg transition-colors"
                >
                  {bountyTestMutation.isPending ? 'Testing...' : 'Test Claim'}
                </button>
                
                {bountyOutput && (
                  <pre className="output bg-black border border-gray-700 rounded p-4 text-gold-400 font-mono text-sm overflow-x-auto">
                    {bountyOutput}
                  </pre>
                )}
              </div>
            </div>
          </div>

          {/* Dynamic Tools Section */}
          <div className="bg-gray-900 border border-gold-500 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-gold-400 mb-6">🔧 Additional Dev Tools</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeTools.map((tool) => (
                <div key={tool.id} className="bg-black border border-gray-600 rounded-lg p-6 hover:border-cyan-500 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-white">
                      {getCategoryIcon(tool.category)} {tool.name}
                    </h4>
                    <span className={`text-sm font-medium ${getToolStatusColor(tool.status)} uppercase`}>
                      {tool.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{tool.description}</p>
                  
                  <button className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded transition-colors">
                    Launch Tool
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Console Output & Logs */}
          <div className="bg-gray-900 border border-red-500 rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold text-red-400 mb-6">🖥️ System Console</h3>
            
            <div className="bg-black border border-gray-700 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
              <div className="text-green-400">[12:42:30] System initialized successfully</div>
              <div className="text-blue-400">[12:42:31] Dream network connections established</div>
              <div className="text-yellow-400">[12:42:32] WARNING: Database endpoint disabled</div>
              <div className="text-purple-400">[12:42:33] Agent orchestration active</div>
              <div className="text-cyan-400">[12:42:34] Bounty engine ready</div>
              <div className="text-gray-400">[12:42:35] Waiting for user input...</div>
            </div>
            
            <div className="mt-4 flex gap-4">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors">
                Clear Console
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors">
                Export Logs
              </button>
              <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded transition-colors">
                Debug Mode
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-gray-900 border border-green-500 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-400">247</div>
              <div className="text-gray-400">Active Dreams</div>
            </div>
            
            <div className="bg-gray-900 border border-blue-500 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">1.2s</div>
              <div className="text-gray-400">Avg Response</div>
            </div>
            
            <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-400">99.8%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            
            <div className="bg-gray-900 border border-gold-500 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-gold-400">156k</div>
              <div className="text-gray-400">Total XP</div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-4">
            <button 
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
              onClick={() => window.history.back()}
            >
              ← Back to Dashboard
            </button>
            <button 
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              onClick={() => window.location.href = '/ecosystem-dashboard'}
            >
              🌐 Ecosystem Dashboard
            </button>
            <button 
              className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-black font-semibold rounded-lg transition-colors"
              onClick={() => window.location.href = '/god-terminal'}
            >
              👑 God Terminal
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}