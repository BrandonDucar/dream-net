import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Environment Variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

async function getUrl() {
    // Dynamic import to ensure process.env is populated
    const { googleAuthService } = await import('../src/services/GoogleAuthService.js');

    const authUrl = googleAuthService.getAuthUrl();
    const outputPath = path.resolve(process.cwd(), 'oauth_link.txt');
    fs.writeFileSync(outputPath, authUrl);

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    console.log(`✅ OAuth link written (ClientID: ${clientId ? 'Present' : 'Missing'})`);
}

getUrl();
