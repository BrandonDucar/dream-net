/**
 * Nerve Middleware - The Manifold for Organ Connectivity
 * 
 * Provides "Top Notch" interception and routing for inter-organ communication.
 */

import { NerveEvent } from './types.js';
import { NERVE_BUS } from './bus.js';

export type NerveMiddlewareFn = (
    event: NerveEvent,
    next: () => Promise<void> | void
) => Promise<void> | void;

/**
 * Organ Manifold - Manages organ-to-organ connectivity
 */
export class OrganManifold {
    private middlewares: NerveMiddlewareFn[] = [];

    /**
     * Use a middleware for organ connectivity
     */
    use(fn: NerveMiddlewareFn) {
        this.middlewares.push(fn);
    }

    /**
     * Connect an organ to the manifold
     */
    async process(event: NerveEvent) {
        let index = 0;

        const next = async (): Promise<void> => {
            if (index < this.middlewares.length) {
                const middleware = this.middlewares[index++];
                await middleware(event, next);
            } else {
                // Final destination: The Nerve Bus
                NERVE_BUS.publish(event);
            }
        };

        await next();
    }
}

export const MANIFOLD = new OrganManifold();
