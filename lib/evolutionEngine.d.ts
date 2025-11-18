export interface EvolutionCycle {
    timestamp: string;
    upgradeID: string;
    insights: EvolutionInsights;
    inputData: EvolutionInputData;
    status: 'analyzing' | 'complete' | 'failed';
    impact: number;
}
export interface EvolutionInputData {
    diagnostics: any[];
    threats: any[];
    remixPatterns: number;
    surgeonFixes: any[];
    networkHealth: any;
}
export interface EvolutionInsights {
    rewriteRules: string[];
    removeFlaws: string[];
    optimizations: string[];
    securityEnhancements: string[];
    performanceBoosts: string[];
}
export declare const EvolutionEngine: {
    cycleLog: any[];
    evolutionRate: "hourly" | "daily" | "weekly" | "monthly";
    upgradeCount: number;
    isActive: boolean;
    lastCycle: string | null;
    startCycle: () => void;
    runUpgradeCycle: () => void;
    analyze: (data: any) => {
        rewriteRules: string[];
        removeFlaws: string[];
        optimizations: string[];
        securityEnhancements: string[];
        performanceBoosts: string[];
    };
    findCommonPatterns: (diagnostics: any[]) => string[];
    calculateImpact: (insights: EvolutionInsights, data: EvolutionInputData) => number;
    applyUpgrades: (cycle: EvolutionCycle) => void;
    generateRemixPatternScore: () => number;
    getStatus: () => {
        isActive: boolean;
        evolutionRate: "monthly" | "hourly" | "daily" | "weekly";
        upgradeCount: number;
        lastCycle: string;
        cycleCount: number;
        averageImpact: number;
        recentCycles: any[];
        totalInsights: any;
    };
    setEvolutionRate: (rate: "hourly" | "daily" | "weekly" | "monthly") => void;
    pause: () => void;
    resume: () => void;
    forceEvolution: () => void;
    getEvolutionAnalytics: () => {
        totalCycles: number;
        averageImpact: number;
        insightBreakdown: {
            rewriteRules: any;
            removeFlaws: any;
            optimizations: any;
            securityEnhancements: any;
            performanceBoosts: any;
        };
        evolutionTrend: {
            date: any;
            impact: any;
            insights: any;
        }[];
    };
    analyzeNewDream: (event: any) => void;
};
