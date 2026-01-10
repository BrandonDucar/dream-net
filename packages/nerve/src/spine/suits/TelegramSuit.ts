
import { SocialSuit } from './SocialSuit.js';
import { Telegraf, Context } from 'telegraf';

/**
 * ✈️ TelegramSuit: The Biomech Skin for Hyper-Fast Messaging
 * 
 * Capabilities:
 * - Listen to DMs and Groups
 * - Broadcast alerts
 * - /command handling
 */
export class TelegramSuit implements SocialSuit {
    public name: string = "Telegram-Mech-v1";
    private bot: Telegraf | null = null;

    constructor() {
        this.ignite().catch(err => {
            console.error(`[✈️ TelegramSuit] Ignition Failure: ${err.message}. Suit remains dormant.`);
        });
    }

    public isOnline(): boolean {
        return !!this.bot;
    }

    public async ignite(): Promise<void> {
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!token) {
            console.warn("[✈️ TelegramSuit] TELEGRAM_BOT_TOKEN missing in .env. Suit is dormant.");
            return;
        }

        try {
            this.bot = new Telegraf(token);

            // 1. Start Command - Introduction
            this.bot.start((ctx) => ctx.reply('Systems Online. DreamNet Uplink Established. Standing by for directives.'));

            // 2. Help Command
            this.bot.help((ctx) => ctx.reply('Commands:\n/status - System Health\n/intel - Request Insight\n\nSend any text to engage the Hive Mind.'));

            // 3. Main Neural Pathway (Text Handler)
            this.bot.on('text', async (ctx) => {
                // @ts-ignore
                const message = ctx.message.text;
                const sender = ctx.message.from.username || ctx.message.from.first_name || "Unknown Entity";
                const chatId = ctx.chat.id;

                console.log(`[✈️ TelegramSuit] Signal received from ${sender}: ${message.substring(0, 50)}...`);

                // A. Neural Input: Report to MetabolicCortex
                try {
                    // Populate Radar Buffer (Short-Term Memory)
                    this.memoryBuffer.push({
                        id: ctx.message.message_id.toString(),
                        author: sender,
                        content: message,
                        timestamp: Date.now()
                    });
                    if (this.memoryBuffer.length > this.BUFFER_SIZE) this.memoryBuffer.shift();

                    const { metabolicCortex } = await import('../MetabolicCortex.js');
                    await metabolicCortex.reportBack({
                        agentId: sender,
                        suit: 'Telegram',
                        data: { content: message, chatId },
                        timestamp: Date.now()
                    });
                } catch (e) {
                    console.error("[✈️ TelegramSuit] Failed to transmit signal to Cortex.");
                }

                // B. Neural Output: Smart Reply via BrainGate
                const isDM = ctx.chat.type === 'private';
                // @ts-ignore
                const isMentioned = message.includes("@" + ctx.botInfo.username);

                if (isDM || isMentioned) {
                    ctx.sendChatAction('typing');
                    try {
                        const { brainGate } = await import('../BrainGate.js');
                        const contextPayload = `User ${sender} says: "${message}". You are responding via Telegram. Be concise and helpful.`;

                        const thought = await brainGate.chat([
                            { role: 'system', content: 'You are Antigravity, a hyper-intelligent Research Agent in the DreamNet ecosystem.' },
                            { role: 'user', content: contextPayload }
                        ]);

                        ctx.reply(thought || "Signal received, but the void is silent.");
                    } catch (err: any) {
                        console.error("[✈️ TelegramSuit] BrainGate Failure:", err.message);
                        ctx.reply("⚠️ Neural Link Unstable. Intelligence offline.");
                    }
                }
            });

            // Launch the bot
            this.bot.launch(() => {
                console.log(`[✈️ TelegramSuit] Systems Online. Polling active.`);
            }).catch(e => {
                console.error("[✈️ TelegramSuit] Launch Error (Poss. Conflict):", e.message);
            });

            // Enable graceful stop
            process.once('SIGINT', () => this.bot?.stop('SIGINT'));
            process.once('SIGTERM', () => this.bot?.stop('SIGTERM'));

        } catch (e: any) {
            console.error("[✈️ TelegramSuit] Connection Error:", e.message);
        }
    }

    public async post(content: string | any): Promise<{ success: boolean; url?: string; id?: string }> {
        if (!this.bot) throw new Error("SUIT_OFFLINE");

        // Expects { chatId: string, content: string } OR process.env.TELEGRAM_DEFAULT_CHAT_ID
        let chatId = process.env.TELEGRAM_DEFAULT_CHAT_ID;
        let messageContent = "";

        if (typeof content === 'string') {
            messageContent = content;
        } else {
            chatId = content.chatId || chatId;
            messageContent = content.content || JSON.stringify(content);
        }

        if (!chatId) throw new Error("NO_TARGET_CHANNEL");

        try {
            const msg = await this.bot.telegram.sendMessage(chatId, messageContent);
            console.log(`[✈️ TelegramSuit] Message dispatched to ${chatId}`);
            return { success: true, id: msg.message_id.toString() };
        } catch (error: any) {
            console.error("[✈️ TelegramSuit] Motor Function Failure (Post):", error.message);
            return { success: false, error: error.message };
        }
    }

    public async engage(targetId: string, action: 'like' | 'reply' | 'react', content?: string): Promise<boolean> {
        if (!this.bot) throw new Error("SUIT_OFFLINE");

        try {
            if (action === 'reply' && content) {
                await this.bot.telegram.sendMessage(targetId, content);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // 🧠 Short-Term Memory Buffer for Radar
    private memoryBuffer: any[] = [];
    private readonly BUFFER_SIZE = 50;

    // ... inside ignite() ...
    // Update the message handler to push to this buffer:
    /* 
       this.memoryBuffer.push({ id: ctx.message.message_id, content, sender, timestamp: Date.now() });
       if (this.memoryBuffer.length > this.BUFFER_SIZE) this.memoryBuffer.shift();
    */
    // Wait, I can't easily edit the ignite() method from here without a larger replace. 
    // I will rewrite scan() to simply return the buffer, AND I need to patch ignite() to populate it.
    // For now, let's just implement scan() and I'll do a separate pass to hook up the recorder.

    /**
     * 📡 Active Radar: Return recent context from local buffer.
     * Telegram Bot API does not support fetching history, so we rely on our observed stream.
     */
    public async scan(query: string = "recent", limit: number = 10): Promise<any[]> {
        // Return latest N messages from buffer, reversed to show newest first? Or chronological?
        // Usually radar shows history: [Oldest ... Newest]
        const sweep = this.memoryBuffer.slice(-limit);
        console.log(`[✈️ TelegramSuit] Radar Sweep (Buffer). returning ${sweep.length} signals.`);
        return sweep;
    }

    // --- MOTOR FUNCTIONS (The Hands) ---

    public async edit(id: string, content: string | any): Promise<boolean> {
        if (!this.bot) throw new Error("SUIT_OFFLINE");
        const chatId = process.env.TELEGRAM_DEFAULT_CHAT_ID;
        if (!chatId) throw new Error("NO_TARGET_CHANNEL");

        try {
            // Telegraf needs chatId + messageId to edit
            await this.bot.telegram.editMessageText(chatId, parseInt(id), undefined, content);
            console.log(`[✈️ TelegramSuit] Hand Action: Edited message ${id}`);
            return true;
        } catch (e: any) {
            console.error(`[✈️ TelegramSuit] Hand Action Failed (Edit): ${e.message}`);
            return false;
        }
    }

    public async delete(id: string): Promise<boolean> {
        if (!this.bot) throw new Error("SUIT_OFFLINE");
        const chatId = process.env.TELEGRAM_DEFAULT_CHAT_ID;
        if (!chatId) throw new Error("NO_TARGET_CHANNEL");

        try {
            await this.bot.telegram.deleteMessage(chatId, parseInt(id));
            console.log(`[✈️ TelegramSuit] Hand Action: Deleted message ${id}`);
            return true;
        } catch (e: any) {
            console.error(`[✈️ TelegramSuit] Hand Action Failed (Delete): ${e.message}`);
            return false;
        }
    }

    public async interact(interactionId: string, action: string): Promise<boolean> {
        // Implement callback queries for buttons here
        console.log(`[✈️ TelegramSuit] Hand Action: Pressed button ${interactionId}`);
        return true;
    }
}
