import { SpiderStore } from "../store/spiderStore";
import { executeThread, canExecuteThread } from "./threadExecutor";
import { findMatchingTemplate, applyTemplateToThread } from "./threadTemplates";
/**
 * Run Orb Weaver - route and execute threads
 */
export async function runOrbWeaver(ctx) {
    const pendingThreads = SpiderStore.listThreadsByStatus("pending");
    const now = Date.now();
    console.log(`[OrbWeaver] Processing ${pendingThreads.length} pending thread(s)...`);
    // Sort by priority (critical first)
    const sortedThreads = [...pendingThreads].sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    for (const thread of sortedThreads) {
        // Check dependencies
        if (!canExecuteThread(thread)) {
            console.log(`[OrbWeaver] Thread ${thread.id} waiting on dependencies`);
            continue;
        }
        // Find and apply template if thread doesn't have execution plan
        if (!thread.executionPlan && thread.executable) {
            const template = findMatchingTemplate(thread);
            if (template) {
                applyTemplateToThread(thread, template);
                SpiderStore.updateThread(thread);
                console.log(`[OrbWeaver] Applied template ${template.id} to thread ${thread.id}`);
            }
        }
        // Mark as in-progress
        thread.status = "in-progress";
        thread.updatedAt = now;
        SpiderStore.updateThread(thread);
        // Execute thread if it has an execution plan
        if (thread.executable && thread.executionPlan) {
            try {
                const result = await executeThread(thread, ctx);
                if (result.success) {
                    // Update template success rate
                    if (thread.templateId) {
                        SpiderStore.updateTemplateUsage(thread.templateId, true);
                    }
                    // Create response thread if needed (bidirectional)
                    if (thread.targets.length > 0 && result.result) {
                        // Could create response threads here
                    }
                    console.log(`[OrbWeaver] Thread ${thread.id} executed successfully`);
                }
                else {
                    thread.status = "failed";
                    thread.error = result.error;
                    thread.updatedAt = Date.now();
                    SpiderStore.updateThread(thread);
                    // Update template failure
                    if (thread.templateId) {
                        SpiderStore.updateTemplateUsage(thread.templateId, false);
                    }
                    console.error(`[OrbWeaver] Thread ${thread.id} failed: ${result.error}`);
                }
            }
            catch (err) {
                thread.status = "failed";
                thread.error = String(err);
                thread.updatedAt = Date.now();
                SpiderStore.updateThread(thread);
                console.error(`[OrbWeaver] Thread ${thread.id} execution error:`, err);
            }
        }
        else {
            // Thread without execution plan - just mark as completed
            thread.status = "completed";
            thread.updatedAt = now;
            SpiderStore.updateThread(thread);
            console.log(`[OrbWeaver] Thread ${thread.id} completed (no execution plan)`);
        }
    }
}
