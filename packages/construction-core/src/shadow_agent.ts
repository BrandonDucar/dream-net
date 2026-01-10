import { ChangeOS, ChangeObject } from './change_os.js';

/**
 * SHADOW AGENT (The Observer)
 * "Shadow a PM for a day."
 * 
 * Objective: Identify the "3 most annoying moments".
 */
export class ShadowAgent {
    private frustationPatterns: string[] = [];

    constructor(private changeOS: ChangeOS) { }

    /**
     * Analyzes a sequence of changes for "Pain".
     */
    analyzeSession(changes: ChangeObject[]) {
        // pattern 1: The "Toggle" (Indecision)
        // Same file modified > 3 times in 5 minutes
        this.detectToggling(changes);

        // Pattern 2: The "Blind Guess" (Low Confidence)
        // User submits data with confidence < 40%
        this.detectUncertainty(changes);
    }

    private detectToggling(changes: ChangeObject[]) {
        // Simplistic detection logic
        const counts: Record<string, number> = {};
        changes.forEach(c => {
            counts[c.id] = (counts[c.id] || 0) + 1;
        });

        Object.entries(counts).forEach(([id, count]) => {
            if (count > 3) {
                this.logPattern(`Frustration detected: Object ${id} modified ${count} times rapidly.`);
            }
        });
    }

    private detectUncertainty(changes: ChangeObject[]) {
        const lowConf = changes.filter(c => c.confidence < 0.4);
        if (lowConf.length > 0) {
            this.logPattern(`Uncertainty detected: ${lowConf.length} low-confidence inputs. Tools are failing the user.`);
        }
    }

    private logPattern(msg: string) {
        console.log(`[ShadowAgent] 🕵️ ${msg}`);
        this.frustationPatterns.push(msg);
    }

    getReport() {
        return {
            patterns: this.frustationPatterns,
            recommendation: "Focus on fixing valid/invalid toggling first."
        };
    }
}
