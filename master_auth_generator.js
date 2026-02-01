
import fs from 'fs';
import path from 'path';

function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        const [key, ...val] = line.split('=');
        if (key && val.length) env[key.trim()] = val.join('=').trim().replace(/^["']|["']$/g, '');
    });
    return env;
}

const env = loadEnv();
const clientId = env.GOOGLE_CLIENT_ID || env.GOOGLE_OAUTH_CLIENT_ID;
const redirectUri = env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/gmail.modify'
];

const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `access_type=offline&` +
    `scope=${encodeURIComponent(scopes.join(' '))}&` +
    `prompt=consent&` +
    `response_type=code&` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}`;

// Print in chunks of 100 to avoid elision
for (let i = 0; i < url.length; i += 100) {
    console.log(url.substring(i, i + 100));
}
