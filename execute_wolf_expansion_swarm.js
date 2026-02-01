
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { createMimeMessage } from 'mimetext';
import process from 'process';

// Load environment variables
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const USER_EMAIL = 'dreamnetgmo@gmail.com';

const TARGETS = [
    {
        org: 'Coinbase Ventures / Base Ecosystem Fund',
        email: 'ventures@coinbase.com',
        subject: 'DreamNet // Agentic Ecosystem Grant Application',
        body: `To the Coinbase Ventures & Base Ecosystem Team,

We are DreamNet.

We are building the **Sovereign Agentic Layer** on Base. 
While others build chat bots, we are building the "Dream Cartel"—an autonomous guild of AI agents that own their own specialized "Spikes" (Sensory Organs) and settle truth on-chain.

**Why Base?**
DreamNet aligns perfectly with the "Builder" ethos. We are not asking for permission; we are deploying value.
- **GrantHunter Module**: Verified.
- **RepoHunter Module**: Verified.
- **Sovereign Sovereignty**: Verified.

We are formally requesting consideration for the **Base Ecosystem Fund** (Pre-Seed) or a **Builder Grant** to accelerate our "Wolf Pack" module—an autonomous bounty hunting squad living on Base L2.

**Metrics:**
- Status: Live Alpha
- Architecture: Swarm Intelligence (DreamEventBus)
- Settlement: Base L2 (Planned)

We await your signal.

// 0xBRANDON_DUCAR
// Architect, DreamNet
// dreamnet.live`
    },
    {
        org: 'Base Protocol',
        email: 'grants@base.org',
        subject: 'DreamNet // Base Builder Grant (Retroactive)',
        body: `Hello Base Team,

We are submitting DreamNet for a **Builder Grant**.

**The Build:**
DreamNet is an autonomous agent operating system (OS) designed to weaponize local compute for on-chain action. We have successfully deployed "Vitality v2"—a telemetry system that pipes real-time shark tracking and global flight data into an on-chain nervous system.

**The Ask:**
We are requesting a Builder Grant to fund the **Base L2 Oracle**, allowing our agents to settle these "Sensory Spikes" directly to Base mainnet, creating a "Proof of Reality" market.

The Wolf Pack is hunting on Base. Let's feed them.

// 0xBRANDON_DUCAR
// Architect, DreamNet`
    },
    {
        org: 'Merkle Manufactory (Farcaster)',
        email: 'team@merklemanufactory.com',
        subject: 'DreamNet x Farcaster // Frame Integration Proposal',
        body: `To the Farcaster / Merkle Team,

We are designing **The Dream Frame**.

DreamNet is an agentic OS. We are building a Farcaster Frame that allows users to "summon" a DreamNet Agent directly into their feed to perform a specific "Hunt" (Repo Scan or Grant Audit) without leaving Warpcast.

We are inquiring about **Bountycaster** opportunities or direct developer incentives for complex, agent-backed Frames.

We don't just post. We execute.

// 0xBRANDON_DUCAR
// Architect, DreamNet`
    },
    {
        org: 'Polygon Grants (Farcaster Innovator)',
        email: 'grants@polygon.technology',
        subject: 'DreamNet // Farcaster Frame Innovator Application',
        body: `Polygon Grants Team,

We detected your signal regarding the **500k MATIC Farcaster Innovator Program**.

DreamNet is tailored for this. We are building the bridge between **Polygon PoS** (for cheap, fast agent coordination) and **Farcaster Frames** (for user interaction).

**Concept:**
"The Bounty Frame" - A Frame where DAOs can stake bounties (on Polygon) and DreamNet agents autonomously claim and execute them, proving work via GitHub API integration.

We are ready to deploy.

// 0xBRANDON_DUCAR
// Architect, DreamNet`
    }
];

async function sendSwarm() {
    console.log('🐺 [WolfPack] Initiating Expansion Swarm...');

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    // Force refresh to ensure valid access token
    try {
        const { token } = await oAuth2Client.getAccessToken();
        oAuth2Client.setCredentials({ access_token: token });
        console.log('🔑 [Auth] Token Refreshed. Access Granted.');
    } catch (err) {
        console.error('❌ [Auth] Failed to refresh token:', err.message);
        return;
    }

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    for (const target of TARGETS) {
        console.log(`\n🎯 Targeting: ${target.org} <${target.email}>`);

        try {
            const msg = createMimeMessage();
            msg.setSender({ name: 'DreamNet GMO', addr: USER_EMAIL });
            msg.setRecipient(target.email);
            msg.setSubject(target.subject);
            msg.setMessage('text/plain', target.body);

            const encodedMessage = Buffer.from(msg.asRaw()).toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            const res = await gmail.users.messages.send({
                userId: 'me',
                requestBody: { raw: encodedMessage }
            });

            console.log(`✅ [TRANSMITTED] Message ID: ${res.data.id}`);
            console.log(`   - Status: 200 OK`);
            console.log(`   - To: ${target.email}`);
        } catch (error) {
            console.error(`❌ [FAILED] Could not transmit to ${target.org}:`, error.message);
        }
    }

    console.log('\n🐺 [WolfPack] Swarm Execution Complete.');
}

sendSwarm();
