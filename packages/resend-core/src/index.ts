/**
 * Resend Email Integration Core
 * Modern email API for transactional emails
 */

export interface ResendConfig {
  apiKey: string;
}

export interface ResendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string | string[];
  tags?: Array<{ name: string; value: string }>;
}

export interface ResendEmailResponse {
  id: string;
}

export class ResendClient {
  private apiKey: string;
  private baseUrl = 'https://api.resend.com';

  constructor(config: ResendConfig) {
    this.apiKey = config.apiKey;
  }

  async sendEmail(options: ResendEmailOptions): Promise<ResendEmailResponse> {
    const response = await fetch(`${this.baseUrl}/emails`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: options.from,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
        reply_to: options.replyTo ? (Array.isArray(options.replyTo) ? options.replyTo : [options.replyTo]) : undefined,
        tags: options.tags,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async sendBatch(emails: ResendEmailOptions[]): Promise<ResendEmailResponse[]> {
    const results = await Promise.all(emails.map(email => this.sendEmail(email)));
    return results;
  }
}

export function createResendClient(): ResendClient | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Resend] ⚠️  RESEND_API_KEY not set');
    return null;
  }

  return new ResendClient({ apiKey });
}

let _resendClient: ResendClient | null = null;

export function getResendClient(): ResendClient | null {
  if (!_resendClient) {
    _resendClient = createResendClient();
  }
  return _resendClient;
}

