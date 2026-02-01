/**
 * Nerve Middleware - The Manifold for Organ Connectivity
 *
 * Provides "Top Notch" interception and routing for inter-organ communication.
 */
import { NerveEvent } from './types.js';
export type NerveMiddlewareFn = (event: NerveEvent, next: () => Promise<void> | void) => Promise<void> | void;
/**
 * Organ Manifold - Manages organ-to-organ connectivity
 */
export declare class OrganManifold {
    private middlewares;
    /**
     * Use a middleware for organ connectivity
     */
    use(fn: NerveMiddlewareFn): void;
    /**
     * Connect an organ to the manifold
     */
    process(event: NerveEvent): Promise<void>;
}
export declare const MANIFOLD: OrganManifold;
//# sourceMappingURL=manifold.d.ts.map