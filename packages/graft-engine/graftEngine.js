import { randomUUID } from "node:crypto";
import { registerGraft, getGraftById, updateGraftStatus } from "./registry";
import { EndpointValidator } from "./validators/validatorEndpoint";
import { AgentValidator } from "./validators/validatorAgent";
import { UIValidator } from "./validators/validatorUI";
import { ModuleValidator } from "./validators/validatorModule";
import { EndpointProcessor } from "./processors/processorEndpoint";
import { AgentProcessor } from "./processors/processorAgent";
import { UIProcessor } from "./processors/processorUI";
import { ModuleProcessor } from "./processors/processorModule";
import * as graftEvents from "./events/emitter";
import { updateTraitsFromEvent } from "../memory-dna";
const validators = {
    endpoint: new EndpointValidator(),
    agent: new AgentValidator(),
    ui: new UIValidator(),
    module: new ModuleValidator(),
};
const processors = {
    endpoint: new EndpointProcessor(),
    agent: new AgentProcessor(),
    ui: new UIProcessor(),
    module: new ModuleProcessor(),
};
async function ensureGraftLoaded(id) {
    const current = await getGraftById(id);
    if (!current) {
        throw new Error(`Graft ${id} not found`);
    }
    return current;
}
export async function submitGraft(partial) {
    const graft = {
        id: partial.id ?? randomUUID(),
        type: partial.type ?? "module",
        name: partial.name ?? "untitled-graft",
        path: partial.path ?? "",
        metadata: partial.metadata ?? {},
        createdAt: new Date().toISOString(),
        status: "pending",
        logs: [],
    };
    await registerGraft(graft);
    graftEvents.emit("graft:registered", graft);
    return graft;
}
export async function validateGraft(graft) {
    const validator = validators[graft.type];
    if (!validator) {
        return { ok: true, issues: [] };
    }
    const result = await validator.validate(graft);
    await updateGraftStatus(graft.id, result.ok ? "validated" : "failed", {
        error: result.ok ? null : result.issues.join("\n"),
    });
    graftEvents.emit(result.ok ? "graft:validated" : "graft:failed", {
        ...graft,
        status: result.ok ? "validated" : "failed",
        error: result.ok ? null : result.issues.join("\n"),
    });
    return result;
}
export async function installGraft(graft) {
    const processor = processors[graft.type];
    if (!processor) {
        await updateGraftStatus(graft.id, "failed", { error: `No processor for type ${graft.type}` });
        graftEvents.emit("graft:failed", { ...graft, status: "failed" });
        await updateTraitsFromEvent({
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
        await updateGraftStatus(graft.id, "failed", {
            error: result.message,
            logs: result.logs,
        });
        // Emit Event Wormhole event
        try {
            const { emitEvent } = await import("../event-wormholes");
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
        await updateTraitsFromEvent({
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
    await updateGraftStatus(graft.id, "installed", {
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
        const { emitEvent } = await import("../event-wormholes");
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
    await updateTraitsFromEvent({
        id: `${graft.id}-installed`,
        timestamp: new Date().toISOString(),
        sourceType: "graft",
        eventType: "graft.installed",
        severity: "info",
        payload: { graftId: graft.id, type: graft.type, name: graft.name },
        handled: true,
    });
}
export async function applyGraft(id) {
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
export async function runPostInstallTasks(graft) {
    // TODO: integrate API Forge test run, HALO revalidation, DreamScope refresh.
    // For now emit event so listeners can react.
    broadcastGraftEvent("graft:installed", graft);
}
export function broadcastGraftEvent(event, graft) {
    graftEvents.emit(event, graft);
}
