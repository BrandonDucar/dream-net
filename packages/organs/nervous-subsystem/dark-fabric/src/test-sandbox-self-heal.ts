import { runSandbox } from './sandbox';

async function testSandboxSelfHeal() {
    console.log("🧪 Testing Sandbox Self-Heal Reporting...");

    // Intentional failure: referencing non-existent module
    const code = `import { nonExistent } from 'non-existent-module';\nconsole.log(nonExistent);`;

    const result = await runSandbox(code);

    console.log("🚀 Sandbox Success:", result.success);
    console.log("🛠️ Detected Issues:", result.selfHealReport?.detectedIssues);
    console.log("💡 Suggested Fixes:", result.selfHealReport?.suggestedFixes);

    if (!result.success && result.selfHealReport?.suggestedFixes.includes("Run 'pnpm install'")) {
        console.log("✅ SUCCESS: Self-Heal reporting verified.");
    } else {
        console.log("❌ FAILURE: Self-Heal report missing or incorrect.");
    }
}

testSandboxSelfHeal().catch(console.error);
