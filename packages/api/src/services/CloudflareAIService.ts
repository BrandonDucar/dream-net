import axios from 'axios';

/**
 * ⛅ CloudflareAIService
 * Interfaces with the DreamNet Edge Models (Hawk, Arya, Governor).
 */
export class CloudflareAIService {
    private static instance: CloudflareAIService;
    
    private hawkUrl = 'https://hawk-processor.dreamnet-intel.workers.dev';
    private aryaUrl = 'https://arya-generator.dreamnet-intel.workers.dev';
    private governorUrl = 'https://governor-enforcer.dreamnet-intel.workers.dev';

    private constructor() {}

    public static getInstance(): CloudflareAIService {
        if (!CloudflareAIService.instance) {
            CloudflareAIService.instance = new CloudflareAIService();
        }
        return CloudflareAIService.instance;
    }

    /**
     * Classify a signal using Hawk Processor
     */
    public async classifySignal(text: string): Promise<{ sentiment: string, category: string, confidence: number }> {
        try {
            const response = await axios.post(`${this.hawkUrl}/classify`, { text });
            return response.data;
        } catch (err) {
            console.error('❌ [CloudflareAI] Hawk classification failed:', err);
            return { sentiment: 'neutral', category: 'general', confidence: 0 };
        }
    }

    /**
     * Generate creative content using Arya Generator
     */
    public async generateCreative(prompt: string, context: string = ''): Promise<string> {
        try {
            const response = await axios.post(`${this.aryaUrl}/generate`, { prompt, context });
            return response.data.text;
        } catch (err) {
            console.error('❌ [CloudflareAI] Arya generation failed:', err);
            return 'The sky castle remains silent... (Generation failed)';
        }
    }

    /**
     * Verify policy adherence using Governor Enforcer
     */
    public async verifyPolicy(action: any): Promise<{ decision: 'PERMIT' | 'DENY', reason?: string }> {
        try {
            const response = await axios.post(`${this.governorUrl}/verify`, { action });
            return response.data;
        } catch (err) {
            console.error('❌ [CloudflareAI] Governor verification failed:', err);
            return { decision: 'DENY', reason: 'Safety Fallback' };
        }
    }
}

export const cloudflareAI = CloudflareAIService.getInstance();
