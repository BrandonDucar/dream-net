import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../../.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function diagnostic() {
    console.log("🧪 [Resend Diagnostic] Initiating isolation pulse...");

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'brandonducar1234@gmail.com',
            subject: '🧪 DREAMNET DIAGNOSTIC PULSE',
            html: '<strong>LIQUID AUTONOMY: ISO-TEST</strong>'
        });

        if (error) {
            console.error("❌ RESEND API ERROR:", error);
        } else {
            console.log("✅ RESEND API SUCCESS:", data);
            console.log("⚠️ If you still see nothing, check if brandonducar1234@gmail.com is the email that created the Resend API key. Resend 'onboarding' only sends to the signup email.");
        }
    } catch (e) {
        console.error("❌ CRITICAL FAILURE:", e);
    }
}

diagnostic();
