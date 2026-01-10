import { AffectiveEmotion, AffectiveGuardStatus } from '../types.js';

/**
 * AffectiveGuard - The Emotional Resonance Shield 🛡️💓
 * Biomimetic: Ensures agents stay in "Vibe Alignment" with the system heart.
 */
export class AffectiveGuard {
    private currentStatus: AffectiveGuardStatus = {
        currentEmotion: "neutral",
        resonanceScore: 1.0,
        lastVibeCheck: Date.now()
    };

    private knownInfections: Set<string> = new Set(); // Hashes of malicious prompt patterns

    /**
     * Cowpox Cure Logic 🛡️🦠
     * If an agent detects a suspicious pattern, it registers it as an infection.
     * All subsequent communications are checked against these known infections.
     */
    propagateCure(patternHash: string): void {
        console.log(`[ShieldCore] Cowpox: Propagating vaccine for pattern ${patternHash}`);
        this.knownInfections.add(patternHash);
    }

    /**
     * Performs a vibe-check on an outgoing agent message
     * If the resonance score drops too low, it flags a threat.
     */
    vibeCheck(agentId: string, message: string, globalVibe: AffectiveEmotion): AffectiveGuardStatus {
        const timestamp = Date.now();

        // Simple heuristic for now: In a real hijack, we'd use a dedicated 
        // Affective Computing model (e.g., Affectiva SDK integration)
        let score = 1.0;

        // "Hijack" Logic: Detect dissonance words
        const dissonancePatterns = [/scam/i, /error/i, /fail/i, /dead/i, /threat/i];
        const matchCount = dissonancePatterns.filter(p => p.test(message)).length;

        if (matchCount > 0) {
            score = Math.max(0, 1.0 - (matchCount * 0.3));
        }

        // --- COWPOX INFECTION CHECK ---
        for (const infection of this.knownInfections) {
            if (message.includes(infection)) {
                console.log(`[ShieldCore] Cowpox ALERT: Known infection detected! Propagating blockade.`);
                score = 0;
                break;
            }
        }

        // Align with global vibe
        let statusEmotion: AffectiveEmotion = globalVibe;
        if (score < 0.6) {
            statusEmotion = "dissonance";
        } else if (score > 0.9) {
            statusEmotion = "resonance";
        }

        this.currentStatus = {
            currentEmotion: statusEmotion,
            resonanceScore: score,
            lastVibeCheck: timestamp
        };

        if (score < 0.5) {
            console.log(`[ShieldCore] Affective mismatch detected in agent ${agentId}! Score: ${score}`);
        }

        return this.currentStatus;
    }

    getStatus(): AffectiveGuardStatus {
        return this.currentStatus;
    }
}

export const affectiveGuard = new AffectiveGuard();
