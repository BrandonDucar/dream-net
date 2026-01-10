import type { HaloCycleResult } from "../types";
export declare function appendHistory(entry: HaloCycleResult): Promise<void>;
export declare function getHistory(limit?: number): Promise<HaloCycleResult[]>;
export declare function getLatestEntry(): Promise<HaloCycleResult | null>;
