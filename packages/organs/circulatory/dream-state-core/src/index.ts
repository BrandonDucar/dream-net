import {
  DreamPassportTier,
  DreamPassport,
  GovernmentDepartment,
  DiplomaticRelation,
  StateSymbol,
  GovernmentAction,
  DreamProposal,
  DreamVote,
  DDAOAttractor,
  DreamStateContext,
  DreamStateStatus,
} from './types.js';
import { CitizenshipStore } from './store/citizenshipStore.js';
import { runDreamStateCycle } from './scheduler/stateScheduler.js';
import { issuePassport as issuePassportHelper, getPassport as getPassportHelper, upgradePassport as upgradePassportHelper } from './logic/passportIssuer.js';
import { createProposal, openProposal, castVote, tallyProposal, executeProposal, rejectProposal, proposalPassed } from './logic/governance.js';
import { registerDDAOAttractor, updateDDAOAttractorScore, getDDAOAttractorsByCategory, getTopDDAOAttractors } from './logic/ddaoAttractor.js';
import { establishDiplomaticRelation, upgradeDiplomaticStatus } from './logic/diplomacy.js';
import { recordGovernmentAction } from './logic/government.js';
import { WisdomEngine } from './logic/wisdom.js';
export { HiveMind, AntigravityMemory } from './memory/AntigravityMemory.js';

export const DreamStateCore = {
  // Orchestration
  run(context: DreamStateContext): DreamStateStatus {
    return runDreamStateCycle(context);
  },

  status(): DreamStateStatus {
    return CitizenshipStore.status();
  },

  // Passports (backed by IdentityGrid)
  issuePassport(identityId: string, tier: DreamPassportTier, flags?: string[]): DreamPassport {
    return issuePassportHelper(identityId, tier, flags);
  },

  getPassport(identityId: string): DreamPassport | undefined {
    return getPassportHelper(identityId);
  },

  upgradePassport(identityId: string, newTier: DreamPassportTier): DreamPassport | undefined {
    return upgradePassportHelper(identityId, newTier);
  },

  listPassports(): DreamPassport[] {
    return CitizenshipStore.listPassports();
  },

  // Governance: Proposals
  createProposal(
    identityId: string,
    title: string,
    description: string,
    meta?: Record<string, any>
  ): DreamProposal {
    return createProposal(identityId, title, description, meta);
  },

  getProposal(id: string): DreamProposal | undefined {
    return CitizenshipStore.getProposal(id);
  },

  listProposals(): DreamProposal[] {
    return CitizenshipStore.listProposals();
  },

  listOpenProposals(): DreamProposal[] {
    return CitizenshipStore.listOpenProposals();
  },

  openProposal(proposalId: string): boolean {
    return openProposal(proposalId);
  },

  // Governance: Votes
  castVote(
    identityId: string,
    proposalId: string,
    choice: "for" | "against",
    passportTier: DreamPassportTier
  ): DreamVote {
    return castVote(identityId, proposalId, choice, passportTier);
  },

  tallyProposal(proposalId: string): { for: number; against: number } {
    return tallyProposal(proposalId);
  },

  proposalPassed(proposalId: string): boolean {
    return proposalPassed(proposalId);
  },

  executeProposal(proposalId: string): boolean {
    return executeProposal(proposalId);
  },

  rejectProposal(proposalId: string): boolean {
    return rejectProposal(proposalId);
  },

  // D-DAO Attractors
  registerDDAOAttractor(
    name: string,
    category: DDAOAttractor["category"],
    url?: string,
    tags?: string[],
    score?: number
  ): DDAOAttractor {
    return registerDDAOAttractor(name, category, url, tags, score);
  },

  getDDAOAttractor(id: string): DDAOAttractor | undefined {
    return CitizenshipStore.getDDAOAttractor(id);
  },

  listDDAOAttractors(): DDAOAttractor[] {
    return CitizenshipStore.listDDAOAttractors();
  },

  getDDAOAttractorsByCategory(category: DDAOAttractor["category"]): DDAOAttractor[] {
    return getDDAOAttractorsByCategory(category);
  },

  getTopDDAOAttractors(limit?: number): DDAOAttractor[] {
    return getTopDDAOAttractors(limit);
  },

  updateDDAOAttractorScore(id: string, score: number): boolean {
    return updateDDAOAttractorScore(id, score);
  },

  // Government
  listDepartments(): GovernmentDepartment[] {
    return CitizenshipStore.listDepartments();
  },

  getDepartment(id: string): GovernmentDepartment | undefined {
    return CitizenshipStore.getDepartment(id);
  },

  recordAction(
    type: GovernmentAction["type"],
    department: string,
    action: string,
    meta?: Record<string, any>
  ): GovernmentAction {
    return recordGovernmentAction(type, department, action, meta);
  },

  listRecentActions(limit: number = 50): GovernmentAction[] {
    return CitizenshipStore.listRecentActions(limit);
  },

  // Diplomacy
  establishDiplomaticRelation(
    context: DreamStateContext,
    protocolName: string,
    protocolType: DiplomaticRelation["protocolType"],
    contactEmail?: string,
    notes?: string
  ): DiplomaticRelation {
    return establishDiplomaticRelation(context, protocolName, protocolType, contactEmail, notes);
  },

  upgradeDiplomaticStatus(
    relationId: string,
    newStatus: DiplomaticRelation["status"]
  ): boolean {
    return upgradeDiplomaticStatus(relationId, newStatus);
  },

  listDiplomaticRelations(): DiplomaticRelation[] {
    return CitizenshipStore.listRelations();
  },

  // State Symbols
  listStateSymbols(): StateSymbol[] {
    return CitizenshipStore.listSymbols();
  },

  getStateSymbol(id: string): StateSymbol | undefined {
    return CitizenshipStore.getSymbol(id);
  },

  // Wisdom Engine 🦉
  async judgeProposal(proposalId: string): Promise<import('./logic/wisdom.js').WisdomAssessment | undefined> {
    const proposal = CitizenshipStore.getProposal(proposalId);
    if (!proposal) return undefined;
    return WisdomEngine.judgeProposal(proposal);
  },
};

export * from './types.js';
export * from './adapters/stateStatusAdapter.js';
export default DreamStateCore;
