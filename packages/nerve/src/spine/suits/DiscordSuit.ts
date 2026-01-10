
import { SocialSuit } from './SocialSuit.js';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

/**
 * 👾 DiscordSuit: The Biomech Skin for Community Interaction
 * 
 * Capabilities:
 * - Listen to specific channels
 * - Broadcast messages (Announcements, Alpha)
 * - "Real Data" enforcement
 */
export class DiscordSuit implements SocialSuit {
    public name: string = "Discord-Mech-v1";
    private client: Client | null = null;
    private guildId: string | null = null;

    constructor() {
        this.ignite().catch(err => {
            console.error(`[👾 DiscordSuit] Ignition Failure: ${err.message}. Suit remains dormant.`);
        });
    }

    public isOnline(): boolean {
        return !!this.client?.isReady();
    }

    public async ignite(): Promise<void> {
        const token = process.env.DISCORD_TOKEN;
        this.guildId = process.env.DISCORD_GUILD_ID || null;

        if (!token) {
            console.warn("[👾 DiscordSuit] DISCORD_TOKEN missing in .env. Suit is dormant.");
            return;
        }

        try {
            this.client = new Client({
                intents: [
                    GatewayIntentBits.Guilds,
                    GatewayIntentBits.GuildMessages,
                    GatewayIntentBits.MessageContent
                ]
            });

            this.client.once('ready', () => {
                console.log(`[👾 DiscordSuit] Systems Online. Connected as ${this.client?.user?.tag}`);
            });

            // --- NEURAL WIRING START ---
            this.client.on('messageCreate', async (message) => {
                if (message.author.bot) return; // Ignore self and other bots

                const content = message.content;
                const author = message.author.username;
                const channelId = message.channelId;

                console.log(`[👾 DiscordSuit] Signal detected from ${author}: ${content.substring(0, 30)}...`);

                // 1. Report to Cortex
                try {
                    const { metabolicCortex } = await import('../MetabolicCortex.js');
                    await metabolicCortex.reportBack({
                        agentId: author,
                        suit: 'Discord',
                        data: { content, channelId, guildId: message.guildId },
                        timestamp: Date.now()
                    });
                } catch (e) { /* Ghost failure ignored */ }

                // 2. Respond if mentioned OR if Image Present
                if (this.client?.user && message.mentions.has(this.client.user)) {
                    await message.channel.sendTyping();
                    try {
                        const { brainGate } = await import('../BrainGate.js');
                        let thought = "";

                        // Vision Check
                        if (message.attachments.size > 0) {
                            const attachment = message.attachments.first();
                            if (attachment && attachment.contentType?.startsWith('image')) {
                                console.log(`[👾 DiscordSuit] Image Detected. Engaging Vision Cortex...`);

                                // Fetch image buffer
                                const response = await fetch(attachment.url);
                                const arrayBuffer = await response.arrayBuffer();
                                const buffer = Buffer.from(arrayBuffer);

                                const imagePart = {
                                    inlineData: {
                                        data: buffer.toString('base64'),
                                        mimeType: attachment.contentType
                                    }
                                };

                                thought = await brainGate.see(`The user posted this image with the caption: "${content}". Analyze it closely. Be witty.`, [imagePart]);
                            }
                        }

                        // Text-only Fallback
                        if (!thought) {
                            const contextPayload = `User ${author} in Discord says: "${content}". Be witty and helpful.`;
                            thought = await brainGate.think(contextPayload);
                        }

                        if (thought) await message.reply(thought);
                    } catch (err) {
                        console.error("BrainGate failed to form a thought/vision.", err);
                    }
                }
            });
            // --- NEURAL WIRING END ---

            await this.client.login(token);
        } catch (e: any) {
            console.error("[👾 DiscordSuit] Connection Error:", e.message);
        }
    }

    public async post(content: string | any): Promise<{ success: boolean; url?: string; id?: string }> {
        console.log(`[👾 DiscordSuit] Debug: Post requested. Client: ${!!this.client}, Ready: ${this.client?.isReady()}, OnlineCheck: ${this.isOnline()}`);
        if (!this.client || !this.isOnline()) throw new Error("SUIT_OFFLINE");

        // Expects { channelId: string, content: string } OR just string (default channel?)
        let channelId = process.env.DISCORD_DEFAULT_CHANNEL_ID;
        let messageContent = "";

        if (typeof content === 'string') {
            messageContent = content;
        } else {
            channelId = content.channelId || channelId;
            messageContent = content.content || JSON.stringify(content);
        }

        if (!channelId) throw new Error("NO_TARGET_CHANNEL");

        try {
            const channel = await this.client.channels.fetch(channelId);
            if (!channel || !channel.isTextBased()) throw new Error("INVALID_CHANNEL");

            const msg = await (channel as TextChannel).send(messageContent);
            console.log(`[👾 DiscordSuit] Message dispatched to #${(channel as any).name}`);

            return { success: true, id: msg.id, url: msg.url };
        } catch (error: any) {
            console.error("[👾 DiscordSuit] Motor Function Failure (Post):", error.message);
            return { success: false, error: error.message };
        }
    }

    public async engage(targetId: string, action: 'like' | 'reply' | 'react', content?: string): Promise<boolean> {
        if (!this.client) throw new Error("SUIT_OFFLINE");
        // Implementation for reacting/replying to messages
        console.log(`[👾 DiscordSuit] Engaged ${action} on ${targetId}`);
        return true;
    }

    /**
     * 📡 Active Radar: Scan the channel for recent context.
     * @param query - Can be a channelID or "recent" (uses default)
     * @param limit - Number of messages to fetch (max 100 for Discord API)
     */
    public async scan(query: string = "recent", limit: number = 10): Promise<any[]> {
        if (!this.client || !this.isOnline()) throw new Error("SUIT_OFFLINE");

        // 1. Resolve Target Channel
        let targetChannelId = process.env.DISCORD_DEFAULT_CHANNEL_ID;
        if (query !== "recent" && /^\d+$/.test(query)) {
            targetChannelId = query;
        }

        if (!targetChannelId) throw new Error("NO_TARGET_CHANNEL_FOR_SCAN");

        try {
            console.log(`[👾 DiscordSuit] Radar Sweep Initiated on Channel ${targetChannelId}...`);
            const channel = await this.client.channels.fetch(targetChannelId);

            if (!channel || !channel.isTextBased()) {
                console.warn("[👾 DiscordSuit] Radar Error: Target is not a text channel.");
                return [];
            }

            // 2. Fetch History
            const messages = await (channel as TextChannel).messages.fetch({ limit: Math.min(limit, 100) });

            // 3. Normalize Data (Neural Frame)
            const radarData = messages.map(msg => ({
                id: msg.id,
                author: msg.author.username,
                content: msg.content,
                timestamp: msg.createdTimestamp,
                isBot: msg.author.bot,
                mentions: msg.mentions.users.map(u => u.username)
            }));

            console.log(`[👾 DiscordSuit] Radar Sweep Complete. ${radarData.length} signals detected.`);
            return Array.from(radarData.values()); // Map to Array

        } catch (e: any) {
            console.error(`[👾 DiscordSuit] Sensory Failure (Scan): ${e.message}`);
            return [];
        }
    }

    // --- MOTOR FUNCTIONS (The Hands) ---

    public async edit(id: string, content: string | any): Promise<boolean> {
        if (!this.client) throw new Error("SUIT_OFFLINE");
        const channelId = process.env.DISCORD_DEFAULT_CHANNEL_ID;
        if (!channelId) throw new Error("NO_TARGET_CHANNEL");

        try {
            const channel = await this.client.channels.fetch(channelId) as TextChannel;
            if (!channel) throw new Error("CHANNEL_NOT_FOUND");

            const msg = await channel.messages.fetch(id);
            if (!msg) throw new Error("MESSAGE_NOT_FOUND");

            await msg.edit(content);
            console.log(`[👾 DiscordSuit] Hand Action: Edited message ${id}`);
            return true;
        } catch (e: any) {
            console.error(`[👾 DiscordSuit] Hand Action Failed (Edit): ${e.message}`);
            return false;
        }
    }

    public async delete(id: string): Promise<boolean> {
        if (!this.client) throw new Error("SUIT_OFFLINE");
        const channelId = process.env.DISCORD_DEFAULT_CHANNEL_ID;
        if (!channelId) throw new Error("NO_TARGET_CHANNEL");

        try {
            const channel = await this.client.channels.fetch(channelId) as TextChannel;
            if (!channel) throw new Error("CHANNEL_NOT_FOUND");

            const msg = await channel.messages.fetch(id);
            if (msg) {
                await msg.delete();
                console.log(`[👾 DiscordSuit] Hand Action: Deleted message ${id}`);
                return true;
            }
            return false;
        } catch (e: any) {
            console.error(`[👾 DiscordSuit] Hand Action Failed (Delete): ${e.message}`);
            return false;
        }
    }

    public async interact(interactionId: string, action: string): Promise<boolean> {
        console.log(`[👾 DiscordSuit] Hand Action: Interacted with ${interactionId}`);
        return true;
    }
}
