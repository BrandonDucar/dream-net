"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamStateCore = void 0;
const citizenshipStore_1 = require("./store/citizenshipStore");
const stateScheduler_1 = require("./scheduler/stateScheduler");
const passportIssuer_1 = require("./logic/passportIssuer");
const governance_1 = require("./logic/governance");
const ddaoAttractor_1 = require("./logic/ddaoAttractor");
const diplomacy_1 = require("./logic/diplomacy");
const government_1 = require("./logic/government");
const wisdom_1 = require("./logic/wisdom");
exports.DreamStateCore = {
    // Orchestration
    run(context) {
        return (0, stateScheduler_1.runDreamStateCycle)(context);
    },
    status() {
        return citizenshipStore_1.CitizenshipStore.status();
    },
    // Passports (backed by IdentityGrid)
    issuePassport(identityId, tier, flags) {
        return (0, passportIssuer_1.issuePassport)(identityId, tier, flags);
    },
    getPassport(identityId) {
        return (0, passportIssuer_1.getPassport)(identityId);
    },
    upgradePassport(identityId, newTier) {
        return (0, passportIssuer_1.upgradePassport)(identityId, newTier);
    },
    listPassports() {
        return citizenshipStore_1.CitizenshipStore.listPassports();
    },
    // Governance: Proposals
    createProposal(identityId, title, description, meta) {
        return (0, governance_1.createProposal)(identityId, title, description, meta);
    },
    getProposal(id) {
        return citizenshipStore_1.CitizenshipStore.getProposal(id);
    },
    listProposals() {
        return citizenshipStore_1.CitizenshipStore.listProposals();
    },
    listOpenProposals() {
        return citizenshipStore_1.CitizenshipStore.listOpenProposals();
    },
    openProposal(proposalId) {
        return (0, governance_1.openProposal)(proposalId);
    },
    // Governance: Votes
    castVote(identityId, proposalId, choice, passportTier) {
        return (0, governance_1.castVote)(identityId, proposalId, choice, passportTier);
    },
    tallyProposal(proposalId) {
        return (0, governance_1.tallyProposal)(proposalId);
    },
    proposalPassed(proposalId) {
        return (0, governance_1.proposalPassed)(proposalId);
    },
    executeProposal(proposalId) {
        return (0, governance_1.executeProposal)(proposalId);
    },
    rejectProposal(proposalId) {
        return (0, governance_1.rejectProposal)(proposalId);
    },
    // D-DAO Attractors
    registerDDAOAttractor(name, category, url, tags, score) {
        return (0, ddaoAttractor_1.registerDDAOAttractor)(name, category, url, tags, score);
    },
    getDDAOAttractor(id) {
        return citizenshipStore_1.CitizenshipStore.getDDAOAttractor(id);
    },
    listDDAOAttractors() {
        return citizenshipStore_1.CitizenshipStore.listDDAOAttractors();
    },
    getDDAOAttractorsByCategory(category) {
        return (0, ddaoAttractor_1.getDDAOAttractorsByCategory)(category);
    },
    getTopDDAOAttractors(limit) {
        return (0, ddaoAttractor_1.getTopDDAOAttractors)(limit);
    },
    updateDDAOAttractorScore(id, score) {
        return (0, ddaoAttractor_1.updateDDAOAttractorScore)(id, score);
    },
    // Government
    listDepartments() {
        return citizenshipStore_1.CitizenshipStore.listDepartments();
    },
    getDepartment(id) {
        return citizenshipStore_1.CitizenshipStore.getDepartment(id);
    },
    recordAction(type, department, action, meta) {
        return (0, government_1.recordGovernmentAction)(type, department, action, meta);
    },
    listRecentActions(limit = 50) {
        return citizenshipStore_1.CitizenshipStore.listRecentActions(limit);
    },
    // Diplomacy
    establishDiplomaticRelation(context, protocolName, protocolType, contactEmail, notes) {
        return (0, diplomacy_1.establishDiplomaticRelation)(context, protocolName, protocolType, contactEmail, notes);
    },
    upgradeDiplomaticStatus(relationId, newStatus) {
        return (0, diplomacy_1.upgradeDiplomaticStatus)(relationId, newStatus);
    },
    listDiplomaticRelations() {
        return citizenshipStore_1.CitizenshipStore.listRelations();
    },
    // State Symbols
    listStateSymbols() {
        return citizenshipStore_1.CitizenshipStore.listSymbols();
    },
    getStateSymbol(id) {
        return citizenshipStore_1.CitizenshipStore.getSymbol(id);
    },
    // Wisdom Engine 🦉
    async judgeProposal(proposalId) {
        const proposal = citizenshipStore_1.CitizenshipStore.getProposal(proposalId);
        if (!proposal)
            return undefined;
        return wisdom_1.WisdomEngine.judgeProposal(proposal);
    },
};
__exportStar(require("./types"), exports);
__exportStar(require("./adapters/stateStatusAdapter"), exports);
exports.default = exports.DreamStateCore;
