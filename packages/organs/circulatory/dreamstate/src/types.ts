import type { TierId, ClusterId, CitizenId, OfficeId, CabinetId, DreamPassport, PassportStatus } from "@dreamnet/types";

export type { CitizenId, DreamPassport, OfficeId, CabinetId, PassportStatus };

/**
 * DreamState Registry Extensions
 * (Legacy support for diplomat/nation types if needed)
 */

export interface GovernmentDepartment {
  id: string;
  name: string;
  packId: string;
  leader?: string;
  responsibilities: string[];
  budget?: number;
  createdAt: number;
}

export interface DiplomaticRelation {
  id: string;
  protocolName: string;
  protocolType: "chain" | "protocol" | "nation";
  status: "alliance" | "neutral" | "treaty" | "hostile";
  establishedAt: number;
  meta?: Record<string, any>;
}

/**
 * DreamState Snapshot
 * Complete state of DreamNet governance
 */
export interface DreamStateSnapshot {
  passports: Record<CitizenId, DreamPassport>;
  offices: Record<OfficeId, Office>;
  cabinets: Record<CabinetId, Cabinet>;
  departments?: Record<string, GovernmentDepartment>;
  diplomacy?: Record<string, DiplomaticRelation>;
  createdAt: string;
  updatedAt: string;
  version: number;
  note?: string;
  founderCitizenId: CitizenId;
  defaultCitizenTemplateTierId: TierId;
  defaultStatus: PassportStatus;
  isReadOnlyBootstrap: boolean;
}

export interface Office {
  id: OfficeId;
  name: string;
  description?: string;
  clusterScope?: ClusterId[];
  requiredTierId: TierId;
  isSingleSeat: boolean;
  powers: string[];
}

export interface Cabinet {
  id: CabinetId;
  name: string;
  description?: string;
  officeIds: OfficeId[];
  decisionRule: "founder_override" | "majority" | "unanimous";
  clusterScope?: ClusterId[];
}

