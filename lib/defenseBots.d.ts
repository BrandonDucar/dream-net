export interface Threat {
    type: string;
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    timestamp: string;
    source?: string;
    neutralized?: boolean;
    response?: string;
}
export interface ThreatPattern {
    type: string;
    frequency: number;
    lastSeen: string;
    riskLevel: number;
}
export declare const DreamDefenseNet: {
    status: "armed" | "standby" | "maintenance" | "compromised";
    threatLog: Threat[];
    patternDatabase: ThreatPattern[];
    activeThreats: number;
    neutralizedThreats: number;
    lastScan: string | null;
    init: () => void;
    monitorLoop: () => void;
    detectThreat: () => Threat | null;
    generateThreatSource: () => string;
    respond: (threat: Threat) => void;
    neutralizeThreat: (threat: Threat) => string;
    updatePatternDatabase: (threat: Threat) => void;
    calculateInitialRisk: (severity: string) => number;
    loadKnownPatterns: () => void;
    cleanupOldThreats: () => void;
    escalateToCore: (threat: Threat) => void;
    requestSurgeonAssistance: (threat: Threat) => void;
    getStatus: () => {
        status: "maintenance" | "armed" | "standby" | "compromised";
        activeThreats: number;
        neutralizedThreeat: number;
        totalThreats: number;
        lastScan: string | null;
        patternCount: number;
        threatLog: Threat[];
        patterns: ThreatPattern[];
    };
    manualThreatResponse: (threatId: string) => boolean;
    setDefenseLevel: (level: "armed" | "standby" | "maintenance") => void;
    emergencyLockdown: () => void;
    getThreatAnalytics: () => {
        totalThreats: number;
        neutralized: number;
        successRate: number;
        severityBreakdown: {
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
        topThreats: ThreatPattern[];
    };
    analyzeDreamEvent: (event: any) => void;
};
