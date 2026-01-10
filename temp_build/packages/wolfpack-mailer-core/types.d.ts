export interface MailerConfig {
    fromName: string;
    fromEmail: string;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
}
export interface MailSendResult {
    success: boolean;
    error?: string;
}
