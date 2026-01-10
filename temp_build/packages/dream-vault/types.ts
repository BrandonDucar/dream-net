export type VaultItemKind =
  | "dream"
  | "blueprint"
  | "asset"
  | "template"
  | "ritual"
  | "prompt"
  | "config";

export type VaultState =
  | "draft"
  | "active"
  | "archived"
  | "deprecated"
  | "experimental";

export interface VaultMetaRef {
  type: "dream" | "identity" | "route" | "chain" | "agent" | "other";
  id: string;
  label?: string;
}

export interface VaultItem {
  id: string;
  kind: VaultItemKind;
  state: VaultState;
  title: string;
  description?: string;

  // Core content: may be text, JSON stringified, or small configs
  content?: string;

  // Tags for search / classification
  tags?: string[];

  // Links to external systems or files (URLs, IPFS, etc.)
  links?: string[];

  // Structural references into DreamNet
  refs?: VaultMetaRef[];

  createdAt: number;
  updatedAt: number;
  version: number;
}

export interface VaultIndexEntry {
  id: string;
  kind: VaultItemKind;
  state: VaultState;
  title: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface VaultSearchQuery {
  text?: string;
  tag?: string;
  kind?: VaultItemKind;
  state?: VaultState;
  refId?: string;     // matches any item with a ref to this id
  limit?: number;
}

export interface VaultContext {
  dreamCortex?: any;
  identityGrid?: any;
  narrativeField?: any;
  neuralMesh?: any;
}

export interface VaultStatus {
  lastRunAt: number | null;
  itemCount: number;
  indexCount: number;
  sampleIndex: VaultIndexEntry[];
}

