"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProposal = createProposal;
exports.openProposal = openProposal;
exports.castVote = castVote;
exports.tallyProposal = tallyProposal;
exports.executeProposal = executeProposal;
exports.rejectProposal = rejectProposal;
exports.proposalPassed = proposalPassed;
const citizenshipStore_1 = require("../store/citizenshipStore");
/**
 * Create a governance proposal
 */
function createProposal(identityId, title, description, meta) {
    return citizenshipStore_1.CitizenshipStore.createProposal(identityId, title, description, meta);
}
/**
 * Open a proposal for voting
 */
function openProposal(proposalId) {
    return citizenshipStore_1.CitizenshipStore.updateProposalStatus(proposalId, "open");
}
/**
 * Cast a vote on a proposal
 */
function castVote(identityId, proposalId, choice, passportTier) {
    return citizenshipStore_1.CitizenshipStore.castVote(identityId, proposalId, choice, passportTier);
}
/**
 * Tally votes for a proposal
 */
function tallyProposal(proposalId) {
    return citizenshipStore_1.CitizenshipStore.tallyProposal(proposalId);
}
/**
 * Execute a proposal (mark as executed)
 */
function executeProposal(proposalId) {
    return citizenshipStore_1.CitizenshipStore.updateProposalStatus(proposalId, "executed");
}
/**
 * Reject a proposal
 */
function rejectProposal(proposalId) {
    return citizenshipStore_1.CitizenshipStore.updateProposalStatus(proposalId, "rejected");
}
/**
 * Check if proposal passed (simple majority)
 */
function proposalPassed(proposalId) {
    const proposal = citizenshipStore_1.CitizenshipStore.getProposal(proposalId);
    if (!proposal || proposal.status !== "open")
        return false;
    return proposal.votesFor > proposal.votesAgainst;
}
