import { getAgents } from './registry.js';
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TASKS_PATH = join(__dirname, "../store/tasks.json");
function loadTasks() {
    if (!existsSync(TASKS_PATH)) {
        return [];
    }
    try {
        const content = readFileSync(TASKS_PATH, "utf-8");
        return JSON.parse(content).map((t) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
        }));
    }
    catch {
        return [];
    }
}
function saveTasks(tasks) {
    const dir = join(TASKS_PATH, "..");
    if (!existsSync(dir)) {
        require("node:fs").mkdirSync(dir, { recursive: true });
    }
    writeFileSync(TASKS_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}
export function createTask(task) {
    const tasks = loadTasks();
    const fullTask = {
        ...task,
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        logs: [],
    };
    tasks.push(fullTask);
    saveTasks(tasks);
    return fullTask;
}
export function getTasks(squadId) {
    const tasks = loadTasks();
    if (squadId) {
        return tasks.filter((t) => t.squadId === squadId);
    }
    return tasks;
}
export function getTaskById(id) {
    return loadTasks().find((t) => t.id === id) ?? null;
}
export function updateTaskStatus(id, status, log) {
    const tasks = loadTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index < 0)
        return null;
    tasks[index] = {
        ...tasks[index],
        status,
        updatedAt: new Date(),
        logs: log ? [...tasks[index].logs, log] : tasks[index].logs,
    };
    saveTasks(tasks);
    return tasks[index];
}
export function assignTaskToAgent(taskId, agentId) {
    const tasks = loadTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index < 0)
        return null;
    tasks[index] = {
        ...tasks[index],
        assignedAgent: agentId,
        updatedAt: new Date(),
    };
    saveTasks(tasks);
    return tasks[index];
}
export function findBestAgentForTask(task) {
    const agents = getAgents();
    if (task.assignedAgent) {
        const assigned = agents.find((a) => a.id === task.assignedAgent);
        if (assigned && assigned.isOnline)
            return assigned;
    }
    // Base router: match task type to agent role
    const baseRouter = (t, ags) => {
        const roleMap = {
            "graft.install": "GraftBuilder",
            "deploy.vercel": "DeployKeeper",
            "env.audit": "EnvKeeper",
            "build.module": "BuildKeeper",
            "repair.api.endpoint": "DeployKeeper",
            "agent.revive": "DreamOps",
        };
        const targetRole = roleMap[t.type] ?? "Custom";
        const candidate = ags.find((a) => a.role === targetRole && a.isOnline);
        return candidate ?? null;
    };
    // Use pheromone routing if available
    try {
        const { routeWithPheromones } = require("./pheromoneRouter");
        return routeWithPheromones(task, agents.filter((a) => a.isOnline), baseRouter);
    }
    catch {
        // Fallback to base router if pheromone system not available
        return baseRouter(task, agents);
    }
}
export async function dispatchTask(taskId) {
    const task = getTaskById(taskId);
    if (!task) {
        return { success: false, error: "Task not found" };
    }
    if (task.status === "suggested" || task.status === "pending-approval") {
        // Phase 1: Don't auto-execute suggested tasks
        return { success: false, error: "Task requires approval" };
    }
    const agent = findBestAgentForTask(task);
    if (!agent) {
        updateTaskStatus(taskId, "failed", "No suitable agent available");
        return { success: false, error: "No suitable agent available" };
    }
    updateTaskStatus(taskId, "running", `Assigned to ${agent.name}`);
    assignTaskToAgent(taskId, agent.id);
    // Mark agent as busy (Congestion Tax)
    try {
        const { depositPheromone, buildPath } = await import("@dreamnet/halo-loop");
        const path = buildPath({
            agent: agent.id,
            time: new Date().getHours() < 12 ? "morning" : "afternoon",
            provider: agent.role.includes("Keeper") ? "dreamnet" : "external"
        });
        depositPheromone(path, true, 0, { loadDelta: 1 });
    }
    catch {
        // Halo-loop not available
    }
    // Execute agent via DreamNet OS
    try {
        // Use dynamic import with proper path resolution
        // @ts-ignore - Reaching into server src for runtime integration
        const dreamNetOSModule = await import('../../../../server/src/core/dreamnet-os.js');
        const dreamNetOS = dreamNetOSModule.dreamNetOS;
        const startTime = Date.now();
        // Map agent roles to DreamNet OS agent names
        const agentNameMap = {
            "DreamKeeper": "dreamkeeper",
            "DeployKeeper": "deploykeeper",
            "EnvKeeper": "envkeeper",
            "RelayBot": "relaybot",
            "DreamOps": "dreamkeeper", // Fallback to DreamKeeper for DreamOps
            "GraftBuilder": "deploykeeper", // Fallback to DeployKeeper for GraftBuilder
            "BuildKeeper": "deploykeeper", // Fallback to DeployKeeper for BuildKeeper
        };
        const osAgentName = agentNameMap[agent.role] || agent.name;
        const result = await dreamNetOS.runAgent({
            agent: osAgentName,
            input: task.payload,
            metadata: {
                taskId,
                taskType: task.type,
                agentId: agent.id,
            },
        });
        if (result.ok) {
            updateTaskStatus(taskId, "success", `Completed by ${agent.name}: ${result.messages?.join(", ") || "Success"}`);
            // Emit Event Wormhole event for successful task completion
            try {
                const { emitEvent } = await import("@dreamnet/event-wormholes");
                const { depositPheromone, buildPath } = await import("@dreamnet/halo-loop");
                const latency = Date.now() - startTime;
                const reward = 1.0; // Base reward for success
                const path = buildPath({
                    agent: agent.id,
                    time: new Date().getHours() < 12 ? "morning" : "afternoon", // Simplified
                    provider: agent.role.includes("Keeper") ? "dreamnet" : "external"
                });
                depositPheromone(path, true, 0.1, { latency, reward, loadDelta: -1 });
                await emitEvent({
                    sourceType: "squad",
                    eventType: "squad.task.completed",
                    severity: "info",
                    payload: {
                        taskId,
                        taskType: task.type,
                        agentId: agent.id,
                        agentRole: agent.role,
                        result: result.result,
                    },
                });
            }
            catch {
                // Event Wormholes not available, continue
            }
        }
        else {
            updateTaskStatus(taskId, "failed", `Failed: ${result.error || "Unknown error"}`);
            // Emit Event Wormhole event for failed task
            try {
                const { emitEvent } = await import("@dreamnet/event-wormholes");
                const { depositPheromone, buildPath } = await import("@dreamnet/halo-loop");
                const path = buildPath({
                    agent: agent.id,
                    time: new Date().getHours() < 12 ? "morning" : "afternoon",
                    provider: agent.role.includes("Keeper") ? "dreamnet" : "external"
                });
                depositPheromone(path, false, 0.05, { loadDelta: -1 });
                await emitEvent({
                    sourceType: "squad",
                    eventType: "squad.task.failed",
                    severity: "error",
                    payload: {
                        taskId,
                        taskType: task.type,
                        agentId: agent.id,
                        agentRole: agent.role,
                        error: result.error,
                    },
                });
            }
            catch {
                // Event Wormholes not available, continue
            }
        }
        return { success: result.ok, agentId: agent.id, error: result.error };
    }
    catch (err) {
        updateTaskStatus(taskId, "failed", `Execution error: ${err.message || "Unknown error"}`);
        return { success: false, error: err.message || "Execution failed" };
    }
}
//# sourceMappingURL=orchestrator.js.map