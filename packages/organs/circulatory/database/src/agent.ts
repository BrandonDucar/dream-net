import * as schema from "@dreamnet/shared/schema";
import { db, isDbAvailable, getPool } from './index.js';
import { EventEmitter } from "node:events";
import os from "node:os";

/**
 * DATAKEEPER AGENT (The Persistent Will)
 * "The Memory of the Car."
 */
export class DataKeeperAgent extends EventEmitter {
    private isActive: boolean = false;
    private healthInterval: NodeJS.Timeout | null = null;
    private static instance: DataKeeperAgent;

    constructor() {
        super();
        this.isActive = isDbAvailable();
    }

    public static getInstance(): DataKeeperAgent {
        if (!DataKeeperAgent.instance) {
            DataKeeperAgent.instance = new DataKeeperAgent();
        }
        return DataKeeperAgent.instance;
    }

    /**
     * Start the DataKeeper monitoring
     */
    public start(): void {
        console.log("[DataKeeperAgent] 🗄️  Persistent Will Online.");
        this.healthInterval = setInterval(() => this.pulse(), 30000); // Pulse every 30s
        this.pulse(); // Initial pulse
    }

    public stop(): void {
        if (this.healthInterval) {
            clearInterval(this.healthInterval);
        }
        console.log("[DataKeeperAgent] 🛑 Persistent Will Offline.");
    }

    /**
     * Get current status of the database agent
     */
    public status() {
        return {
            agent: "DataKeeper",
            status: isDbAvailable() ? "active" : "offline",
            uptime: process.uptime(),
            load: os.loadavg(),
            connection: isDbAvailable() ? "ok" : "failed"
        };
    }

    /**
     * Internal pulse (health check)
     */
    private async pulse(): Promise<void> {
        const available = isDbAvailable();
        if (available !== this.isActive) {
            this.isActive = available;
            this.emit("state_change", { status: this.isActive ? "recovered" : "degraded" });
            console.warn(`[DataKeeperAgent] 🚨 Database State Changed: ${this.isActive ? "ONLINE" : "OFFLINE"}`);
        }

        if (available) {
            try {
                // Background check if connection is still healthy
                const pool = getPool();
                if (pool) {
                    const client = await pool.connect();
                    client.release();
                    this.emit("heartbeat", { latency: "ok" });
                }
            } catch (error) {
                console.error("[DataKeeperAgent] ❌ Heartbeat test failed:", error);
                this.emit("error", error);
            }
        }
    }

    /**
     * Access the raw database instance
     */
    public get db() {
        return db;
    }

    /**
     * Access the shared schema
     */
    public get schema() {
        return schema;
    }
}

// Export the singleton for monorepo-wide use
export const DataKeeper = DataKeeperAgent.getInstance();
