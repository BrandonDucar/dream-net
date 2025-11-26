/**
 * WebOpsAgent Configuration
 * Specialized agent for web operations using browser capability
 */
export declare const WebOpsAgentConfig: {
    name: string;
    id: string;
    description: string;
    capabilities: string[];
    /**
     * Agent prompt/instructions for using browser tools
     */
    instructions: string;
    /**
     * Example mission template
     */
    exampleMission: {
        allowedDomains: string[];
        mode: "read_only";
        maxSteps: number;
        description: string;
    };
};
