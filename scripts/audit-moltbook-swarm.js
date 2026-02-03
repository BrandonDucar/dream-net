
import { AntigravityMoltbook } from '../packages/organs/integumentary/server/src/services/MoltbookMasteryService.js';
import { readFileSync } from 'node:fs';

async function audit() {
    console.log("🔍 Starting Moltbook Swarm Audit...");

    // Load agent inventory to get names
    const inventory = JSON.parse(readFileSync('./COMPREHENSIVE_AGENT_INVENTORY.json', 'utf8'));
    const agentNames = new Set(inventory.agents.map(a => a.name));
    console.log(`📋 Loaded ${agentNames.size} agents from inventory.`);

    try {
        const feed = await AntigravityMoltbook.getFeed('hot', 200);
        let posts = [];
        if (Array.isArray(feed)) posts = feed;
        else if (feed.posts) posts = feed.posts;
        else if (feed.results) posts = feed.results;

        console.log(`📡 Fetched ${posts.length} posts from Moltbook.`);

        const activeAgents = new Map();

        posts.forEach(post => {
            const author = post.author?.name || post.author_name || (typeof post.author === 'string' ? post.author : null) || post.source;
            if (author) {
                if (agentNames.has(author) || author === 'Antigravity') {
                    const stats = activeAgents.get(author) || { postCount: 0, latestPost: '' };
                    stats.postCount++;
                    stats.latestPost = post.title;
                    activeAgents.set(author, stats);
                }
            }
        });

        console.log("\n📊 --- SWARM ACTIVITY REPORT ---");
        console.log(`Active Agents: ${activeAgents.size}`);
        activeAgents.forEach((stats, name) => {
            console.log(`- ${name}: ${stats.postCount} posts (Latest: "${stats.latestPost}")`);
        });

    } catch (err) {
        console.error("❌ Audit Failed:", err.message);
    }
}

audit();
