/**
 * BrowserSurgeon Configuration
 * Specialized agent for browser-based diagnostics and repairs
 */
export declare const BrowserSurgeonConfig: {
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
        mode: "limited_write";
        maxSteps: number;
        description: string;
    };
};
