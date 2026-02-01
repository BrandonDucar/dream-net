export interface MailerConfig {
  fromName: string;
  fromEmail: string;
  // SMTP configuration (Gmail-compatible)
  host: string;       // e.g. "smtp.gmail.com"
  port: number;      // e.g. 465 or 587
  secure: boolean;   // true for 465, false for 587
  user: string;      // SMTP username
  pass: string;      // SMTP password or app password
}

export interface MailSendResult {
  success: boolean;
  error?: string;
}

