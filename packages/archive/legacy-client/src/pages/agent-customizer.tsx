import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface CustomAgent {
  customAgentId: string;
  owner: string;
  agentsIncluded: string[];
  name: string;
  traits: string[];
  createdAt: number;
}

interface AgentMission {
  agentId: string;
  missionType: string;
  options: {
    minInactivityDays?: number;
    bountyTrigger?: boolean;
    zone?: string;
  };
}

interface LockedPanel {
  toolName: string;
  requirements: string;
  isLocked: boolean;
}

export default function AgentCustomizer() {
  const queryClient = useQueryClient();
  
  // Agent Creation State
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [agentName, setAgentName] = useState('');
  const [createdAgent, setCreatedAgent] = useState<CustomAgent | null>(null);
  
  // Mission Assignment State
  const [missionType, setMissionType] = useState('fossilScanner');
  const [missionZone, setMissionZone] = useState('DeSci');
  const [minInactivityDays, setMinInactivityDays] = useState(14);
  const [bountyTrigger, setBountyTrigger] = useState(true);

  const availableModules = [
    { id: 'ROOT', name: 'ROOT', description: 'Subconscious Architect' },
    { id: 'CANVAS', name: 'CANVAS', description: 'Visual Layer Weaver' },
    { id: 'WING', name: 'WING', description: 'Messenger & Mint Agent' },
    { id: 'CRADLE', name: 'CRADLE', description: 'Evolution Engine' },
    { id: 'LUCID', name: 'LUCID', description: 'Logic Unification & Command Interface Daemon' },
    { id: 'ECHO', name: 'ECHO', description: 'Wallet Mirror' }
  ];

  const missionTypes = [
    { id: 'fossilScanner', name: 'Fossil Scanner', description: 'Identify inactive dreams for revival' },
    { id: 'bountyHunter', name: 'Bounty Hunter', description: 'Complete and claim bounties' },
    { id: 'networkGuardian', name: 'Network Guardian', description: 'Monitor and protect the dream network' },
    { id: 'xpOptimizer', name: 'XP Optimizer', description: 'Maximize team XP generation' }
  ];

  const { data: walletAccess } = useQuery({
    queryKey: ['/api/dev-console/access-check', '0xabc...123'],
    queryFn: async () => {
      const response = await fetch('/api/dev-console/access-check/0xabc...123');
      return response.json();
    }
  });

  const createAgentMutation = useMutation({
    mutationFn: async ({ modules, name }: { modules: string[]; name: string }): Promise<CustomAgent> => {
      return apiRequest('/api/agents/create-custom', {
        method: 'POST',
        body: JSON.stringify({
          agentsIncluded: modules,
          name: name.toUpperCase(),
          owner: '0xabc...123'
        })
      });
    },
    onSuccess: (data: CustomAgent) => {
      setCreatedAgent(data);
      queryClient.invalidateQueries({ queryKey: ['/api/agents/custom'] });
    }
  });

  const assignMissionMutation = useMutation({
    mutationFn: async (mission: AgentMission) => {
      return apiRequest('/api/agents/assign-mission', {
        method: 'POST',
        body: JSON.stringify(mission)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/agents/missions'] });
    }
  });

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId);
      } else if (prev.length < 4) {
        return [...prev, moduleId];
      }
      return prev;
    });
  };

  const handleCreateAgent = () => {
    if (selectedModules.length === 0 || !agentName.trim()) return;
    
    createAgentMutation.mutate({
      modules: selectedModules,
      name: agentName
    });
  };

  const handleAssignMission = () => {
    if (!createdAgent) return;
    
    assignMissionMutation.mutate({
      agentId: createdAgent.customAgentId,
      missionType,
      options: {
        minInactivityDays,
        bountyTrigger,
        zone: missionZone
      }
    });
  };

  const hasToolAccess = (toolName: string) => {
    return walletAccess?.accessStatus?.[toolName] ?? false;
  };

  const getLockedPanelInfo = (toolName: string): LockedPanel => {
    const requirements: Record<string, string> = {
      devConsole: 'You need a trust score of 65 or higher, or Creator badge to access.',
      walletScorer: 'You need a trust score of 75 or higher, or hold ≥ 1000 $SHEEP to access.',
      bountyEngine: 'You need Strategist badge or 3+ remix claims to access.',
      evolutionTester: 'You need Dream Architect badge or God mode to access.'
    };

    return {
      toolName,
      requirements: requirements[toolName] || 'Access requirements not specified.',
      isLocked: !hasToolAccess(toolName)
    };
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">
          🤖 Agent Customizer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Agent Creation Panel */}
          <section className="agent-customizer bg-gray-900 border border-cyan-500 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">🧠 Create Your Dream Agent</h2>
            
            <p className="text-gray-300 mb-6">Select up to 4 modules:</p>
            
            <div className="space-y-3 mb-6">
              {availableModules.map((module) => (
                <label key={module.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-800 p-3 rounded">
                  <input
                    type="checkbox"
                    value={module.id}
                    checked={selectedModules.includes(module.id)}
                    onChange={() => handleModuleToggle(module.id)}
                    disabled={!selectedModules.includes(module.id) && selectedModules.length >= 4}
                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
                  />
                  <span className="text-white font-semibold">{module.name}</span>
                  <span className="text-gray-400 text-sm">- {module.description}</span>
                </label>
              ))}
            </div>

            <input
              type="text"
              placeholder="Agent Name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none mb-6"
            />

            <button
              onClick={handleCreateAgent}
              disabled={createAgentMutation.isPending || selectedModules.length === 0 || !agentName.trim()}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
            >
              {createAgentMutation.isPending ? 'Creating Agent...' : 'Create Agent'}
            </button>

            <div className="mt-4 text-sm text-gray-400">
              Selected: {selectedModules.length}/4 modules
            </div>
          </section>

          {/* Mission Assignment Panel */}
          <div className="space-y-8">
            {createdAgent ? (
              <section className="bg-gray-900 border border-purple-500 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-purple-400 mb-6">🎯 Assign Mission</h3>
                
                <div className="bg-black border border-cyan-600 rounded-lg p-4 mb-6">
                  <h4 className="text-lg font-semibold text-cyan-400 mb-2">Agent Created: {createdAgent.name}</h4>
                  <p className="text-gray-300 text-sm">ID: {createdAgent.customAgentId}</p>
                  <p className="text-gray-300 text-sm">Modules: {createdAgent.agentsIncluded.join(', ')}</p>
                  <p className="text-gray-300 text-sm">Traits: {createdAgent.traits.join(', ')}</p>
                </div>

                <div className="space-y-4">
                  <select
                    value={missionType}
                    onChange={(e) => setMissionType(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white focus:border-purple-500 focus:outline-none"
                  >
                    {missionTypes.map((mission) => (
                      <option key={mission.id} value={mission.id}>
                        {mission.name} - {mission.description}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Zone (e.g., DeSci, DeFi, Gaming)"
                    value={missionZone}
                    onChange={(e) => setMissionZone(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />

                  <input
                    type="number"
                    placeholder="Min Inactivity Days"
                    value={minInactivityDays}
                    onChange={(e) => setMinInactivityDays(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bountyTrigger}
                      onChange={(e) => setBountyTrigger(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-white">Enable Bounty Trigger</span>
                  </label>

                  <button
                    onClick={handleAssignMission}
                    disabled={assignMissionMutation.isPending}
                    className="w-full px-6 py-3 bg-gold-600 hover:bg-gold-700 disabled:bg-gray-700 text-black font-semibold rounded-lg transition-colors"
                  >
                    {assignMissionMutation.isPending ? 'Assigning Mission...' : 'Assign Mission'}
                  </button>
                </div>
              </section>
            ) : (
              <section className="locked-panel bg-gray-800 border border-gray-600 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-400 mb-4">🔐 Mission Assignment Locked</h3>
                <p className="text-gray-500 mb-6">Create an agent first to unlock mission assignment.</p>
                <button 
                  disabled
                  className="px-6 py-3 bg-gray-700 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                >
                  Create Agent Required
                </button>
              </section>
            )}

            {/* Access Control Panels */}
            <section className="locked-panel bg-gray-800 border border-red-500 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-red-400 mb-4">🔐 Wallet Scorer Tool</h3>
              <p className="text-gray-300 mb-6">{getLockedPanelInfo('walletScorer').requirements}</p>
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                Check My Access
              </button>
            </section>
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
            onClick={() => window.location.href = '/dev-console'}
          >
            🧰 Dev Console
          </button>
        </div>
      </div>
    </div>
  );
}