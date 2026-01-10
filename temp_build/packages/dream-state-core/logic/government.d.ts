import { GovernmentDepartment, GovernmentAction, StateSymbol } from "../types";
/**
 * Initialize government departments
 */
export declare function ensureGovernmentDepartments(): GovernmentDepartment[];
/**
 * Record a government action
 */
export declare function recordGovernmentAction(type: GovernmentAction["type"], department: string, action: string, meta?: Record<string, any>): GovernmentAction;
/**
 * Initialize state symbols
 */
export declare function ensureStateSymbols(): StateSymbol[];
