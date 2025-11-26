/**
 * Farcaster Integration
 * 
 * Uses Neynar API for posting to Farcaster
 * Docs: https://docs.neynar.com/
 * 
 * Alternative: Can use @farcaster/hub-nodejs for direct hub access
 * 
 * Requirements:
 * - Neynar API key (get from https://neynar.com)
 * - OR: Farcaster mnemonic + FID for direct hub access
 */

import axios from "axios";

export interface FarcasterConfig {
  // Option 1: Neynar API (recommended - easiest)
  neynarApiKey?: string;
  
  // Option 2: Direct hub access (requires mnemonic)
  mnemonic?: string;
  fid?: string; // Farcaster ID
  hubUrl?: string; // Default: https://hub.farcaster.xyz
}

export class FarcasterPoster {
  private config: FarcasterConfig;
  private neynarBaseUrl = "https://api.neynar.com/v2";
  private hubBaseUrl = "https://hub.farcaster.xyz";

  constructor(config: FarcasterConfig) {
    this.config = config;
    if (config.hubUrl) {
      this.hubBaseUrl = config.hubUrl;
    }
  }

  /**
   * Post a cast using Neynar API (recommended)
   */
  async postCast(text: string, mediaUrls?: string[], parentHash?: string): Promise<{ 
    success: boolean; 
    castHash?: string; 
    permalink?: string; 
    error?: string 
  }> {
    if (!this.config.neynarApiKey) {
      return {
        success: false,
        error: "Neynar API key required. Get one from https://neynar.com",
      };
    }

    try {
      // Neynar API v2 - Post cast
      const response = await axios.post(
        `${this.neynarBaseUrl}/farcaster/cast`,
        {
          signer_uuid: process.env.NEYNAR_SIGNER_UUID, // Required for posting
          text: text,
          embeds: mediaUrls || [],
          parent: parentHash ? { hash: parentHash } : undefined,
        },
        {
          headers: {
            "api_key": this.config.neynarApiKey,
            "Content-Type": "application/json",
          },
        }
      );

      const castHash = response.data.cast?.hash;
      const permalink = castHash 
        ? `https://warpcast.com/${response.data.cast?.author?.username}/${castHash}`
        : undefined;

      return {
        success: true,
        castHash,
        permalink,
      };
    } catch (error: any) {
      console.error("[Farcaster] Post failed:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || "Failed to post to Farcaster",
      };
    }
  }

  /**
   * Post a cast using direct hub access (requires mnemonic)
   */
  async postCastDirect(text: string, mediaUrls?: string[]): Promise<{ 
    success: boolean; 
    castHash?: string; 
    permalink?: string; 
    error?: string 
  }> {
    if (!this.config.mnemonic || !this.config.fid) {
      return {
        success: false,
        error: "Mnemonic and FID required for direct hub access. Use Neynar API instead.",
      };
    }

    try {
      // This would require @farcaster/hub-nodejs implementation
      // For now, recommend using Neynar API
      return {
        success: false,
        error: "Direct hub posting not yet implemented. Please use Neynar API (set NEYNAR_API_KEY).",
      };
    } catch (error: any) {
      console.error("[Farcaster] Direct post failed:", error);
      return {
        success: false,
        error: error.message || "Failed to post to Farcaster",
      };
    }
  }

  /**
   * Post a cast (auto-selects method)
   */
  async post(text: string, mediaUrls?: string[], parentHash?: string): Promise<{ 
    success: boolean; 
    castHash?: string; 
    permalink?: string; 
    error?: string 
  }> {
    if (this.config.neynarApiKey) {
      return this.postCast(text, mediaUrls, parentHash);
    } else if (this.config.mnemonic && this.config.fid) {
      return this.postCastDirect(text, mediaUrls);
    } else {
      return {
        success: false,
        error: "Either NEYNAR_API_KEY or FARCASTER_MNEMONIC + FARCASTER_FID required",
      };
    }
  }
}

