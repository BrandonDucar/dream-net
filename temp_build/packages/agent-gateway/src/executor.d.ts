/**
 * Agent Gateway Tool Executor
 * Executes tools by calling underlying DreamNet organs
 */
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import type { ToolId } from "./tools";
export interface ToolExecutionResult {
    toolId: ToolId;
    ok: boolean;
    error?: string;
    data?: unknown;
    latencyMs?: number;
}
/**
 * Execute a tool by calling the underlying DreamNet organ
 */
export interface ToolExecutionContext {
    toolId: ToolId;
    caller: RequestWithIdentity["callerIdentity"];
}
export declare function executeTool(toolId: ToolId, payload: Record<string, unknown>, req: RequestWithIdentity): Promise<ToolExecutionResult>;
