import { AGENTS } from '@dreamnet/shared/agents';

interface AgentPanelProps {
  walletData: {
    unlockedAgents: string[];
  };
}

export default function AgentPanel({ walletData }: AgentPanelProps) {
  return (
    <ul className="agent-panel">
      {AGENTS.map(agent => {
        const unlocked = walletData.unlockedAgents.includes(agent.key);
        if (agent.hidden && !unlocked) return null;

        return (
          <li key={agent.key}>
            <strong>{agent.name}</strong> — {agent.tier}
            <br />
            <small>🔓 {unlocked ? 'Unlocked' : `Locked: ${agent.unlock}`}</small>
          </li>
        );
      })}
    </ul>
  );
}