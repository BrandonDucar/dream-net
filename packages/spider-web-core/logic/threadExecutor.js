import { SpiderStore } from "../store/spiderStore";
/**
 * Execute a thread's execution plan
 */
export async function executeThread(thread, ctx) {
    if (!thread.executable || !thread.executionPlan) {
        return { success: false, error: "Thread is not executable or has no execution plan" };
    }
    const executionStart = Date.now();
    const results = {};
    try {
        // Execute each step in order
        for (const step of thread.executionPlan.steps.sort((a, b) => a.order - b.order)) {
            const stepResult = await executeStep(step, ctx);
            results[step.id] = stepResult;
            // If step fails, rollback if possible
            if (!stepResult.success && thread.executionPlan.rollbackSteps) {
                console.log(`[ThreadExecutor] Step ${step.id} failed, attempting rollback...`);
                await rollbackThread(thread, ctx);
                return { success: false, error: stepResult.error, result: results };
            }
        }
        const executionTime = Date.now() - executionStart;
        // Update thread
        thread.status = "completed";
        thread.executedAt = Date.now();
        thread.executionResult = results;
        thread.updatedAt = Date.now();
        SpiderStore.updateThread(thread);
        console.log(`[ThreadExecutor] Thread ${thread.id} executed successfully in ${executionTime}ms`);
        return { success: true, result: results };
    }
    catch (err) {
        thread.status = "failed";
        thread.error = String(err);
        thread.updatedAt = Date.now();
        SpiderStore.updateThread(thread);
        return { success: false, error: String(err), result: results };
    }
}
/**
 * Execute a single execution step
 */
async function executeStep(step, ctx) {
    console.log(`[ThreadExecutor] Executing step: ${step.action} on ${step.target.kind}:${step.target.id}`);
    try {
        switch (step.action) {
            case "create-orca-post":
                // Create an Orca post idea/plan
                if (ctx.orcaPackCore?.upsertIdea) {
                    const idea = ctx.orcaPackCore.upsertIdea({
                        id: `idea:thread:${Date.now()}`,
                        kind: "short-text",
                        themeId: step.params.themeId || "theme:dreamnet-organism",
                        title: step.params.title,
                        body: step.params.body || "",
                        tags: step.params.tags || [],
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    });
                    return { success: true, result: { ideaId: idea.id } };
                }
                return { success: false, error: "OrcaPackCore not available" };
            case "update-narrative":
                // Add to NarrativeField
                if (ctx.narrativeField?.add) {
                    ctx.narrativeField.add({
                        id: `narrative:thread:${Date.now()}`,
                        timestamp: Date.now(),
                        title: step.params.title || "Thread execution",
                        summary: step.params.summary || "",
                        severity: step.params.severity || "info",
                        domain: step.params.domain || "generic",
                        tags: step.params.tags || ["spider-web"],
                        references: step.params.references || [],
                    });
                    return { success: true };
                }
                return { success: false, error: "NarrativeField not available" };
            case "remember-neural-mesh":
                // Store in NeuralMesh
                if (ctx.neuralMesh?.remember) {
                    ctx.neuralMesh.remember({
                        source: "SpiderWebCore",
                        ...step.params,
                        timestamp: Date.now(),
                    });
                    return { success: true };
                }
                return { success: false, error: "NeuralMesh not available" };
            case "trigger-wolf-action":
                // Trigger Wolf Pack action
                if (ctx.wolfPackCore?.run) {
                    // Could trigger specific Wolf Pack operations
                    return { success: true };
                }
                return { success: false, error: "WolfPackCore not available" };
            case "trigger-whale-action":
                // Trigger Whale Pack action
                if (ctx.whalePackCore?.run) {
                    return { success: true };
                }
                return { success: false, error: "WhalePackCore not available" };
            case "broadcast-status":
                // Broadcast status to multiple packs
                return { success: true };
            case "optimize-seo":
                // Optimize content for SEO
                if (ctx.spiderWebCore?.AISEOCore) {
                    const seoResult = ctx.spiderWebCore.AISEOCore.optimizeContent(step.params.contentType || "post", step.params.contentId || `content:${Date.now()}`, step.params.platform || "web", step.params.title, step.params.description);
                    return { success: true, result: { optimizationId: seoResult.id, score: seoResult.score } };
                }
                return { success: false, error: "AISEOCore not available" };
            case "apply-geofence":
                // Apply geofencing rules
                if (ctx.spiderWebCore?.AISEOCore) {
                    const geofences = ctx.spiderWebCore.AISEOCore.checkGeofence(step.params.location || {});
                    const rules = ctx.spiderWebCore.AISEOCore.applyGeofenceRules(geofences.map((g) => g.id), step.params.contentType, step.params.platform);
                    return { success: true, result: { geofences: geofences.length, rules: rules.length } };
                }
                return { success: false, error: "AISEOCore not available" };
            case "fire-shield-spike":
                // Fire shield spike
                if (ctx.spiderWebCore?.ShieldCore) {
                    const spike = ctx.spiderWebCore.ShieldCore.fireSpike(step.params.name || "Thread Spike", step.params.type || "block", step.params.target || "unknown", step.params.power || 1.0);
                    return { success: spike.success, result: { spikeId: spike.id } };
                }
                return { success: false, error: "ShieldCore not available" };
            case "create-cellular-shield":
                // Create cellular shield for a cell
                if (ctx.spiderWebCore?.ShieldCore) {
                    const shield = ctx.spiderWebCore.ShieldCore.createCellularShield(step.params.cellId, step.params.cellType || "agent", step.params.wormholeId);
                    return { success: true, result: { cellId: shield.cellId } };
                }
                return { success: false, error: "ShieldCore not available" };
            case "propagate-wormhole":
                // Propagate signal via wormhole
                if (ctx.spiderWebCore?.ShieldCore) {
                    const signal = ctx.spiderWebCore.ShieldCore.propagateShieldViaWormhole(step.params.signalType || "shield-update", step.params.sourcePhase || "cellular", step.params.payload || {}, step.params.targetCells);
                    return { success: true, result: { signalId: signal.id, propagationCount: signal.propagationCount } };
                }
                return { success: false, error: "ShieldCore not available" };
            default:
                return { success: false, error: `Unknown action: ${step.action}` };
        }
    }
    catch (err) {
        return { success: false, error: String(err) };
    }
}
/**
 * Rollback a thread execution
 */
async function rollbackThread(thread, ctx) {
    if (!thread.executionPlan?.rollbackSteps) {
        console.log(`[ThreadExecutor] No rollback steps for thread ${thread.id}`);
        return;
    }
    console.log(`[ThreadExecutor] Rolling back thread ${thread.id}...`);
    // Execute rollback steps in reverse order
    const rollbackSteps = [...thread.executionPlan.rollbackSteps].sort((a, b) => b.order - a.order);
    for (const step of rollbackSteps) {
        try {
            await executeStep(step, ctx);
        }
        catch (err) {
            console.error(`[ThreadExecutor] Rollback step ${step.id} failed:`, err);
        }
    }
}
/**
 * Check if thread dependencies are met
 */
export function canExecuteThread(thread) {
    if (!thread.dependsOn || thread.dependsOn.length === 0) {
        return true;
    }
    // Check if all dependencies are completed
    for (const depId of thread.dependsOn) {
        const depThread = SpiderStore.getThread(depId);
        if (!depThread || depThread.status !== "completed") {
            return false;
        }
    }
    return true;
}
