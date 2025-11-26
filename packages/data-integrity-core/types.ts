/**
 * Data Integrity Core Types
 * Blockchain-based data integrity and audit trails
 */

export interface DataHash {
  id: string;
  dataHash: string; // SHA-256 hash of data
  dataType: string; // Type of data (event, log, transaction, etc.)
  timestamp: number;
  blockNumber?: number; // Blockchain block number
  transactionHash?: string; // Blockchain transaction hash
  chainId?: string; // Blockchain chain ID (e.g., "8453" for Base)
  verified: boolean; // Whether hash has been verified on-chain
  metadata?: Record<string, any>;
}

export interface IntegrityProof {
  dataHash: string;
  blockNumber: number;
  transactionHash: string;
  chainId: string;
  timestamp: number;
  verifiedAt: number;
}

export interface DataIntegrityConfig {
  enabled: boolean;
  blockchain: "base" | "ethereum" | "optimism";
  chainId: string;
  contractAddress?: string; // Optional: smart contract for hash storage
  batchSize?: number; // Number of hashes to batch before on-chain storage
  batchInterval?: number; // Time in ms between batch writes
}

