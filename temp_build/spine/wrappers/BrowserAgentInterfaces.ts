export interface LighthouseAuditResult {
    url: string;
    timestamp: string;
    scores: {
        performance: number;
        accessibility: number;
        bestPractices: number;
        seo: number;
    };
    metrics: {
        firstContentfulPaint: number;
        largestContentfulPaint: number;
        cumulativeLayoutShift: number;
        speedIndex: number;
        totalBlockingTime: number;
    };
    opportunities: Array<{
        id: string;
        title: string;
        description: string;
        impact: 'high' | 'medium' | 'low';
        savings: string;
    }>;
    diagnostics: Array<{
        id: string;
        title: string;
        description: string;
        severity: 'error' | 'warning' | 'info';
    }>;
    accessibility: {
        violations: Array<{
            rule: string;
            description: string;
            impact: 'critical' | 'serious' | 'moderate' | 'minor';
            nodes: number;
        }>;
        passedAudits: number;
        totalAudits: number;
    };
    seo: {
        issues: Array<{
            audit: string;
            description: string;
            recommendation: string;
        }>;
        passedChecks: number;
        totalChecks: number;
    };
    summary: {
        overallScore: number;
        primaryIssues: string[];
        quickWins: string[];
        dreamUpgradeCategory: 'Vision' | 'Tool' | 'Movement';
    };
}

export interface IDomainAllowlist {
    isAllowed(urlStr: string): { allowed: boolean; reason?: string };
    getDomains(): string[];
}

export interface IIPBlocking {
    validateUrl(urlStr: string): Promise<{ allowed: boolean; reason?: string; resolvedIp?: string }>;
}

export interface ILighthouseAuditor {
    auditWebsite(url: string): Promise<LighthouseAuditResult>;
}
