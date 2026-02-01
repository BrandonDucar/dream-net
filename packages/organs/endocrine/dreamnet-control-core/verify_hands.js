
import { GitHubSuit } from './dist/suits/GitHubSuit.js';

async function test() {
    console.log("🤖 [Mech Suit] Initializing connection...");
    if (!process.env.GITHUB_TOKEN) {
        console.error("❌ GITHUB_TOKEN is missing in environment!");
        process.exit(1);
    }

    const suit = new GitHubSuit(process.env.GITHUB_TOKEN);

    try {
        console.log("👤 [Core] Verifying Authenticated User...");
        const { data: user } = await suit['octokit'].rest.users.getAuthenticated();
        console.log(`✅ [Core] Token identified as: ${user.login} (${user.type})`);

        console.log("🔍 [Grip] Checking repository access...");
        const { data: repo } = await suit['octokit'].rest.repos.get({
            owner: "BrandonDucar",
            repo: "dream-net"
        });
        console.log(`✅ [Grip] SUCCESS: Found repo "${repo.full_name}" (Private: ${repo.private})`);

        console.log("📡 [Radar] Scanning repository issues...");
        const issues = await suit.scanIssues();
        console.log(`✅ [Radar] SUCCESS: Found ${issues.length} active signals.`);

        console.log("🦾 [Combat] Testing Grip & Craft (Write Ops)...");
        const testBranch = `handshake-${Date.now()}`;
        console.log(`   - Creating branch: ${testBranch}`);
        await suit.createBranch(testBranch);

        console.log(`   - Committing file: DREAMNET_PULSE.md`);
        await suit.commitFile(
            testBranch,
            "DREAMNET_PULSE.md",
            "# DREAMNET PULSE\nHandshake successful. Swarm is online.",
            "Handshake verified by Mech Suit"
        );
        console.log(`✅ [Combat] SUCCESS: Write operations verified.`);

    } catch (err) {
        console.error("❌ [Mech Suit] FAILURE.", err.message || err);
        if (err.response) {
            console.error("   - Status:", err.response.status);
            console.error("   - Data:", JSON.stringify(err.response.data, null, 2));
        }
        process.exit(1);
    }
}

test();
