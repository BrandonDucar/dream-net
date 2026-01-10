/**
 * The Shipping Container (Standardized Agent Wrapper)
 * Hijacked Wisdom: Supply Chain Logistics (Maersk)
 * 
 * Philosophy: Standardization reduces complexity.
 * Mechanism: Every agent must fit inside this box. No exceptions.
 */

import { z } from 'zod';
import { EpistemicValue, EpistemicTriad } from './EpistemicTriad.js';

export type AgentStatus = 'IDLE' | 'WORKING' | 'ERROR' | 'OFFLINE' | 'METABOLIC_SHEDDING';

export interface AgentHealth {
    status: AgentStatus;
    lastHeartbeat: number;
    errorCount: number;
    memoryUsage: number;
    epistemicConfidence?: number;
}

export abstract class AgentContainer<TConfig = any, TOutput = any> {
    protected config: TConfig;
    protected status: AgentStatus = 'OFFLINE';
    protected errorCount: number = 0;

    constructor(config: TConfig) {
        this.config = config;
    }

    /**
     * Universal Boot Sequence
     */
    async boot(): Promise<void> {
        try {
            console.log(`[🚛 Container] Booting ${this.constructor.name}...`);
            this.status = 'WORKING';
            await this.onBoot();
        } catch (err) {
            this.status = 'ERROR';
            this.errorCount++;
            console.error(`[🚛 Container] Boot Failed for ${this.constructor.name}:`, err);
            throw err;
        }
    }

    /**
     * Universal Shutdown Sequence
     */
    async shutdown(): Promise<void> {
        console.log(`[🚛 Container] Shutting down ${this.constructor.name}...`);
        this.status = 'OFFLINE';
        await this.onShutdown();
    }

    /**
     * Universal Health Check
     */
    checkHealth(): AgentHealth {
        return {
            status: this.status,
            lastHeartbeat: Date.now(),
            errorCount: this.errorCount,
            memoryUsage: process.memoryUsage().heapUsed,
            epistemicConfidence: this.lastConfidence
        };
    }

    protected lastConfidence: number = 1.0;

    /**
     * 🧠 EPISTEMIC THINK
     * Executes the agent's logic but returns a Triad [Certain, Unknown, Probable].
     * Allows for sub-millisecond decision shedding based on confidence.
     */
    public async epistemicThink<T = any>(input: any): Promise<EpistemicValue<T>> {
        try {
            const result = await this.execute(input);
            // Default to PROBABLE if confidence is not explicitly returned by agent logic
            // In the future, execute() will be refactored to return triads directly.
            const confidence = 0.9;
            this.lastConfidence = confidence;
            return EpistemicTriad.probable(result, confidence);
        } catch (err) {
            return EpistemicTriad.unknown();
        }
    }

    // Abstract methods that the specific "Cargo" (Agent Logic) must implement
    protected abstract onBoot(): Promise<void>;
    protected abstract onShutdown(): Promise<void>;
    public abstract execute(input: any): Promise<TOutput>;

    // 💿 THE IDENTITY DISC (ISOMORPHIC DNA)
    // Every agent carries the snapshot of its own source code.
    // The 'Disc' is the cryptographic hash of its implementation.
    protected identityDisc: string = 'UNINIT';

    // Abstract source path - must be defined by concrete agents for the Disc to work
    protected abstract sourcePath?: string;

    public getIdentity(): string {
        return this.identityDisc;
    }

    /**
     * ⚓ ANCHOR TO WISDOM
     * Allows the agent to query the Cosmic Layer for immutable directives.
     * Enforces a cryptographic 'reality check' before acting on high-stakes logic.
     */
    protected async anchorToWisdom(contextKey: string): Promise<any> {
        try {
            // Dynamic import to avoid circular dependencies in core
            const { memorySystem } = await import('@dreamnet/memory-dna');

            // 1. Verify the integrity of the entire chain first
            if (!memorySystem.cosmic.verifyIntegrity()) {
                throw new Error("COSMIC_SEVERANCE: The architectural soul is corrupt. Halting.");
            }

            // 2. Recall the immutable directive
            const wisdom = await memorySystem.cosmic.recall(contextKey);

            if (!wisdom) {
                console.warn(`[🚛 ${this.constructor.name}] Wisdom Anchor '${contextKey}' not found. Drifting...`);
                return null;
            }

            console.log(`[🚛 ${this.constructor.name}] Anchored to Cosmic Wisdom: ${contextKey}`);
            return wisdom;
        } catch (e) {
            console.error(`[🚛 ${this.constructor.name}] Failed to anchor to wisdom:`, e);
            throw e; // Fail hard on cosmic errors
        }
    }

    protected async equipIdentityDisc() {
        try {
            if (this.sourcePath) {
                const fs = await import('fs');
                const path = await import('path');
                const crypto = await import('node:crypto');

                const fullPath = path.resolve(process.cwd(), this.sourcePath);

                if (fs.existsSync(fullPath)) {
                    const sourceCode = fs.readFileSync(fullPath, 'utf-8');
                    const hash = crypto.createHash('sha256').update(sourceCode).digest('hex');
                    this.identityDisc = `ISO-${hash.slice(0, 16)}`;
                    console.log(`[💿 Disc] Identity Equipped for ${this.constructor.name}: ${this.identityDisc}`);
                } else {
                    console.error(`[💿 Disc] CRITICAL: Source file not found at ${fullPath}. Identity Unverified.`);
                    this.identityDisc = 'UNVERIFIED_GHOST';
                }
            } else {
                console.warn(`[💿 Disc] No source path defined for ${this.constructor.name}. Operating as Phantom.`);
                this.identityDisc = 'PHANTOM_SIGNAL';
            }
        } catch (e) {
            console.error(`[💿 Disc] Failed to equip identity disc for ${this.constructor.name}:`, e);
            throw new Error("IDENTITY_EQUIP_FAILURE");
        }
    }
}
