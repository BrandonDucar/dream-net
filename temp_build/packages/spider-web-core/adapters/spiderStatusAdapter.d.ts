export interface SpiderDashboardView {
    threadCount: number;
    pendingCount: number;
    inProgressCount: number;
    completedCount: number;
    failedCount: number;
    insightCount: number;
    flyCount: number;
    fliesCaughtToday: number;
    stickyFlyCount: number;
    activeSensors: number;
    avgExecutionTime: number;
    threadSuccessRate: number;
    templateCount: number;
    patternCount: number;
    threads: {
        id: string;
        source: string;
        targets: string[];
        kind: string;
        status: string;
        priority: string;
        executable: boolean;
    }[];
    insights: {
        id: string;
        type: string;
        title: string;
        description: string;
    }[];
    flies: {
        id: string;
        type: string;
        source: string;
        priority: string;
        sticky: boolean;
        processed: boolean;
    }[];
    sensors: {
        id: string;
        type: string;
        active: boolean;
        catchRate: number;
    }[];
}
export declare function getSpiderDashboardView(): SpiderDashboardView;
