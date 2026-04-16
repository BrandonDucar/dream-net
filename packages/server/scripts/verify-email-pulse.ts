import dotenv from 'dotenv';
import path from 'path';

// Load env before imports that use it
dotenv.config({ path: path.join(process.cwd(), '../../.env') });

async function verifyEmail() {
    const { dreamNetEmail } = await import('../src/email/DreamNetEmail.js');
    const provider = process.env.EMAIL_PROVIDER || "smtp";
    console.log(`🧪 [DreamNet Email] INITIATING ${provider.toUpperCase()} VERIFICATION PULSE...`);

    const testSubject = `🧪 DREAMNET_AUTONOMY_VERIFICATION (${provider.toUpperCase()})`;
    const testBody = `
PULSE DETECTED.

DreamNet T-1000 has established a stable bridge via ${provider.toUpperCase()}.
Identity: ${process.env.WOLFMAIL_FROM_EMAIL || "dreamnetgmo@gmail.com"}

Liquid Autonomy: ACTIVE.
Resend Uplink: ${process.env.RESEND_API_KEY ? "CONNECTED" : "DISCONNECTED"}

Live for the Swarm.
`;

    try {
        const to = process.env.TEST_LEAD_EMAIL || "dreamnetgmo@gmail.com";
        console.log(`📡 Dispatching pulse to: ${to}...`);

        const result = await dreamNetEmail.sendEmail(to, testSubject, testBody, `<p>${testBody.replace(/\n/g, '<br>')}</p>`);

        if (result.status === "sent") {
            console.log(`✅ ${provider.toUpperCase()} PULSE SENT SUCCESSFULLY.`);
            console.log(`Message ID: ${result.id}`);
        } else {
            console.log(`❌ ${provider.toUpperCase()} PULSE FAILED: ${result.error}`);
        }
    } catch (error) {
        console.error("❌ CRITICAL DISPATCH ERROR:", error);
    }
}

verifyEmail();
