import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Environment Variables (Root + Local)
const rootEnv = resolve(__dirname, '../.env');
if (existsSync(rootEnv)) dotenv.config({ path: rootEnv });
dotenv.config();

import { getDb } from '../packages/server/src/db.js';
import * as schema from '../packages/shared/schema.js';
import { memoryDNA } from '../packages/server/src/core/MemoryDNA.js';
import { eq, or, like } from 'drizzle-orm';

const { superSpineTasks } = schema;

async function scavenger() {
    console.log("🧠 [Mnemosyne] Starting Chat History Scavenger...");

    try {
        const db = await getDb({ intent: 'READ' });

        // Query for tasks that look like chat sessions
        const chatTasks = await db.select()
            .from(superSpineTasks)
            .where(
                or(
                    eq(superSpineTasks.type, 'agent_chat'),
                    eq(superSpineTasks.type, 'chat_message'),
                    like(superSpineTasks.type, '%chat%')
                )
            );

        console.log(`🧠 [Mnemosyne] Found ${chatTasks.length} potential chat sessions in Super Spine history.`);

        for (const task of chatTasks) {
            console.log(`🧠 [Mnemosyne] Ingesting task [${task.id}] (Type: ${task.type})...`);

            const messages = (task.input as any)?.messages || [];
            if (messages.length === 0 && (task.input as any)?.message) {
                messages.push({ role: 'user', content: (task.input as any).message });
                if (task.result) {
                    messages.push({ role: 'assistant', content: typeof task.result === 'string' ? task.result : JSON.stringify(task.result) });
                }
            }

            if (messages.length > 0) {
                await memoryDNA.recordChatSession({
                    agentId: task.agentKey,
                    messages,
                    metadata: {
                        source: 'super_spine_history',
                        taskId: task.id,
                        originalType: task.type,
                        timestamp: new Date(task.createdAt).getTime()
                    }
                });
            }
        }

        console.log("🏁 [Mnemosyne] Scavenging Complete.");
        process.exit(0);

    } catch (error) {
        console.error("❌ [Mnemosyne] Scavenging Failed:", error);
        process.exit(1);
    }
}

scavenger();
