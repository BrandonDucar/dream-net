
/**
 * 🕵️‍♂️ MAINTENANCE SWARM SCHEDULER
 * 
 * Runs "Nano-Janitors" on a tick schedule.
 * Mimics a biological circadian rhythm for the DreamNet.
 */

import { randomUUID } from "node:crypto";

export type TaskFunction = () => Promise<void>;

export interface ScheduledTask {
    id: string;
    name: string;
    intervalMs: number;
    lastRun: number;
    action: TaskFunction;
}

export class SwarmScheduler {
    private tasks: ScheduledTask[] = [];
    private isRunning: boolean = false;
    private timer: NodeJS.Timeout | null = null;
    private tickRate: number = 1000; // Check every second

    register(name: string, intervalMs: number, action: TaskFunction) {
        this.tasks.push({
            id: randomUUID(),
            name,
            intervalMs,
            lastRun: 0,
            action
        });
        console.log(`🤖 [Scheduler] Registered Agent Task: ${name} (Every ${intervalMs}ms)`);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        console.log(`🕸️ [Swarm] Maintenance Swarm Activated (Tick: ${this.tickRate}ms).`);

        this.timer = setInterval(() => this.tick(), this.tickRate);
    }

    stop() {
        this.isRunning = false;
        if (this.timer) clearInterval(this.timer);
        console.log("🕸️ [Swarm] Maintenance Swarm Hibernating.");
    }

    private async tick() {
        const now = Date.now();

        for (const task of this.tasks) {
            if (now - task.lastRun >= task.intervalMs) {
                console.log(`🧹 [Nano-Janitor] Executing: ${task.name}`);
                try {
                    await task.action();
                    task.lastRun = now;
                } catch (err) {
                    console.error(`💥 [Nano-Janitor] Failed: ${task.name}`, err);
                }
            }
        }
    }
}
