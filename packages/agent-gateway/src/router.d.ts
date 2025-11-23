/**
 * Agent Gateway Intent Router
 * Resolves intents to tools and checks permissions
 */
import type { RequestWithIdentity } from "@dreamnet/dreamnet-control-core/identityResolver";
import { type ToolId } from "./tools";
export interface AgentGatewayRequestBody {
    intent: string;
    tools?: string[];
    constraints?: {
        maxLatencyMs?: number;
        maxCostUsd?: number;
        maxTokens?: number;
        riskCeiling?: "low" | "medium" | "high";
    };
    payload?: Record<string, unknown>;
}
export interface IntentResolution {
    tool?: ToolId;
    reason?: string;
}
/**
 * Resolve intent string to a tool ID
 * Simple mapping for now; can get smarter later with NLP/LLM routing
 */
export declare function resolveIntentToTool(body: AgentGatewayRequestBody): IntentResolution;
/**
 * Check if caller is allowed to use a tool
 */
export declare function isToolAllowedForCaller(toolId: ToolId, req: RequestWithIdentity): {
    allowed: boolean;
    reason?: string;
};
