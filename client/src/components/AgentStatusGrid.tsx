import { useState } from 'react';

const AGENTS = [
  {
    name: 'LUCID',
    codename: '🧠 Logic Unification & Command Interface Daemon',
    description: 'Routes logic, detects failure patterns, and determines the next step.',
    gated: false
  },
  {
    name: 'CANVAS',
    codename: '🎨 Visual Layer Weaver',
    description: 'Scaffolds and generates frontend dream components.',
    gated: false
  },
  {
    name: 'ROOT',
    codename: '🌱 Subconscious Architect',
    description: 'Builds backend schemas, APIs, and storage logic.',
    gated: false
  },
  {
    name: 'ECHO',
    codename: '🪞 Wallet Mirror',
    description: 'Analyzes wallet trust and unlocks deeper layers of the network.',
    gated: false
  },
  {
    name: 'CRADLE',
    codename: '🌀 Evolution Engine',
    description: 'Tracks and evolves dreams over time through mutation and growth.',
    gated: true
  },
  {
    name: 'WING',
    codename: '🪽 Messenger & Mint Agent',
    description: 'Mints dream messages or micro-tokens and delivers them.',
    gated: true
  }
];

interface AgentStatusGridProps {
  activeAgents: string[];
  onAgentAction: (agent: string, action: string) => void;
}

export default function AgentStatusGrid({ activeAgents, onAgentAction }: AgentStatusGridProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="dream-agent-dash font-mono mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">🌐 Dream Agent Dashboard</h2>
        <p className="text-gray-400">Explore your Dream Network's sentient agents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {AGENTS.map(agent => {
          const isUnlocked = !agent.gated || activeAgents.includes(agent.name);
          return (
            <div 
              key={agent.name}
              className={`
                border-2 p-4 rounded-xl transition-all duration-200 cursor-pointer
                ${isUnlocked 
                  ? 'border-green-400 bg-gray-900/50 hover:bg-gray-800/70' 
                  : 'border-gray-600 bg-gray-900/20 opacity-50 cursor-not-allowed'
                }
              `}
              onClick={() => isUnlocked && setSelectedAgent(agent.name)}
            >
              <h3 className="text-sm font-semibold text-cyan-300 mb-2">{agent.codename}</h3>
              <p className="text-white font-bold mb-2">{agent.name}</p>
              <p className="text-xs text-gray-300 mb-3 leading-relaxed">{agent.description}</p>
              {isUnlocked ? (
                <div className="flex items-center">
                  <span className="text-green-400 text-sm">🟢 ONLINE</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAgentAction(agent.name, 'activate');
                    }}
                    className="ml-auto text-xs px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
                  >
                    Activate
                  </button>
                </div>
              ) : (
                <span className="text-red-400 text-sm">🔒 LOCKED</span>
              )}
            </div>
          );
        })}
      </div>

      {selectedAgent && (
        <div className="mt-6 p-4 bg-black border border-green-400 rounded-lg">
          <h4 className="text-lg font-bold text-green-400 mb-3">🧬 {selectedAgent} Response Panel</h4>
          <pre className="text-green-400 text-sm">
            → Logic output, logs, or visual builder will render here in future upgrade layers.
            {'\n'}→ Agent {selectedAgent} is ready for deep system integration.
            {'\n'}→ Click "Activate" to trigger agent-specific operations.
          </pre>
        </div>
      )}
    </div>
  );
}