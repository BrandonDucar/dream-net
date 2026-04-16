
import { AnalystInsight } from '../types.js';
import { AnalystStore } from '../store/analystStore.js';

export interface GrantOpportunity {
    name: string;
    organization: string;
    type: 'AI' | 'Data' | 'Consumer' | 'DeFi';
    amountText: string;
    contactEmail?: string;
    applicationLink: string;
    requirements: string[];
}

/**
 * 🐺 Wolf Pack Grant Hunter
 * Scouts the web for new grant opportunities and maps them to DreamNet's DNA.
 */
export class GrantHunter {

    /**
     * Scouts for new grant opportunities based on target ecosystems.
     * In production, this would use a Search API (e.g., Google Search, Webz.io).
     */
    static async scoutOpportunities(ecosystems: string[]): Promise<GrantOpportunity[]> {
        console.log(`[GrantHunter] 🐺 Scouting for grants in: ${ecosystems.join(', ')}...`);

        // Static data reflecting current Hitlist Tier 1 & 3
        const opportunities: GrantOpportunity[] = [
            {
                name: 'Arbitrum Trailblazer AI',
                organization: 'Arbitrum Foundation',
                type: 'AI',
                amountText: 'Up to $10,000',
                contactEmail: 'grants@arbitrum.foundation',
                applicationLink: 'https://arbitrum.questbook.app/',
                requirements: ['On-chain AI integration', 'Open-source code']
            },
            {
                name: 'Solana AI Innovation',
                organization: 'Solana Foundation',
                type: 'AI',
                amountText: '$1,000,000 Total Pool',
                contactEmail: 'operations@solana.foundation',
                applicationLink: 'https://solana.org/grants-funding',
                requirements: ['Consumer focus', 'Public accessibility']
            },
            {
                name: 'Cronos AI Accelerator',
                organization: 'Cronos Labs',
                type: 'Consumer',
                amountText: 'Funding + Mentorship',
                contactEmail: 'contact@cronoslabs.org',
                applicationLink: 'https://cronos.org/accelerator',
                requirements: ['Early stage', 'Web3 x AI utility']
            }
        ];

        // Filter and convert to Insights
        opportunities.forEach(opp => {
            const insight: AnalystInsight = {
                id: `insight-grant-${opp.organization.toLowerCase().replace(/\s+/g, '-')}`,
                type: 'opportunity',
                source: 'wolf-scout',
                confidence: 0.9,
                title: `${opp.name} Grant Detected`,
                summary: `${opp.organization} is offering ${opp.amountText} for ${opp.type} projects.`,
                description: `Requirements: ${opp.requirements.join(', ')}. Actionable via ${opp.contactEmail || opp.applicationLink}`,
                actionable: true,
                suggestedAction: `Draft customized proposal to ${opp.contactEmail || 'the portal'}.`,
                data: opp,
                createdAt: Date.now()
            };

            AnalystStore.addInsight(insight);
            console.log(`[GrantHunter] 🎯 Insight captured for ${opp.name}`);
        });

        return opportunities;
    }
}
