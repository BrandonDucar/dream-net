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
exports.submitGraft = submitGraft;
exports.validateGraft = validateGraft;
exports.installGraft = installGraft;
exports.applyGraft = applyGraft;
exports.runPostInstallTasks = runPostInstallTasks;
exports.broadcastGraftEvent = broadcastGraftEvent;
const node_crypto_1 = require("node:crypto");
const registry_1 = require("./registry");
const validatorEndpoint_1 = require("./validators/validatorEndpoint");
const validatorAgent_1 = require("./validators/validatorAgent");
const validatorUI_1 = require("./validators/validatorUI");
const validatorModule_1 = require("./validators/validatorModule");
const processorEndpoint_1 = require("./processors/processorEndpoint");
const processorAgent_1 = require("./processors/processorAgent");
const processorUI_1 = require("./processors/processorUI");
const processorModule_1 = require("./processors/processorModule");
const graftEvents = __importStar(require("./events/emitter"));
const memory_dna_1 = require("../memory-dna");
const validators = {
    endpoint: new validatorEndpoint_1.EndpointValidator(),
    agent: new validatorAgent_1.AgentValidator(),
    ui: new validatorUI_1.UIValidator(),
    module: new validatorModule_1.ModuleValidator(),
};
const processors = {
    endpoint: new processorEndpoint_1.EndpointProcessor(),
    agent: new processorAgent_1.AgentProcessor(),
    ui: new processorUI_1.UIProcessor(),
    module: new processorModule_1.ModuleProcessor(),
};
async function ensureGraftLoaded(id) {
    const current = await (0, registry_1.getGraftById)(id);
    if (!current) {
        throw new Error(`Graft ${id} not found`);
    }
    return current;
}
async function submitGraft(partial) {
    const graft = {
        id: partial.id ?? (0, node_crypto_1.randomUUID)(),
        type: partial.type ?? "module",
        name: partial.name ?? "untitled-graft",
        path: partial.path ?? "",
        metadata: partial.metadata ?? {},
        createdAt: new Date().toISOString(),
        status: "pending",
        logs: [],
    };
    await (0, registry_1.registerGraft)(graft);
    graftEvents.emit("graft:registered", graft);
    return graft;
}
async function validateGraft(graft) {
    const validator = validators[graft.type];
    if (!validator) {
        return { ok: true, issues: [] };
    }
    const result = await validator.validate(graft);
    await (0, registry_1.updateGraftStatus)(graft.id, result.ok ? "validated" : "failed", {
        error: result.ok ? null : result.issues.join("\n"),
    });
    graftEvents.emit(result.ok ? "graft:validated" : "graft:failed", {
        ...graft,
        status: result.ok ? "validated" : "failed",
        error: result.ok ? null : result.issues.join("\n"),
    });
    return result;
}
async function installGraft(graft) {
    const processor = processors[graft.type];
    if (!processor) {
        await (0, registry_1.updateGraftStatus)(graft.id, "failed", { error: `No processor for type ${graft.type}` });
        graftEvents.emit("graft:failed", { ...graft, status: "failed" });
        await (0, memory_dna_1.updateTraitsFromEvent)({
            id: `${graft.id}-failure`,
            timestamp: new Date().toISOString(),
            sourceType: "graft",
            eventType: "graft.failed",
            severity: "error",
            payload: { graftId: graft.id, error: `No processor for type ${graft.type}` },
            handled: false,
        });
        return;
    }
    const result = await processor.install(graft);
    if (!result.ok) {
        await (0, registry_1.updateGraftStatus)(graft.id, "failed", {
            error: result.message,
            logs: result.logs,
        });
        // Emit Event Wormhole event
        try {
            const { emitEvent } = await Promise.resolve().then(() => __importStar(require("../event-wormholes")));
            await emitEvent({
                sourceType: "graft",
                eventType: "graft.install.failed",
                severity: "error",
                payload: { graftId: graft.id, error: result.message },
            });
        }
        catch {
            // Event Wormholes not available, continue
        }
        graftEvents.emit("graft:failed", {
            ...graft,
            status: "failed",
            error: result.message,
            logs: result.logs,
        });
        await (0, memory_dna_1.updateTraitsFromEvent)({
            id: `${graft.id}-failed`,
            timestamp: new Date().toISOString(),
            sourceType: "graft",
            eventType: "graft.failed",
            severity: "error",
            payload: { graftId: graft.id, error: result.message },
            handled: false,
        });
        return;
    }
    await (0, registry_1.updateGraftStatus)(graft.id, "installed", {
        error: null,
        logs: result.logs,
    });
    const installedPayload = {
        ...graft,
        status: "installed",
        logs: result.logs,
    };
    graftEvents.emit("graft:installed", installedPayload);
    // Emit Event Wormhole event
    try {
        const { emitEvent } = await Promise.resolve().then(() => __importStar(require("../event-wormholes")));
        await emitEvent({
            sourceType: "graft",
            eventType: "graft.installed",
            severity: "info",
            payload: { graftId: graft.id, type: graft.type, name: graft.name },
        });
    }
    catch {
        // Event Wormholes not available, continue
    }
    await (0, memory_dna_1.updateTraitsFromEvent)({
        id: `${graft.id}-installed`,
        timestamp: new Date().toISOString(),
        sourceType: "graft",
        eventType: "graft.installed",
        severity: "info",
        payload: { graftId: graft.id, type: graft.type, name: graft.name },
        handled: true,
    });
}
async function applyGraft(id) {
    const graft = await ensureGraftLoaded(id);
    const validation = await validateGraft(graft);
    if (!validation.ok) {
        throw new Error(`Validation failed: ${validation.issues.join(", ")}`);
    }
    const validated = await ensureGraftLoaded(id);
    await installGraft(validated);
    const installed = await ensureGraftLoaded(id);
    await runPostInstallTasks(installed);
    return installed;
}
async function runPostInstallTasks(graft) {
    // TODO: integrate API Forge test run, HALO revalidation, DreamScope refresh.
    // For now emit event so listeners can react.
    broadcastGraftEvent("graft:installed", graft);
}
function broadcastGraftEvent(event, graft) {
    graftEvents.emit(event, graft);
}
