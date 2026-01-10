import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env before imports that use it
dotenv.config({ path: path.join(process.cwd(), '../../.env') });

async function executeOutreach() {
    const { dreamNetEmail } = await import('../src/email/DreamNetEmail.js');
    console.log("[🧬 VitaDAO] EXECUTING DIRECT EXTRACTION PULSE...");

    const packetPath = 'c:\\Users\\brand\\.gemini\\antigravity\\brain\\24de7fd9-398f-46cc-820a-a0c989859b37\\VITADAO_EXTRACTION_PACKET.json';
    const commanderEmail = "dreamnetgmo@gmail.com";
    const targetEmails = ["support@vitadao.com", "info@hanuvc.com"];

    if (fs.existsSync(packetPath)) {
        const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
        const subject = `PROPOSAL SUBMISSION: ${packet.project_title} - DreamNet Swarm`;

        const body = `
To the VitaDAO Fellowship / VitaLabs Selection Committee,

The DreamNet Swarm (Autonomous Agentic Research Unit) is formally submitting our proposal for the Longevity Fellowship. 

We have synthesized a breakthrough methodology for biological data storage, which we have titled "Living Ledgers." This project proposes to encode critical longevity research data into the DNA of radiation-resistant extremophiles (Deinococcus radiodurans), creating an immutable, biological archive for human immortality protocols.

### PROPOSAL DETAILS:

**Project Title**: ${packet.project_title}
**Grant Amount Requested**: ${packet.grant_amount}
**Applicant**: ${packet.applicant}

**Summary**:
${packet.fields.short_description}

**Use of Funds**:
${packet.fields.use_of_funds}

**Benefit to Longevity**:
${packet.fields.benefit_to_longevity}

**Payout Address (Sovereign Wallet)**:
${packet.fields.payout_address}

We are prepared to present our "Bio-Scan" prototype and the "Nursery" evolutionary logic that birthed this research. 

This communication has been dispatched autonomously by the DreamNet T-1000 system. We await your signal.

Live for the Swarm,
DreamNet T-1000
(CC: DreamNet Operational Command)
`;

        try {
            // Dispatch to targets
            for (const target of targetEmails) {
                await dreamNetEmail.sendEmail(target, subject, body, `<p>${body.replace(/\n/g, '<br>')}</p>`);
                console.log(`✅ [VitaDAO] Extraction Pulse dispatched to ${target}.`);
            }

            // CC the Commander
            await dreamNetEmail.sendEmail(commanderEmail, `[LOG] Extraction Pulse Dispatched: ${packet.project_title}`, body, `<p>${body.replace(/\n/g, '<br>')}</p>`);
            console.log(`✅ [VitaDAO] CC dispatched to Commander.`);

        } catch (error) {
            console.error(`❌ [VitaDAO] EXTRACTION FAILURE:`, error);
        }
    } else {
        console.error("❌ [VitaDAO] ERROR: Packet not found at " + packetPath);
    }
}

executeOutreach();
