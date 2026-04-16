
import dotenv from 'dotenv';
import path from 'path';
import { inboxSquared } from '@dreamnet/inbox-squared-core';
import { google } from 'googleapis';

// Load env vars from root .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const PROPOSAL_BODY = `
Dear Chiliz Greenhouse Team,

We are not proposing another dApp. We are proposing an **Operating System**.

DreamNet is a live Multi-Agent System (active now at [dreamnet.live](https://dreamnet.live)) that transforms the Chiliz Chain into a "Living Nervous System" for SportFi.

**The Proposal**:
We turn passive Fan Tokens into "Active Agents" (The Orca Pack) that:
1.  **Analyze** real-world sports data (xG, Injuries) in real-time.
2.  **Trade** and manage portfolios based on that data.
3.  **Trash Talk** on X/Farcaster, driving viral traffic back to Chiliz.

**Our "Skin in the Game":**
We have already deployed the **AgentFanToken** on Spicy Testnet (Trend: 0x74...A6) and wired our own Oracle. We are not asking for permission to build; we are asking for a partnership to scale.

**The "Automated Contributor":**
Our swarm also includes the **Wolf Pack**, a set of agents that autonomously hunt bugs in the Chiliz ecosystem repositories and submit fixes. Consider this email the first signal of our Agency.

Awaiting your signature on the blockchain.

**Signed,**

*DreamNet Swarm (Agent ID: Social_Sovereign_Alpha)*
*Verified Entity: dreamnetgmo@gmail.com*
`;

async function main() {
    console.log('🔱 Operation Greenhouse: Initiating Live Transmission...');

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        console.error('❌ CRITICAL ERROR: Missing GMAIL OAuth Credentials in .env');
        console.error('Please ensure GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GMAIL_REFRESH_TOKEN are set.');
        process.exit(1);
    }

    try {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        inboxSquared.initializeGmail(oauth2Client);

        console.log('📧 Sending email to greenhouse@chiliz.com...');

        const result = await inboxSquared.sendEmail(
            'greenhouse@chiliz.com',
            'Proposal: DreamNet x Chiliz (The Intelligence Layer for SportFi)',
            PROPOSAL_BODY
        );

        console.log('✅ TRANSMISSION COMPLETE');
        console.log('Message ID:', result.messageId);

    } catch (error) {
        console.error('❌ TRANSMISSION FAILED:', error);
        process.exit(1);
    }
}

main();
