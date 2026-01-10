"use strict";
/**
 * 🦉 WISDOM ENGINE: The Political Conscience
 *
 * "Not just votes, but values."
 *
 * Analyzes proposals using the Oracle Engine and Memory DNA
 * to ascertain their long-term impact on the DreamNet ecosystem.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WisdomEngine = void 0;
const oracle_1 = require("@dreamnet/dreambet-core/logic/oracle");
const VectorStore_1 = require("@dreamnet/memory-dna/store/VectorStore");
class WisdomEngine {
    /**
     * Judges a proposal based on DreamNet's "Constitution" (Vector Memories).
     */
    static async judgeProposal(proposal) {
        console.log(`🦉 [Wisdom] Convening Council for Proposal: "${proposal.title}"`);
        // 1. Contextualize via Memory
        const precedents = await VectorStore_1.vectorStore.query(`governance precedent similar to: ${proposal.title} ${proposal.description}`, 3);
        // 2. Predict Outcome via Dreambet Oracle
        // We treat the proposal passing as a "Game" to predict the outcome of.
        const prediction = await oracle_1.OracleEngine.predict({
            gameType: "governance_impact",
            participants: ["DreamNet_Health", "Proposal_Effect"],
            context: { proposal }
        });
        // 3. Calculate Wisdom Score
        // Base score starts at 50 (neutral).
        let score = 50;
        // Adjust based on Oracle confidence
        if (prediction.confidence > 0.8)
            score += 10;
        // Adjust based on keywords (Naive Heuristic for v1)
        const text = (proposal.title + proposal.description).toLowerCase();
        if (text.includes("expand") || text.includes("grow") || text.includes("fix"))
            score += 10;
        if (text.includes("destroy") || text.includes("shutdown") || text.includes("limit"))
            score -= 15;
        if (text.includes("dream") || text.includes("create"))
            score += 15;
        score = Math.min(100, Math.max(0, score));
        // 4. Determine Alignment
        let alignment = "pragmatic";
        if (score > 80)
            alignment = "utopian";
        if (score < 30)
            alignment = "dystopian";
        if (score >= 30 && score <= 40)
            alignment = "chaos";
        // 5. Formulate Suggestion
        const suggestedVote = score >= 60 ? "for" : "against";
        // 6. Log to Pulsar (The Subconscious)
        // The system "thinks" about this judgment.
        // We don't expose Pulsar broadcast here directly, but we log it.
        console.log(`🦉 [Wisdom] Verdict: ${alignment.toUpperCase()} (Score: ${score})`);
        return {
            proposalId: proposal.id,
            wisdomScore: score,
            rationale: `Oracle confidence: ${(prediction.confidence * 100).toFixed(0)}%. Precedents found: ${precedents.length}. Impact Assessment: ${alignment}.`,
            alignment,
            suggestedVote
        };
    }
}
exports.WisdomEngine = WisdomEngine;
