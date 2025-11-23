import { CitizenshipStore } from "../store/citizenshipStore";
/**
 * Create a governance proposal
 */
export function createProposal(identityId, title, description, meta) {
    return CitizenshipStore.createProposal(identityId, title, description, meta);
}
/**
 * Open a proposal for voting
 */
export function openProposal(proposalId) {
    return CitizenshipStore.updateProposalStatus(proposalId, "open");
}
/**
 * Cast a vote on a proposal
 */
export function castVote(identityId, proposalId, choice, passportTier) {
    return CitizenshipStore.castVote(identityId, proposalId, choice, passportTier);
}
/**
 * Tally votes for a proposal
 */
export function tallyProposal(proposalId) {
    return CitizenshipStore.tallyProposal(proposalId);
}
/**
 * Execute a proposal (mark as executed)
 */
export function executeProposal(proposalId) {
    return CitizenshipStore.updateProposalStatus(proposalId, "executed");
}
/**
 * Reject a proposal
 */
export function rejectProposal(proposalId) {
    return CitizenshipStore.updateProposalStatus(proposalId, "rejected");
}
/**
 * Check if proposal passed (simple majority)
 */
export function proposalPassed(proposalId) {
    const proposal = CitizenshipStore.getProposal(proposalId);
    if (!proposal || proposal.status !== "open")
        return false;
    return proposal.votesFor > proposal.votesAgainst;
}
