import { useState } from 'react';
import { AGENTS, getAvailableAgents, getAgentDescription, type Agent } from '@dreamnet/shared';



interface AgentSelectorProps {
  selectedAgents: string[];
  onAgentToggle: (agentKey: string) => void;
  trustScore?: number;
  completedDreams?: number;
  stakedSheep?: number;
  hasTokenBoost?: boolean;
}

export default function AgentSelector({
  selectedAgents,
  onAgentToggle,
  trustScore = 0,
  completedDreams = 0,
  stakedSheep = 0,
  hasTokenBoost = false
}: AgentSelectorProps) {
  const availableAgents = getAvailableAgents(trustScore, completedDreams, stakedSheep, hasTokenBoost);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  function isAgentAvailable(agent: Agent): boolean {
    return availableAgents.some(a => a.key === agent.key);
  }

  function getTierColor(tier: Agent['tier']): string {
    switch (tier) {
      case 'Standard': return '#0ff';
      case 'Premium': return '#ffa500';
      case 'Nightmare': return '#f00';
      default: return '#555';
    }
  }

  return (
    <div style={{
      background: '#111',
      border: '1px solid #555',
      borderRadius: 8,
      padding: 20,
      marginBottom: 20
    }}>
      <h3 style={{
        color: '#0ff',
        marginBottom: 15,
        fontFamily: 'monospace'
      }}>
        🤖 Agent Selection
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 15
      }}>
        {AGENTS.filter(agent => !agent.hidden).map(agent => {
          const available = isAgentAvailable(agent);
          const selected = selectedAgents.includes(agent.key);

          return (
            <div
              key={agent.key}
              style={{
                background: available ? '#222' : '#111',
                border: `2px solid ${selected ? getTierColor(agent.tier) : '#555'}`,
                borderRadius: 6,
                padding: 12,
                cursor: available ? 'pointer' : 'not-allowed',
                opacity: available ? 1 : 0.5,
                position: 'relative'
              }}
              onClick={() => available && onAgentToggle(agent.key)}
              onMouseEnter={() => setShowTooltip(agent.key)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 8
              }}>
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => available && onAgentToggle(agent.key)}
                  disabled={!available}
                  style={{
                    marginRight: 8,
                    accentColor: getTierColor(agent.tier)
                  }}
                />
                <span style={{
                  color: getTierColor(agent.tier),
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}>
                  {agent.name}
                </span>
              </div>

              <div style={{
                fontSize: 12,
                color: '#ccc',
                marginBottom: 4
              }}>
                Tier: {agent.tier}
              </div>

              <div style={{
                fontSize: 11,
                color: available ? '#0f0' : '#f55',
                fontStyle: 'italic'
              }}>
                {agent.unlock}
              </div>

              {showTooltip === agent.key && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#000',
                  border: '1px solid #555',
                  borderRadius: 4,
                  padding: 8,
                  fontSize: 11,
                  color: '#ccc',
                  zIndex: 10,
                  marginTop: 4
                }}>
                  {getAgentDescription(agent.key)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 15,
        fontSize: 12,
        color: '#888',
        fontFamily: 'monospace'
      }}>
        Stats: Trust {trustScore} | Dreams {completedDreams} | Staked {stakedSheep} SHEEP
        {hasTokenBoost && <span style={{ color: '#f0f' }}> | TOKEN BOOST ACTIVE</span>}
      </div>
    </div>
  );
}