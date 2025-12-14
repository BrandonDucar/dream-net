/**
 * Incident Runbook Core Types
 * P0/P1/P2 incident procedures with hotkeys and pre-baked commands
 */

export type IncidentSeverity = 'P0' | 'P1' | 'P2';

export interface Incident {
  id: string;
  severity: IncidentSeverity;
  title: string;
  description: string;
  detectedAt: number;
  resolvedAt?: number;
  status: 'open' | 'investigating' | 'mitigating' | 'resolved' | 'closed';
  goldenSignals: GoldenSignals;
  rootCause?: string;
  resolution?: string;
}

export interface GoldenSignals {
  latency: {
    p50: number;
    p95: number;
    p99: number;
  };
  errors: {
    rate: number; // percentage
    count: number;
  };
  traffic: {
    requestsPerSecond: number;
    changePercent: number; // compared to baseline
  };
  saturation: {
    cpu: number; // percentage
    memory: number; // percentage
  };
}

export interface HotkeyCommand {
  id: string;
  name: string;
  description: string;
  execute: () => Promise<void>;
  severity: IncidentSeverity[];
}

export interface PreBakedCommand {
  id: string;
  name: string;
  description: string;
  execute: (params: Record<string, any>) => Promise<void>;
  severity: IncidentSeverity[];
}

export interface RunbookProcedure {
  id: string;
  severity: IncidentSeverity;
  title: string;
  steps: RunbookStep[];
  estimatedTime: number; // minutes
}

export interface RunbookStep {
  id: string;
  order: number;
  description: string;
  command?: string;
  hotkey?: string;
  preBakedCommand?: string;
  expectedOutcome: string;
}

