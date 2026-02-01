import { OrcaOutputAdapter, setOrcaOutputAdapter } from '../../../orca-pack-core/logic/orcaPosterCore.js';
import { OrcaChannel } from '../../../orca-pack-core/types.js';
import { DiscordSuit } from './suits/DiscordSuit.js';
import { TelegramSuit } from './suits/TelegramSuit.js';

/**
 * The Synaptic Bridge is the Corpus Callosum.
 * It connects the "Dreaming Mind" (Orca Pack) to the "Acting Body" (Nerve Suits).
 */
export class SynapticBridge implements OrcaOutputAdapter {
    private discordSuit: DiscordSuit;
    private telegramSuit: TelegramSuit;

    constructor() {
        this.discordSuit = new DiscordSuit();
        this.telegramSuit = new TelegramSuit();
    }

    /**
     * Wires this bridge into the Orca Core logic.
     * Must be called at system startup.
     */
    public wire() {
        setOrcaOutputAdapter(this);
        console.log("[SynapticBridge] 🧠 <==> 🦾 Connection Established.");
    }

    /**
     * The actual transmission logic.
     * Orca Core calls this when it decides to post something.
     */
    async post(channel: OrcaChannel, content: string, meta?: any): Promise<string | undefined> {
        console.log(`[SynapticBridge] Routing signal to [${channel}]...`);

        switch (channel) {
            case 'farcaster':
                // Temporarily route Farcaster to Discord for testing? Or specific FC suit if existing.
                // For now, mapping 'farcaster' plans to Discord #general effectively
                return await this.discordSuit.post(content);

            case 'x':
                // Twitter/X Suit not fully online/auth'd in this session, log warning
                console.warn("[SynapticBridge] X Suit offline. Signal dropped.");
                return undefined;

            case 'instagram':
            case 'threads':
                // Discord is our default "sink" for now if others are missing
                return await this.discordSuit.post(`[FROM ${channel.toUpperCase()}] ${content}`);

            default:
                // If the channel string matches our known suits (e.g. if we add 'discord' type to Orca)
                if (channel === 'discord' as any) {
                    const result = await this.discordSuit.post(content);
                    return result.success ? result.id : undefined;
                }
                if (channel === 'telegram' as any) {
                    const result = await this.telegramSuit.post(content);
                    return result.success ? result.id : undefined;
                }

                console.warn(`[SynapticBridge] No motor function found for channel: ${channel}`);
                return undefined;
        }
    }
}
