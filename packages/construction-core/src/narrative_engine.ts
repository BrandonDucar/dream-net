import { ChangeObject } from './change_os.js';

/**
 * NARRATIVE ENGINE (The Storyteller)
 * "Executives think in stories, not tables."
 * 
 * Objective: Convert ChangeObjects into a "Weekly Story".
 */
export class NarrativeEngine {

    generateWeeklyStory(changes: ChangeObject[]): string {
        if (changes.length === 0) return "Nothing changed this week. The site is dormant.";

        const highImpact = changes.filter(c => c.impact.includes('Critical') || c.impact.includes('Schedule'));
        const lowConfidence = changes.filter(c => c.confidence < 0.5);

        let story = `# Weekly Reality Report\n\n`;

        // The "Headline"
        if (highImpact.length > 0) {
            story += `## 🚨 The Main Event\n`;
            story += `This week was defined by **${highImpact.length} critical shifts**.\n`;
            story += `Most notably, ${highImpact[0].delta.description}, which triggered a cascade affecting ${highImpact[0].impact.join(', ')}.\n\n`;
        } else {
            story += `## ✅ Steady Progress\n`;
            story += `The job is stable. No critical deviations detected.\n\n`;
        }

        // The "Friction"
        if (lowConfidence.length > 0) {
            story += `## ⚠️ Uncertainty & Friction\n`;
            story += `The field is struggling to confirm data in **${lowConfidence.length} areas**.\n`;
            story += `Specific attention is needed on: ${lowConfidence.map(c => c.delta.scope).join(', ')}.\n`;
            story += `*Recommendation: Send a Shadow Agent to verify.*`;
        }

        return story;
    }
}
