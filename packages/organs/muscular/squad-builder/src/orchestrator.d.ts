import type { TaskModel, AgentModel } from './types.js';
export declare function createTask(task: Omit<TaskModel, "id" | "createdAt" | "updatedAt" | "logs">): TaskModel;
export declare function getTasks(squadId?: string): TaskModel[];
export declare function getTaskById(id: string): TaskModel | null;
export declare function updateTaskStatus(id: string, status: TaskModel["status"], log?: string): TaskModel | null;
export declare function assignTaskToAgent(taskId: string, agentId: string): TaskModel | null;
export declare function findBestAgentForTask(task: TaskModel): AgentModel | null;
export declare function dispatchTask(taskId: string): Promise<{
    success: boolean;
    agentId?: string;
    error?: string;
}>;
//# sourceMappingURL=orchestrator.d.ts.map