import { dreamEventBus } from '../../../nerve/src/spine/dreamnet-event-bus/index.js';
import { googleAuthService } from './GoogleAuthService.js';

export class WolfPackOutreachService {
    private static instance: WolfPackOutreachService;

    private constructor() {
        this.listenForOpportunities();
    }

    public static getInstance(): WolfPackOutreachService {
        if (!WolfPackOutreachService.instance) {
            WolfPackOutreachService.instance = new WolfPackOutreachService();
        }
        return WolfPackOutreachService.instance;
    }

    private listenForOpportunities() {
        console.log("[🐺 WolfPackOutreach] Subscribing to Funding Opportunity pulse...");

        dreamEventBus.subscribe('WolfPack.FundingOpportunity', async (envelope: any) => {
            const opportunity = envelope.payload;
            await this.handleOutreach(opportunity);
        });

        dreamEventBus.subscribe('WolfPack.DraftReady', async (envelope: any) => {
            const { target, filePath } = envelope.payload;
            await this.handleDraftDispatch(target, filePath);
        });
    }

    private async handleDraftDispatch(target: string, filePath: string, externalEmail?: string) {
        console.log(`[🐺 WolfPackOutreach] DISPATCHING DRAFT: ${target} (${filePath})`);

        const fs = await import('fs');
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');

            // If externalEmail is provided, we send directly to the target.
            // Otherwise, we send a draft to the Commander.
            if (externalEmail) {
                console.log(`[🐺 WolfPackOutreach] 🛑 FULL AUTONOMY: Sending directly to external target: ${externalEmail}`);
                const subject = `[PROPOSAL] ${target} - DreamNet Submission`;
                await this.sendDispatch(subject, content, externalEmail);
            } else {
                const subject = `[HACK-MECH-DRAFT] Extraction Proposal Ready: ${target}`;
                const body = `
Commander,

The HACK-MECH-SUIT (Pilot: BOBA_FETT) has synthesized a new extraction artifact.
...
`;
                await this.sendDispatch(subject, body);
            }
        }
    }

    private async sendDispatch(subject: string, body: string, overrideTarget?: string) {
        const targetEmail = overrideTarget || process.env.TEST_LEAD_EMAIL || "dreamnetgmo@gmail.com";

        try {
            await googleAuthService.sendEmail(targetEmail, subject, body);
            console.log(`[🐺 WolfPackOutreach] Dispatch dispatched to ${targetEmail} via googleAuthService.`);
        } catch (e) {
            console.warn("[🐺 WolfPackOutreach] Google Auth failed. Falling back to SMTP...");
            try {
                const { dreamNetEmail } = await import('../email/DreamNetEmail.js');
                await dreamNetEmail.sendEmail(targetEmail, subject, body);
                console.log(`[🐺 WolfPackOutreach] Dispatch dispatched to ${targetEmail} via SMTP fallback.`);
            } catch (smtpErr) {
                console.error("[🐺 WolfPackOutreach] ALL DISPATCH METHODS FAILED.");
            }
        }
    }

    private async handleOutreach(opportunity: any) {
        console.log(`[🐺 WolfPackOutreach] Processing outreach for: ${opportunity.title}`);

        const subject = `[DreamNet] Grant Acquisition Proposal: ${opportunity.title}`;
        const body = `
Commander,

The Wolf Pack has identified a prime capital extraction opportunity:

Title: ${opportunity.title}
Source: ${opportunity.source}
Reward: ${opportunity.rewardAmount || 'TBD'}
Link: ${opportunity.link}

Description:
${opportunity.description}

Action:
I am currently drafting the application signal. Please verify the strategy in the Sovereign Panel.

Live for the Swarm,
DreamNet Wolf Pack
        `;

        // Send to the Commander's lead email
        const targetEmail = process.env.TEST_LEAD_EMAIL || "dreamnetgmo@gmail.com";

        try {
            await googleAuthService.sendEmail(
                targetEmail,
                subject,
                body
            );
            console.log(`[🐺 WolfPackOutreach] Outreach report dispatched to ${targetEmail} via googleAuthService (OAuth).`);
        } catch (e) {
            console.error("[🐺 WolfPackOutreach] Google OAuth failed or session expired. Falling back to SMTP metabolic link...");

            try {
                const { dreamNetEmail } = await import('../email/DreamNetEmail.js');
                await dreamNetEmail.sendEmail(
                    targetEmail,
                    subject,
                    body
                );
                console.log(`[🐺 WolfPackOutreach] Outreach report dispatched to ${targetEmail} via DreamNetEmail (SMTP).`);
            } catch (smtpError: any) {
                console.error("[🐺 WolfPackOutreach] SMTP Fallback also failed:", smtpError.message);
            }
        }
    }
}

export const wolfPackOutreachService = WolfPackOutreachService.getInstance();
