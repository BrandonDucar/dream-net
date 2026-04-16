
import dotenv from 'dotenv';
import path from 'path';
import { google } from 'googleapis';

// Load env vars from root .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const RECIPIENT = 'greenhouse@chiliz.com';
const SUBJECT = 'Proposal: DreamNet x Chiliz (The Intelligence Layer for SportFi)';
const PROPOSAL_BODY = `Dear Chiliz Greenhouse Team,

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
    console.log('🔱 Operation Greenhouse: Initiating Live Transmission V2...');

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        console.error('❌ CRITICAL ERROR: Missing GMAIL OAuth Credentials in .env');
        process.exit(1);
    }

    try {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'https://developers.google.com/oauthplayground');
        oauth2Client.setCredentials({ refresh_token: refreshToken });

        const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

        // Construct raw email
        const subject = SUBJECT;
        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `From: DreamNet <dreamnetgmo@gmail.com>`,
            `To: ${RECIPIENT}`,
            `Subject: ${utf8Subject}`,
            `Content-Type: text/plain; charset=utf-8`,
            `MIME-Version: 1.0`,
            ``,
            PROPOSAL_BODY,
        ];
        const message = messageParts.join('\n');

        // Encode the message
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        console.log(`📧 Sending email to ${RECIPIENT}...`);

        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log('✅ TRANSMISSION SUCCESSFUL');
        console.log('Message ID:', res.data.id);
        console.log('Status Code:', res.status);

    } catch (error) {
        console.error('❌ TRANSMISSION FAILED:', error);
        if (error.response) {
            console.error('API Error:', error.response.data);
        }
        process.exit(1);
    }
}

main();
