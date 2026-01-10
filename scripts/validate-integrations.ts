import express from 'express';
import { createServer } from 'http';
import { type Request, type Response } from 'express';

// Import all the new routers (mocking the imports to avoid loading full dependencies)
// In a real run, we would import from server/index.ts, but for validation we want to check existence
// We will simulate the server startup logic from server/index.ts

async function validateIntegrations() {
    console.log("🔍 Starting Integration Validation Scan...");

    const integrations = [
        { name: "WolfPack", path: "/api/wolf-pack" },
        { name: "Foundry", path: "/api/foundry" },
        { name: "MediaList", path: "/api/media-list" },
        { name: "Email", path: "/api/email" },
        { name: "InboxSquared", path: "/api/inbox-squared" },
        { name: "CoinSensei", path: "/api/coinsensei" },
        { name: "AgentWallets", path: "/api/agent-wallets" },
        { name: "DreamSnail", path: "/api/dream-snail" },
        { name: "Biomimetic", path: "/api/biomimetic" },
        { name: "Fleets", path: "/api/fleets" },
        { name: "CustomGPT", path: "/api/custom-gpt-fleets" },
        { name: "SocialOps", path: "/api/social-media-ops" },
        { name: "InstantMesh", path: "/api/instant-mesh" },
        { name: "SuperSpine", path: "/api/super-spine" },
        { name: "Whale", path: "/api/whale" },
        { name: "Onboarding", path: "/api/onboarding" },
        // Add others from the list
    ];

    console.log(`📋 Checking ${integrations.length} integration points...`);

    // Check file existence for routers
    const fs = await import('fs');
    const path = await import('path');

    const results: any[] = [];
    const missing: string[] = [];

    for (const integration of integrations) {
        // Try to find the file in server/routes
        // Map integration name/path to likely filename
        // e.g. "WolfPack" -> "wolf-pack.ts"

        let filename = integration.path.replace('/api/', '') + '.ts';

        // Handle special cases if any
        if (integration.name === "Biomimetic") filename = "biomimetic-systems.ts";

        const filePath = path.join(process.cwd(), 'server', 'routes', filename);

        if (fs.existsSync(filePath)) {
            results.push({ ...integration, status: 'found', file: filename });
        } else {
            missing.push(integration.name);
            console.warn(`❌ Missing route file for ${integration.name} (expected ${filename})`);
        }
    }

    if (missing.length > 0) {
        console.error(`⚠️ ${missing.length} integrations missing route files!`);
        process.exit(1);
    } else {
        console.log("✅ All integration route files detected!");
    }
}

validateIntegrations().catch(console.error);
