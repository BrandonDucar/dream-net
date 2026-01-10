/**
 * Example: Using Spine Wrappers in Routes
 * 
 * This shows how to integrate wrappers into existing routes
 * with the USE_SPINE_WRAPPERS feature flag.
 */

import { Router } from 'express';
import { env } from '../config/env';
import { DreamEventBus } from '../../spine/dreamnet-event-bus/DreamEventBus';
import { DeploymentWrapper } from '../../spine/wrappers/DeploymentWrapper';

// Initialize Event Bus (singleton)
const eventBus = new DreamEventBus();

// Initialize Wrapper
const deploymentWrapper = new DeploymentWrapper(eventBus);

export function createDeploymentRouteExample(): Router {
    const router = Router();

    router.post('/api/deploy', async (req, res) => {
        try {
            const config = req.body;

            // Feature flag: Use wrapper or direct call
            if (env.USE_SPINE_WRAPPERS) {
                // NEW: Use Spine Wrapper (with events, correlation IDs, etc.)
                const result = await deploymentWrapper.deploy(config);
                res.json(result);
            } else {
                // OLD: Direct call to deployment-core
                const { getDeploymentManager } = await import('../../packages/deployment-core/src/index');
                const manager = getDeploymentManager();
                const result = await manager.deploy(config);
                res.json(result);
            }

        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}

/**
 * Event Listener Example
 * 
 * Listen to deployment events emitted by the wrapper
 */
export function setupDeploymentEventListeners() {
    eventBus.subscribe('Deployment.Announced', (envelope) => {
        console.log(`[Deployment] Announced: ${envelope.payload.platform}`);
    });

    eventBus.subscribe('Deployment.Completed', (envelope) => {
        console.log(`[Deployment] Completed: ${envelope.payload.deploymentId}`);
        console.log(`  URL: ${envelope.payload.url}`);
    });

    eventBus.subscribe('Deployment.Failed', (envelope) => {
        console.error(`[Deployment] Failed: ${envelope.payload.error}`);
    });
}
