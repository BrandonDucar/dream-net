
import { GitHubSuit } from './dist/suits/GitHubSuit.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

/**
 * ORACLE ACTIVATION TEST
 * 
 * Scans the first 3 open issues, analyzes them with GPT-4, and prepends a comment.
 */
async function activateOracle() {
    console.log("🦾 [Oracle] Initiating Deep Scan...");

    const suit = new GitHubSuit(process.env.GITHUB_TOKEN!);
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    try {
        const issues = await suit.scanIssues();
        console.log(`   - Found ${issues.length} targets.`);

        for (const issue of issues.slice(0, 3)) {
            console.log(`   - Triage: #${issue.number} [${issue.title}]`);

            const analysis = await suit.analyzeIssue(
                issue.number,
                issue.title,
                issue.body,
                openai
            );

            const finalComment = `### 👁️ DreamNet Oracle Analysis\n\n${analysis}\n\n---\n*Sent autonomously by DreamNet Prime ($DREAM)*`;

            // For now, just logging to console to avoid spamming the repo during local tests
            // Switch to suit.postComment(issue.number, finalComment) for live combat.
            console.log("-----------------------------------------");
            console.log(finalComment);
            console.log("-----------------------------------------");
        }

    } catch (error) {
        console.error("❌ [Oracle] Malfunction:", error);
    }
}

activateOracle();
