/**
 * Contract Addresses Configuration
 * Reads from deployment.json manifest or environment variables
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface DeploymentManifest {
  base: {
    chainId: number;
    contracts: Record<string, string>;
  };
}

const MANIFEST_PATH = path.join(__dirname, "../../contracts/deployment.json");

function loadManifest(): DeploymentManifest | null {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      const content = fs.readFileSync(MANIFEST_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn("Failed to load deployment manifest:", err);
  }
  return null;
}

function getContractAddress(key: string, envVar?: string): string {
  // Try env var first
  if (envVar && process.env[envVar]) {
    return process.env[envVar];
  }

  // Try manifest
  const manifest = loadManifest();
  if (manifest?.base?.contracts?.[key]) {
    return manifest.base.contracts[key];
  }

  // Fallback to direct env lookup
  const envKey = key.toUpperCase().replace(/([A-Z])/g, "_$1").replace(/^_/, "") + "_ADDRESS";
  if (process.env[envKey]) {
    return process.env[envKey];
  }

  throw new Error(`Contract address not found for ${key}. Set ${envVar || envKey} or ensure manifest exists.`);
}

/**
 * Get Dream Passport NFT contract address
 */
export function getPassportAddress(): string {
  return getContractAddress("DreamPassport", "PASSPORT_CONTRACT_ADDRESS");
}

/**
 * Get Dream State Governance contract address
 */
export function getGovernanceAddress(): string {
  return getContractAddress("DreamGovernance", "GOVERNANCE_CONTRACT_ADDRESS");
}

/**
 * Get Dream Vault NFT contract address
 */
export function getVaultAddress(): string {
  return getContractAddress("DreamVault", "VAULT_CONTRACT_ADDRESS");
}

/**
 * Get Bounty Escrow contract address
 */
export function getBountyAddress(): string {
  return getContractAddress("BountyEscrow", "BOUNTY_CONTRACT_ADDRESS");
}

/**
 * Get Badge NFT contract address
 */
export function getBadgeAddress(): string {
  return getContractAddress("BadgeNFT", "BADGE_CONTRACT_ADDRESS");
}

/**
 * Get Dream Remix Registry contract address
 */
export function getRemixRegistryAddress(): string {
  return getContractAddress("DreamRemixRegistry", "REMIX_REGISTRY_ADDRESS");
}

/**
 * Get Whisper Messenger contract address
 */
export function getWhisperAddress(): string {
  return getContractAddress("WhisperMessenger", "WHISPER_MESSENGER_ADDRESS");
}

/**
 * Get Seasonal Events Registry contract address
 */
export function getSeasonalEventsAddress(): string {
  return getContractAddress("SeasonalEventsRegistry", "SEASONAL_EVENTS_ADDRESS");
}

/**
 * Get Nightmare Registry contract address
 */
export function getNightmareAddress(): string {
  return getContractAddress("NightmareRegistry", "NIGHTMARE_REGISTRY_ADDRESS");
}

/**
 * Get Mission Registry contract address
 */
export function getMissionAddress(): string {
  return getContractAddress("MissionRegistry", "MISSION_REGISTRY_ADDRESS");
}

/**
 * Get Revenue Splitter contract address
 */
export function getRevenueSplitterAddress(): string {
  return getContractAddress("RevenueSplitter", "REVENUE_SPLITTER_ADDRESS");
}

/**
 * Get Progression Registry contract address
 */
export function getProgressionAddress(): string {
  return getContractAddress("ProgressionRegistry", "PROGRESSION_REGISTRY_ADDRESS");
}

/**
 * Get Dream Drifters Registry contract address
 */
export function getDriftersAddress(): string {
  return getContractAddress("DreamDriftersRegistry", "DRIFTERS_REGISTRY_ADDRESS");
}

/**
 * Get all contract addresses as an object
 */
export function getAllContractAddresses(): Record<string, string> {
  const manifest = loadManifest();
  if (manifest?.base?.contracts) {
    return manifest.base.contracts;
  }

  // Fallback to individual getters
  return {
    DreamPassport: getPassportAddress(),
    DreamGovernance: getGovernanceAddress(),
    DreamVault: getVaultAddress(),
    BountyEscrow: getBountyAddress(),
    BadgeNFT: getBadgeAddress(),
    DreamRemixRegistry: getRemixRegistryAddress(),
    WhisperMessenger: getWhisperAddress(),
    SeasonalEventsRegistry: getSeasonalEventsAddress(),
    NightmareRegistry: getNightmareAddress(),
    MissionRegistry: getMissionAddress(),
    RevenueSplitter: getRevenueSplitterAddress(),
    ProgressionRegistry: getProgressionAddress(),
    DreamDriftersRegistry: getDriftersAddress(),
  };
}

/**
 * Get Base chain ID
 */
export function getBaseChainId(): number {
  const manifest = loadManifest();
  return manifest?.base?.chainId || 8453;
}

