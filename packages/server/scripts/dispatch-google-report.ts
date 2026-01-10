import { dreamNetEmail } from '../src/email/DreamNetEmail.js';
import fs from 'fs';
import path from 'path';

async function dispatchReport() {
    console.log("[📧 GoogleDispatch] Igniting Outreach Pulse...");

    const draftPath = 'c:\\Users\\brand\\.gemini\\antigravity\\brain\\24de7fd9-398f-46cc-820a-a0c989859b37\\GOOGLE_OUTREACH_DRAFT.md';
    const targetEmail = 'support@google.com'; // Generalized target for the report

    if (fs.existsSync(draftPath)) {
        const content = fs.readFileSync(draftPath, 'utf8');
        const subject = "[URGENT] Antigravity Extension Download Failure & Gemini API 404 Anomalies";

        try {
            await dreamNetEmail.sendEmail(targetEmail, subject, content);
            console.log(`✅ [GoogleDispatch] SUCCESS: Bug Report dispatched to ${targetEmail}.`);
        } catch (error) {
            console.error(`❌ [GoogleDispatch] FAILURE:`, error);
            process.exit(1);
        }
    } else {
        console.error("❌ [GoogleDispatch] ERROR: Draft not found at " + draftPath);
        process.exit(1);
    }
}

dispatchReport();
