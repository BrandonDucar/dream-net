/**
 * Semantic Inbox Verification Pulse
 * 
 * Tests the end-to-end pipeline:
 * 1. BrainGate Embeddings
 * 2. SemanticInboxService Ingestion
 * 3. BlobIndex Semantic Search
 */

import dotenv from 'dotenv';
import path from 'path';

// Load env before imports
dotenv.config({ path: path.join(process.cwd(), '../../.env') });

async function verifySemanticInbox() {
    console.log("🧪 [Semantic Inbox] INITIATING VERIFICATION PULSE...");

    const { semanticInboxService } = await import('../src/email/SemanticInboxService.js');

    // 1. Ingest test data
    const testEmails = [
        {
            subject: "VitaDAO Grant Application Status",
            body: "Your proposal for the biological data storage fellowship is under review. Please provide a payout address.",
            metadata: { tags: ['vitadao', 'grant'] }
        },
        {
            subject: "Amazon AWS Credits Verification",
            body: "Your $100 AWS credits have been applied to your account. You can now use the specialized agents.",
            metadata: { tags: ['aws', 'credits'] }
        },
        {
            subject: "Market Volatility Alert",
            body: "Eth is down 5 points. Adjusting leverage for the swarm.",
            metadata: { tags: ['trading', 'alpha'] }
        }
    ];

    console.log("📥 Ingesting test vectors...");
    for (const email of testEmails) {
        await semanticInboxService.ingestEmail(email.subject, email.subject, email.body, email.metadata);
    }

    // 2. Perform semantic search
    const query = "how much money do i have on aws?";
    console.log(`🔎 Querying: "${query}"`);

    const results = await semanticInboxService.search(query);

    console.log("\n📊 SEARCH RESULTS:");
    results.forEach((res, i) => {
        console.log(`${i + 1}. [${res.commitment}] - ${res.tags?.join(', ')}`);
    });

    if (results[0]?.tags?.includes('aws')) {
        console.log("\n✅ SEMANTIC MATCH SUCCESSFUL: Found AWS context for credit query.");
    } else {
        console.log("\n❌ SEMANTIC MATCH FAILED: Context misalignment.");
    }
}

verifySemanticInbox().catch(console.error);
