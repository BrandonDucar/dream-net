
/**
 * 🎵 VIBES CORE: Atmospheric Intelligence
 * 
 * Inspired by Spotify "Prompted Playlists".
 * Agents emit a "Vibe State" which translates to a musical context.
 */

export interface VibeState {
    context: string; // e.g., "High Frequency Trading"
    genre: string;   // e.g., "Liquid DnB"
    bpm: number;
    description: string; // "Why this song?"
}

export class VibeEmitter {

    static analyze(agentState: string): VibeState {
        console.log(`🎧 [Vibes] Analyzing Atmosphere for state: ${agentState}`);

        switch (agentState.toUpperCase()) {
            case "HUNTING":
            case "TRADING":
                return {
                    context: "High Velocity Markets",
                    genre: "Dark Techno / Phonk",
                    bpm: 140,
                    description: "Aggressive rhythms for high-speed alpha capture."
                };
            case "HEALING":
            case "REPAIR":
                return {
                    context: "System Regeneration",
                    genre: "Ambient / Theta Waves",
                    bpm: 60,
                    description: "Low frequency oscillations to drift and repair code."
                };
            case "IDLE":
                return {
                    context: "Standby Mode",
                    genre: "Lo-Fi Hip Hop",
                    bpm: 90,
                    description: "Chill beats to wait for new directives."
                };
            default:
                return {
                    context: "Unknown State",
                    genre: "White Noise",
                    bpm: 0,
                    description: "Static."
                };
        }
    }
}
