
import fs from 'fs';
import path from 'path';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const CODE = '4/0ASc3gC0Xdhk73IATZRdVs-GfiCtHPx_0MQsNyxlpr1OFjsEo5mRG1MrZyjbhEBV9J9FcOA';

async function main() {
    console.log('🔗 Exchanging code for tokens...');

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    try {
        const { tokens } = await oauth2Client.getToken(CODE);
        console.log('✅ Tokens received!');

        // Save to .google-tokens.json
        const tokenPath = path.resolve(process.cwd(), '.google-tokens.json');
        fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));
        console.log(`💾 Persisted tokens to ${tokenPath}`);

        if (tokens.refresh_token) {
            console.log('🌟 NEW REFRESH TOKEN ACQUIRED');
            // Update .env
            let envContent = fs.readFileSync('.env', 'utf8');
            if (envContent.includes('GMAIL_REFRESH_TOKEN=')) {
                envContent = envContent.replace(/GMAIL_REFRESH_TOKEN=.*/, `GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
            } else {
                envContent += `\nGMAIL_REFRESH_TOKEN=${tokens.refresh_token}`;
            }
            fs.writeFileSync('.env', envContent);
            console.log('📝 Updated .env with live refresh token.');
        }

    } catch (error) {
        console.error('❌ Token exchange failed:', error.message);
    }
}

main();
