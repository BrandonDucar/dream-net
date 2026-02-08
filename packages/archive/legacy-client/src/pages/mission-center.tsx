import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import XPMeter from '@/components/XPMeter';
import { useToast } from '@/hooks/use-toast';
import { SentientAvatar, AgentSoulType } from "@/components/ui/SentientAvatar";
import { useSettings } from '@/contexts/SettingsContext';
import { Globe, MapPin, Zap, Shield, Lock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { settings, isConfigured } = useSettings();
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
          title: "ðŸŽ‰ Level Up!",
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
          ðŸ”„ Running {agent.currentMission}
        </span>
      );
    }
    return (
      <span className="text-green-400 text-sm">
        âœ… Idle
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center border-b border-white/10 pb-6 relative z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-500 uppercase">
            Mission Control Center
          </h1>
          <p className="text-[10px] text-cyan-500/60 uppercase tracking-[0.4em]">Integrated DreamNet Sovereign Interface // Regional Node: NA_ALPHA</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="vivid-glass px-4 py-2 rounded-xl flex items-center gap-3 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <SentientAvatar seed={settings.identitySeed} type="human" className="w-8 h-8" />
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-500 uppercase font-black">YOUR IDENTITY</span>
              <span className="text-xs font-black text-white flex items-center gap-1 uppercase tracking-tighter">{settings.identitySeed}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]"></div>
            <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Uplink Stable</span>
          </div>
        </div>
      </header>

      {/* SCANLINES & NOISE */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] opacity-30"></div>

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
        <section className="mission-center vivid-glass border border-white/5 p-8 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
          <h2 className="text-2xl font-black text-cyan-400 mb-6 flex items-center gap-3 uppercase tracking-widest">
            <Zap className="w-5 h-5 animate-pulse" /> Deploy_Mission
          </h2>

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
              disabled={deployMissionMutation.isPending || !selectedAgent || !isConfigured}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors relative group"
            >
              {deployMissionMutation.isPending ? 'Deploying Mission...' : 'Deploy Mission'}
              {!isConfigured && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <span className="text-[10px] font-black uppercase text-red-400 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Missing_API_Key
                  </span>
                </div>
              )}
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
        <section className="chitin-iridescent border border-white/5 rounded-2xl p-8 relative">
          <h3 className="text-2xl font-black text-purple-400 mb-6 flex items-center gap-3 uppercase tracking-widest">
            <Shield className="w-5 h-5" /> Swarm_Status
          </h3>

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
                <motion.div
                  key={agent.customAgentId}
                  whileHover={{ scale: 1.02 }}
                  className="vivid-glass border border-white/5 rounded-xl p-4 flex gap-4 items-center group/card"
                >
                  <SentientAvatar
                    seed={agent.name}
                    type={agent.traits.includes('Defense') ? 'defense' : 'research'}
                    className="w-12 h-12"
                    pulse={!!agent.currentMission}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter">{agent.name}</h4>
                      {getAgentStatus(agent)}
                    </div>
                    <p className="text-cyan-500/60 text-[10px] font-mono uppercase">
                      Units: {agent.agentsIncluded.join(' â€¢ ')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mission Logbook */}
      <section className="logbook mt-8 bg-gray-900 border border-gold-500 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gold-400 mb-6">ðŸ“– Mission Logbook</h2>

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
                        {log.status === 'complete' ? 'âœ… Complete' : 'ðŸ”„ Running'}
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
          â† Back to Dashboard
        </button>
        <button
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          onClick={() => window.location.href = '/agent-customizer'}
        >
          ðŸ¤– Agent Customizer
        </button>
      </div>
    </div>
  );
}


