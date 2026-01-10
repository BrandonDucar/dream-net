/**
 * Webhook Auto-Discoverer
 * ZERO-TOUCH: Automatically discovers and registers webhooks
 * Like API keys - no manual setup needed
 */
import type { WebhookNeuron } from "../types";
/**
 * Auto-discover webhooks from environment variables
 */
export declare function autoDiscoverWebhooksFromEnv(): WebhookNeuron[];
/**
 * Auto-discover webhooks from config files
 */
export declare function autoDiscoverWebhooksFromConfig(): WebhookNeuron[];
/**
 * Auto-discover all webhooks from all sources
 */
export declare function autoDiscoverAllWebhooks(): WebhookNeuron[];
/**
 * Auto-create default antibodies (security rules)
 */
export declare function autoCreateDefaultAntibodies(): void;
