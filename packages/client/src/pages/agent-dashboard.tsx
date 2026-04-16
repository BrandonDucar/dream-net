import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface Agent {
  cloudId: string;
  agentName: string;
  levelUnlocked: number;
  abilities: string[];
  personality: string;
  currentTasks: string[];
  status: 'active' | 'idle' | 'busy' | 'offline';
  trustLevel: number;
  activeSince: number;
  completedTasks: number;
}

interface AgentCommand {
  agentName: string;
  command: string;
  params?: any;
}

export default function AgentDashboard() {
  const queryClient = useQueryClient();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [commandInput, setCommandInput] = useState('');

  const { data: agents, isLoading } = useQuery<Agent[]>({
    queryKey: ['/api/agents/dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/agents/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }
      return response.json();
    }
  });

  const executeCommandMutation = useMutation({
    mutationFn: async (command: AgentCommand) => {
      return apiRequest('/api/agents/execute', {
        method: 'POST',
        body: JSON.stringify(command)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents/dashboard'] });
      setCommandInput('');
    }
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': 'text-green-400 bg-green-900',
      'idle': 'text-yellow-400 bg-yellow-900',
      'busy': 'text-blue-400 bg-blue-900',
      'offline': 'text-red-400 bg-red-900'
    };
    return colors[status] || 'text-gray-400 bg-gray-900';
  };

  const getCloudIcon = (cloudId: string) => {
    const icons: Record<string, string> = {
      'zk-guardians': '🛡️',
      'defi-vaults': '💰',
      'ai-research': '🧠',
      'meme-factory': '🎭'
    };
    return icons[cloudId] || '☁️';
  };

  const handleExecuteCommand = (agentName: string) => {
    if (!commandInput.trim()) return;
    
    executeCommandMutation.mutate({
      agentName,
      command: commandInput,
      params: { timestamp: Date.now() }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading agent dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
          🤖 Agent Dashboard
        </h1>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {agents?.map((agent) => (
            <div key={agent.agentName} className="bg-gray-900 border border-cyan-500 rounded-lg p-6">
              {/* Agent Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{getCloudIcon(agent.cloudId)}</span>
                <div>
                  <h3 className="text-xl font-bold text-cyan-400">{agent.agentName}</h3>
                  <p className="text-sm text-gray-400 capitalize">
                    {agent.cloudId.replace('-', ' ')}
                  </p>
                </div>
                <div className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(agent.status)}`}>
                  {agent.status.toUpperCase()}
                </div>
              </div>

              {/* Agent Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-400">Level:</span>
                  <span className="text-green-400 font-semibold ml-2">{agent.levelUnlocked}</span>
                </div>
                <div>
                  <span className="text-gray-400">Trust:</span>
                  <span className="text-purple-400 font-semibold ml-2">{agent.trustLevel}</span>
                </div>
                <div>
                  <span className="text-gray-400">Tasks Done:</span>
                  <span className="text-gold-400 font-semibold ml-2">{agent.completedTasks}</span>
                </div>
                <div>
                  <span className="text-gray-400">Active:</span>
                  <span className="text-cyan-400 font-semibold ml-2">
                    {Math.floor((Date.now() - agent.activeSince) / 3600000)}h
                  </span>
                </div>
              </div>

              {/* Abilities */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Abilities:</h4>
                <div className="flex flex-wrap gap-1">
                  {agent.abilities.map((ability, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-purple-800 text-purple-300 rounded text-xs"
                    >
                      {ability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Current Tasks */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Current Tasks:</h4>
                <div className="space-y-1">
                  {agent.currentTasks.map((task, index) => (
                    <div key={index} className="text-xs text-cyan-300 bg-gray-800 px-2 py-1 rounded">
                      {task}
                    </div>
                  ))}
                </div>
              </div>

              {/* Personality */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-1">Personality:</h4>
                <p className="text-xs text-gray-300 italic">"{agent.personality}"</p>
              </div>

              {/* Command Interface */}
              {selectedAgent === agent.agentName ? (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commandInput}
                      onChange={(e) => setCommandInput(e.target.value)}
                      placeholder="Enter command..."
                      className="flex-1 px-3 py-2 bg-black border border-gray-600 rounded text-white text-sm focus:border-cyan-500 focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleExecuteCommand(agent.agentName)}
                    />
                    <button
                      onClick={() => handleExecuteCommand(agent.agentName)}
                      disabled={executeCommandMutation.isPending || !commandInput.trim()}
                      className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 text-black text-sm font-semibold rounded transition-colors"
                    >
                      Send
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="mt-2 text-xs text-gray-400 hover:text-gray-300"
                  >
                    Close command interface
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedAgent(agent.agentName)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors"
                >
                  Open Command Interface
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Agent Summary */}
        <div className="bg-gray-900 border border-purple-500 rounded-lg p-6 mb-12">
          <h3 className="text-2xl font-bold text-purple-400 mb-6">🎯 Agent Network Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {agents?.filter(a => a.status === 'active').length || 0}
              </div>
              <div className="text-gray-400">Active Agents</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {agents?.reduce((sum, agent) => sum + agent.completedTasks, 0) || 0}
              </div>
              <div className="text-gray-400">Tasks Completed</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">
                {agents?.reduce((sum, agent) => sum + agent.currentTasks.length, 0) || 0}
              </div>
              <div className="text-gray-400">Active Tasks</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {Math.round((agents?.reduce((sum, agent) => sum + agent.trustLevel, 0) || 0) / (agents?.length || 1))}
              </div>
              <div className="text-gray-400">Avg Trust Level</div>
            </div>
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
            onClick={() => window.location.href = '/dream-ops-launcher'}
          >
            🚀 DreamOps Launcher
          </button>
        </div>
      </div>
    </div>
  );
}