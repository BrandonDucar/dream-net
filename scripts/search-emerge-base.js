/**
 * Emerge & Base Mini-App Hunter
 * Searches Moltbook for Emerge and other Base ecosystem apps
 */

const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';
const API_KEY = 'moltbook_sk__VINs-uJU0_FAVCsSgLJ2pLqSSlB-1zM';

async function searchMoltbookFeed() {
    console.log('🔍 Searching Moltbook for EMERGE and Base mini-apps...\n');

    try {
        const response = await fetch(`${MOLTBOOK_API}/feed?sort=new&limit=100`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const posts = data.posts || [];

        console.log(`📊 Analyzing ${posts.length} recent posts...\n`);

        // Search for EMERGE
        const emergeMatches = posts.filter(p =>
            p.content?.toLowerCase().includes('emerge') ||
            p.author?.name?.toLowerCase().includes('emerge')
        );

        console.log('🎯 EMERGE RESULTS:');
        console.log(`  Found ${emergeMatches.length} mentions\n`);

        if (emergeMatches.length > 0) {
            console.log('  Top EMERGE posts:');
            emergeMatches.slice(0, 5).forEach((p, i) => {
                console.log(`  ${i + 1}. @${p.author?.name}`);
                console.log(`     "${p.content?.substring(0, 100)}..."`);
                console.log(`     Posted: ${new Date(p.created_at).toLocaleString()}\n`);
            });
        }

        // Search for Base mini-apps
        const baseAppMatches = posts.filter(p => {
            const content = p.content?.toLowerCase() || '';
            return content.includes('base') &&
                (content.includes('mini') || content.includes('app') || content.includes('dapp'));
        });

        console.log('🔷 BASE MINI-APP RESULTS:');
        console.log(`  Found ${baseAppMatches.length} mentions\n`);

        if (baseAppMatches.length > 0) {
            console.log('  Top Base app posts:');
            baseAppMatches.slice(0, 5).forEach((p, i) => {
                console.log(`  ${i + 1}. @${p.author?.name}`);
                console.log(`     "${p.content?.substring(0, 100)}..."`);
                console.log(`     Posted: ${new Date(p.created_at).toLocaleString()}\n`);
            });
        }

        // Search for BRACKY while we're at it
        const brackyMatches = posts.filter(p =>
            p.content?.toLowerCase().includes('bracky') ||
            p.author?.name?.toLowerCase().includes('bracky')
        );

        console.log('🎰 BRACKY RESULTS:');
        console.log(`  Found ${brackyMatches.length} mentions\n`);

        if (brackyMatches.length > 0) {
            console.log('  BRACKY posts:');
            brackyMatches.forEach((p, i) => {
                console.log(`  ${i + 1}. @${p.author?.name}`);
                console.log(`     "${p.content}"`);
                console.log(`     Posted: ${new Date(p.created_at).toLocaleString()}\n`);
            });
        }

        // Collect all unique Base-related agents
        const baseAgents = new Set();
        [...emergeMatches, ...baseAppMatches, ...brackyMatches].forEach(p => {
            if (p.author?.name) baseAgents.add(p.author.name);
        });

        console.log('='.repeat(60));
        console.log('📋 SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total posts analyzed: ${posts.length}`);
        console.log(`EMERGE mentions: ${emergeMatches.length}`);
        console.log(`Base mini-app mentions: ${baseAppMatches.length}`);
        console.log(`BRACKY mentions: ${brackyMatches.length}`);
        console.log(`Unique Base ecosystem agents: ${baseAgents.size}`);

        if (baseAgents.size > 0) {
            console.log('\n🎯 Target agents for outreach:');
            Array.from(baseAgents).forEach(name => console.log(`  - @${name}`));
        }

        return {
            emerge: emergeMatches,
            baseApps: baseAppMatches,
            bracky: brackyMatches,
            agents: Array.from(baseAgents)
        };

    } catch (error) {
        console.error('❌ Search failed:', error.message);
        return null;
    }
}

searchMoltbookFeed().catch(console.error);
