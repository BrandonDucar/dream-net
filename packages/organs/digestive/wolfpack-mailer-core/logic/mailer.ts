import nodemailer from "nodemailer";
import { MailerConfig, MailSendResult } from '../types.js';

/**
 * Create mailer configuration from environment variables.
 */
export function createMailerFromEnv(): MailerConfig {
  const fromName = process.env.WOLFMAIL_FROM_NAME || "DreamNet Wolf Pack";
  const fromEmail = process.env.WOLFMAIL_FROM_EMAIL || "dreamnetgmo@gmail.com";

  const host = process.env.WOLFMAIL_SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.WOLFMAIL_SMTP_PORT || 465);
  const secure = (process.env.WOLFMAIL_SMTP_SECURE || "true") === "true";

  const user = process.env.WOLFMAIL_SMTP_USER || fromEmail;
  const pass = process.env.WOLFMAIL_SMTP_PASS || "";

  if (!pass) {
    throw new Error("WOLFMAIL_SMTP_PASS is not set");
  }

  return { fromName, fromEmail, host, port, secure, user, pass };
}

/**
 * Send an email via SMTP.
 */
export async function sendMail(
  config: MailerConfig,
  to: string,
  subject: string,
  body: string
): Promise<MailSendResult> {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    const from = `"${config.fromName}" <${config.fromEmail}>`;

    await transporter.sendMail({
      from,
      to,
      subject,
      text: body,
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: String(err) };
  }
}

