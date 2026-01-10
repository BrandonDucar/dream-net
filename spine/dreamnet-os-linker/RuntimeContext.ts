export interface RuntimeContext {
    env: 'dev' | 'staging' | 'prod' | string;
    identity?: {
        id: string;
        roles?: string[];
    };
    capabilities: string[];
    metadata?: Record<string, unknown>;
}
