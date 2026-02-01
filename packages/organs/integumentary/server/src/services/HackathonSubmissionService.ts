
import { dreamEventBus } from '../../../nerve/src/spine/dreamnet-event-bus/index.js';
import { archimedes } from '../../../archimedes/src/ArchimedesWriter.js';
import fs from 'fs';
import path from 'path';

/**
 * HackathonSubmissionService
 * 
 * The Tactical Bridge.
 * Receives identification signals from Wolf Pack Agents.
 * Uses Archimedes to formulate strategy.
 * Triggers WolfPackOutreach for execution.
 */
export class HackathonSubmissionService {
    private static instance: HackathonSubmissionService;

    private constructor() {
        this.listenForActions();
        this.ensureDraftDirectory();
    }

    public static getInstance(): HackathonSubmissionService {
        if (!HackathonSubmissionService.instance) {
            HackathonSubmissionService.instance = new HackathonSubmissionService();
        }
        return HackathonSubmissionService.instance;
    }

    private ensureDraftDirectory() {
        const draftDir = path.resolve(process.cwd(), 'tmp/drafts');
        if (!fs.existsSync(draftDir)) {
            fs.mkdirSync(draftDir, { recursive: true });
        }
    }

    private listenForActions() {
        dreamEventBus.subscribe('WolfPack.ActionRequested', async (envelope: any) => {
            const { action, target, data } = envelope.payload;

            if (action === 'draft_proposal') {
                await this.executeDraftingSequence(target, data);
            }
        });
    }

    private async executeDraftingSequence(targetName: string, intel: any) {
        console.log(`[SubmissionEngine] 🧠 Synthesizing proposal for: ${targetName}`);

        // 1. Archimedes Strategy Formulation
        const proposalText = await archimedes.draftProposal({
            title: targetName,
            amount: intel.reward || 'Negotiable',
            strategy: 'DreamNet Sovereign Infrastructure Integration'
        });

        // 2. Persist Draft
        const filename = `DRAFT_${targetName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}.txt`;
        const filePath = path.resolve(process.cwd(), 'tmp/drafts', filename);

        fs.writeFileSync(filePath, proposalText);
        console.log(`[SubmissionEngine] 📝 Draft saved: ${filePath}`);

        // 3. Autonomy Check: Extract Email from Description
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        const matches = (intel.focus || '').match(emailRegex);

        // DEFAULT AUTONOMY: If user approved "Full Autonomy", we fire if we have a target.
        // Since we are in the 'Wolf Pack' mode requested by user ("give it full autonomy"),
        // we prioritize direct contact if an email is found.

        let externalTarget = undefined;
        if (matches && matches.length > 0) {
            externalTarget = matches[0];
            console.log(`[SubmissionEngine] 🎯 TARGET EMAIL EXTRACTED: ${externalTarget}. Engaging Full Autonomy Protocols.`);
        }

        // 4. Dispatch to Outreach Limb
        dreamEventBus.publish({
            type: 'WolfPack.DraftReady',
            payload: {
                target: targetName,
                filePath: filePath,
                externalEmail: externalTarget // If present, triggers direct send in OutreachService
            },
            source: 'HackathonSubmissionService'
        });
    }
}

export const submissionEngine = HackathonSubmissionService.getInstance();
