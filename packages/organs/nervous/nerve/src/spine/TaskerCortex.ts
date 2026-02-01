
import { brainGate } from './BrainGate.js';

export interface Task {
    id: string;
    role: 'RESEARCHER' | 'WRITER' | 'PUBLISHER' | 'CODER' | 'SINEW' | 'MANAGER' | 'SALESMAN';
    instruction: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
    output?: string;
}

export class TaskerCortex {
    private static instance: TaskerCortex;

    private constructor() { }

    public static getInstance(): TaskerCortex {
        if (!TaskerCortex.instance) {
            TaskerCortex.instance = new TaskerCortex();
        }
        return TaskerCortex.instance;
    }

    /**
     * 🧠 Decompose a high-level goal into atomic tasks using BrainGate.
     */
    public async decompose(goal: string): Promise<Task[]> {
        console.log(`[TaskerCortex] Decomposing Goal: "${goal}"`);

        // 💰 Monetization Playbooks (The "Get Rich" Scripts)
        if (goal.toLowerCase().includes('seo') || goal.toLowerCase().includes('content factory')) {
            return [
                { id: `t-${Date.now()}-1`, role: 'RESEARCHER', instruction: 'Identify 3 high-volume, low-difficulty keywords related to "AI Agents".', status: 'PENDING' },
                { id: `t-${Date.now()}-2`, role: 'WRITER', instruction: 'Write a 1000-word blog post optimized for the identified keywords. Use "Markdown" format.', status: 'PENDING' },
                { id: `t-${Date.now()}-3`, role: 'SINEW', instruction: 'Trigger "wordpress-publish" webhook with the blog post content.', status: 'PENDING' },
                { id: `t-${Date.now()}-4`, role: 'PUBLISHER', instruction: 'Post a tweet summarizing the article with a link.', status: 'PENDING' }
            ];
        }

        if (goal.toLowerCase().includes('lead') || goal.toLowerCase().includes('sales')) {
            return [
                { id: `t-${Date.now()}-1`, role: 'RESEARCHER', instruction: 'Scan X (Twitter) for users asking about "Custom AI Chatbots".', status: 'PENDING' },
                { id: `t-${Date.now()}-2`, role: 'WRITER', instruction: 'Draft a polite, helpful reply offering advice (and subtly mentioning our services).', status: 'PENDING' },
                { id: `t-${Date.now()}-3`, role: 'SALESMAN', instruction: 'Engage the user via Botpress or DM (simulated).', status: 'PENDING' }
            ];
        }

        const prompt = `
        You are the PROJECT MANAGER for an Autonomous AI Swarm.
        GOAL: "${goal}"

        Break this goal down into 3-5 atomic steps.
        Roles available:
        - RESEARCHER: Scans the web, reads docs, finds info.
        - WRITER: Drafts content, summaries, or tweets.
        - PUBLISHER: Posts content to Discord/X/TikTok.
        - CODER: Writes code or fixes JSON.
        - SINEW: Triggers external automations (N8n, Webhooks) for payment/email/sheets.
        - SALESMAN: Engages leads via Botpress/Chat.

        Return a JSON ARRAY of objects with this shape:
        { "role": "...", "instruction": "..." }
        Do not include markdown formatting. Just raw JSON.
        `;

        const response = await brainGate.think(prompt);

        try {
            // Clean content (remove markdown code blocks if any)
            const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
            const steps = JSON.parse(cleanJson);

            return steps.map((step: any, index: number) => ({
                id: `task-${Date.now()}-${index}`,
                role: step.role,
                instruction: step.instruction,
                status: 'PENDING'
            }));
        } catch (e) {
            console.error("[TaskerCortex] Decomposition Failed:", e);
            return [];
        }
    }

    /**
     * 🐝 Execute the Swarm on a list of tasks.
     */
    public async executeSwarm(tasks: Task[]): Promise<string> {
        console.log(`[TaskerCortex] Swarm Activated: ${tasks.length} tasks.`);
        let context = "";

        for (const task of tasks) {
            task.status = 'IN_PROGRESS';
            console.log(`[TaskerCortex] Executing Task [${task.role}]: ${task.instruction}`);

            try {
                let result = "";

                if (task.role === 'RESEARCHER' || task.role === 'WRITER' || task.role === 'CODER') {
                    // Logic Tasks -> BrainGate
                    result = await brainGate.think(`
                    CONTEXT SO FAR:
                    ${context}

                    YOUR MISSION (${task.role}):
                    ${task.instruction}
                    `);
                } else if (task.role === 'PUBLISHER') {
                    // Action Tasks -> SocialSuits
                    // Dynamic Import to avoid circular dependency issues at root
                    const { DiscordSuit } = await import('./suits/DiscordSuit.js');
                    const suit = new DiscordSuit();
                    // Note: In a persistent server, we should reuse the active instance.
                    // For this "One Shot" task execution, we ignite a fresh connection if needed.
                    if (!suit.isOnline()) await suit.ignite();

                    // If instruction implies a post...
                    // "Post this content to channel 123"
                    // We need to parse the content. For now, we assume the instruction contains the content to post.
                    // Let's ask BrainGate to extract the final "Post Content" from the instruction
                    const postContent = await brainGate.think(`Extract the exact text content to post from this instruction: "${task.instruction}". Return ONLY the content.`);

                    const actionResult = await suit.post(postContent);
                    result = actionResult.success
                        ? `[SUCCESS] Published to Discord. ID: ${actionResult.id}`
                        : `[FAILURE] Could not publish. Error: ${actionResult.error}`;
                } else if (task.role === 'SINEW') {
                    // Automation Tasks -> N8nBridge
                    const { n8nBridge } = await import('../bridges/N8nBridge.js');
                    // Instruction: "Trigger checkout-flow with { item: 'sword' }"
                    const payloadString = await brainGate.think(`Extract the JSON payload from this instruction: "${task.instruction}". Return ONLY JSON.`);
                    let payload = {};
                    try { payload = JSON.parse(payloadString.replace(/```json/g, '').replace(/```/g, '').trim()); } catch (e) { }

                    // We assume a generic 'tasker-hook' for now, or extract path from instruction
                    const bridgeResult = await n8nBridge.trigger('tasker-hook', payload);
                    result = bridgeResult.success
                        ? `[SUCCESS] Triggered N8n. Data: ${JSON.stringify(bridgeResult.data)}`
                        : `[FAILURE] N8n Error.`;

                } else if (task.role === 'SALESMAN') {
                    // Conversational/Sales Tasks -> BotpressSuit
                    const { BotpressSuit } = await import('./suits/BotpressSuit.js');
                    const suit = new BotpressSuit();
                    if (suit.isOnline()) { // Only if configured
                        // "Engage user X with offer Y"
                        const salesPitch = await brainGate.think(`Write a short, punchy sales message based on this instruction: "${task.instruction}".`);
                        const resultBp = await suit.post(salesPitch);
                        result = resultBp.success
                            ? `[SUCCESS] Pitch sent to Botpress. ID: ${resultBp.id}`
                            : `[FAILURE] Botpress Error/Dormant.`;
                    } else {
                        result = `[SKIPPED] BotpressSuit is dormant (No Webhook).`;
                    }
                }

                task.output = result;
                task.status = 'DONE';
                context += `\n\n--- OUTPUT from ${task.role} ---\n${result}`;

            } catch (e) {
                console.error(`[TaskerCortex] Task Failed: ${task.id}`, e);
                task.status = 'FAILED';
                task.output = "Execution Error.";
            }
        }

        return context;
    }
}

export const taskerCortex = TaskerCortex.getInstance();
