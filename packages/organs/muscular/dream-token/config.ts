import type { DreamTokenConfig } from './types.js';

// TODO: Update once actual DREAM ERC-20 token is deployed on Base L2
export const defaultConfig: DreamTokenConfig = {
  maxSupply: "1000000000", // 1 billion tokens
  decimals: 18,
  symbol: "DREAM", // Reverting to DREAM for type safety alignment
  name: "DreamNet Token",
  tokenAddress: process.env.DREAM_TOKEN_ADDRESS || "0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77",
  emissionModel: "manual", // Will switch to "emissions" once automated distribution is live
};

