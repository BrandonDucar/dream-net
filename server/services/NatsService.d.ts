export declare class NatsService {
    private static instance;
    private connection;
    private js;
    private constructor();
    static getInstance(): NatsService;
    /**
     * Initialize NATS and JetStream
     */
    initialize(url?: string): Promise<void>;
    /**
     * Ensure core DreamNet streams exist
     */
    private ensureStreams;
    /**
     * Register NATS as a transport for the Nerve Bus
     */
    private registerAsNerveTransport;
    /**
     * Publish a message to NATS
     */
    publish(subject: string, data: any): Promise<void>;
    /**
     * Shutdown NATS connection
     */
    shutdown(): Promise<void>;
}
export declare const natsService: NatsService;
//# sourceMappingURL=NatsService.d.ts.map