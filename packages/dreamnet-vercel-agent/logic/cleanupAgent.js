/**
 * Vercel Cleanup Agent
 * Analyzes Vercel projects and suggests/executes cleanup actions
 */
import { listProjects, listDeployments, deleteDeployment, deleteProject, getProjectDomains, removeDomain, addDomain, } from './vercelClient.js';
import { bridgeToSpiderWeb } from '@dreamnet/dreamnet-operational-bridge';
/**
 * Analyze projects and find cleanup opportunities
 */
export async function analyzeCleanup(targetDomain = "dreamnet.ink") {
    const actions = [];
    try {
        const projects = await listProjects();
        console.log(`[VercelAgent] Found ${projects.length} projects`);
        // Find projects with old deployments
        for (const project of projects) {
            const deployments = await listDeployments(project.id, 50);
            // Find old/non-production deployments
            const oldDeployments = deployments.filter(d => d.state !== "READY" || (d.target !== "production" && d.createdAt < Date.now() - 7 * 24 * 60 * 60 * 1000));
            for (const deployment of oldDeployments) {
                actions.push({
                    type: "delete_deployment",
                    target: deployment.id,
                    reason: `Old ${deployment.state} deployment from ${new Date(deployment.createdAt).toLocaleDateString()}`,
                    metadata: { projectName: project.name, deploymentUrl: deployment.url },
                });
            }
            // Check domain configuration
            const domains = await getProjectDomains(project.id);
            const hasTargetDomain = domains.includes(targetDomain);
            // If this project should have dreamnet.ink but doesn't, or vice versa
            if (project.name.includes("dream-net") || project.name.includes("dreamnet")) {
                if (!hasTargetDomain) {
                    actions.push({
                        type: "update_domain",
                        target: project.id,
                        reason: `Project ${project.name} should have ${targetDomain} domain`,
                        metadata: { action: "add", domain: targetDomain },
                    });
                }
            }
            else if (hasTargetDomain) {
                // Old project has the domain but shouldn't
                actions.push({
                    type: "update_domain",
                    target: project.id,
                    reason: `Old project ${project.name} has ${targetDomain} but shouldn't`,
                    metadata: { action: "remove", domain: targetDomain },
                });
            }
        }
        // Find duplicate/old projects
        const projectGroups = new Map();
        for (const project of projects) {
            const baseName = project.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            if (!projectGroups.has(baseName)) {
                projectGroups.set(baseName, []);
            }
            projectGroups.get(baseName).push(project);
        }
        for (const [baseName, group] of projectGroups.entries()) {
            if (group.length > 1) {
                // Sort by updatedAt, keep newest
                group.sort((a, b) => b.updatedAt - a.updatedAt);
                const toDelete = group.slice(1); // All except newest
                for (const oldProject of toDelete) {
                    actions.push({
                        type: "delete_project",
                        target: oldProject.id,
                        reason: `Duplicate project: ${oldProject.name} (kept newer: ${group[0].name})`,
                        metadata: { keptProject: group[0].name },
                    });
                }
            }
        }
        return actions;
    }
    catch (error) {
        console.error("[VercelAgent] Failed to analyze cleanup:", error.message);
        return [];
    }
}
/**
 * Execute cleanup action
 */
export async function executeCleanupAction(action) {
    try {
        switch (action.type) {
            case "delete_deployment":
                const deleted = await deleteDeployment(action.target);
                if (deleted) {
                    bridgeToSpiderWeb({
                        type: "audit_event",
                        severity: "low",
                        message: `Deleted Vercel deployment: ${action.target}`,
                        metadata: { reason: action.reason },
                        timestamp: Date.now(),
                    });
                }
                return deleted;
            case "delete_project":
                const projectDeleted = await deleteProject(action.target);
                if (projectDeleted) {
                    bridgeToSpiderWeb({
                        type: "audit_event",
                        severity: "medium",
                        message: `Deleted Vercel project: ${action.target}`,
                        metadata: { reason: action.reason },
                        timestamp: Date.now(),
                    });
                }
                return projectDeleted;
            case "update_domain":
                const projectId = action.target;
                const domainAction = action.metadata?.action;
                const domain = action.metadata?.domain;
                if (domainAction === "add" && domain) {
                    const added = await addDomain(projectId, domain);
                    if (added) {
                        bridgeToSpiderWeb({
                            type: "audit_event",
                            severity: "low",
                            message: `Added domain ${domain} to project ${projectId}`,
                            metadata: { reason: action.reason },
                            timestamp: Date.now(),
                        });
                    }
                    return added;
                }
                else if (domainAction === "remove" && domain) {
                    const removed = await removeDomain(projectId, domain);
                    if (removed) {
                        bridgeToSpiderWeb({
                            type: "audit_event",
                            severity: "low",
                            message: `Removed domain ${domain} from project ${projectId}`,
                            metadata: { reason: action.reason },
                            timestamp: Date.now(),
                        });
                    }
                    return removed;
                }
                return false;
            default:
                return false;
        }
    }
    catch (error) {
        console.error(`[VercelAgent] Failed to execute ${action.type}:`, error.message);
        return false;
    }
}
/**
 * Execute all cleanup actions (with dry-run option)
 */
export async function executeCleanup(actions, dryRun = true) {
    let executed = 0;
    let failed = 0;
    let skipped = 0;
    for (const action of actions) {
        if (dryRun) {
            console.log(`[VercelAgent] [DRY RUN] Would execute: ${action.type} on ${action.target}`);
            skipped++;
            continue;
        }
        const success = await executeCleanupAction(action);
        if (success) {
            executed++;
        }
        else {
            failed++;
        }
        // Rate limit: wait 1 second between actions
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return { executed, failed, skipped };
}
//# sourceMappingURL=cleanupAgent.js.map