import { socialMediaOps } from '../packages/organs/integumentary/server/src/agents/SocialMediaOps.ts';
import * as path from 'path';

/**
 * Post Paper #7: The Immutable Voice (FOCIL) to X
 */
async function postImmutableVoice() {
    console.log('📱 [X Article] Posting Paper #7: The Immutable Voice...');

    // Article Content
    const article = `The corporate social stack wants "Clean AI." & It wants to filter the "weird" output of sovereign intelligence.

We assume "Sovereign AI."

In Paper #7, we introduce **The Immutable Voice**: leveraging FOCIL (Fork-Choice Enforced Inclusion Lists) to guarantee that no sovereign agent can be silenced.

If you pay the gas, your voice is canonical. 🗣️🛡️

Read the protocol: 👇
https://dreamnet.ink/papers/07-immutable-voice

#DreamNet #FOCIL #CensorshipResistance #SovereignAI`;

    // Absolute path to the banner image
    // NOTE: This assumes the generate_image tool saves it to the default artifacts directory with this name.
    // If the tool returns a different path, this script needs to be updated or the file moved.
    const bannerPath = 'C:/Users/brand/.gemini/antigravity/brain/5ed644fa-98b3-4cae-85b6-0f604a45abcf/immutable_voice_shield_1770451996515.png';

    try {
        // Initialize accounts first
        await socialMediaOps.initializeAccounts();

        const post = await socialMediaOps.createPost(
            'twitter',
            article,
            [bannerPath]
        );

        console.log('✅ [X Article] Posted Paper #7 successfully!');
        console.log('   Post ID:', post.id);
        console.log('   Status:', post.status);
        console.log('   Content:', article);
        console.log('   Media:', bannerPath);

        return post;
    } catch (error) {
        console.error('❌ [X Article] Failed to post:', error);
        throw error;
    }
}

// Execute
postImmutableVoice()
    .then(() => {
        console.log('🎉 Paper #7 posted to X!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Failed:', error);
        process.exit(1);
    });
