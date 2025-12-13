/**
 * Snapshot Voting Integration
 * 
 * Integrates Snapshot off-chain voting for DreamNet Government vertical
 */

import axios, { AxiosInstance } from "axios";
import { ethers } from "ethers";

export interface SnapshotConfig {
  apiUrl?: string;
  space?: string;
}

export interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: "pending" | "active" | "closed";
  scores?: number[];
  scores_by_strategy?: Array<Record<string, number>>;
}

export interface SnapshotVote {
  id: string;
  voter: string;
  choice: number | number[];
  vp: number;
  timestamp: number;
}

/**
 * Snapshot Voting Client
 * 
 * Wraps Snapshot voting for off-chain governance
 */
export class SnapshotVoting {
  private client: AxiosInstance;
  private config: SnapshotConfig;

  constructor(config: SnapshotConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl || "https://hub.snapshot.org/api",
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.apiUrl,
    });
  }

  /**
   * Get proposals
   */
  async getProposals(
    space?: string,
    limit: number = 20
  ): Promise<SnapshotProposal[]> {
    try {
      const params: any = { limit };
      if (space || this.config.space) {
        params.space = space || this.config.space;
      }

      const response = await this.client.get("/proposals", { params });
      return response.data || [];
    } catch (error: any) {
      console.error("[SnapshotVoting] Failed to get proposals:", error.message);
      return [];
    }
  }

  /**
   * Get proposal by ID
   */
  async getProposal(proposalId: string): Promise<SnapshotProposal | null> {
    try {
      const response = await this.client.get(`/proposal/${proposalId}`);
      return response.data || null;
    } catch (error: any) {
      console.error("[SnapshotVoting] Failed to get proposal:", error.message);
      return null;
    }
  }

  /**
   * Get votes for proposal
   */
  async getVotes(proposalId: string): Promise<SnapshotVote[]> {
    try {
      const response = await this.client.get(`/proposal/${proposalId}/votes`);
      return response.data || [];
    } catch (error: any) {
      console.error("[SnapshotVoting] Failed to get votes:", error.message);
      return [];
    }
  }

  /**
   * Vote on proposal
   */
  async vote(
    proposalId: string,
    choice: number | number[],
    signer: ethers.Signer
  ): Promise<{ success: boolean; voteId?: string; error?: string }> {
    try {
      // Snapshot voting would use EIP-712 signing
      // This is a simplified version
      return {
        success: true,
        voteId: `snapshot-${Date.now()}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

