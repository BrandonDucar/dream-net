"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitizenshipStore = void 0;
const passports = new Map(); // Keyed by identityId
const departments = new Map();
const diplomaticRelations = new Map();
const stateSymbols = new Map();
const governmentActions = [];
const proposals = new Map();
const votes = new Map(); // Keyed by `${proposalId}:${identityId}`
const ddaoAttractors = new Map();
let lastRunAt = null;
let passportCounter = 0;
function generatePassportId() {
    passportCounter += 1;
    return `passport:${Date.now()}:${passportCounter}`;
}
exports.CitizenshipStore = {
    // Passports (backed by IdentityGrid)
    issuePassport(identityId, tier, flags) {
        const now = Date.now();
        const id = generatePassportId();
        const passport = {
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
    getPassport(identityId) {
        return passports.get(identityId);
    },
    upgradePassport(identityId, newTier) {
        const passport = passports.get(identityId);
        if (!passport)
            return undefined;
        const updated = {
            ...passport,
            tier: newTier,
            updatedAt: Date.now(),
        };
        passports.set(identityId, updated);
        return updated;
    },
    listPassports() {
        return Array.from(passports.values());
    },
    // Governance: Proposals
    createProposal(identityId, title, description, meta) {
        const now = Date.now();
        const id = `proposal:${now}:${Math.random().toString(36).substring(7)}`;
        const proposal = {
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
    getProposal(id) {
        return proposals.get(id);
    },
    listProposals() {
        return Array.from(proposals.values());
    },
    listOpenProposals() {
        return Array.from(proposals.values()).filter((p) => p.status === "open");
    },
    updateProposalStatus(id, status) {
        const proposal = proposals.get(id);
        if (!proposal)
            return false;
        proposal.status = status;
        proposals.set(id, proposal);
        return true;
    },
    // Governance: Votes
    castVote(identityId, proposalId, choice, passportTier) {
        const weight = getVoteWeightForTier(passportTier);
        const now = Date.now();
        const voteKey = `${proposalId}:${identityId}`;
        const vote = {
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
            }
            else {
                proposal.votesAgainst += weight;
            }
            proposals.set(proposalId, proposal);
        }
        return vote;
    },
    getVote(proposalId, identityId) {
        return votes.get(`${proposalId}:${identityId}`);
    },
    listVotesForProposal(proposalId) {
        return Array.from(votes.values()).filter((v) => v.proposalId === proposalId);
    },
    tallyProposal(proposalId) {
        const proposal = proposals.get(proposalId);
        if (!proposal)
            return { for: 0, against: 0 };
        return {
            for: proposal.votesFor,
            against: proposal.votesAgainst,
        };
    },
    // D-DAO Attractors
    addDDAOAttractor(attractor) {
        ddaoAttractors.set(attractor.id, attractor);
        return attractor;
    },
    getDDAOAttractor(id) {
        return ddaoAttractors.get(id);
    },
    listDDAOAttractors() {
        return Array.from(ddaoAttractors.values());
    },
    updateDDAOAttractorScore(id, score) {
        const attractor = ddaoAttractors.get(id);
        if (!attractor)
            return false;
        attractor.score = score;
        attractor.updatedAt = Date.now();
        ddaoAttractors.set(id, attractor);
        return true;
    },
    // Departments
    createDepartment(dept) {
        departments.set(dept.id, dept);
        return dept;
    },
    getDepartment(id) {
        return departments.get(id);
    },
    listDepartments() {
        return Array.from(departments.values());
    },
    // Diplomatic Relations
    establishRelation(relation) {
        diplomaticRelations.set(relation.id, relation);
        return relation;
    },
    getRelation(id) {
        return diplomaticRelations.get(id);
    },
    listRelations() {
        return Array.from(diplomaticRelations.values());
    },
    updateRelationStatus(id, status) {
        const relation = diplomaticRelations.get(id);
        if (!relation)
            return false;
        relation.status = status;
        diplomaticRelations.set(id, relation);
        return true;
    },
    // State Symbols
    adoptSymbol(symbol) {
        stateSymbols.set(symbol.id, symbol);
        return symbol;
    },
    getSymbol(id) {
        return stateSymbols.get(id);
    },
    listSymbols() {
        return Array.from(stateSymbols.values());
    },
    // Government Actions
    recordAction(action) {
        governmentActions.push(action);
        if (governmentActions.length > 1000) {
            governmentActions.shift();
        }
        return action;
    },
    listRecentActions(limit = 50) {
        return governmentActions.slice(-limit).reverse();
    },
    // Status
    setLastRunAt(ts) {
        lastRunAt = ts;
    },
    status() {
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
function getVoteWeightForTier(tier) {
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
