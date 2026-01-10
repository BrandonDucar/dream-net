import { Fly, FlyType, FlyPriority, SignalThread, SpiderNodeRef } from "../types";
/**
 * Determine if a fly should stick to the web
 */
export declare function shouldFlyStick(fly: Fly): boolean;
/**
 * Classify a fly and determine what thread it should create
 */
export declare function classifyFly(fly: Fly): {
    threadKind: SignalThread["kind"];
    priority: SignalThread["priority"];
    targets: SpiderNodeRef[];
};
/**
 * Catch a fly and create a thread from it
 */
export declare function catchFly(fly: Fly): SignalThread | null;
/**
 * Create a fly from external event
 */
export declare function createFly(type: FlyType, source: string, payload: Record<string, any>, priority?: FlyPriority, sticky?: boolean): Fly;
