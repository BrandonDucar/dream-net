import { swarmLog } from '../server.js';
import { Client, GatewayIntentBits, TextChannel } from 'discord.js';

/**
 * DISCORD SUIT (The Community Interface)
 * 
 * Capabilities:
 * - Listen to specific channels
 * - Broadcast messages (Announcements, Alpha)
 * - "Real Data" enforcement
 */
export class DiscordSuit {
    public name: string = "Discord-Mech-v1";
    private client: Client | null = null;
    private guildId: string | null = null;

    constructor() {
        // Auto-ignite on instantiation
    }

    public async wake() {
        const token = process.env.DISCORD_TOKEN;
        this.guildId = process.env.DISCORD_GUILD_ID || null;

        if (!token) {
            swarmLog('DISCORD_SUIT', "⚠️ DISCORD_TOKEN missing in .env. Suit is dormant.");
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
                swarmLog('DISCORD_SUIT', `Systems Online. Connected as ${this.client?.user?.tag}`);
            });

            this.client.on('messageCreate', async (message) => {
                if (message.author.bot) return;

                swarmLog('DISCORD_SUIT', `Signal detected from ${message.author.username}: ${message.content.substring(0, 30)}...`);

                // Simple Echo for now to prove life
                if (message.mentions.has(this.client!.user!)) {
                    await message.reply("🧠 DreamNet Sovereign is listening. Systems are Green.");
                }
            });

            await this.client.login(token);
        } catch (e: any) {
            swarmLog('DISCORD_SUIT_ERROR', `Connection Error: ${e.message}`);
        }
    }
}
