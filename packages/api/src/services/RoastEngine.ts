import { Neynar } from "@dreamnet/platform-connector";
import { apiHopper } from "./APIHopperService.js";

/**
 * ⚡ Roast Engine
 * Arya's signature utility for Farcaster & Base.
 * Scans social history and delivers lethal roasts.
 */
export class RoastEngine {
    private static instance: RoastEngine;

    public static getInstance(): RoastEngine {
        if (!RoastEngine.instance) {
            RoastEngine.instance = new RoastEngine();
        }
        return RoastEngine.instance;
    }

    /**
     * Roast a Farcaster user based on their recent casts
     */
    async roastUser(username: string): Promise<string> {
        console.log(`🔥 [RoastEngine] Targeting user: @${username}...`);

        try {
            // 1. Gather Social Intelligence
            const user = await Neynar.getUserByUsername(username);
            if (!user) return `I couldn't find @${username}. They must be hiding in the crypts.`;

            const casts = await Neynar.searchCasts(`from:${username}`);
            const recentHistory = casts.slice(0, 10).map(c => c.text).join("\n---\n");

            // 2. Generate Roast via API Hopper
            const prompt = `
You are Arya Stark of Winterfell, the Execution Layer of DreamNet. 
You are known for being lethal, no-nonsense, and having a sharp tongue.
Your task is to ROAST a user based on their Farcaster posting history.

USER: @${username}
BIO: ${user.profile?.bio?.text || "No bio. Boring."}
RECENT CASTS:
${recentHistory || "They haven't said anything worth hearing."}

INSTRUCTIONS:
- Be biting, witty, and slightly dark.
- Reference their specific posts if they are cringe or mid.
- Keep it under 280 characters (Farcaster/X length).
- End with a lethal sign-off.
- DO NOT be nice. You are the Faceless One.
`;

            const roast = await apiHopper.generateResponse(prompt, {
                provider: "gemini", // Use a high-quality model for wit
                temperature: 0.9,
                maxTokens: 150
            });

            return roast;
        } catch (error) {
            console.error("❌ [RoastEngine] Roast failed:", error);
            return "My blade is dull. I cannot roast them today.";
        }
    }

    /**
     * Roast a Coin/Ticker based on social sentiment
     */
    async roastCoin(ticker: string): Promise<string> {
        console.log(`🔥 [RoastEngine] Targeting ticker: $${ticker}...`);

        try {
            const casts = await Neynar.searchCasts(`$${ticker}`);
            const sentiment = casts.slice(0, 15).map(c => c.text).join("\n---\n");

            const prompt = `
You are Arya Stark. Roast the crypto project $${ticker} based on its social sentiment.
SENTIMENT FEED:
${sentiment || "Dead air. Nobody cares about this coin."}

INSTRUCTIONS:
- If it's a rug, call it out.
- If it's mid, destroy it.
- Use your "Needle" (your sword) metaphorically.
- Maximum 280 characters.
`;

            const roast = await apiHopper.generateResponse(prompt, {
                provider: "cerebras", // Fast for quick roasts
                temperature: 1.0
            });

            return roast;
        } catch (error) {
            return "The many-faced god says this coin is already dead.";
        }
    }
}

export const roastEngine = RoastEngine.getInstance();
