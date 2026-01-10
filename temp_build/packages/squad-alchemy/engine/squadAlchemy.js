"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSquadAlchemyCycle = runSquadAlchemyCycle;
const squadRegistry_1 = require("../registry/squadRegistry");
const mergeStrategy_1 = require("../strategies/mergeStrategy");
const splitStrategy_1 = require("../strategies/splitStrategy");
const cloneStrategy_1 = require("../strategies/cloneStrategy");
function runSquadAlchemyCycle(ctx) {
    const decisions = [];
    // Sync Squad-Builder squads into Alchemy registry (async import handled separately)
    // Note: This is a synchronous function, so we can't await here
    // The sync will happen lazily when the bridge is first accessed
    try {
        // Use dynamic import without await - will be handled asynchronously
        Promise.resolve().then(() => __importStar(require("../bridge/squadBuilderBridge"))).then((module) => {
            const synced = module.syncSquadBuilderSquads();
            if (synced > 0) {
                console.log(`[SquadAlchemy] Synced ${synced} squads from Squad-Builder`);
            }
        }).catch(() => {
            // Bridge not available - continue with existing registry
        });
    }
    catch {
        // Bridge not available - continue with existing registry
    }
    const squads = squadRegistry_1.SquadRegistry.getAll();
    if (!squads.length) {
        return [
            {
                action: "noop",
                reason: "No squads registered for alchemy",
            },
        ];
    }
    // Example heuristic:
    // 1. Try merging smallest squads if many small squads exist
    if (squads.length >= 3) {
        const mergeDecision = (0, mergeStrategy_1.proposeMergeStrategy)(squads);
        decisions.push(mergeDecision);
        applyDecision(mergeDecision);
    }
    // 2. Try splitting largest squad if it is too big
    const largest = [...squads].sort((a, b) => b.members.length - a.members.length)[0];
    if (largest) {
        const splitDecision = (0, splitStrategy_1.proposeSplitStrategy)(largest);
        decisions.push(splitDecision);
        applyDecision(splitDecision);
    }
    // 3. Clone a specialized squad for high-pressure roles
    const specialized = squads.find((s) => ["repair", "deploy", "routing"].includes(s.role));
    if (specialized) {
        const cloneDecision = (0, cloneStrategy_1.proposeCloneStrategy)(specialized);
        decisions.push(cloneDecision);
        applyDecision(cloneDecision);
    }
    // Optional: push summary into Neural Mesh memory or QAL
    if (ctx.neuralMesh?.remember) {
        ctx.neuralMesh.remember({
            source: "SquadAlchemy",
            decisions,
            timestamp: Date.now(),
        });
    }
    return decisions;
}
function applyDecision(decision) {
    if (!decision || decision.action === "noop")
        return;
    if (decision.targetSquadIds) {
        decision.targetSquadIds.forEach((id) => {
            squadRegistry_1.SquadRegistry.remove(id);
        });
    }
    if (decision.newSquads) {
        decision.newSquads.forEach((squad) => squadRegistry_1.SquadRegistry.upsert(squad));
    }
}
