
import { google } from 'googleapis';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

async function checkReplies() {
    console.log('📡 [DreamNet] Checking frequencies for grant responses...');

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, 'https://developers.google.com/oauthplayground');
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

    try {
        const { token } = await oAuth2Client.getAccessToken();
        oAuth2Client.setCredentials({ access_token: token });
    } catch (err) {
        console.error('❌ [Auth] Failed to refresh token:', err.message);
        return;
    }

    const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

    try {
        const res = await gmail.users.messages.list({
            userId: 'me',
            q: 'is:unread',
            maxResults: 10
        });

        const messages = res.data.messages || [];
        if (messages.length === 0) {
            console.log('🔇 [Silence] No unread messages detected.');
            return;
        }

        console.log(`📩 [Signal] ${messages.length} unread signal(s) detected.\n`);

        for (const msg of messages) {
            const detail = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id
            });

            const headers = detail.data.payload.headers;
            const subject = headers.find(h => h.name === 'Subject')?.value;
            const from = headers.find(h => h.name === 'From')?.value;

            console.log(`--- [MESSAGE_${msg.id}] ---`);
            console.log(`FROM: ${from}`);
            console.log(`SUBJ: ${subject}`);
            console.log(`SNIP: ${detail.data.snippet}`);
            console.log('---------------------------\n');
        }
    } catch (err) {
        console.error('❌ [Gmail] Check failed:', err.message);
    }
}

checkReplies();
