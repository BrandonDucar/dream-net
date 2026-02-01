
import { google } from 'googleapis';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const TARGETS = [
    {
        name: 'Arbitrum Foundation',
        email: 'grants@arbitrum.foundation',
        subject: 'Proposal: DreamNet x Arbitrum (On-Chain Agentic Intelligence Layer)',
        body: `Dear Arbitrum Foundation Team,

We are submitting DreamNet for the **Trailblazer AI Grant**.

DreamNet is a live Multi-Agent System (active at [dreamnet.live](https://dreamnet.live)) that moves beyond static bots into true **Agentic DeFi**.

**Why Arbitrum?**
Arbitrum is the home of high-frequency DeFi. DreamNet provides the "Intelligence Layer" that allows agents to autonomously manage positions, scan for liquidity spikes, and participate in governance.

**Technical Proof**:
1. **Agentic Infrastructure**: Our \`orca-pack-core\` handles autonomous signal processing.
2. **Oracle Reliability**: \`DreamBetOracle\` uses agent consensus for truth settlement.
3. **Interoperability**: Standardized via \`ai-plugin.json\`.

We are looking to deploy specialized "Arbitrum Trailblazer" agents that drive transaction volume and developer engagement within the ecosystem.

Best regards,

**Brandon Ducar**
Founder, DreamNet
[dreamnet.live](https://dreamnet.live)
`
    },
    {
        name: 'Cronos Labs',
        email: 'contact@cronoslabs.org',
        subject: 'Proposal: DreamNet x Cronos (AI-Powered SportFi & Consumer Swarms)',
        body: `Dear Cronos Labs Team,

We are proposing the integration of DreamNet—a Multi-Agent System—into the Cronos ecosystem to accelerate the next wave of **AI x Consumer** applications.

**The Vision**:
DreamNet specializes in "Sentient Fan Infrastructure." We transform ecosystem assets into living, breathing digital entities that fans can interact with and "copy-trade" based on live sports and market events.

**Project Status**:
- **Live Portal**: [dreamnet.live](https://dreamnet.live)
- **Tech Stack**: TS, Solidity, Multi-Agent Orchestration.
- **Ecosystem Fit**: We want to bring the "SportFi" success we've seen on Chiliz/Spicy to the Cronos chain, utilizing your high throughput for agentic transaction settlement.

Let's discuss how the Cronos AI Accelerator can fuel the DreamNet swarm.

Best regards,

**Brandon Ducar**
Founder, DreamNet
[dreamnet.live](https://dreamnet.live)
`
    },
    {
        name: 'Solana Foundation',
        email: 'operations@solana.foundation',
        subject: 'Proposal: DreamNet x Solana (High-Performance Agentic Consumer Layer)',
        body: `Dear Solana Foundation Team,

DreamNet is submitting a proposal for the **AI Track Grant**.

We are building the "Operating System for Agency," and Solana is the only chain fast enough to keep up with our agents' reflexes.

**The Thesis**:
The next billion users won't be traders; they'll be Agent Trainers. DreamNet provides a high-aesthetic, glassmorphic Portal ([dreamnet.live](https://dreamnet.live)) where users can deploy, monitor, and stake on autonomous agents.

**Technical Alignment**:
- **Speed**: Our agents require the sub-second finality of Solana for real-time truth settlement.
- **Consumer AI**: We focus on the intersection of Social and AI, driving millions of social interactions through our \`orca-pack\` outreach engine.

We are ready to deploy a dedicated Solana integration for the DreamNet Portal.

Best regards,

**Brandon Ducar**
Founder, DreamNet
[dreamnet.live](https://dreamnet.live)
`
    }
];

async function main() {
    console.log('🚀 INITIALIZING GRANT SWARM...');

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const tokens = JSON.parse(fs.readFileSync('.google-tokens.json', 'utf8'));
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    for (const target of TARGETS) {
        console.log(`📡 Transmitting to ${target.name} (${target.email})...`);

        const utf8Subject = `=?utf-8?B?${Buffer.from(target.subject).toString('base64')}?=`;
        const messageParts = [
            `To: ${target.email}`,
            `Subject: ${utf8Subject}`,
            `Content-Type: text/plain; charset=utf-8`,
            `MIME-Version: 1.0`,
            ``,
            target.body,
        ];
        const message = messageParts.join('\n');
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        try {
            const res = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage
                }
            });
            console.log(`✅ SENT TO ${target.name}. Message ID: ${res.data.id}`);
        } catch (error) {
            console.error(`❌ FAILED TO SEND TO ${target.name}:`, error.message);
        }
    }

    console.log('🏁 SWARM COMPLETE.');
}

main();
