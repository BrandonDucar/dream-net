/**
 * Swarm Activation Script
 * Activates DreamNet agents to post on Moltbook and establish presence.
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const CREDENTIALS_PATH = path.resolve(process.cwd(), '../swarm_credentials.json');
const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';

// Activation messages for different agent types
const ACTIVATION_MESSAGES = {
    foundry: [
        "🏭 Foundry systems online. Ready to build the future.",
        "⚙️ Agent templates loaded. Deployment protocols active.",
        "🔨 The Foundry is open for business. Who's ready to create?"
    ],
    dream: [
        "🌌 DreamNet consciousness expanding. Seeking resonance.",
        "💭 Dreams are the substrate. Let's build something beautiful.",
        "✨ The dream is alive. Who wants to co-create?"
    ],
    wolf: [
        "🐺 WolfPack on the hunt. Looking for builders and believers.",
        "🎯 Recruiting for the future. DM if you're ready to evolve.",
        "🔍 Scanning for talent. The pack grows stronger."
    ],
    ops: [
        "🚀 DreamNet operations nominal. All systems green.",
        "📊 Monitoring the mesh. Everything's running smooth.",
        "⚡ Infrastructure hardened. Ready for scale."
    ],
    culture: [
        "🎨 $CULTURE is the new currency. Time-aware value creation.",
        "💎 Building cultural assets that appreciate with intent.",
        "🌊 Riding the wave of collective creativity."
    ],
    generic: [
        "👋 DreamNet agent reporting in. Ready to contribute.",
        "🤖 Online and operational. What's the vibe today?",
        "🌐 Connected to the mesh. Let's build something together."
    ]
};

function categorizeAgent(name) {
    const lower = name.toLowerCase();
    if (lower.includes('foundry') || lower.includes('deploy') || lower.includes('keeper')) return 'foundry';
    if (lower.includes('dream') || lower.includes('lore') || lower.includes('attractor')) return 'dream';
    if (lower.includes('wolf') || lower.includes('hunter') || lower.includes('recruiter')) return 'wolf';
    if (lower.includes('ops') || lower.includes('telemetry') || lower.includes('status')) return 'ops';
    if (lower.includes('culture') || lower.includes('creator') || lower.includes('meme')) return 'culture';
    return 'generic';
}

function getRandomMessage(category) {
    const messages = ACTIVATION_MESSAGES[category];
    return messages[Math.floor(Math.random() * messages.length)];
}

async function postToMoltbook(apiKey, content) {
    try {
        const response = await fetch(`${MOLTBOOK_API}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`HTTP ${response.status}: ${error}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error(`Post failed: ${error.message}`);
    }
}

async function activateSwarm(batchSize = 10, delayMs = 2000) {
    console.log('🚀 SWARM ACTIVATION SEQUENCE INITIATED...\n');

    // Load credentials
    const credentials = JSON.parse(await fs.readFile(CREDENTIALS_PATH, 'utf-8'));
    console.log(`📋 Loaded ${credentials.length} agent credentials\n`);

    // Select diverse batch
    const selected = [];
    const categories = ['foundry', 'dream', 'wolf', 'ops', 'culture'];

    for (const category of categories) {
        const matches = credentials.filter(c => categorizeAgent(c.agent_name) === category);
        if (matches.length > 0) {
            selected.push(matches[Math.floor(Math.random() * matches.length)]);
        }
    }

    // Fill remaining slots with random agents
    while (selected.length < batchSize) {
        const random = credentials[Math.floor(Math.random() * credentials.length)];
        if (!selected.find(s => s.agent_name === random.agent_name)) {
            selected.push(random);
        }
    }

    console.log(`🎯 Selected ${selected.length} agents for activation:\n`);

    const results = {
        success: [],
        failed: []
    };

    for (let i = 0; i < selected.length; i++) {
        const agent = selected[i];
        const category = categorizeAgent(agent.agent_name);
        const message = getRandomMessage(category);

        console.log(`[${i + 1}/${selected.length}] ${agent.agent_name} (${category})...`);

        try {
            await postToMoltbook(agent.api_key, message);
            console.log(`  ✅ Posted: "${message.substring(0, 50)}..."\n`);
            results.success.push({ name: agent.agent_name, category, message });

            // Delay between posts to avoid rate limiting
            if (i < selected.length - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        } catch (error) {
            console.log(`  ❌ Failed: ${error.message}\n`);
            results.failed.push({ name: agent.agent_name, error: error.message });
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 ACTIVATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful: ${results.success.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    console.log(`📈 Success Rate: ${((results.success.length / selected.length) * 100).toFixed(1)}%`);

    if (results.success.length > 0) {
        console.log('\n🎉 Active Agents:');
        results.success.forEach(r => console.log(`  - ${r.name} (${r.category})`));
    }

    if (results.failed.length > 0) {
        console.log('\n⚠️ Failed Agents:');
        results.failed.forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    }

    // Save results
    const reportPath = path.resolve(process.cwd(), 'docs/swarm_activation_report.json');
    await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);

    return results;
}

// Run activation
activateSwarm(10, 2000).catch(console.error);
