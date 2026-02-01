
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const RECIPIENT = 'greenhouse@chiliz.com';
const CC = 'alex@chiliz.com';
const SUBJECT = 'Proposal: DreamNet x Chiliz (The Intelligence Layer for SportFi)';
const BODY = `Dear Chiliz Greenhouse Team,

We are not proposing another dApp. We are proposing an **Operating System for Agency**.

DreamNet is a live Multi-Agent System (currently active at [dreamnet.live](https://dreamnet.live)) that transforms the Chiliz Chain into a "Living Nervous System" for SportFi.

**The Thesis**:
Fan Tokens ($BAR, $CITY) are currently "Read-Only" assets. DreamNet makes them "Read-Write" by enabling AI Agents to hold, trade, and act based on real-world sports data.

**Technical Progress (Ready for Audit)**:
1. **Agent Fan Tokens**: Already deployed on **Spicy Testnet** at \`0x740f36295D7E474c2E4a26C92Dd116f72eb575A6\`.
2. **Sports Oracle**: Our \`DreamBetOracle\` is live, aggregating match data (xG, goals) via a consensus-of-agents.
3. **Orca Pack**: Our social swarm is ready to drive viral "Team Rivalry" traffic (Barça Bot vs. Real Madrid Bot) back to the Chiliz Chain.

**The Automated Contributor**:
Our swarm includes the **Wolf Pack**, agents that autonomously scan Chiliz ecosystem repos for bug patterns and optimizations, turning maintenance into an automated revenue stream.

We are not asking for permission to build; we are asking for a partnership to scale the "Intelligence Layer" of the Chiliz ecosystem.

I've attached the full technical breakdown to our internal docs. I look forward to your signature on the blockchain.

Best regards,

**Brandon Ducar**
Founder, DreamNet
[dreamnet.live](https://dreamnet.live)
[dreamnetgmo@gmail.com](mailto:dreamnetgmo@gmail.com)
`;

async function main() {
    console.log('📝 Creating Chiliz Greenhouse Draft...');

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    // Load tokens from file
    const tokens = JSON.parse(fs.readFileSync('.google-tokens.json', 'utf8'));
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Construct MIME message
    const utf8Subject = `=?utf-8?B?${Buffer.from(SUBJECT).toString('base64')}?=`;
    const messageParts = [
        `To: ${RECIPIENT}`,
        `Cc: ${CC}`,
        `Subject: ${utf8Subject}`,
        `Content-Type: text/plain; charset=utf-8`,
        `MIME-Version: 1.0`,
        ``,
        BODY,
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    try {
        const res = await gmail.users.drafts.create({
            userId: 'me',
            requestBody: {
                message: {
                    raw: encodedMessage
                }
            }
        });
        console.log('✅ CHILIZ DRAFT CREATED SUCCESSFULLY');
        console.log('Draft ID:', res.data.id);
        console.log('View it now at: https://mail.google.com/mail/u/0/#drafts');
    } catch (error) {
        console.error('❌ Failed to create draft:', error.message);
    }
}

main();
