/**
 * 🗺️ THE FORTY AVENUES
 * 
 * A registry of 40 specialized intelligence sectors used for Alpha Tracking.
 * Each Avenue is mapped to "Titans" (top minds) whose activity is monitored.
 */

export interface Avenue {
  id: number;
  name: string;
  description: string;
  titans: string[]; // Farcaster usernames or IDs
  tags: string[];
}

export const FORTY_AVENUES: Avenue[] = [
  // 1-10: ON-CHAIN FOUNDATIONS
  { id: 1, name: "MEV & Order Flow", description: "Flashbots, Jito, and builder dynamics.", titans: ["bertmiller", "flashbots"], tags: ["defi", "mev"] },
  { id: 2, name: "Liquid Staking", description: "Lido, RocketPool, and restaking alpha.", titans: ["drakefj", "vbuterin"], tags: ["eth", "staking"] },
  { id: 3, name: "Bridge Arbitrage", description: "Cross-chain liquidity flows.", titans: ["layerzero", "connext"], tags: ["infra"] },
  { id: 8, name: "Dutch Book Arbitrage", description: "Efficient market execution.", titans: ["cowswap", "agoric"], tags: ["economics"] },

  // 11-20: SOVEREIGN INFRASTRUCTURE
  { id: 11, name: "Sovereign Passports", description: "Agentic identity and ZK-proofs.", titans: ["balajis", "worldcoin"], tags: ["identity"] },
  { id: 13, name: "Pulse Sync", description: "Distributed clocking and consensus.", titans: ["solana", "monad"], tags: ["speed"] },
  { id: 20, name: "Sovereign Ledger", description: "High-finality persistent logs.", titans: ["arweave", "celestia"], tags: ["storage"] },

  // 21-30: BIOMORPHIC & AI
  { id: 21, name: "Triune Cortex", description: "Triple-layer LLM reasoning.", titans: ["dmarcus", "sama"], tags: ["ai"] },
  { id: 22, name: "Slime-Mold Routing", description: "Bio-inspired network topology.", titans: ["vitalik", "gavinwood"], tags: ["topology"] },
  { id: 24, name: "Self-Assembling Matter", description: "4D printing and nanotech.", titans: ["nanotech", "mit_media_lab"], tags: ["science"] },

  // 31-40: THE SECOND FRONTIER
  { id: 35, name: "Xenobots & Living Tech", description: "Biological computers.", titans: ["levin", "wyss"], tags: ["bio"] },
  { id: 40, name: "Social Dreaming", description: "Collective intelligence and prediction.", titans: ["naval", "pmarca"], tags: ["social"] },
];

// Helper to get titans for all 40 avenues (simplified for now)
export const getAllTitans = () => {
  const titans = new Set<string>();
  FORTY_AVENUES.forEach(a => a.titans.forEach(t => titans.add(t)));
  return Array.from(titans);
};
