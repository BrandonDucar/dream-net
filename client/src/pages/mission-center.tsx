import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import XPMeter from '@/components/XPMeter';
import { useToast } from '@/hooks/use-toast';

interface UserAgent {
  customAgentId: string;
  name: string;
  agentsIncluded: string[];
  traits: string[];
  status: string;
  currentMission?: string;
}

interface MissionLog {
  logId: string;
  agentId: string;
  agentName: string;
  missionType: string;
  owner: string;
  timestamp: number;
  results: string[];
  xpGained: number;
  status: string;
  targetZone?: string;
}

interface MissionDeployment {
  success: boolean;
  deploymentId: string;
  missionLog: MissionLog;
  summary: string;
}

export default function MissionCenter() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedMissionType, setSelectedMissionType] = useState('fossilScanner');
  const [targetZone, setTargetZone] = useState('DeSci');
  
  // Mock wallet data with XP
  const walletData = {
    address: '0xabc...123',
    xp: 190,
    level: 2
  };

  const { data: userAgents = [] } = useQuery({
    queryKey: ['/api/agents/user-agents', '0xabc...123'],
    queryFn: async (): Promise<UserAgent[]> => {
      const response = await fetch('/api/agents/user-agents/0xabc...123');
      return response.json();
    }
  });

  const { data: missionLogs = [] } = useQuery({
    queryKey: ['/api/agents/mission-logs'],
    queryFn: async (): Promise<MissionLog[]> => {
      const response = await fetch('/api/agents/mission-logs');
      return response.json();
    }
  });

  const deployMissionMutation = useMutation({
    mutationFn: async ({ agentId, missionType, targetZone }: { agentId: string; missionType: string; targetZone: string }): Promise<MissionDeployment> => {
      const response = await apiRequest('/api/agents/deploy-mission', {
        method: 'POST',
        body: JSON.stringify({
          agentId,
          missionType,
          targetZone
        })
      });
      return response as unknown as MissionDeployment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents/mission-logs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/agents/user-agents'] });
      
      // Show level up toast if applicable
      if (data.xpUpdate?.levelUp) {
        toast({
          title: "🎉 Level Up!",
          description: `You leveled up to L${data.xpUpdate.newLevel}!`,
          duration: 5000,
        });
      }
    }
  });

  const handleDeployMission = () => {
    if (!selectedAgent || !selectedMissionType) return;
    
    deployMissionMutation.mutate({
      agentId: selectedAgent,
      missionType: selectedMissionType,
      targetZone
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getMissionDescription = (missionType: string) => {
    const descriptions: Record<string, string> = {
      fossilScanner: 'Identify inactive dreams for revival',
      remixStrategist: 'Plan optimal remix strategies',
      viralScout: 'Track viral dream patterns',
      walletWhisperer: 'Analyze wallet behaviors'
    };
    return descriptions[missionType] || 'Unknown mission type';
  };

  const getAgentStatus = (agent: UserAgent) => {
    if (agent.currentMission) {
      return (
        <span className="text-yellow-400 text-sm">
          🔄 Running {agent.currentMission}
        </span>
      );
    }
    return (
      <span className="text-green-400 text-sm">
        ✅ Idle
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
          🎯 Mission Control Center
        </h1>

        {/* Wallet XP Display */}
        <div className="mb-8">
          <XPMeter 
            level={walletData.level} 
            xp={walletData.xp} 
            className="max-w-md mx-auto"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Mission Assignment */}
          <section className="mission-center bg-gray-900 border border-cyan-500 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">🎯 Assign a Mission</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">Select Agent:</label>
                <select 
                  id="agentSelect"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">Choose an agent...</option>
                  {userAgents.map((agent) => (
                    <option key={agent.customAgentId} value={agent.customAgentId}>
                      {agent.name} - {agent.traits.join(', ')}
                    </option>
                  ))}
                </select>
                
                {userAgents.length > 0 && (
                  <div className="mt-2 text-sm text-gray-400">
                    Available agents: {userAgents.length}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Mission Type:</label>
                <select 
                  id="missionType"
                  value={selectedMissionType}
                  onChange={(e) => setSelectedMissionType(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="fossilScanner">Fossil Scanner</option>
                  <option value="remixStrategist">Remix Strategist</option>
                  <option value="viralScout">Viral Scout</option>
                  <option value="walletWhisperer">Wallet Whisperer</option>
                </select>
                
                <p className="mt-2 text-sm text-gray-400">
                  {getMissionDescription(selectedMissionType)}
                </p>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Target Zone:</label>
                <select 
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="DeSci">DeSci</option>
                  <option value="DeFi">DeFi</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Memes">Memes</option>
                  <option value="ZK">ZK</option>
                </select>
              </div>

              <button 
                onClick={handleDeployMission}
                disabled={deployMissionMutation.isPending || !selectedAgent}
                className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                {deployMissionMutation.isPending ? 'Deploying Mission...' : 'Deploy Mission'}
              </button>

              {deployMissionMutation.data && (
                <div className="mt-4 p-4 bg-green-900 border border-green-500 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">Mission Deployed!</h4>
                  <p className="text-green-300 text-sm">{deployMissionMutation.data.summary}</p>
                </div>
              )}
            </div>
          </section>

          {/* Agent Status */}
          <section className="bg-gray-900 border border-purple-500 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-purple-400 mb-6">🤖 Agent Status</h3>
            
            {userAgents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No agents found</p>
                <button 
                  onClick={() => window.location.href = '/agent-customizer'}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded transition-colors"
                >
                  Create Agent
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userAgents.map((agent) => (
                  <div key={agent.customAgentId} className="bg-black border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-white">{agent.name}</h4>
                      {getAgentStatus(agent)}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">
                      Modules: {agent.agentsIncluded.join(', ')}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Traits: {agent.traits.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Mission Logbook */}
        <section className="logbook mt-8 bg-gray-900 border border-gold-500 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gold-400 mb-6">📖 Mission Logbook</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-3 px-4 text-white font-semibold">Agent</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Mission</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Result</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">XP</th>
                  <th className="text-left py-3 px-4 text-white font-semibold">Date</th>
                </tr>
              </thead>
              <tbody id="missionLogs">
                {missionLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      No mission logs found. Deploy a mission to see results here.
                    </td>
                  </tr>
                ) : (
                  missionLogs.map((log) => (
                    <tr key={log.logId} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-cyan-400 font-semibold">{log.agentName}</div>
                        <div className="text-gray-400 text-sm">{log.targetZone}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-white">{log.missionType}</div>
                        <div className="text-gray-400 text-sm">{getMissionDescription(log.missionType)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-green-400 text-sm">
                          {log.results.length} results found
                        </div>
                        <div className="text-gray-300 text-xs mt-1">
                          {log.results[0]}
                          {log.results.length > 1 && (
                            <span className="text-gray-500"> +{log.results.length - 1} more</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gold-400 font-semibold">+{log.xpGained}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-300">{formatDate(log.timestamp)}</div>
                        <div className="text-gray-500 text-sm">
                          {log.status === 'complete' ? '✅ Complete' : '🔄 Running'}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {missionLogs.length > 0 && (
            <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
              <span>Total missions: {missionLogs.length}</span>
              <span>Total XP earned: {missionLogs.reduce((sum, log) => sum + log.xpGained, 0)}</span>
            </div>
          )}
        </section>

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
            onClick={() => window.location.href = '/agent-customizer'}
          >
            🤖 Agent Customizer
          </button>
        </div>
      </div>
    </div>
  );
}