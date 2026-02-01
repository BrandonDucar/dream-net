export type MiniAppCategory = 
  | "governance" 
  | "identity" 
  | "commerce" 
  | "social" 
  | "utility" 
  | "gaming" 
  | "defi" 
  | "nft";

export type MiniAppStatus = "draft" | "deployed" | "active" | "paused" | "deprecated";

export interface BaseMiniApp {
  id: string;
  name: string;
  description: string;
  category: MiniAppCategory;
  status: MiniAppStatus;
  
  // Onchain
  contractAddress?: string;      // Base contract address
  chainId: number;               // Base = 8453
  deploymentTx?: string;          // Deployment transaction hash
  
  // Features
  features: string[];            // ["voting", "staking", "minting"]
  requiresPassport?: boolean;   // Requires Dream State passport?
  passportTier?: string[];       // Minimum tier required
  
  // UI
  iconUrl?: string;
  bannerUrl?: string;
  colorScheme?: {
    primary: string;
    secondary: string;
  };
  
  // Integration
  integratesWith?: string[];     // ["dream-state", "wolf-pack", "api-keeper"]
  
  // Stats
  users?: number;
  transactions?: number;
  volume?: number;               // USD volume
  
  createdAt: number;
  deployedAt?: number;
  updatedAt: number;
}

export interface MiniAppManifest {
  name: string;
  version: string;
  description: string;
  entryPoint: string;            // URL or contract function
  permissions: string[];         // What it can access
  dependencies: string[];        // Other mini-apps or contracts
}

