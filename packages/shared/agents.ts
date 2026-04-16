export interface Agent {
  name: string;
  tier: 'Standard' | 'Premium' | 'Nightmare';
  unlock: string;
  key: string;
  hidden?: boolean;
}

export const AGENTS: Agent[] = [
  {
    name: 'LUCID',
    tier: 'Standard',
    unlock: 'Default',
    key: 'lucid'
  },
  {
    name: 'CANVAS',
    tier: 'Standard',
    unlock: 'Default',
    key: 'canvas'
  },
  {
    name: 'ROOT',
    tier: 'Standard',
    unlock: 'Trust Score > 60',
    key: 'root'
  },
  {
    name: 'CRADLE',
    tier: 'Premium',
    unlock: 'Trust Score > 80 or Token Boost',
    key: 'cradle'
  },
  {
    name: 'WING',
    tier: 'Premium',
    unlock: 'Stake 1000 $SHEEP or complete 10 dreams',
    key: 'wing'
  },
  {
    name: 'GLITCH',
    tier: 'Nightmare',
    unlock: 'Hidden infection unlock',
    key: 'glitch',
    hidden: true
  }
];

export function getAgentByKey(key: string): Agent | undefined {
  return AGENTS.find(agent => agent.key === key);
}

export function getAvailableAgents(trustScore: number, completedDreams: number, stakedSheep: number, hasTokenBoost: boolean = false): Agent[] {
  return AGENTS.filter(agent => {
    if (agent.hidden) return false; // GLITCH is hidden by default
    
    switch (agent.key) {
      case 'lucid':
      case 'canvas':
        return true; // Always available
      case 'root':
        return trustScore > 60;
      case 'cradle':
        return trustScore > 80 || hasTokenBoost;
      case 'wing':
        return stakedSheep >= 1000 || completedDreams >= 10;
      default:
        return false;
    }
  });
}

export function checkAgentAccess(agentKey: string, trustScore: number, completedDreams: number, stakedSheep: number, hasTokenBoost: boolean = false): boolean {
  const agent = getAgentByKey(agentKey);
  if (!agent) return false;
  
  if (agent.hidden) return false; // GLITCH requires special unlock
  
  return getAvailableAgents(trustScore, completedDreams, stakedSheep, hasTokenBoost).some(a => a.key === agentKey);
}

export function getAgentDescription(agentKey: string): string {
  const descriptions = {
    lucid: 'Logic Unification & Command Interface Daemon - Primary orchestration and task routing',
    canvas: 'Visual Layer Weaver - HTML/CSS generation and visual component creation',
    root: 'Subconscious Architect - Deep system analysis and foundational architecture',
    cradle: 'Evolution Engine - Dream token minting and advanced progression systems',
    wing: 'Messenger & Mint Agent - Social coordination and advanced token operations',
    glitch: 'Nightmare Infection Vector - Corrupted processing and reality distortion'
  };
  return descriptions[agentKey as keyof typeof descriptions] || 'Unknown agent';
}