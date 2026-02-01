// Shared dream storage across multiple routes
interface Dream {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  type: string;
  createdByAgent?: string;
  lineage?: {
    ancestors?: string[];
    parentA?: string;
    parentB?: string;
  };
  wallet: string;
  remix?: boolean;
  isDraft?: boolean;
  createdAt: string;
  updatedAt?: string;
  dreamCloud?: 'defi' | 'gaming' | 'zksync' | 'desci' | 'memes' | 'ai' | 'tools' | 'social' | 'art' | 'custom';
  forkedFrom?: string;
  bountyId?: string;
}

// Centralized storage for all dream operations
const dreamStorage = new Map<string, Dream>();

// Initialize with sample dreams
const sampleDreams: Dream[] = [
  {
    id: 'dream-1',
    title: 'Quantum Consciousness Bridge',
    description: 'A vision of connecting human consciousness with quantum computing networks',
    tags: ['quantum', 'consciousness', 'bridge', 'technology'],
    type: 'Vision',
    createdByAgent: 'LUCID',
    wallet: '',
    isDraft: false,
    createdAt: new Date().toISOString(),
    dreamCloud: 'ai'
  },
  {
    id: 'dream-2',
    title: 'Digital Empathy Network',
    description: 'A tool for sharing emotional experiences across digital platforms',
    tags: ['empathy', 'digital', 'emotions', 'network'],
    type: 'Tool',
    createdByAgent: 'CANVAS',
    wallet: '',
    isDraft: false,
    createdAt: new Date().toISOString(),
    dreamCloud: 'social'
  },
  {
    id: 'dream-3',
    title: 'Collective Memory Archive',
    description: 'A movement to preserve and share human memories for future generations',
    tags: ['memory', 'collective', 'archive', 'preservation'],
    type: 'Movement',
    createdByAgent: 'ROOT',
    wallet: '',
    isDraft: false,
    createdAt: new Date().toISOString(),
    dreamCloud: 'desci'
  },
  {
    id: 'dream-4',
    title: 'Evolution Tracking System',
    description: 'A system for monitoring the evolution of ideas and dreams over time',
    tags: ['evolution', 'tracking', 'system', 'ideas'],
    type: 'System',
    createdByAgent: 'CRADLE',
    wallet: '',
    isDraft: false,
    createdAt: new Date().toISOString(),
    dreamCloud: 'tools'
  },
  {
    id: 'dream-5',
    title: 'Hybrid Reality Synthesis',
    description: 'A fusion of the Quantum Consciousness Bridge and Digital Empathy Network',
    tags: ['hybrid', 'synthesis', 'fusion', 'reality'],
    type: 'Fusion',
    createdByAgent: 'WING',
    lineage: {
      ancestors: ['dream-1', 'dream-2'],
      parentA: 'dream-1',
      parentB: 'dream-2'
    },
    wallet: '',
    isDraft: false,
    createdAt: new Date().toISOString(),
    dreamCloud: 'custom'
  },
  {
    id: 'dream-draft-1',
    title: 'Untitled Draft',
    description: 'Work in progress dream concept',
    tags: ['draft', 'wip'],
    type: 'Vision',
    createdByAgent: 'LUCID',
    wallet: '',
    isDraft: true,
    createdAt: new Date().toISOString(),
    dreamCloud: 'custom'
  }
];

// Initialize storage
sampleDreams.forEach(dream => {
  dreamStorage.set(dream.id, dream);
});

export function loadDream(id: string): Dream | undefined {
  return dreamStorage.get(id);
}

export function saveDream(id: string, dream: Dream): void {
  dreamStorage.set(id, dream);
  console.log(`Updated dream: ${id} - ${dream.title}`);
}

export function getAllDreams(): Dream[] {
  return Array.from(dreamStorage.values());
}

export function deleteDream(id: string): boolean {
  return dreamStorage.delete(id);
}

export { Dream, dreamStorage };