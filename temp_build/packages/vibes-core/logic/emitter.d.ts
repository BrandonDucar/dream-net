/**
 * 🎵 VIBES CORE: Atmospheric Intelligence
 *
 * Inspired by Spotify "Prompted Playlists".
 * Agents emit a "Vibe State" which translates to a musical context.
 */
export interface VibeState {
    context: string;
    genre: string;
    bpm: number;
    description: string;
}
export declare class VibeEmitter {
    static analyze(agentState: string): VibeState;
}
