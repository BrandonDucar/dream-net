/**
 * Spider Web Thread Bridge
 * Biomimetic: Converts operational events into Spider Web threads (nervous system)
 */
import { type SignalThread, type Fly } from "../spider-web/index.js";
import { type OperationalEvent } from '../types.js';
/**
 * Convert operational event to Spider Web Fly
 */
export declare function operationalEventToFly(event: OperationalEvent): Fly;
/**
 * Convert operational event directly to Spider Web Thread
 */
export declare function operationalEventToThread(event: OperationalEvent): SignalThread;
/**
 * Bridge operational event to Spider Web
 */
/**
 * Bridge operational event to Spider Web AND route to Voice (SMS)
 */
export declare function bridgeToSpiderWeb(event: OperationalEvent): SignalThread;
//# sourceMappingURL=spiderWebBridge.d.ts.map