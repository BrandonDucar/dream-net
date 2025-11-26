// Shared agent definitions
export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'error';
  description?: string;
}

export const AGENTS: Agent[] = [
  {
    id: 'dreamkeeper',
    name: 'DreamKeeper',
    type: 'governor',
    status: 'active',
    description: 'System health and governance agent',
  },
  {
    id: 'shield-core',
    name: 'Shield Core',
    type: 'security',
    status: 'active',
    description: 'Threat detection and defense agent',
  },
  {
    id: 'ai-surgeon',
    name: 'AI Surgeon',
    type: 'maintenance',
    status: 'active',
    description: 'Automated system maintenance agent',
  },
];

export const SUPPORTED_AGENTS = AGENTS;

export function getAvailableAgents(): Agent[] {
  return AGENTS.filter(agent => agent.status === 'active');
}

export function getAgentDescription(id: string): string {
  const agent = AGENTS.find(a => a.id === id);
  return agent?.description || 'No description available';
}

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find(agent => agent.id === id);
}

export function getAgentsByType(type: string): Agent[] {
  return AGENTS.filter(agent => agent.type === type);
}

export function getAllAgents(): Agent[] {
  return AGENTS;
}
