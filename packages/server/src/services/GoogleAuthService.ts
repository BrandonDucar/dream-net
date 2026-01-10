import { google } from 'googleapis';
import { dreamEventBus } from '../../../nerve/src/spine/dreamnet-event-bus/index.js';
import fs from 'fs';
import path from 'path';

/**
 * GoogleAuthService
 * Handles OAuth 2.0 flow for Gmail outreach.
 * Enabled for "Scan-In" (Passkey/Biometric) authentication.
 */
export class GoogleAuthService {
    private static instance: GoogleAuthService;
    private oauth2Client: any;
    private tokenPath: string;

    private constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_OAUTH_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_OAUTH_CLIENT_SECRET;

        console.log(`[📧 GoogleAuth] Initializing Service. ClientID present: ${!!clientId}`);

        // Prioritize localhost callback for "Scan-In" ritual, fallback to .env or OOB
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

        this.oauth2Client = new google.auth.OAuth2(
            clientId,
            clientSecret,
            redirectUri
        );

        this.tokenPath = path.resolve(process.cwd(), '.google-tokens.json');
        this.loadTokens();
    }

    public static getInstance(): GoogleAuthService {
        if (!GoogleAuthService.instance) {
            GoogleAuthService.instance = new GoogleAuthService();
        }
        return GoogleAuthService.instance;
    }

    private loadTokens() {
        if (fs.existsSync(this.tokenPath)) {
            const tokens = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
            this.oauth2Client.setCredentials(tokens);
            console.log("[📧 GoogleAuth] Existing tokens loaded from .google-tokens.json");
        } else if (process.env.GOOGLE_REFRESH_TOKEN) {
            this.oauth2Client.setCredentials({
                refresh_token: process.env.GOOGLE_REFRESH_TOKEN
            });
            console.log("[📧 GoogleAuth] Tokens loaded from environment variables.");
        }
    }

    public saveTokens(tokens: any) {
        fs.writeFileSync(this.tokenPath, JSON.stringify(tokens, null, 2));
        this.oauth2Client.setCredentials(tokens);
        console.log("[📧 GoogleAuth] Tokens persisted to .google-tokens.json");
    }

    public getAuthUrl(): string {
        const scopes = [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/userinfo.email'
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent' // Force refresh token generation
        });
    }

    public async setCode(code: string) {
        const { tokens } = await this.oauth2Client.getToken(code);
        this.saveTokens(tokens);
        return tokens;
    }

    public async sendEmail(to: string, subject: string, body: string, from?: string) {
        console.log(`[📧 GoogleAuth] Dispatching signal to ${to}...`);

        const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

        const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const messageParts = [
            `From: ${from || 'DreamNet <dreamnetgmo@gmail.com>'}`,
            `To: ${to}`,
            `Content-Type: text/plain; charset=utf-8`,
            `MIME-Version: 1.0`,
            `Subject: ${utf8Subject}`,
            '',
            body
        ];
        const message = messageParts.join('\n');

        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        try {
            await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage
                }
            });
            console.log("[📧 GoogleAuth] Outreach signal dispatched successfully.");
        } catch (error: any) {
            if (error.code === 401) {
                console.error("[📧 GoogleAuth] SESSION EXPIRED. User must 'Scan-In' again.");
                dreamEventBus.publish({
                    type: 'WolfPack.AuthRequired',
                    payload: { url: this.getAuthUrl() },
                    source: 'GoogleAuthService'
                });
            }
            throw error;
        }
    }
}

export const googleAuthService = GoogleAuthService.getInstance();
