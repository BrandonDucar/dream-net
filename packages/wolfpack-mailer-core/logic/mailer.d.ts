import { MailerConfig, MailSendResult } from "../types";
/**
 * Create mailer configuration from environment variables.
 */
export declare function createMailerFromEnv(): MailerConfig;
/**
 * Send an email via SMTP.
 */
export declare function sendMail(config: MailerConfig, to: string, subject: string, body: string): Promise<MailSendResult>;
