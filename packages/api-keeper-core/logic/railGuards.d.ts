import { APIRequest, APIRailGuard } from "../types";
/**
 * Check rail guards before allowing a request
 */
export declare function checkRailGuards(request: APIRequest): {
    allowed: boolean;
    reason?: string;
};
/**
 * Create default rail guards
 */
export declare function ensureDefaultRailGuards(): APIRailGuard[];
/**
 * Create a custom rail guard
 */
export declare function createRailGuard(name: string, type: APIRailGuard["type"], limit: number, action: APIRailGuard["action"]): APIRailGuard;
