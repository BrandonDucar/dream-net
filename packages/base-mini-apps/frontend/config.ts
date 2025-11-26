/**
 * Frontend Contract Configuration
 * Hardcoded addresses from deployment.json
 * In production, these can be overridden via environment variables
 */

// Helper to get env var with fallback (works in both Node and browser)
function getEnv(key: string, fallback: string): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  // For browser/Vite, use import.meta.env if available
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] || fallback;
  }
  return fallback;
}

export const CONTRACT_ADDRESSES = {
  // Core contracts
  DreamPassport: getEnv('VITE_PASSPORT_ADDRESS', "0x62805dBCc7fb37b62d9Ca92e14aFf63d1e1424CC"),
  DreamGovernance: getEnv('VITE_GOVERNANCE_ADDRESS', "0x44a2E7ee89EEa63C6EAC6532c6B356be1655ff16"),
  DreamVault: getEnv('VITE_VAULT_ADDRESS', "0x832876CDAaC6e7BAd9C4B953efce19AF0D89Fbd7"),
  BountyEscrow: getEnv('VITE_BOUNTY_ADDRESS', "0x21c4BD450a6689353aFfB3EDCA887aa9F908Fc2c"),
  BadgeNFT: getEnv('VITE_BADGE_ADDRESS', "0x6Ece1531C0547b366Fd10814Fae5963788d2c2a1"),
  
  // New mini-app contracts (addresses from deployment.json - source of truth)
  DreamRemixRegistry: getEnv('VITE_REMIX_REGISTRY_ADDRESS', "0x66Ef7DDb340537E22F567D60d6c22EDA2B8c3619"),
  WhisperMessenger: getEnv('VITE_WHISPER_ADDRESS', "0x1cBf5C4AB1aa0f1D0Db0fF17f978EC1e165E1002"),
  SeasonalEventsRegistry: getEnv('VITE_SEASONAL_EVENTS_ADDRESS', "0xdf30a28fA5DbF392DD76Ed761852a31F772AcC27"),
  NightmareRegistry: getEnv('VITE_NIGHTMARE_ADDRESS', "0x29f2E979E5E2ec0683B1D0ee660824eeb12B7AdF"),
  MissionRegistry: getEnv('VITE_MISSION_ADDRESS', "0x73999460083aC079A199B10f1DE1f4A9cA3db837"),
  RevenueSplitter: getEnv('VITE_REVENUE_SPLITTER_ADDRESS', "0x07ed77169aD71905aF3778b42760F3269a0D0C74"),
  ProgressionRegistry: getEnv('VITE_PROGRESSION_ADDRESS', "0xDa02C8383D42C9b0943d532fC9F95C27C9A8055B"),
  DreamDriftersRegistry: getEnv('VITE_DRIFTERS_ADDRESS', "0x3987902f05Dfca6197D08AcB694e48BE5Df8cE65"),
  DreamTimeCapsule: getEnv('VITE_TIME_CAPSULE_ADDRESS', "0x891A71eB2D20692D22bF7106B16Ba48253826409"),
  DreamDNASequencer: getEnv('VITE_DNA_SEQUENCER_ADDRESS', "0xd9B140aFB0ef0b358f8342fe6381f6589d450A87"),
  DreamPredictionMarket: getEnv('VITE_PREDICTION_MARKET_ADDRESS', "0x036b043Ebb894f16639452fC35B7C379bbD05593"),
  // New practical app contracts
  DreamShop: getEnv('VITE_DREAM_SHOP_ADDRESS', "0xa1E35292c736a68B9CAB7b9e5c271575632F442d"),
  TributeGate: getEnv('VITE_TRIBUTE_GATE_ADDRESS', "0x318292412250E906951f849eB3446c00b7688a6B"),
  WalletScoreRegistry: getEnv('VITE_WALLET_SCORE_ADDRESS', "0x61A0523f068246E72a77e70f7B30AC2e4bfa87D5"),
  // Game contracts
  GameRegistry: getEnv('VITE_GAME_REGISTRY_ADDRESS', "0xB38005e10E376D5D43699B45E7fc2f06A8465a5D"),
  GameAchievementNFT: getEnv('VITE_GAME_ACHIEVEMENT_NFT_ADDRESS', "0x4AF7a82908C64e554584bD6A0F9145521F1913d6"),
  // Card Forge Pro
  CardForgeNFT: getEnv('VITE_CARD_FORGE_NFT_ADDRESS', "0x34e1079820b4c733bE7D67A5F980ea4c752DbD47"),
  // X402 Contracts
  X402ServiceMarketplace: getEnv('VITE_X402_SERVICE_MARKETPLACE_ADDRESS', "0xb7834fb3Be595dD480C01B912f79D542C2387De3"),
  X402TransactionRegistry: getEnv('VITE_X402_TRANSACTION_REGISTRY_ADDRESS', "0xE9C2c5c0418b4F85BBE5AEE87620A8760Cdf4DDe"),
} as const;

export const BASE_CHAIN_ID = 8453;

