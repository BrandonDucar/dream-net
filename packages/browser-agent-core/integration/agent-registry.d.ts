/**
 * Agent Registry Integration
 * Registers WebOpsAgent and BrowserSurgeon with the agent registry
 */
/**
 * Register browser-capable agents with the agent registry
 */
export declare function registerBrowserAgents(): Promise<void>;
/**
 * Initialize browser agent integration
 * Call this during system startup
 */
export declare function initBrowserAgentIntegration(): Promise<void>;
