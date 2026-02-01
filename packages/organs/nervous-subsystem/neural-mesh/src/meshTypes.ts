export interface SynapticSpike {
  type: string;
  timestamp: number;
  payload: unknown;
  intensity: number;
  source?: string;
  target?: string;
  [key: string]: any;
}

export interface MemoryTrace {
  trace: unknown;
  timestamp: number;
  decay?: number;
  tags?: string[];
}

export interface SynapseConfig {
  swarm?: any;
  governance?: any;
  wormholes?: any;
  routing?: any;
  haloLoop?: any;
  [key: string]: any;
}

export interface SynapseConnection {
  id: string;
  from: string;
  to: string;
  enabled: boolean;
  lastPulse?: number;
}

export interface NeuralMeshStatus {
  synapses: {
    connections: SynapseConnection[];
    count: number;
  };
  memory: {
    count: number;
    last?: MemoryTrace;
  };
}

