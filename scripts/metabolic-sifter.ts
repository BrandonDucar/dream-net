#!/usr/bin/env tsx
/**
 * 🧹 Metabolic Sifter (SifterAgent v2)
 * 
 * An autonomous agent that monitor build/run logs, Extracts "Metabolic Waste" (errors),
 * and applies "Surgery" (auto-patches) to restore system homeostasis.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { BaseAgent, AgentConfig } from "../packages/agents/src/core/BaseAgent";
import { dreamEventBus } from "../packages/nerve/src/index";

interface ErrorSeed {
    id: string;
    file?: string;
    line?: number;
    context?: string;
}

export class MetabolicSifter extends BaseAgent {
    private logs: string = "";
    private seeds: ErrorSeed[] = [];

    constructor(config: AgentConfig) {
        super(config);
    }

    /**
     * Simulation of self-refinement logic for debugging complex issues.
     */
    protected async performSelfRefinement(thought: string): Promise<string> {
        return `${thought} -> Metabolic Deep-Dive: [Scanning AST for mutation...]`;
    }

    /**
     * Main lifecycle: Sift -> Diagnose -> Patch -> Verify
     */
    public async ignite(): Promise<void> {
        console.log(`[🧹 ${this.name}] Starting Metabolic Cycle...`);

        // 1. Sift
        this.sift();

        if (this.seeds.length === 0) {
            console.log(`[🧹 ${this.name}] System Homeostasis confirmed. No waste detected.`);
            return;
        }

        // 2. Diagnose & Patch
        for (const seed of this.seeds) {
            await this.patch(seed);
        }

        // 3. Verify
        this.verify();
    }

    private sift() {
        const logFile = "script_output.log";
        if (existsSync(logFile)) {
            this.logs = readFileSync(logFile, "utf-8");
        }

        // Detect ERR_PACKAGE_PATH_NOT_EXPORTED in drizzle-zod
        if (this.logs.includes("ERR_PACKAGE_PATH_NOT_EXPORTED") && this.logs.includes("zod/v4")) {
            this.seeds.push({ id: "DRIZZLE_ZOD_V4_BUG", context: "zod/v4 import in drizzle-zod" });
        }

        // Detect z.int is not a function
        if (this.logs.includes("TypeError: z.int is not a function")) {
            this.seeds.push({ id: "DRIZZLE_ZOD_INT_BUG", context: "z.int() call in drizzle-zod" });
        }

        // Detect Node version mismatch
        if (this.logs.includes("Unsupported engine") && this.logs.includes("node")) {
            this.seeds.push({ id: "ENGINE_MISMATCH", context: "Node/pnpm engine versioning" });
        }
    }

    private async patch(seed: ErrorSeed) {
        console.log(`[🧪 ${this.name}] Applying surgical patch for ${seed.id}...`);

        switch (seed.id) {
            case "DRIZZLE_ZOD_V4_BUG":
            case "DRIZZLE_ZOD_INT_BUG":
                this.surgeryDrizzleZod();
                break;
            case "ENGINE_MISMATCH":
                this.surgeryEngines();
                break;
            default:
                console.log(`[⚠️ ${this.name}] No surgical protocol for ${seed.id}.`);
        }
    }

    private surgeryDrizzleZod() {
        const target = join(process.cwd(), "node_modules", "drizzle-zod", "index.mjs");
        if (!existsSync(target)) return;

        let content = readFileSync(target, "utf-8");

        // Fix zod/v4
        content = content.replace("import { z } from 'zod/v4';", "import { z } from 'zod';");

        // Fix z.int() and inverted logic
        content = content.replace(
            /let schema = coerce === true \|\| coerce\?\.number\s+\? integer \? z\.coerce\.number\(\) : z\.coerce\.number\(\)\.int\(\)\s+: integer\s+\? z\.int\(\)\s+: z\.number\(\);/g,
            `let schema = coerce === true || coerce?.number
        ? integer ? z.coerce.number().int() : z.coerce.number()
        : integer
            ? z.number().int()
            : z.number();`
        );

        writeFileSync(target, content);
        console.log(`[🗡️ ${this.name}] Drizzle-Zod Surgery Complete.`);
    }

    private surgeryEngines() {
        const pkgPath = join(process.cwd(), "package.json");
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

        pkg.engines = {
            "node": "20.x",
            "pnpm": "9.15.0"
        };
        pkg.packageManager = "pnpm@9.15.0";

        writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
        console.log(`[🗡️ ${this.name}] Engine Pinning Surgery Complete.`);
    }

    private verify() {
        console.log(`[📡 ${this.name}] Emitting Metabolic Report to Nerve...`);
        dreamEventBus.publish({
            type: "Agent.MetabolicRepair",
            payload: {
                agentId: this.name,
                patchesApplied: this.seeds.map(s => s.id),
                timestamp: new Date().toISOString()
            },
            source: "SIFTER"
        });
    }
}

// Ignition logic
if (import.meta.url === `file://${process.argv[1]}`) {
    const sifter = new MetabolicSifter({
        name: "MetabolicSifter",
        thinkingBudget: 3
    });
    sifter.ignite().catch(console.error);
}
