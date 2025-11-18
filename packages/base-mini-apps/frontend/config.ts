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
  
  // New mini-app contracts
  DreamRemixRegistry: getEnv('VITE_REMIX_REGISTRY_ADDRESS', "0xF373fE51416BB37067262174e5c721903FC0E66d"),
  WhisperMessenger: getEnv('VITE_WHISPER_ADDRESS', "0x4D33f7Ad7b33cd038770D71C5675B5b2F48A2dFB"),
  SeasonalEventsRegistry: getEnv('VITE_SEASONAL_EVENTS_ADDRESS', "0xa7c1d6a3127D17256b40af71F9BE82Ff2235073F"),
  NightmareRegistry: getEnv('VITE_NIGHTMARE_ADDRESS', "0x9347617Ae849aC861489A402193da97Bcd9F8E7f"),
  MissionRegistry: getEnv('VITE_MISSION_ADDRESS', "0x1AD0C9a5cFCdCc787C1751a412123939f2d434A9"),
  RevenueSplitter: getEnv('VITE_REVENUE_SPLITTER_ADDRESS', "0x807ED6BA7B4AacaDf744693Ca59f118F1a7Bf282"),
  ProgressionRegistry: getEnv('VITE_PROGRESSION_ADDRESS', "0xe23526d164C568aC0870C0BA26e88c7f158aC80a"),
  DreamDriftersRegistry: getEnv('VITE_DRIFTERS_ADDRESS', "0x63809962f399F42aFf03aF57342F6510D581A0b9"),
  DreamTimeCapsule: getEnv('VITE_TIME_CAPSULE_ADDRESS', "0x9F62429F7Fa81D5D97a6540386730cC404547629"),
  DreamDNASequencer: getEnv('VITE_DNA_SEQUENCER_ADDRESS', "0x5b511831E1070efFBb70226251a83341Cb73B353"),
  DreamPredictionMarket: getEnv('VITE_PREDICTION_MARKET_ADDRESS', "0xc3C5d260465A1917D7deC4b290fFF0bc8bc74B4c"),
} as const;

export const BASE_CHAIN_ID = 8453;

