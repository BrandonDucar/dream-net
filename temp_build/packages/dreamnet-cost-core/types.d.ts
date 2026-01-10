/**
 * DreamNet Cost Core Types
 * API cost tracking and optimization
 */
export interface CostRecord {
    id: string;
    clusterId: string;
    provider: string;
    operation: string;
    cost: number;
    currency: string;
    timestamp: number;
    traceId?: string;
    metadata?: Record<string, any>;
}
export interface CostSummary {
    clusterId: string;
    totalCost: number;
    costToday: number;
    costThisWeek: number;
    costThisMonth: number;
    currency: string;
    recordCount: number;
    lastUpdatedAt: number;
}
export interface CostAlert {
    id: string;
    clusterId: string;
    threshold: number;
    currentCost: number;
    period: "daily" | "weekly" | "monthly";
    triggeredAt: number;
    acknowledged: boolean;
}
export interface CostBudget {
    id: string;
    clusterId: string;
    amount: number;
    period: "daily" | "weekly" | "monthly";
    currency: string;
    alertThreshold?: number;
    enabled: boolean;
}
