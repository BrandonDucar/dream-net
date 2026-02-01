/**
 * 🦉 WISDOM ENGINE: The Political Conscience
 *
 * "Not just votes, but values."
 *
 * Analyzes proposals using the Oracle Engine and Memory DNA
 * to ascertain their long-term impact on the DreamNet ecosystem.
 */
import type { DreamProposal } from '../types.js';
export interface WisdomAssessment {
    proposalId: string;
    wisdomScore: number;
    rationale: string;
    alignment: "utopian" | "pragmatic" | "dystopian" | "chaos";
    suggestedVote: "for" | "against" | "abstain";
}
export declare class WisdomEngine {
    /**
     * Judges a proposal based on DreamNet's "Constitution" (Vector Memories).
     */
    static judgeProposal(proposal: DreamProposal): Promise<WisdomAssessment>;
}
//# sourceMappingURL=wisdom.d.ts.map