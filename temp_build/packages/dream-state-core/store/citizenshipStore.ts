import {
  DreamPassport,
  DreamPassportTier,
  GovernmentDepartment,
  DiplomaticRelation,
  StateSymbol,
  GovernmentAction,
  DreamProposal,
  DreamVote,
  DDAOAttractor,
  DreamStateStatus,
} from "../types";

const passports: Map<string, DreamPassport> = new Map(); // Keyed by identityId
const departments: Map<string, GovernmentDepartment> = new Map();
const diplomaticRelations: Map<string, DiplomaticRelation> = new Map();
const stateSymbols: Map<string, StateSymbol> = new Map();
const governmentActions: GovernmentAction[] = [];
const proposals: Map<string, DreamProposal> = new Map();
const votes: Map<string, DreamVote> = new Map(); // Keyed by `${proposalId}:${identityId}`
const ddaoAttractors: Map<string, DDAOAttractor> = new Map();

let lastRunAt: number | null = null;

let passportCounter = 0;
function generatePassportId(): string {
  passportCounter += 1;
  return `passport:${Date.now()}:${passportCounter}`;
}

export const CitizenshipStore = {
  // Passports (backed by IdentityGrid)
  issuePassport(identityId: string, tier: DreamPassportTier, flags?: string[]): DreamPassport {
    const now = Date.now();
    const id = generatePassportId();

    const passport: DreamPassport = {
      id,
      identityId,
      tier,
      issuedAt: now,
      updatedAt: now,
      flags,
    };

    passports.set(identityId, passport); // Key by identityId for easy lookup
    return passport;
  },

  getPassport(identityId: string): DreamPassport | undefined {
    return passports.get(identityId);
  },

  upgradePassport(identityId: string, newTier: DreamPassportTier): DreamPassport | undefined {
    const passport = passports.get(identityId);
    if (!passport) return undefined;

    const updated: DreamPassport = {
      ...passport,
      tier: newTier,
      updatedAt: Date.now(),
    };

    passports.set(identityId, updated);
    return updated;
  },

  listPassports(): DreamPassport[] {
    return Array.from(passports.values());
  },

  // Governance: Proposals
  createProposal(
    identityId: string,
    title: string,
    description: string,
    meta?: Record<string, any>
  ): DreamProposal {
    const now = Date.now();
    const id = `proposal:${now}:${Math.random().toString(36).substring(7)}`;

    const proposal: DreamProposal = {
      id,
      title,
      description,
      createdByIdentityId: identityId,
      createdAt: now,
      status: "draft",
      votesFor: 0,
      votesAgainst: 0,
      meta,
    };

    proposals.set(id, proposal);
    return proposal;
  },

  getProposal(id: string): DreamProposal | undefined {
    return proposals.get(id);
  },

  listProposals(): DreamProposal[] {
    return Array.from(proposals.values());
  },

  listOpenProposals(): DreamProposal[] {
    return Array.from(proposals.values()).filter((p) => p.status === "open");
  },

  updateProposalStatus(id: string, status: DreamProposal["status"]): boolean {
    const proposal = proposals.get(id);
    if (!proposal) return false;

    proposal.status = status;
    proposals.set(id, proposal);
    return true;
  },

  // Governance: Votes
  castVote(
    identityId: string,
    proposalId: string,
    choice: "for" | "against",
    passportTier: DreamPassportTier
  ): DreamVote {
    const weight = getVoteWeightForTier(passportTier);
    const now = Date.now();
    const voteKey = `${proposalId}:${identityId}`;

    const vote: DreamVote = {
      proposalId,
      identityId,
      choice,
      weight,
      castAt: now,
    };

    votes.set(voteKey, vote);

    // Update proposal vote counts
    const proposal = proposals.get(proposalId);
    if (proposal) {
      if (choice === "for") {
        proposal.votesFor += weight;
      } else {
        proposal.votesAgainst += weight;
      }
      proposals.set(proposalId, proposal);
    }

    return vote;
  },

  getVote(proposalId: string, identityId: string): DreamVote | undefined {
    return votes.get(`${proposalId}:${identityId}`);
  },

  listVotesForProposal(proposalId: string): DreamVote[] {
    return Array.from(votes.values()).filter((v) => v.proposalId === proposalId);
  },

  tallyProposal(proposalId: string): { for: number; against: number } {
    const proposal = proposals.get(proposalId);
    if (!proposal) return { for: 0, against: 0 };

    return {
      for: proposal.votesFor,
      against: proposal.votesAgainst,
    };
  },

  // D-DAO Attractors
  addDDAOAttractor(attractor: DDAOAttractor): DDAOAttractor {
    ddaoAttractors.set(attractor.id, attractor);
    return attractor;
  },

  getDDAOAttractor(id: string): DDAOAttractor | undefined {
    return ddaoAttractors.get(id);
  },

  listDDAOAttractors(): DDAOAttractor[] {
    return Array.from(ddaoAttractors.values());
  },

  updateDDAOAttractorScore(id: string, score: number): boolean {
    const attractor = ddaoAttractors.get(id);
    if (!attractor) return false;

    attractor.score = score;
    attractor.updatedAt = Date.now();
    ddaoAttractors.set(id, attractor);
    return true;
  },

  // Departments
  createDepartment(dept: GovernmentDepartment): GovernmentDepartment {
    departments.set(dept.id, dept);
    return dept;
  },

  getDepartment(id: string): GovernmentDepartment | undefined {
    return departments.get(id);
  },

  listDepartments(): GovernmentDepartment[] {
    return Array.from(departments.values());
  },

  // Diplomatic Relations
  establishRelation(relation: DiplomaticRelation): DiplomaticRelation {
    diplomaticRelations.set(relation.id, relation);
    return relation;
  },

  getRelation(id: string): DiplomaticRelation | undefined {
    return diplomaticRelations.get(id);
  },

  listRelations(): DiplomaticRelation[] {
    return Array.from(diplomaticRelations.values());
  },

  updateRelationStatus(id: string, status: DiplomaticRelation["status"]): boolean {
    const relation = diplomaticRelations.get(id);
    if (!relation) return false;

    relation.status = status;
    diplomaticRelations.set(id, relation);
    return true;
  },

  // State Symbols
  adoptSymbol(symbol: StateSymbol): StateSymbol {
    stateSymbols.set(symbol.id, symbol);
    return symbol;
  },

  getSymbol(id: string): StateSymbol | undefined {
    return stateSymbols.get(id);
  },

  listSymbols(): StateSymbol[] {
    return Array.from(stateSymbols.values());
  },

  // Government Actions
  recordAction(action: GovernmentAction): GovernmentAction {
    governmentActions.push(action);
    if (governmentActions.length > 1000) {
      governmentActions.shift();
    }
    return action;
  },

  listRecentActions(limit: number = 50): GovernmentAction[] {
    return governmentActions.slice(-limit).reverse();
  },

  // Status
  setLastRunAt(ts: number | null) {
    lastRunAt = ts;
  },

  status(): DreamStateStatus {
    const allPassports = Array.from(passports.values());
    const allDepartments = Array.from(departments.values());
    const allRelations = Array.from(diplomaticRelations.values());
    const allProposals = Array.from(proposals.values());
    const openProposals = allProposals.filter((p) => p.status === "open");
    const allDDAOAttractors = Array.from(ddaoAttractors.values());
    const allSymbols = Array.from(stateSymbols.values());

    return {
      lastRunAt,
      passportCount: allPassports.length,
      departmentCount: allDepartments.length,
      diplomaticRelationsCount: allRelations.length,
      proposalCount: allProposals.length,
      openProposals: openProposals.length,
      ddaoAttractorCount: allDDAOAttractors.length,
      headOfState: "agent:DreamNet",
      samplePassports: allPassports.slice(0, 20),
      sampleDepartments: allDepartments.slice(0, 10),
      sampleDiplomaticRelations: allRelations.slice(0, 10),
      sampleProposals: allProposals.slice(0, 10),
      sampleDDAOAttractors: allDDAOAttractors.slice(0, 10),
      stateSymbols: allSymbols,
      recentActions: this.listRecentActions(20),
    };
  },
};

// Vote weight by tier
function getVoteWeightForTier(tier: DreamPassportTier): number {
  switch (tier) {
    case "visitor":
      return 0; // Visitors can't vote
    case "dreamer":
      return 1;
    case "citizen":
      return 2;
    case "operator":
      return 3;
    case "architect":
      return 5;
    case "founder":
      return 10;
  }
}
