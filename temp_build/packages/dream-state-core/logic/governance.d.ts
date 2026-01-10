import { DreamProposal, DreamVote, DreamPassportTier } from "../types";
/**
 * Create a governance proposal
 */
export declare function createProposal(identityId: string, title: string, description: string, meta?: Record<string, any>): DreamProposal;
/**
 * Open a proposal for voting
 */
export declare function openProposal(proposalId: string): boolean;
/**
 * Cast a vote on a proposal
 */
export declare function castVote(identityId: string, proposalId: string, choice: "for" | "against", passportTier: DreamPassportTier): DreamVote;
/**
 * Tally votes for a proposal
 */
export declare function tallyProposal(proposalId: string): {
    for: number;
    against: number;
};
/**
 * Execute a proposal (mark as executed)
 */
export declare function executeProposal(proposalId: string): boolean;
/**
 * Reject a proposal
 */
export declare function rejectProposal(proposalId: string): boolean;
/**
 * Check if proposal passed (simple majority)
 */
export declare function proposalPassed(proposalId: string): boolean;
