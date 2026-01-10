"use strict";
/**
 * Agent Gateway Tool Executor
 * Executes tools by calling underlying DreamNet organs
 */
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
exports.executeTool = executeTool;
const tools_1 = require("./tools");
const activity_1 = require("./activity");
const conduitGovernor_1 = require("@dreamnet/dreamnet-control-core/conduitGovernor");
const conduits_1 = require("@dreamnet/dreamnet-control-core/conduits");
const deadLetter_1 = require("@dreamnet/dreamnet-control-core/deadLetter");
/**
 * Emit Nerve event for tool execution
 */
async function emitToolExecutionEvent(toolId, ok, req, latencyMs, error, isTimeout) {
    try {
        const { NERVE_BUS } = await Promise.resolve().then(() => __importStar(require("@dreamnet/nerve/bus")));
        const { createNerveEvent } = await Promise.resolve().then(() => __importStar(require("@dreamnet/nerve/factory")));
        const toolConfig = (0, tools_1.getToolConfig)(toolId);
        const risk = toolConfig?.riskLevel ?? "medium";
        // Calculate risk score from risk level
        const riskScore = risk === "low"
            ? 0.2
            : risk === "medium"
                ? 0.5
                : risk === "high"
                    ? 0.8
                    : 0.95;
        const event = createNerveEvent({
            channelId: ok && !isTimeout ? "HTTP_REQUEST" : "SHIELD_EVENT",
            kind: ok && !isTimeout ? "REQUEST_DECISION" : "THREAT_DETECTED",
            priority: ok && !isTimeout ? 3 : 5, // Higher priority for failures/timeouts
            context: {
                traceId: req.traceId,
                clusterId: toolConfig?.clusterId,
                tierId: req.callerIdentity?.tierId,
                citizenId: req.callerIdentity?.passport?.citizenId,
                officeIds: req.callerIdentity?.officeIds,
                cabinetIds: req.callerIdentity?.cabinetIds,
                costEstimate: toolConfig?.cost?.estimatedDollarCost,
                riskScore,
            },
            payload: {
                integration: "agent_gateway",
                action: "tool_executed",
                toolId,
                portId: toolConfig?.portId,
                conduitId: req.conduitId,
                ok,
                error: !ok ? error : undefined,
                reason: isTimeout ? "TIMEOUT" : !ok ? "FAILURE" : undefined,
                latencyMs,
                riskLevel: risk,
            },
            defaultSampleRate: ok ? 0.2 : 1.0, // Always sample failures
        });
        NERVE_BUS.publish(event);
    }
    catch (error) {
        // Nerve not available, continue
    }
}
async function executeTool(toolId, payload, req) {
    const startTime = Date.now();
    const toolConfig = (0, tools_1.getToolConfig)(toolId);
    const caller = req.callerIdentity;
    if (!toolConfig) {
        return {
            toolId,
            ok: false,
            error: "UNKNOWN_TOOL",
        };
    }
    // Basic risk guard: forbid high/critical tools at lower tiers unless GodVault
    const risk = toolConfig.riskLevel ?? "medium";
    if (!caller?.isGodVault) {
        if (risk === "critical" && caller?.tierId !== "GOD_MODE") {
            return {
                toolId,
                ok: false,
                error: "RISK_TOO_HIGH_FOR_TIER",
                data: {
                    riskLevel: risk,
                    tierId: caller?.tierId,
                    requiredTier: "GOD_MODE",
                },
            };
        }
    }
    // TODO: In future, enforce per-caller cost budgets using toolConfig.cost
    // Conduit evaluation (per-line enforcement)
    const portId = (req.portId ?? "AGENT_GATEWAY");
    const clusterId = toolConfig.clusterId;
    const conduitDecision = (0, conduitGovernor_1.evaluateConduit)(portId, clusterId, toolId);
    if (!conduitDecision.allowed) {
        return {
            toolId,
            ok: false,
            error: conduitDecision.reason ?? "CONDUIT_BLOCKED",
            data: {
                conduitId: conduitDecision.conduitId,
                portId,
                clusterId,
            },
        };
    }
    // Get conduit config for timeout check
    const conduitConfig = conduitDecision.conduitId
        ? (0, conduits_1.getConduitConfig)(portId, clusterId, toolId)
        : undefined;
    const timeoutMs = conduitConfig?.budgets.maxExecutionTimeMs;
    // Track execution start for timeout detection
    const executionStartTime = Date.now();
    try {
        let result;
        // Route to appropriate executor based on tool ID
        // Wrap in timeout if conduit has maxExecutionTimeMs
        let executionPromise;
        if (toolId.startsWith("env.")) {
            executionPromise = executeEnvTool(toolId, payload, req);
        }
        else if (toolId.startsWith("api.")) {
            executionPromise = executeApiTool(toolId, payload, req);
        }
        else if (toolId.startsWith("vercel.")) {
            executionPromise = executeVercelTool(toolId, payload, req);
        }
        else if (toolId === "diagnostics.ping") {
            executionPromise = executeDiagnosticsTool(toolId, payload, req);
        }
        else {
            executionPromise = Promise.resolve({
                toolId,
                ok: false,
                error: "TOOL_NOT_IMPLEMENTED",
                latencyMs: Date.now() - startTime,
            });
        }
        // Apply timeout if configured
        if (timeoutMs && timeoutMs > 0) {
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    reject(new Error(`TIMEOUT: Tool execution exceeded ${timeoutMs}ms`));
                }, timeoutMs);
            });
            result = await Promise.race([executionPromise, timeoutPromise]);
        }
        else {
            result = await executionPromise;
        }
        // Check if execution exceeded timeout (race condition check)
        const executionTime = Date.now() - executionStartTime;
        if (timeoutMs && executionTime > timeoutMs) {
            result = {
                toolId,
                ok: false,
                error: "TIMEOUT",
                data: {
                    timeoutMs,
                    executionTimeMs: executionTime,
                    conduitId: conduitDecision.conduitId,
                },
                latencyMs: executionTime,
            };
        }
        // Handle timeout or failure - add to dead-letter if critical conduit
        const isTimeout = result.error === "TIMEOUT" || (result.error && result.error.includes("TIMEOUT"));
        const isCriticalConduit = conduitConfig && conduitConfig.priorityLane >= 4;
        // Record failure/timeout in conduit usage metrics
        if (!result.ok && conduitDecision.conduitId) {
            (0, conduitGovernor_1.recordConduitFailure)(conduitDecision.conduitId, result.error || "UNKNOWN_ERROR", isTimeout);
        }
        if ((!result.ok || isTimeout) && isCriticalConduit && conduitDecision.conduitId) {
            (0, deadLetter_1.addDeadLetterRecord)({
                conduitId: conduitDecision.conduitId,
                traceId: req.traceId || "unknown",
                toolId,
                portId,
                clusterId,
                error: result.error || "UNKNOWN_ERROR",
                errorType: isTimeout ? "TIMEOUT" : "FAILURE",
                citizenId: caller?.passport?.citizenId,
                tierId: caller?.tierId,
            });
        }
        // Emit Nerve event for tool execution (with timeout/threat detection)
        await emitToolExecutionEvent(toolId, result.ok && !isTimeout, req, result.latencyMs, result.error, !!isTimeout);
        // Attach conduit ID to request for downstream use
        req.conduitId = conduitDecision.conduitId;
        // Record activity for DreamScope
        (0, activity_1.recordAgentActivity)({
            toolId,
            intent: payload.intent || toolId,
            citizenId: caller?.passport?.citizenId,
            tierId: caller?.tierId,
            ok: result.ok && !isTimeout,
            latencyMs: result.latencyMs,
            riskLevel: toolConfig.riskLevel,
            error: result.error,
            portId: toolConfig.portId,
            conduitId: conduitDecision.conduitId,
        });
        return result;
    }
    catch (error) {
        const isTimeout = error.message && error.message.includes("TIMEOUT");
        const result = {
            toolId,
            ok: false,
            error: isTimeout ? "TIMEOUT" : error.message || "EXECUTION_ERROR",
            latencyMs: Date.now() - startTime,
        };
        // Add to dead-letter if critical conduit
        const conduitConfig = conduitDecision.conduitId
            ? (0, conduits_1.getConduitConfig)(portId, clusterId, toolId)
            : undefined;
        const isCriticalConduit = conduitConfig && conduitConfig.priorityLane >= 4;
        // Record failure/timeout in conduit usage metrics
        if (conduitDecision.conduitId) {
            (0, conduitGovernor_1.recordConduitFailure)(conduitDecision.conduitId, result.error || "UNKNOWN_ERROR", isTimeout);
        }
        if (isCriticalConduit && conduitDecision.conduitId) {
            (0, deadLetter_1.addDeadLetterRecord)({
                conduitId: conduitDecision.conduitId,
                traceId: req.traceId || "unknown",
                toolId,
                portId,
                clusterId,
                error: result.error || "UNKNOWN_ERROR",
                errorType: isTimeout ? "TIMEOUT" : "ERROR",
                citizenId: caller?.passport?.citizenId,
                tierId: caller?.tierId,
            });
        }
        // Emit failure event (with threat detection for timeouts)
        await emitToolExecutionEvent(toolId, false, req, result.latencyMs, result.error, isTimeout);
        return result;
    }
}
/**
 * Execute Env Keeper tools
 */
async function executeEnvTool(toolId, payload, req) {
    const startTime = Date.now();
    try {
        const { EnvKeeperCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/env-keeper-core")));
        if (toolId === "env.get") {
            const key = payload.key;
            if (!key) {
                return {
                    toolId,
                    ok: false,
                    error: "KEY_REQUIRED",
                };
            }
            const envVar = EnvKeeperCore.get(key, false); // Don't decrypt for security
            if (!envVar) {
                return {
                    toolId,
                    ok: false,
                    error: "ENV_VAR_NOT_FOUND",
                    data: { key },
                };
            }
            return {
                toolId,
                ok: true,
                data: {
                    key: envVar.key,
                    category: envVar.category,
                    isSecret: envVar.isSecret,
                    value: envVar.isSecret ? "[ENCRYPTED]" : envVar.value,
                    description: envVar.description,
                    environments: envVar.environments,
                    createdAt: envVar.createdAt,
                    updatedAt: envVar.updatedAt,
                },
                latencyMs: Date.now() - startTime,
            };
        }
        if (toolId === "env.set") {
            const key = payload.key;
            const value = payload.value;
            const category = payload.category;
            const isSecret = payload.isSecret;
            const description = payload.description;
            const environments = payload.environments;
            if (!key || value === undefined) {
                return {
                    toolId,
                    ok: false,
                    error: "KEY_AND_VALUE_REQUIRED",
                };
            }
            const envVar = EnvKeeperCore.set(key, value, {
                category,
                isSecret,
                description,
                environments,
            });
            return {
                toolId,
                ok: true,
                data: {
                    key: envVar.key,
                    category: envVar.category,
                    isSecret: envVar.isSecret,
                    value: envVar.isSecret ? "[ENCRYPTED]" : envVar.value,
                    description: envVar.description,
                    environments: envVar.environments,
                    createdAt: envVar.createdAt,
                    updatedAt: envVar.updatedAt,
                },
                latencyMs: Date.now() - startTime,
            };
        }
        if (toolId === "env.delete") {
            const key = payload.key;
            if (!key) {
                return {
                    toolId,
                    ok: false,
                    error: "KEY_REQUIRED",
                };
            }
            const deleted = EnvKeeperCore.delete(key);
            if (!deleted) {
                return {
                    toolId,
                    ok: false,
                    error: "ENV_VAR_NOT_FOUND",
                    data: { key },
                };
            }
            return {
                toolId,
                ok: true,
                data: {
                    key,
                    deleted: true,
                },
                latencyMs: Date.now() - startTime,
            };
        }
        return {
            toolId,
            ok: false,
            error: "UNKNOWN_ENV_TOOL",
        };
    }
    catch (error) {
        return {
            toolId,
            ok: false,
            error: error.message || "ENV_KEEPER_ERROR",
            latencyMs: Date.now() - startTime,
        };
    }
}
/**
 * Execute API Keeper tools
 */
async function executeApiTool(toolId, payload, req) {
    const startTime = Date.now();
    try {
        const { APIKeeperCore } = await Promise.resolve().then(() => __importStar(require("@dreamnet/api-keeper-core")));
        if (toolId === "api.listKeys") {
            const keys = APIKeeperCore.listKeys();
            // Return summary (no raw keys)
            const summary = keys.map((key) => ({
                id: key.id,
                providerId: key.providerId,
                name: key.name,
                status: key.status,
                usageCount: key.usageCount,
                usageThisMonth: key.usageThisMonth,
                costThisMonth: key.costThisMonth,
                createdAt: key.createdAt,
                lastUsedAt: key.lastUsedAt,
                expiresAt: key.expiresAt,
            }));
            return {
                toolId,
                ok: true,
                data: {
                    keys: summary,
                    count: keys.length,
                },
                latencyMs: Date.now() - startTime,
            };
        }
        if (toolId === "api.rotateKey") {
            const keyId = payload.keyId;
            if (!keyId) {
                return {
                    toolId,
                    ok: false,
                    error: "KEY_ID_REQUIRED",
                };
            }
            // TODO: Implement actual key rotation logic
            // For now, return a placeholder
            return {
                toolId,
                ok: false,
                error: "KEY_ROTATION_NOT_IMPLEMENTED",
                data: {
                    message: "Key rotation will be implemented in a future update",
                    keyId,
                },
                latencyMs: Date.now() - startTime,
            };
        }
        return {
            toolId,
            ok: false,
            error: "UNKNOWN_API_TOOL",
        };
    }
    catch (error) {
        return {
            toolId,
            ok: false,
            error: error.message || "API_KEEPER_ERROR",
            latencyMs: Date.now() - startTime,
        };
    }
}
/**
 * Execute Vercel Agent tools
 */
async function executeVercelTool(toolId, payload, req) {
    const startTime = Date.now();
    try {
        const { DreamNetVercelAgent } = await Promise.resolve().then(() => __importStar(require("@dreamnet/dreamnet-vercel-agent")));
        if (toolId === "vercel.listProjects") {
            const projects = await DreamNetVercelAgent.listProjects();
            return {
                toolId,
                ok: true,
                data: {
                    projects: projects.map((p) => ({
                        id: p.id,
                        name: p.name,
                        // Add other safe fields as needed
                    })),
                    count: projects.length,
                },
                latencyMs: Date.now() - startTime,
            };
        }
        if (toolId === "vercel.deploy") {
            const projectName = payload.projectName;
            const targetDomain = payload.targetDomain;
            if (!projectName) {
                return {
                    toolId,
                    ok: false,
                    error: "PROJECT_NAME_REQUIRED",
                };
            }
            // Get project to verify it exists
            const project = await DreamNetVercelAgent.getProject(projectName);
            if (!project) {
                return {
                    toolId,
                    ok: false,
                    error: "PROJECT_NOT_FOUND",
                    data: { projectName },
                };
            }
            // For now, return project info and indicate deploy would be triggered
            // Actual deploy logic can be added when Vercel Agent has deploy method
            return {
                toolId,
                ok: true,
                data: {
                    message: "Deploy operation prepared (actual deploy will be implemented)",
                    project: {
                        id: project.id,
                        name: project.name,
                        accountId: project.accountId,
                        latestDeployment: project.latestDeployment,
                    },
                    targetDomain: targetDomain || "dreamnet.ink",
                    status: "prepared",
                    note: "Vercel deploy API integration pending",
                },
                latencyMs: Date.now() - startTime,
            };
        }
        return {
            toolId,
            ok: false,
            error: "UNKNOWN_VERCEL_TOOL",
        };
    }
    catch (error) {
        return {
            toolId,
            ok: false,
            error: error.message || "VERCEL_AGENT_ERROR",
            latencyMs: Date.now() - startTime,
        };
    }
}
/**
 * Execute diagnostics tools
 */
async function executeDiagnosticsTool(toolId, payload, req) {
    const startTime = Date.now();
    try {
        // Simple ping - return system status
        return {
            toolId,
            ok: true,
            data: {
                message: "DreamNet core is online",
                timestamp: new Date().toISOString(),
                caller: {
                    tierId: req.callerIdentity?.tierId,
                    citizenId: req.callerIdentity?.passport?.citizenId,
                },
            },
            latencyMs: Date.now() - startTime,
        };
    }
    catch (error) {
        return {
            toolId,
            ok: false,
            error: error.message || "DIAGNOSTICS_ERROR",
            latencyMs: Date.now() - startTime,
        };
    }
}
