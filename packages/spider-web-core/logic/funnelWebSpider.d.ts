import { SpiderWebContext, SignalThread, WebSensor } from "../types";
/**
 * Run Funnel Web Spider - catch flies from all sensors
 */
export declare function runFunnelWebSpider(ctx: SpiderWebContext): Promise<SignalThread[]>;
/**
 * Initialize default sensors
 * Reads API credentials from environment variables
 */
export declare function ensureDefaultSensors(): WebSensor[];
