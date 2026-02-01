
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const RECIPIENT = 'cloud-startups-support@google.com'; // General portal for startups
const SUBJECT = 'Proposal: DreamNet - The Autonomous Intelligence Layer (Google for Startups Application)';
const BODY = `Hi Google for Startups Team,

I am writing to submit DreamNet for the Cloud Program.

DreamNet is a Multi-Agent System (MAS) built on Google Cloud Platform, currently live at [dreamnet.live](https://dreamnet.live). We are transforming the intersection of Blockchain and AI by building a "Living Nervous System" for SportFi and Social Agency.

**Why Google?**
Our architecture is built on the belief that Agency requires scale. We utilize:
1.  **GCP Compute Engine** for our persistent agent swarms (Orca Pack).
2.  **Gmail API** as our agents' primary communication nervous system.
3.  **Cloud Pub/Sub** for real-time sensory reflex loops.

**The Request**:
We are looking to transition to the "Scale" tier of the Google for Startups program to support our 2025 expansion, specifically for:
*   High-concurrency Agent processing.
*   Cross-region redundancy for our Oracle system.
*   Advanced Vector DB hosting on Cloud SQL.

Consider this email a demonstration of our technical integration—it was drafted autonomously by a DreamNet Agent via our authorized GCP OAuth pipeline.

I'd love to discuss how DreamNet can showcase the power of Google's AI Infrastructure in the Web3 space.

Best regards,

**Brandon Ducar**
Founder, DreamNet
[dreamnet.live](https://dreamnet.live)
[dreamnetgmo@gmail.com](mailto:dreamnetgmo@gmail.com)
`;

async function main() {
    console.log('📝 Creating Google for Startups Draft...');

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
        console.log('✅ DRAFT CREATED SUCCESSFULLY');
        console.log('Draft ID:', res.data.id);
        console.log('View it now at: https://mail.google.com/mail/u/0/#drafts');
    } catch (error) {
        console.error('❌ Failed to create draft:', error.message);
    }
}

main();
