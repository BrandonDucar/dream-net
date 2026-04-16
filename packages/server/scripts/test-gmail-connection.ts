import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function verifyGmailSmtp() {
    console.log("🐺 DREAMNET: GMAIL SMTP CONNECTION VERIFICATION 🩸");
    console.log("-------------------------------------------------");

    try {
        // Use proper file:// URL for dynamic import on Windows
        const mailerPath = path.resolve(__dirname, '../../../packages/wolfpack-mailer-core/index.js');
        const mailerUrl = pathToFileURL(mailerPath).href;
        console.log(`[📧 Gmail] Importing mailer core from: ${mailerUrl}`);

        const { WolfPackMailerCore } = await import(mailerUrl);

        console.log("[📧 Gmail] Initializing metabolic mailer from environment...");
        const config = WolfPackMailerCore.createMailerFromEnv();

        console.log(`[📧 Gmail] User: ${config.user}`);
        console.log(`[📧 Gmail] Pass: ${config.pass ? '****' : 'MISSING'}`);

        const targetEmail = process.env.TEST_LEAD_EMAIL || "dreamnetgmo@gmail.com";
        const subject = "🐺 DreamNet: Gmail SMTP Verification Signal 🩸";
        const body = "The metabolic link to Gmail SMTP has been verified.";

        const result = await WolfPackMailerCore.sendMail(
            config,
            targetEmail,
            subject,
            body
        );

        if (result.success) {
            console.log(`\n✅ SUCCESS: Metabolic signal dispatched to ${targetEmail}.`);
            console.log("The Gmail connection is usable as is. 🩸");
        } else {
            console.error(`\n❌ FAILED: ${result.error}`);
        }

    } catch (e: any) {
        console.error("\n❌ FATAL ERROR:", e.message);
    } finally {
        process.exit(0);
    }
}

verifyGmailSmtp().catch(e => {
    console.error("Fatal verification error:", e);
    process.exit(1);
});
