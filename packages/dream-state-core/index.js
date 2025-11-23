import { CitizenshipStore } from "./store/citizenshipStore";
import { runDreamStateCycle } from "./scheduler/stateScheduler";
import { issuePassport as issuePassportHelper, getPassport as getPassportHelper, upgradePassport as upgradePassportHelper } from "./logic/passportIssuer";
import { createProposal, openProposal, castVote, tallyProposal, executeProposal, rejectProposal, proposalPassed } from "./logic/governance";
import { registerDDAOAttractor, updateDDAOAttractorScore, getDDAOAttractorsByCategory, getTopDDAOAttractors } from "./logic/ddaoAttractor";
import { establishDiplomaticRelation, upgradeDiplomaticStatus } from "./logic/diplomacy";
import { recordGovernmentAction } from "./logic/government";
export const DreamStateCore = {
    // Orchestration
    run(context) {
        return runDreamStateCycle(context);
    },
    status() {
        return CitizenshipStore.status();
    },
    // Passports (backed by IdentityGrid)
    issuePassport(identityId, tier, flags) {
        return issuePassportHelper(identityId, tier, flags);
    },
    getPassport(identityId) {
        return getPassportHelper(identityId);
    },
    upgradePassport(identityId, newTier) {
        return upgradePassportHelper(identityId, newTier);
    },
    listPassports() {
        return CitizenshipStore.listPassports();
    },
    // Governance: Proposals
    createProposal(identityId, title, description, meta) {
        return createProposal(identityId, title, description, meta);
    },
    getProposal(id) {
        return CitizenshipStore.getProposal(id);
    },
    listProposals() {
        return CitizenshipStore.listProposals();
    },
    listOpenProposals() {
        return CitizenshipStore.listOpenProposals();
    },
    openProposal(proposalId) {
        return openProposal(proposalId);
    },
    // Governance: Votes
    castVote(identityId, proposalId, choice, passportTier) {
        return castVote(identityId, proposalId, choice, passportTier);
    },
    tallyProposal(proposalId) {
        return tallyProposal(proposalId);
    },
    proposalPassed(proposalId) {
        return proposalPassed(proposalId);
    },
    executeProposal(proposalId) {
        return executeProposal(proposalId);
    },
    rejectProposal(proposalId) {
        return rejectProposal(proposalId);
    },
    // D-DAO Attractors
    registerDDAOAttractor(name, category, url, tags, score) {
        return registerDDAOAttractor(name, category, url, tags, score);
    },
    getDDAOAttractor(id) {
        return CitizenshipStore.getDDAOAttractor(id);
    },
    listDDAOAttractors() {
        return CitizenshipStore.listDDAOAttractors();
    },
    getDDAOAttractorsByCategory(category) {
        return getDDAOAttractorsByCategory(category);
    },
    getTopDDAOAttractors(limit) {
        return getTopDDAOAttractors(limit);
    },
    updateDDAOAttractorScore(id, score) {
        return updateDDAOAttractorScore(id, score);
    },
    // Government
    listDepartments() {
        return CitizenshipStore.listDepartments();
    },
    getDepartment(id) {
        return CitizenshipStore.getDepartment(id);
    },
    recordAction(type, department, action, meta) {
        return recordGovernmentAction(type, department, action, meta);
    },
    listRecentActions(limit = 50) {
        return CitizenshipStore.listRecentActions(limit);
    },
    // Diplomacy
    establishDiplomaticRelation(context, protocolName, protocolType, contactEmail, notes) {
        return establishDiplomaticRelation(context, protocolName, protocolType, contactEmail, notes);
    },
    upgradeDiplomaticStatus(relationId, newStatus) {
        return upgradeDiplomaticStatus(relationId, newStatus);
    },
    listDiplomaticRelations() {
        return CitizenshipStore.listRelations();
    },
    // State Symbols
    listStateSymbols() {
        return CitizenshipStore.listSymbols();
    },
    getStateSymbol(id) {
        return CitizenshipStore.getSymbol(id);
    },
};
export * from "./types";
export * from "./adapters/stateStatusAdapter";
export default DreamStateCore;
