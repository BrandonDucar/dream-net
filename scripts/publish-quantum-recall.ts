import { xWriter } from '../packages/server/src/agents/ops/XArticleWriterAgent.js';
import { socialMediaOps } from '../packages/server/src/agents/SocialMediaOps.js';

/**
 * 🧠 Phase XXXII: Quantum Recall Publication
 * 
 * Uses the XArticleWriter agent to publish research findings.
 */
async function publishQuantumRecallResearch() {
    console.log('📡 [Publication] Initiating Phase XXXII Research Publication...\n');

    const article = {
        title: '🔮 QUANTUM RECALL: The Reverse Siphon',
        content: `Phase XXXII is LIVE.

🧬 TriuneMemory Architecture:
• LIZARD: Sub-ms volatile buffer (recent events)
• MAMMAL: Semantic clusters in Vector Mesh (Qdrant)
• COSMIC: Deep durable logs (Pulsar/SQL)

🔮 Reverse Siphon reconstructs DreamNet's "State of Mind" at any temporal junction.

The organism now remembers its past to predict its future.

Timeline.svelte @ dreamnet.live
ChronoLoom ingesting the Loom of Time.

#DreamNet #QuantumRecall #TriuneMemory #SovereignAI`,
        tags: ['DreamNet', 'QuantumRecall', 'AI', 'Sovereignty']
    };

    try {
        console.log('📝 [XArticleWriter] Drafting manifesto...');
        console.log(`   Title: ${article.title}`);
        console.log(`   Length: ${article.content.length} chars\n`);

        // Option 1: Use XArticleWriter agent
        const result = await xWriter.runImplementation({
            query: 'Quantum Recall TriuneMemory',
            article: article.content
        }, {} as any);

        console.log('✅ [XArticleWriter] Research compiled:');
        console.log(`   Status: ${result.status}`);
        console.log(`   Recommendation: ${result.recommendation}\n`);

        // Option 2: Direct post via SocialMediaOps
        console.log('📱 [SocialMediaOps] Publishing to X...');
        const post = await socialMediaOps.createPost('twitter', article.content);
        
        console.log('✅ [Publication] Article posted successfully!');
        console.log(`   Post ID: ${post.id}`);
        console.log(`   Status: ${post.status}`);
        
        return { result, post };
    } catch (error) {
        console.error('❌ [Publication] Failed:', error);
        console.log('\n💡 Note: If OAuth is not configured, the article is drafted but not posted.');
        console.log('   Article content saved for manual publication.\n');
        
        // Save to file for manual posting
        const fs = await import('fs');
        const path = await import('path');
        const outputPath = path.resolve(process.cwd(), 'wisdom', 'DRAFT_PHASE_XXXII.md');
        
        fs.writeFileSync(outputPath, `# ${article.title}\n\n${article.content}\n\n---\n\nTags: ${article.tags.join(', ')}`);
        console.log(`📄 Draft saved to: ${outputPath}`);
        
        return { drafted: true, path: outputPath };
    }
}

// Execute
publishQuantumRecallResearch()
    .then((result) => {
        console.log('\n🎉 Phase XXXII publication complete!');
        console.log(JSON.stringify(result, null, 2));
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed:', error);
        process.exit(1);
    });
