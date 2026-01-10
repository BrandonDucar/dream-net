import { DreamEventBus } from '../dreamnet-event-bus/DreamEventBus';
import { getDeploymentManager, DeploymentConfig as CoreDeploymentConfig } from '@dreamnet/deployment-core';

export interface DeploymentConfig {
    platform: string;
    projectName: string;
    sourceDirectory: string;
    [key: string]: any;
}

export interface DeploymentResult {
    success: boolean;
    deploymentId?: string;
    url?: string;
    error?: string;
}

export class DeploymentWrapper {
    constructor(private eventBus: DreamEventBus) {
        this.subscribeToEvents();
    }

    private subscribeToEvents() {
        this.eventBus.subscribe('Deployment.Requested', async (envelope) => {
            const { config, identityId, correlationId } = envelope.payload;
            console.log(`[DeploymentWrapper] Received deployment request for ${config.platform}`);

            try {
                const manager = getDeploymentManager();

                // Map wrapper config to core config
                const coreConfig: CoreDeploymentConfig = {
                    platform: config.platform as any,
                    projectName: config.projectName,
                    sourceDirectory: config.sourceDirectory,
                    ...config
                };

                const result = await manager.deploy(coreConfig);

                // Publish completion event
                this.eventBus.publish(
                    this.eventBus.createEnvelope(
                        result.success ? 'Deployment.Completed' : 'Deployment.Failed',
                        'deployment-wrapper',
                        { ...result, identityId, correlationId },
                        {
                            eventId: crypto.randomUUID(),
                            correlationId: envelope.metadata.correlationId,
                            timestamp: Date.now(),
                            severity: result.success ? 'low' : 'high'
                        }
                    )
                );

            } catch (error: any) {
                console.error('[DeploymentWrapper] Deployment failed:', error);
                this.eventBus.publish(
                    this.eventBus.createEnvelope(
                        'Deployment.Failed',
                        'deployment-wrapper',
                        { error: error.message, identityId, correlationId },
                        {
                            eventId: crypto.randomUUID(),
                            correlationId: envelope.metadata.correlationId,
                            timestamp: Date.now(),
                            severity: 'high'
                        }
                    )
                );
            }
        });
    }

    /**
     * Announce a deployment request.
     * The actual deployment logic should be handled by a subscriber (e.g., Deployment Core).
     */
    public async deploy(config: DeploymentConfig, identityId?: string): Promise<DeploymentResult> {
        const correlationId = crypto.randomUUID();
        const timestamp = Date.now();

        // 1. Announce deployment request
        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'Deployment.Requested',
                'deployment-wrapper',
                { platform: config.platform, config, identityId, correlationId },
                {
                    eventId: crypto.randomUUID(),
                    correlationId,
                    timestamp,
                    severity: 'low'
                }
            )
        );

        // In a real async event system, we might wait for a response here.
        // For now, we return a provisional status.
        return { success: true, deploymentId: 'pending-event-bus' };
    }

    // Legacy methods for backward compatibility
    public announceDeploy(platform: string): void {
        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'Deployment.Announced',
                'deployment-wrapper',
                { platform, timestamp: Date.now() }
            )
        );
    }

    public recordDeployResult(platform: string, success: boolean): void {
        this.eventBus.publish(
            this.eventBus.createEnvelope(
                'Deployment.Completed',
                'deployment-wrapper',
                { platform, success, timestamp: Date.now() }
            )
        );
    }
}
