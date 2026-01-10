export interface OSProcessDescriptor {
    processName: string;
    allowedCapabilities: string[];
    metadata?: Record<string, unknown>;
}
