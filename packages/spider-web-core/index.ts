/**
 * DreamNet Spider Web Core Stub
 * Severed from @dreamnet/nerve to break circular build dependencies.
 */

export * from './types.js';

export const SpiderWebCore = {
    run: async (context: any) => {
        console.log("[SpiderWeb] Stub run called");
        return {
            lastRunAt: Date.now(),
            threadCount: 0,
            fliesCaughtToday: 0
        } as any;
    },
    status: () => ({}) as any,
    listThreads: () => [],
    addThread: (t: any) => t,
    catchFly: (f: any) => null,
    createFly: (type: any, source: string, payload: any) => ({
        id: "stub", type, source, payload, caughtAt: Date.now(), priority: "medium", sticky: false, processed: false
    } as any),
};

export default SpiderWebCore;
