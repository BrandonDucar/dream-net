import { DreamProposal, DreamVote, DreamPassportTier } from '../types.js';
import { CitizenshipStore } from '../store/citizenshipStore.js';

/**
 * Create a governance proposal
 */
export function createProposal(
  identityId: string,
  title: string,
  description: string,
  meta?: Record<string, any>
): DreamProposal {
  return CitizenshipStore.createProposal(identityId, title, description, meta);
}

/**
 * Open a proposal for voting
 */
export function openProposal(proposalId: string): boolean {
  return CitizenshipStore.updateProposalStatus(proposalId, "open");
}

/**
 * Cast a vote on a proposal
 */
export function castVote(
  identityId: string,
  proposalId: string,
  choice: "for" | "against",
  passportTier: DreamPassportTier
): DreamVote {
  return CitizenshipStore.castVote(identityId, proposalId, choice, passportTier);
}

/**
 * Tally votes for a proposal
 */
export function tallyProposal(proposalId: string): { for: number; against: number } {
  return CitizenshipStore.tallyProposal(proposalId);
}

/**
 * Execute a proposal (mark as executed)
 */
export function executeProposal(proposalId: string): boolean {
  return CitizenshipStore.updateProposalStatus(proposalId, "executed");
}

/**
 * Reject a proposal
 */
export function rejectProposal(proposalId: string): boolean {
  return CitizenshipStore.updateProposalStatus(proposalId, "rejected");
}

/**
 * Check if proposal passed (simple majority)
 */
export function proposalPassed(proposalId: string): boolean {
  const proposal = CitizenshipStore.getProposal(proposalId);
  if (!proposal || proposal.status !== "open") return false;

  return proposal.votesFor > proposal.votesAgainst;
}

