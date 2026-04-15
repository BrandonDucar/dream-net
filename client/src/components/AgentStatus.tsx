interface Agent {
  id: string;
  label: string;
  required: number;
}

interface AgentStatusProps {
  agents?: string[];
}

export default function AgentStatus({ agents = [] }: AgentStatusProps) {
  const allAgents: Agent[] = [
    { id: 'LUCID', label: 'Lucid', required: 0 },
    { id: 'CANVAS', label: 'Canvas', required: 0 },
    { id: 'ROOT', label: 'Root', required: 50 },
    { id: 'ECHO', label: 'Echo', required: 50 },
    { id: 'CRADLE', label: 'Cradle', required: 80 },
    { id: 'WING', label: 'Wing', required: 80 },
  ];

  return (
    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {allAgents.map(agent => {
        const unlocked = agents.includes(agent.id);
        return (
          <div key={agent.id} style={{
            padding: 20,
            background: unlocked ? '#0f0' : '#333',
            border: `2px solid ${unlocked ? '#0ff' : '#666'}`,
            borderRadius: 12,
            width: 160,
            textAlign: 'center'
          }}
          className={unlocked ? 'unlocked' : ''}>
            <h3>{agent.label}</h3>
            <p>{unlocked ? '✅ Unlocked' : `🔒 Locked`}</p>
            <p>Required Score: {agent.required}</p>
          </div>
        );
      })}
    </div>
  );
}