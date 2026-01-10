export type NarrativeSeverity = "info" | "notice" | "warning" | "critical";

export type NarrativeDomain =
  | "infra"
  | "routing"
  | "swarm"
  | "dream"
  | "reputation"
  | "cross-chain"
  | "security"
  | "generic";

export interface NarrativeReference {
  kind: "dream" | "agent" | "service" | "route" | "chain" | "wallet" | "other";
  id: string;
  label?: string;
}

export interface NarrativeEntry {
  id: string;
  timestamp: number;
  title: string;
  summary: string;
  severity: NarrativeSeverity;
  domain: NarrativeDomain;
  tags?: string[];
  references?: NarrativeReference[];
  meta?: Record<string, any>;
}

export interface NarrativeFilter {
  domain?: NarrativeDomain;
  severityMin?: NarrativeSeverity;
  sinceTs?: number;
  tag?: string;
}

export interface NarrativeContext {
  dreamCortex?: any;
  reputationLattice?: any;
  wolfPack?: any;
  starBridge?: any;
  slugTime?: any;
  neuralMesh?: any;
}

export interface NarrativeStatus {
  lastRunAt: number | null;
  entryCount: number;
  recentEntries: NarrativeEntry[];
}

