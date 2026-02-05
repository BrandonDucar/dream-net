import { institutionManager } from './Institution.js';
import { prepSchool } from './PrepSchool.js';
import { theResonance } from './HumanizerAgent.js';

async function inaugurate() {
    console.log("🏛️  DreamNet Prep School Inauguration Sequence Initiated...");

    // 1. Appoint Staff
    institutionManager.appoint("pippin-soul", "HEADMASTER");
    institutionManager.appoint("the-resonance", "DEAN", "Vibe & Purgation");
    institutionManager.appoint("formicidae-tunneler", "DEAN", "Adversarial Resilience");

    console.log("\n🎓 Initial Appointments Complete.\n");

    // 2. Run Entrance Exams
    console.log("🧪 Running Inaugural Entrance Exams...");

    const results = [
        await prepSchool.conductExam("Agent-Alpha", "LANG-001"),
        await prepSchool.conductExam("Agent-NPC-Bot", "LANG-001")
    ];

    console.log("\n📋 Final School Report:");
    results.forEach(r => {
        console.log(`- ${r.studentId}: ${r.grade} | Feedback: ${r.feedback}`);
    });

    console.log("\n🌿 DreamNet Prep School is now OPERATIONAL.");
}

inaugurate().catch(console.error);
