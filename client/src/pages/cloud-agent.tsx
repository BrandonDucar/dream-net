import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface CloudAgent {
  cloudId: string;
  agentName: string;
  levelUnlocked: number;
  abilities: string[];
  personality: string;
  currentTasks: string[];
  status: 'deployed' | 'idle' | 'active' | 'offline';
  deployedAt: number;
  taskHistory: string[];
  logs: string[];
}

interface TaskAssignment {
  agentName: string;
  task: string;
  priority: 'low' | 'medium' | 'high';
}

export default function CloudAgent() {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const { data: agents, isLoading } = useQuery<CloudAgent[]>({
    queryKey: ['/api/cloud-agents'],
    queryFn: async () => {
      const response = await fetch('/api/cloud-agents');
      if (!response.ok) {
        throw new Error('Failed to fetch cloud agents');
      }
      return response.json();
    }
  });

  const assignTaskMutation = useMutation({
    mutationFn: async (assignment: TaskAssignment) => {
      return apiRequest('/api/cloud-agents/assign-task', {
        method: 'POST',
        body: JSON.stringify(assignment)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cloud-agents'] });
      setNewTask('');
      setSelectedAgent(null);
    }
  });

  const handleAssignTask = (agentName: string) => {
    if (!newTask.trim()) return;
    
    assignTaskMutation.mutate({
      agentName,
      task: newTask,
      priority: 'medium'
    });
  };

  const formatAbilities = (abilities: string[]) => {
    return abilities.map(ability => {
      return ability.replace(/([A-Z])/g, ' $1').trim();
    }).join(', ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading cloud agents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
          ☁️ Cloud Agent Deployment
        </h1>

        {/* Agent Deployments */}
        <div className="space-y-8 mb-12">
          {agents?.map((agent) => (
            <section key={agent.agentName} className="cloud-agent bg-gray-900 border border-cyan-500 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-cyan-400 mb-6">
                🤖 {agent.agentName} has been deployed
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-lg mb-3">
                    <span className="text-gray-400">Personality:</span>{' '}
                    <span className="text-purple-400 italic">{agent.personality}</span>
                  </p>
                  
                  <p className="text-lg mb-3">
                    <span className="text-gray-400">Abilities:</span>{' '}
                    <span className="text-green-400">{formatAbilities(agent.abilities)}</span>
                  </p>
                  
                  <p className="text-lg mb-3">
                    <span className="text-gray-400">Cloud:</span>{' '}
                    <span className="text-blue-400 capitalize">{agent.cloudId.replace('-', ' ')}</span>
                  </p>
                  
                  <p className="text-lg">
                    <span className="text-gray-400">Level:</span>{' '}
                    <span className="text-gold-400 font-semibold">{agent.levelUnlocked}</span>
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-400 mb-3">Current Tasks:</h4>
                  <div className="space-y-2">
                    {agent.currentTasks.length > 0 ? (
                      agent.currentTasks.map((task, index) => (
                        <div key={index} className="bg-black border border-gray-600 rounded p-3">
                          <span className="text-cyan-300 text-sm">{task}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic">No active tasks</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Assignment Form */}
              {selectedAgent === agent.agentName && (
                <div className="bg-black border border-cyan-600 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-4">Assign New Task</h4>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Enter task description..."
                      className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded text-white focus:border-cyan-500 focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && handleAssignTask(agent.agentName)}
                    />
                    <button
                      onClick={() => handleAssignTask(agent.agentName)}
                      disabled={assignTaskMutation.isPending || !newTask.trim()}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-semibold rounded transition-colors"
                    >
                      {assignTaskMutation.isPending ? 'Assigning...' : 'Assign Task'}
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="mt-3 text-sm text-gray-400 hover:text-gray-300"
                  >
                    Cancel assignment
                  </button>
                </div>
              )}

              {/* Agent Logs */}
              {showLogs && selectedAgent === agent.agentName && (
                <div className="bg-black border border-gray-600 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-semibold text-gray-400 mb-4">Agent Logs</h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {agent.logs.length > 0 ? (
                      agent.logs.map((log, index) => (
                        <div key={index} className="text-sm text-gray-300 font-mono bg-gray-800 p-2 rounded">
                          {log}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic">No logs available</div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowLogs(false)}
                    className="mt-3 text-sm text-gray-400 hover:text-gray-300"
                  >
                    Hide logs
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setShowLogs(!showLogs);
                    setSelectedAgent(agent.agentName);
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  View Agent Logs
                </button>
                
                <button
                  onClick={() => setSelectedAgent(agent.agentName)}
                  disabled={selectedAgent === agent.agentName}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Assign Tasks
                </button>
                
                <button
                  onClick={() => window.location.href = `/agent-details/${agent.agentName}`}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
                >
                  Agent Details
                </button>
              </div>

              {/* Deployment Info */}
              <div className="mt-6 pt-6 border-t border-gray-700 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Deployed: {new Date(agent.deployedAt).toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    agent.status === 'deployed' ? 'bg-green-900 text-green-400' :
                    agent.status === 'active' ? 'bg-blue-900 text-blue-400' :
                    agent.status === 'idle' ? 'bg-yellow-900 text-yellow-400' :
                    'bg-red-900 text-red-400'
                  }`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Deployment Summary */}
        <div className="bg-gray-900 border border-gold-500 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-gold-400 mb-6">📊 Deployment Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">
                {agents?.length || 0}
              </div>
              <div className="text-gray-400">Deployed Agents</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {agents?.filter(a => a.status === 'active').length || 0}
              </div>
              <div className="text-gray-400">Active Agents</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {agents?.reduce((sum, agent) => sum + agent.currentTasks.length, 0) || 0}
              </div>
              <div className="text-gray-400">Active Tasks</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-gold-400">
                {agents?.reduce((sum, agent) => sum + agent.taskHistory.length, 0) || 0}
              </div>
              <div className="text-gray-400">Completed Tasks</div>
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
            onClick={() => window.location.href = '/agent-dashboard'}
          >
            🤖 Agent Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}