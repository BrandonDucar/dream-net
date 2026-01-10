/**
 * DreamState Types
 * Governance layer: Passports, Offices, Cabinets
 * 
 * @module @dreamnet/dreamstate/types
 */

import type { TierId } from "@dreamnet/dreamnet-control-core/tierConfig";
import type { ClusterId } from "@dreamnet/dreamnet-control-core/clusters";

/**
 * Citizen ID - Unique identifier for a DreamNet citizen
 */
export type CitizenId = string;

/**
 * Dream Passport
 * Represents a citizen's identity and governance status
 */
export interface DreamPassport {
  /** Unique citizen identifier */
  citizenId: CitizenId;
  
  /** Display name */
  displayName: string;
  
  /** Wallet addresses (lowercase) */
  walletAddresses: string[];
  
  /** Access tier (from control-core) */
  tierId: TierId;
  
  /** Passport status */
  status: "active" | "suspended" | "exiled" | "probation";
  
  /** Reputation score (0-1 or 0-100) */
  reputationScore: number;
  
  /** Office IDs held by this citizen */
  officeIds: OfficeId[];
  
  /** Cabinet IDs this citizen belongs to */
  cabinetIds: CabinetId[];
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
}

/**
 * Office ID - Governance roles
 */
export type OfficeId =
  | "FOUNDER"
  | "MINISTER_OF_WOLF_OPERATIONS"
  | "CHIEF_OF_AI_SEO"
  | "GEO_BOUNDARY_ARCHITECT"
  | "CELL_SHIELD_OVERSEER"
  | "TREASURY_KEEPER"
  | "SHIELD_COMMANDER"
  | "DREAMKEEPER_CHIEF"
  | "DREAMBET_STEWARD"
  | "ZEN_GARDEN_CURATOR"
  | "SOCIAL_HUB_DIRECTOR"
  | string; // Allow extension

/**
 * Office
 * Represents a governance role with specific powers
 */
export interface Office {
  /** Office identifier */
  id: OfficeId;
  
  /** Human-readable name */
  name: string;
  
  /** Description of the office */
  description?: string;
  
  /** Which clusters this office governs */
  clusterScope?: ClusterId[];
  
  /** Required tier to hold this office */
  requiredTierId: TierId;
  
  /** Whether only one citizen can hold this office at a time */
  isSingleSeat: boolean;
  
  /** Human-readable capabilities/powers */
  powers: string[];
}

/**
 * Cabinet ID - Groups of offices
 */
export type CabinetId =
  | "FOUNDER_CABINET"
  | "SHIELD_CABINET"
  | "TREASURY_CABINET"
  | "GROWTH_SEO_CABINET"
  | "DATA_PRIVACY_CABINET"
  | "DREAM_HEALTH_CABINET"
  | "GAMING_CABINET"
  | "SOCIAL_COORDINATION_CABINET"
  | string; // Allow extension

/**
 * Cabinet
 * Represents a group of offices that make decisions together
 */
export interface Cabinet {
  /** Cabinet identifier */
  id: CabinetId;
  
  /** Human-readable name */
  name: string;
  
  /** Description of the cabinet */
  description?: string;
  
  /** Office IDs that belong to this cabinet */
  officeIds: OfficeId[];
  
  /** Decision rule for cabinet actions */
  decisionRule: "founder_override" | "majority" | "unanimous";
  
  /** Which clusters this cabinet governs */
  clusterScope?: ClusterId[];
}

/**
 * DreamState Snapshot
 * Complete state of DreamNet governance
 */
export interface DreamStateSnapshot {
  /** All passports indexed by citizen ID */
  passports: Record<CitizenId, DreamPassport>;
  
  /** All offices indexed by office ID */
  offices: Record<OfficeId, Office>;
  
  /** All cabinets indexed by cabinet ID */
  cabinets: Record<CabinetId, Cabinet>;
  
  /** Creation timestamp */
  createdAt: string;
  
  /** Last update timestamp */
  updatedAt: string;
  
  /** Version number */
  version: number;
  
  /** Optional note */
  note?: string;
  
  /** Founder citizen ID */
  founderCitizenId: CitizenId;
  
  /** God Vault citizen ID (usually same as founder) */
  godVaultCitizenId: CitizenId;
  
  /** Default tier for new citizens */
  defaultCitizenTemplateTierId: TierId;
  
  /** Default status for new citizens */
  defaultStatus: "active" | "probation";
  
  /** Who initialized this state */
  initializedBy: string;
  
  /** When this state was initialized */
  initializedAt: string;
  
  /** Last rebuild timestamp */
  lastRebuildAt?: string;
  
  /** Governing charter */
  governingCharter?: string;
  
  /** Governing charter version */
  governingVersion?: string;
  
  /** Governing notes */
  governingNotes?: string;
  
  /** Whether this is a read-only bootstrap */
  isReadOnlyBootstrap: boolean;
  
  /** Next citizen ID seed */
  nextCitizenIdSeed: number;
  
  /** Next office ID suffix */
  nextOfficeIdSuffix: number;
  
  /** Next cabinet ID suffix */
  nextCabinetIdSuffix: number;
  
  /** Global policies */
  globalPolicies?: Record<string, unknown>;
  
  /** Cluster-specific policies */
  clusterPolicies?: Record<ClusterId, unknown>;
  
  /** Risk policies */
  riskPolicies?: Record<string, unknown>;
  
  /** Economic policies */
  economicPolicies?: Record<string, unknown>;
}

