/**
 * 🌉 N8nBridge: The Sinew (Automation Link)
 *
 * Role: Triggers external n8n workflows via Webhooks.
 * Use Case: "Add row to Google Sheet", "Send Slack Notification", "Process Payment".
 */
export declare class N8nBridge {
    private static instance;
    private baseUrl;
    private constructor();
    static getInstance(): N8nBridge;
    /**
     * Trigger a specific n8n webhook.
     * @param webhookPath The path part of the webhook URL (e.g., "my-workflow-id")
     * @param payload JSON data to send
     */
    trigger(webhookPath: string, payload: any): Promise<{
        success: boolean;
        data?: any;
    }>;
}
export declare const n8nBridge: N8nBridge;
//# sourceMappingURL=N8nBridge.d.ts.map