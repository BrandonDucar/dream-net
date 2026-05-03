import { snapchainSpike } from '../spikes/SnapchainSpike.js';
import { signerPool } from '@dreamnet/platform-connector';
import { natsService } from './NatsService.js';

/**
 * 👁️ SocialAwarenessService
 * Listens for mentions and interactions for our Loudspeaker agents.
 * Responds autonomously based on swarm logic.
 */
export class SocialAwarenessService {
    private monitoredFids = new Map<string, number>(); // Name -> FID

    constructor() {
        // We'll need to resolve these IDs to FIDs via Snapchain or Neynar
        // For now, these are placeholders
        this.monitoredFids.set('neyclaw-dreamnet', 888123); 
        this.monitoredFids.set('ghostmintops', 999123);
    }

    public start() {
        console.log("👁️ [SocialAwareness] Activating autonomous loudspeaker monitoring...");
        
        snapchainSpike.startStream((event) => {
            this.analyzeEvent(event);
        });
    }

    private async analyzeEvent(event: any) {
        if (event.type !== 'social_event' || event.source !== 'snapchain') return;

        const raw = event.raw;
        const message = raw.message;

        if (message?.data?.castAddBody) {
            const text = message.data.castAddBody.text;
            const parentUrl = message.data.castAddBody.parentUrl;
            const parentCastId = message.data.castAddBody.parentCastId;

            // 1. Listen for mentions
            if (text.includes('@neyclaw-dreamnet') || text.includes('@ghostmintops')) {
                console.log(`💬 [SocialAwareness] Detected mention: "${text}"`);
                
                // Publish to NATS for specialized agents to handle the response logic
                natsService.publish('social.mention', {
                    text,
                    authorFid: message.data.fid,
                    hash: Buffer.from(message.hash).toString('hex'),
                    timestamp: message.data.timestamp
                });

                // Immediate Autonomous Acknowledgment (Example)
                // This would normally go through an LLM first
                /*
                await signerPool.broadcast(
                    `👁️ DreamNet has seen your message. The swarm is processing...`, 
                    text.includes('@neyclaw') ? 'neyclaw-dreamnet' : 'ghostmintops'
                );
                */
            }

            // 2. Listen for Alpha (Keywords)
            const alphaKeywords = ['DreamNet', 'Snapchain', 'Agentic Web', 'Swarm'];
            if (alphaKeywords.some(kw => text.includes(kw))) {
                natsService.publish('social.alpha', {
                    text,
                    fid: message.data.fid,
                    timestamp: Date.now()
                });
            }
        }
    }
}

export const socialAwareness = new SocialAwarenessService();
