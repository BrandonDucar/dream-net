import { DreamStateCore } from "../index";
import { DreamStateStatus } from "../types";

export interface DreamStateDashboardView {
  citizenCount: number;
  passportCount: number;
  departmentCount: number;
  diplomaticRelationsCount: number;
  headOfState: string;
  citizens: {
    identityId: string;
    passportNumber?: string;
    tier: string;
    joinedAt: number;
    contributions: number;
  }[];
  passports: {
    passportNumber: string;
    citizenId: string;
    tier: string;
    transferable: boolean;
    currentOwner: string;
  }[];
  departments: {
    id: string;
    name: string;
    packId: string;
    responsibilities: string[];
  }[];
  diplomaticRelations: {
    id: string;
    protocolName: string;
    protocolType: string;
    status: string;
  }[];
  stateSymbols: {
    type: string;
    name: string;
    content: string;
    description: string;
  }[];
  recentActions: {
    type: string;
    department: string;
    action: string;
    timestamp: number;
  }[];
}

/**
 * Get Dream State dashboard view model
 */
export function getDreamStateDashboardView(): DreamStateDashboardView {
  const status: DreamStateStatus = DreamStateCore.status();

  return {
    citizenCount: status.citizenCount,
    passportCount: status.passportCount,
    departmentCount: status.departmentCount,
    diplomaticRelationsCount: status.diplomaticRelationsCount,
    headOfState: status.headOfState,
    citizens: status.sampleCitizens.map((c) => ({
      identityId: c.identityId,
      passportNumber: c.passportNumber,
      tier: c.citizenshipTier,
      joinedAt: c.joinedAt,
      contributions: c.contributions,
    })),
    passports: status.samplePassports.map((p) => ({
      passportNumber: p.passportNumber,
      citizenId: p.citizenId,
      tier: p.citizenshipTier,
      transferable: p.transferable,
      currentOwner: p.currentOwner,
    })),
    departments: status.sampleDepartments.map((d) => ({
      id: d.id,
      name: d.name,
      packId: d.packId,
      responsibilities: d.responsibilities,
    })),
    diplomaticRelations: status.sampleDiplomaticRelations.map((r) => ({
      id: r.id,
      protocolName: r.protocolName,
      protocolType: r.protocolType,
      status: r.status,
    })),
    stateSymbols: status.stateSymbols.map((s) => ({
      type: s.type,
      name: s.name,
      content: s.content,
      description: s.description,
    })),
    recentActions: status.recentActions.map((a) => ({
      type: a.type,
      department: a.department,
      action: a.action,
      timestamp: a.timestamp,
    })),
  };
}

