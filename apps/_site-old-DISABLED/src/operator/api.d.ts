export declare const operatorApi: {
    getAliveStatus: () => Promise<{
        status: any;
    }>;
    runAliveBoot: () => Promise<{
        status: any;
    }>;
    getEvents: () => Promise<{
        events?: any[];
    }>;
    getWormholes: () => Promise<{
        wormholes?: any[];
    }>;
    getSquads: () => Promise<{
        squads?: any[];
    }>;
    getAgents: () => Promise<{
        agents?: any[];
    }>;
    getTasks: () => Promise<{
        tasks?: any[];
    }>;
    getHaloStatus: () => Promise<{
        status?: any;
    }>;
    getHaloHistory: () => Promise<{
        history?: any[];
    }>;
    getForgeHistory: () => Promise<{
        history?: any[];
    }>;
    getForgeCollections: () => Promise<{
        collections?: any[];
    }>;
    getGrafts: () => Promise<{
        grafts?: any[];
    }>;
    getSpores: () => Promise<{
        spores?: any[];
    }>;
    getResonanceInsights: () => Promise<{
        insights?: any[];
    }>;
    getFabricTasks: () => Promise<{
        tasks?: any[];
    }>;
    runHaloCycle: (mode?: "light" | "full", reason?: string) => Promise<{
        ok: boolean;
        cycle?: any;
    }>;
    emitEvent: (event: {
        sourceType: string;
        eventType: string;
        severity: string;
        payload?: any;
    }) => Promise<{
        ok: boolean;
        event?: any;
    }>;
    quickNewAgent: () => Promise<{
        ok: boolean;
        taskId?: string;
    }>;
    quickNewEndpoint: () => Promise<{
        ok: boolean;
        graftId?: string;
    }>;
    quickNewSpore: () => Promise<{
        ok: boolean;
        sporeId?: string;
    }>;
    quickNewWormhole: () => Promise<{
        ok: boolean;
        wormholeId?: string;
    }>;
};
