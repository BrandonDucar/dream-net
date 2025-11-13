export declare const DREAMKEEPER_CORE: {
    version: string;
    networkVitals: {
        totalDreams: number;
        activeCores: number;
        agentClusters: number;
        networkHealth: "healthy" | "degraded" | "critical" | "unknown";
        threatLevel: "stable" | "elevated" | "critical";
    };
    logs: Array<{
        timestamp: string;
        status: string;
        notes: string[];
    }>;
    dreamEvents: any[];
    scanHistory: Array<{
        timestamp: string;
        findings: any[];
        recommendations: string[];
    }>;
    updateCycle: "realtime" | "hourly" | "daily";
    baseHealth: {
        mainnet: {
            rpc: "healthy" | "degraded" | "down" | "unknown";
            blockNumber: number | null;
            latency: number | null;
            lastCheck: string;
        };
        sepolia: {
            rpc: "healthy" | "degraded" | "down" | "unknown";
            blockNumber: number | null;
            latency: number | null;
            lastCheck: string;
        };
    };
    init: () => void;
    processDreamEvent: (event: any) => void;
    getDreamEvents: () => any[];
    runSelfDiagnostics: () => void;
    startMonitoring: () => void;
    performNetworkScan: () => void;
    learnAndAdapt: (feedback: {
        source: string;
        type: "remix_failure" | "build_error" | "security_flag" | "performance_issue";
        details: any;
    }) => void;
    requestSurgeonIntervention: (dreamId: string, issue: string) => void;
    getStatus: () => {
        version: string;
        lastScan: string;
        logCount: number;
        baseHealth: {
            mainnet: {
                rpc: "healthy" | "degraded" | "down" | "unknown";
                blockNumber: number | null;
                latency: number | null;
                lastCheck: string;
            };
            sepolia: {
                rpc: "healthy" | "degraded" | "down" | "unknown";
                blockNumber: number | null;
                latency: number | null;
                lastCheck: string;
            };
        };
        totalDreams: number;
        activeCores: number;
        agentClusters: number;
        networkHealth: "healthy" | "degraded" | "critical" | "unknown";
        threatLevel: "stable" | "elevated" | "critical";
    };
    /**
     * Check Base L2 network health (Mainnet and Sepolia)
     */
    checkBaseHealth: (network?: "mainnet" | "sepolia") => Promise<{
        status: "healthy" | "degraded" | "down";
        blockNumber: number;
        latency: number;
    } | {
        status: "down";
        blockNumber: null;
        latency: null;
    }>;
    /**
     * Start periodic Base health checks
     */
    startBaseHealthChecks: () => void;
};
