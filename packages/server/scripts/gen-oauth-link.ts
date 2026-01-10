import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment Variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;

if (clientId) {
    const scopes = [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/userinfo.email'
    ];
    const redirectUri = 'urn:ietf:wg:oauth:2.0:oob';

    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `access_type=offline&` +
        `scope=${encodeURIComponent(scopes.join(' '))}&` +
        `prompt=consent&` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}`;

    console.log(`DREAMNET_LINK_START[${url}]DREAMNET_LINK_END`);
} else {
    console.log(`\n❌ ERROR: Credentials missing.`);
}
