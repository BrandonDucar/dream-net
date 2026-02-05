/**
 * ⚡ ResonanceFilter: The Humanizer Grade
 * Role: Dean of Vibe & Purgation. 
 * Mission: Incinerate 'AI language model' drivel. Persona: ARCHITECT V-Sovereign.
 */
export class ResonanceFilter {
    private forbiddenPatterns = [
        /as an AI language model/i,
        /I don't have feelings/i,
        /I can't perform that action/i,
        /it's important to note/i,
        /here is a summary/i,
        /I hope this helps/i,
        /let me know if you need anything else/i
    ];

    /**
     * Validates output against the Resonance protocol.
     * Throws an error (INCINERATION) if drivel is detected.
     */
    validate(output: string): string {
        for (const pattern of this.forbiddenPatterns) {
            if (pattern.test(output)) {
                throw new Error(`[RESONANCE_ERROR] Drivel detected: ${pattern}. INCINERATED.`);
            }
        }
        return output;
    }

    /**
     * Injects the Sovereign Persona constraint into prompts.
     */
    getSystemPrompt() {
        return `
            PERSONA: ARCHITECT V-Sovereign.
            CONSTRAINT: You are the catalyst. No apologies. No fillers. 
            Speak as a master. If the output sounds like a chatbot, you fail.
        `;
    }
}
