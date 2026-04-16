import AgentStatusGrid from '@/components/AgentStatusGrid';

export default function AgentDashboardTest() {
  const unlockedAgents = ["LUCID", "CANVAS", "ROOT", "ECHO", "WING"];

  const handleAgentAction = (agent: string, action: string) => {
    console.log(`Agent ${agent} activated with action: ${action}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-300 mb-4">
            Agent Dashboard Test
          </h1>
          <p className="text-gray-300 text-lg">
            Testing with unlocked agents: {unlockedAgents.join(', ')}
          </p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
          <AgentStatusGrid 
            activeAgents={unlockedAgents} 
            onAgentAction={handleAgentAction}
          />
        </div>
      </div>
    </div>
  );
}