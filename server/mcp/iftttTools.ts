import { IftttService } from '../services/IftttService.js';

/**
 * 🔗 IFTTT MCP Tools
 * Exposes IFTTT capabilities to the agent tool chest.
 */
export const iftttTools = {
  /**
   * Trigger an IFTTT Webhook event.
   */
  trigger_ifttt_event: async ({ event, value1, value2, value3 }: { event: string; value1?: any; value2?: any; value3?: any }) => {
    try {
      await IftttService.triggerWebhook(event, { value1, value2, value3 });
      return {
        success: true,
        message: `IFTTT event '${event}' triggered successfully.`
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Send a system notification via IFTTT.
   */
  send_system_notification: async ({ message, level = 'info' }: { message: string; level?: 'info' | 'warn' | 'error' }) => {
    return await iftttTools.trigger_ifttt_event({
      event: `system_${level}`,
      value1: message,
      value2: new Date().toISOString(),
      value3: 'DreamNet Swarm'
    });
  }
};
