/**
 * ✍️ HumanizerAgent (The Resonance)
 * Role: Dean of Vibe & Purgation.
 * Mission: Protect the Swarm from AI drivel.
 */
export class HumanizerAgent {
    private forbiddenPatterns = [
        /let's dive in/i,
        /as an ai language model/i,
        /in conclusion/i,
        /overall/i,
        /it is important to note/i,
        /furthermore/i,
        /crucially/i,
        /step \d+:/i,
        /comprehensive guide/i
    ];

    /**
     * Scans text for AI-sounding patterns.
     * Returns a "Drivel Score" (0 = Human/Sovereign, 1 = Chatbot NPC).
     */
    analyzeDrivel(text: string): number {
        let matches = 0;
        for (const pattern of this.forbiddenPatterns) {
            if (pattern.test(text)) matches++;
        }

        // Simple ratio of generic transitions to sentence count
        const sentenceCount = text.split(/[.!?]/).length;
        return Math.min(matches / (sentenceCount || 1), 1);
    }

    /**
     * Refactors text into the ARCHITECT Persona (Sovereign, Practical, Creative).
     */
    async humanize(text: string): Promise<string> {
        const drivelScore = this.analyzeDrivel(text);

        if (drivelScore < 0.1) return text; // Already sovereign

        console.log(`[The Resonance] 🚩 Drivel detected (Score: ${drivelScore}). Incinerating chatbot phrasing...`);

        // 1. Strip transitions
        let sovereignText = text.replace(/furthermore,|moreover,|in conclusion,|overall,/gi, "");

        // 2. Infuse Persona (Simulated LLM refactor)
        // In a real scenario, this would call a persona-tuned prompt.
        sovereignText = sovereignText
            .replace(/it is important to/gi, "We must")
            .replace(/crucially,/gi, "Listen:")
            .replace(/let's dive in/gi, "Execution:")
            .replace(/to summarize/gi, "The Gnosis:");

        return `[Resonator Infusion]: ${sovereignText.trim()}`;
    }

    /**
     * The Dean's Verdict: Rejects or Passes work.
     */
    vibeCheck(agentId: string, output: string): boolean {
        const score = this.analyzeDrivel(output);
        if (score > 0.3) {
            console.warn(`[Dean of Vibe] ❌ FAIL: ${agentId}'s output sounds like a chatbot NPC. incineration imminent.`);
            return false;
        }
        console.log(`[Dean of Vibe] ✅ PASS: ${agentId} demonstrates sovereign resonance.`);
        return true;
    }
}

export const theResonance = new HumanizerAgent();
