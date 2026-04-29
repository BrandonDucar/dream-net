import { Neynar } from "@dreamnet/platform-connector";
import { apiHopper } from "./APIHopperService.js";

/**
 * 🎨 Tattoo Studio
 * Arya's second utility: The Essence Tattoo.
 * Distills a soul into ink.
 */
export class TattooStudio {
    private static instance: TattooStudio;

    public static getInstance(): TattooStudio {
        if (!TattooStudio.instance) {
            TattooStudio.instance = new TattooStudio();
        }
        return TattooStudio.instance;
    }

    /**
     * Generate a tattoo design based on a user's "essence"
     */
    async generateEssenceTattoo(username: string): Promise<{ prompt: string; description: string }> {
        console.log(`🎨 [TattooStudio] Designing for @${username}...`);

        try {
            // 1. Analyze Essence
            const user = await Neynar.getUserByUsername(username);
            const casts = await Neynar.searchCasts(`from:${username}`);
            const history = casts.slice(0, 20).map(c => c.text).join("\n");

            const analysisPrompt = `
You are a master tattoo artist and psychologist.
Analyze the following social media history for user @${username}.
Determine their "essence" — their core values, obsessions, and hidden depths.

USER BIO: ${user?.profile?.bio?.text || "N/A"}
SOCIAL HISTORY:
${history}

TASK:
1. Describe their "Essence" in 2 sentences.
2. Create a detailed prompt for a high-end, artistic tattoo that represents this essence.
   - Style: Minimalist, Neo-traditional, or Dark Surrealism (pick one that fits).
   - Elements: Use metaphors found in their posts.
   - Tone: Meaningful and sharp.

FORMAT:
ESSENCE: [2 sentence description]
PROMPT: [Detailed DALL-E style image prompt]
`;

            const result = await apiHopper.generateResponse(analysisPrompt, {
                provider: "gemini",
                temperature: 0.7
            });

            const essenceMatch = result.match(/ESSENCE: ([\s\S]*?)\nPROMPT:/);
            const promptMatch = result.match(/PROMPT: ([\s\S]*)/);

            const essence = essenceMatch ? essenceMatch[1].trim() : "A mysterious soul in the digital void.";
            const imagePrompt = promptMatch ? promptMatch[1].trim() : "A sharp needle piercing a digital heart, minimalist black ink.";

            return {
                description: essence,
                prompt: imagePrompt
            };
        } catch (error) {
            console.error("❌ [TattooStudio] Design failed:", error);
            throw error;
        }
    }
}

export const tattooStudio = TattooStudio.getInstance();
