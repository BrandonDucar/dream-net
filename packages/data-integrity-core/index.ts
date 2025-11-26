/**
 * Data Integrity Core
 * Blockchain-Based Data Integrity - Hashes data to blockchain for immutable audit trails
 */

import { createHash } from "crypto";
import { ethers } from "ethers";
import { SpiderWebCore } from "@dreamnet/spider-web-core";

export interface DataIntegrityConfig {
  enabled: boolean;
  blockchain: "base" | "ethereum" | "optimism";
  chainId: string;
  contractAddress?: string;
  rpcUrl?: string;
  privateKey?: string;
  batchSize: number; // Number of hashes to batch before submitting
  batchInterval: number; // Milliseconds between batch submissions
}

export interface DataHash {
  hash: string;
  dataType: string;
  timestamp: number;
  batchId?: string;
  txHash?: string;
}

export interface BatchStatus {
  batchId: string;
  merkleRoot: string;
  hashCount: number;
  timestamp: number;
  txHash?: string;
  status: "pending" | "submitted" | "confirmed" | "failed";
}

export interface DataIntegrityStatus {
  enabled: boolean;
  blockchain: string;
  chainId: string;
  contractAddress?: string;
  totalHashes: number;
  totalBatches: number;
  pendingHashes: number;
  lastBatchTime: number | null;
}

// Contract ABI (minimal - just what we need)
const DATA_INTEGRITY_ABI = [
  "function recordHash(bytes32 hash, string memory dataType) public",
  "function recordBatch(string memory batchId, bytes32 merkleRoot, uint256 hashCount) public",
  "function hashExists(bytes32 hash) public view returns (bool)",
  "function getHash(bytes32 hash) public view returns (tuple(bytes32 hash, uint256 timestamp, string dataType, address submitter))",
  "function getBatch(string memory batchId) public view returns (tuple(bytes32 merkleRoot, uint256 timestamp, uint256 hashCount, string batchId))",
  "function getBatchCount() public view returns (uint256)",
  "event DataHashRecorded(bytes32 indexed hash, string dataType, address indexed submitter, uint256 timestamp)",
  "event BatchRecorded(string indexed batchId, bytes32 indexed merkleRoot, uint256 hashCount, uint256 timestamp)",
];

class DataIntegrityCore {
  private config: DataIntegrityConfig;
  private provider: ethers.Provider | null = null;
  private signer: ethers.Wallet | null = null;
  private contract: ethers.Contract | null = null;
  private hashQueue: DataHash[] = [];
  private batches: Map<string, BatchStatus> = new Map();
  private batchIntervalId: NodeJS.Timeout | null = null;
  private totalHashes: number = 0;

  constructor(config: DataIntegrityConfig) {
    this.config = config;

    if (config.enabled && config.contractAddress && config.rpcUrl && config.privateKey) {
      this.initializeBlockchain();
    }
  }

  /**
   * Initialize blockchain connection
   */
  private initializeBlockchain(): void {
    try {
      // Create provider
      this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);

      // Create signer
      this.signer = new ethers.Wallet(this.config.privateKey!, this.provider);

      // Create contract instance
      if (this.config.contractAddress) {
        this.contract = new ethers.Contract(
          this.config.contractAddress,
          DATA_INTEGRITY_ABI,
          this.signer
        );
      }

      // Start batch processing interval
      this.startBatchProcessing();

      console.log(`[DataIntegrityCore] Initialized on ${this.config.blockchain} (Chain ID: ${this.config.chainId})`);
      console.log(`   Contract: ${this.config.contractAddress}`);
    } catch (error: any) {
      console.error(`[DataIntegrityCore] Failed to initialize blockchain:`, error.message);
      this.config.enabled = false;
    }
  }

  /**
   * Hash data and queue for blockchain submission
   */
  async hashData(data: any, dataType: string): Promise<string> {
    // Create hash
    const dataString = JSON.stringify(data);
    const hash = createHash("sha256").update(dataString).digest("hex");
    const hashBytes32 = "0x" + hash;

    const dataHash: DataHash = {
      hash: hashBytes32,
      dataType,
      timestamp: Date.now(),
    };

    // Add to queue
    this.hashQueue.push(dataHash);
    this.totalHashes++;

    // Emit fly to Spider Web Core
    SpiderWebCore.createFly(
      "data-integrity",
      "data-integrity-core",
      {
        hash: hashBytes32,
        dataType,
        timestamp: dataHash.timestamp,
        queued: true,
      },
      "low",
      false
    );

    // If queue is full, submit batch immediately
    if (this.hashQueue.length >= this.config.batchSize) {
      await this.submitBatch();
    }

    return hashBytes32;
  }

  /**
   * Start batch processing interval
   */
  private startBatchProcessing(): void {
    if (this.batchIntervalId) {
      return; // Already running
    }

    this.batchIntervalId = setInterval(() => {
      if (this.hashQueue.length > 0) {
        this.submitBatch().catch(error => {
          console.error(`[DataIntegrityCore] Batch submission error:`, error.message);
        });
      }
    }, this.config.batchInterval);

    console.log(`[DataIntegrityCore] Batch processing started (interval: ${this.config.batchInterval}ms)`);
  }

  /**
   * Stop batch processing
   */
  private stopBatchProcessing(): void {
    if (this.batchIntervalId) {
      clearInterval(this.batchIntervalId);
      this.batchIntervalId = null;
    }
  }

  /**
   * Submit a batch of hashes to blockchain
   */
  private async submitBatch(): Promise<void> {
    if (!this.config.enabled || !this.contract || this.hashQueue.length === 0) {
      return;
    }

    try {
      // Create batch ID
      const batchId = `batch-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Calculate Merkle root from hashes
      const hashes = this.hashQueue.map(h => h.hash);
      const merkleRoot = this.calculateMerkleRoot(hashes);

      // Record batch
      const batchStatus: BatchStatus = {
        batchId,
        merkleRoot,
        hashCount: this.hashQueue.length,
        timestamp: Date.now(),
        status: "pending",
      };

      this.batches.set(batchId, batchStatus);

      // Submit to blockchain
      const tx = await this.contract.recordBatch(batchId, merkleRoot, this.hashQueue.length);
      batchStatus.status = "submitted";
      batchStatus.txHash = tx.hash;

      // Wait for confirmation
      const receipt = await tx.wait();
      if (receipt && receipt.status === 1) {
        batchStatus.status = "confirmed";
        
        // Update hashes with batch ID
        for (const hash of this.hashQueue) {
          hash.batchId = batchId;
          hash.txHash = tx.hash;
        }

        console.log(`[DataIntegrityCore] Batch ${batchId} confirmed: ${tx.hash}`);
      } else {
        batchStatus.status = "failed";
        console.error(`[DataIntegrityCore] Batch ${batchId} failed`);
      }

      // Clear queue
      this.hashQueue = [];

      // Emit batch fly
      SpiderWebCore.createFly(
        "data-integrity",
        "data-integrity-core",
        {
          batchId,
          merkleRoot,
          hashCount: batchStatus.hashCount,
          txHash: tx.hash,
          status: batchStatus.status,
        },
        "medium",
        false
      );
    } catch (error: any) {
      console.error(`[DataIntegrityCore] Error submitting batch:`, error.message);
      
      // Mark batch as failed
      const batchId = `batch-${Date.now()}`;
      this.batches.set(batchId, {
        batchId,
        merkleRoot: "0x0",
        hashCount: this.hashQueue.length,
        timestamp: Date.now(),
        status: "failed",
      });
    }
  }

  /**
   * Calculate Merkle root from array of hashes
   */
  private calculateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) {
      return "0x0";
    }

    if (hashes.length === 1) {
      return hashes[0];
    }

    // Simple Merkle tree calculation
    let currentLevel = hashes.map(h => Buffer.from(h.slice(2), "hex"));

    while (currentLevel.length > 1) {
      const nextLevel: Buffer[] = [];
      
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = Buffer.concat([currentLevel[i], currentLevel[i + 1]]);
          nextLevel.push(Buffer.from(createHash("sha256").update(combined).digest()));
        } else {
          // Odd number, hash with itself
          const combined = Buffer.concat([currentLevel[i], currentLevel[i]]);
          nextLevel.push(Buffer.from(createHash("sha256").update(combined).digest()));
        }
      }

      currentLevel = nextLevel;
    }

    return "0x" + currentLevel[0].toString("hex");
  }

  /**
   * Verify hash exists on blockchain
   */
  async verifyHash(hash: string): Promise<boolean> {
    if (!this.config.enabled || !this.contract) {
      return false;
    }

    try {
      const exists = await this.contract.hashExists(hash);
      return exists;
    } catch (error: any) {
      console.error(`[DataIntegrityCore] Error verifying hash:`, error.message);
      return false;
    }
  }

  /**
   * Get status
   */
  getStatus(): DataIntegrityStatus {
    const lastBatch = Array.from(this.batches.values())
      .sort((a, b) => b.timestamp - a.timestamp)[0];

    return {
      enabled: this.config.enabled,
      blockchain: this.config.blockchain,
      chainId: this.config.chainId,
      contractAddress: this.config.contractAddress,
      totalHashes: this.totalHashes,
      totalBatches: this.batches.size,
      pendingHashes: this.hashQueue.length,
      lastBatchTime: lastBatch?.timestamp || null,
    };
  }

  /**
   * Get pending hashes
   */
  getPendingHashes(): DataHash[] {
    return [...this.hashQueue];
  }

  /**
   * Get batch status
   */
  getBatch(batchId: string): BatchStatus | undefined {
    return this.batches.get(batchId);
  }

  /**
   * Get all batches
   */
  getAllBatches(): BatchStatus[] {
    return Array.from(this.batches.values());
  }
}

let dataIntegrityCoreInstance: DataIntegrityCore | null = null;

/**
 * Initialize Data Integrity Core
 */
export function initDataIntegrityCore(config: DataIntegrityConfig): DataIntegrityCore {
  if (dataIntegrityCoreInstance) {
    return dataIntegrityCoreInstance;
  }

  dataIntegrityCoreInstance = new DataIntegrityCore(config);
  return dataIntegrityCoreInstance;
}

/**
 * Get Data Integrity Core instance
 */
export function getDataIntegrityCore(): DataIntegrityCore | null {
  return dataIntegrityCoreInstance;
}

export default DataIntegrityCore;
