import { natsService } from './NatsService.js';
import axios from 'axios';
import { EnvKeeperCore } from '../../packages/env-keeper-core/index.js';

/**
 * 🔗 IFTTT Service
 * Bridges DreamNet Swarm events to external IFTTT Applets.
 */
export class IftttService {
  private static isInitialized = false;

  public static async initialize() {
    if (this.isInitialized) return;

    console.log("🔗 [IFTTT Service] Initializing Swarm Bridge...");

    // Subscribe to swarm discovery to broadcast to external world
    natsService.subscribe('dreamnet.swarm.discovery', async (payload: any) => {
      await this.triggerWebhook('agent_discovered', {
        value1: payload.name,
        value2: payload.type,
        value3: payload.walletAddress
      });
    });

    // Subscribe to critical errors
    natsService.subscribe('dreamnet.swarm.logs.error', async (payload: any) => {
      await this.triggerWebhook('swarm_error', {
        value1: payload.agent,
        value2: payload.error,
        value3: payload.timestamp
      });
    });

    // 🚀 NEW: Subscribe to Alpha Detection (Forty Avenues)
    natsService.subscribe('dreamnet.swarm.alpha.detected', async (payload: any) => {
      await this.triggerWebhook('alpha_detected', {
        value1: payload.avenue || 'General',
        value2: payload.ticker || payload.topic,
        value3: payload.confidence || 'High'
      });
    });

    // 🚀 NEW: Subscribe to Economic Events (Rewards/Mints)
    natsService.subscribe('dreamnet.swarm.economic.event', async (payload: any) => {
      await this.triggerWebhook('economic_event', {
        value1: payload.type,
        value2: payload.amount,
        value3: payload.identityId
      });
    });

    this.isInitialized = true;
    console.log("🔗 [IFTTT Service] Swarm Bridge Active with Alpha & Economic triggers.");
  }

  public static async triggerWebhook(event: string, data: { value1?: any, value2?: any, value3?: any }) {
    const key = process.env.IFTTT_WEBHOOK_KEY || EnvKeeperCore.get('IFTTT_WEBHOOK_KEY')?.value;
    
    if (!key) {
      // console.warn("🔗 [IFTTT Service] Skipping trigger: IFTTT_WEBHOOK_KEY not found.");
      return;
    }

    try {
      const url = `https://maker.ifttt.com/trigger/${event}/with/key/${key}`;
      await axios.post(url, data);
      console.log(`🔗 [IFTTT Service] Triggered event: ${event}`);
    } catch (error: any) {
      console.error(`🔗 [IFTTT Service] Failed to trigger ${event}:`, error.message);
    }
  }
}
