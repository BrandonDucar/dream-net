
/**
 * 🌉 N8nBridge: The Sinew (Automation Link)
 * 
 * Role: Triggers external n8n workflows via Webhooks.
 * Use Case: "Add row to Google Sheet", "Send Slack Notification", "Process Payment".
 */
export class N8nBridge {
    private static instance: N8nBridge;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = process.env.N8N_WEBHOOK_BASE || '';
    }

    public static getInstance(): N8nBridge {
        if (!N8nBridge.instance) {
            N8nBridge.instance = new N8nBridge();
        }
        return N8nBridge.instance;
    }

    /**
     * Trigger a specific n8n webhook.
     * @param webhookPath The path part of the webhook URL (e.g., "my-workflow-id")
     * @param payload JSON data to send
     */
    public async trigger(webhookPath: string, payload: any): Promise<{ success: boolean; data?: any }> {
        if (!this.baseUrl && !webhookPath.startsWith('http')) {
            console.warn('[🌉 N8nBridge] Warning: N8N_WEBHOOK_BASE is not set. Assuming full URL provided.');
        }

        const url = webhookPath.startsWith('http') ? webhookPath : `${this.baseUrl}/${webhookPath}`;
        console.log(`[🌉 N8nBridge] Triggering Sinew found at: ${url}`);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`N8n Status ${response.status}: ${await response.text()}`);
            }

            const data = await response.json().catch(() => ({ status: 'ok' })); // n8n might return simple text
            return { success: true, data };
        } catch (error: any) {
            console.error(`[🌉 N8nBridge] Connection Snapped: ${error.message}`);
            return { success: false, data: error.message };
        }
    }
}

export const n8nBridge = N8nBridge.getInstance();
