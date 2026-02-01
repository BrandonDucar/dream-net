/**
 * 🕸️ WakuSpine: The Mycelial Comms Layer
 *
 * Target: Logos Network (Waku)
 * Role: Provides unstoppable, censorship-resistant P2P gossipsub for the Wolf Pack.
 *
 * "We do not need servers. We whisper in the dark."
 */
export declare class WakuSpine {
    private static instance;
    private node;
    private encoder;
    private decoder;
    private constructor();
    static getInstance(): WakuSpine;
    ignite(): Promise<void>;
    /**
     * "Socket In" - The T-1000 connection alias.
     */
    socketIn(): Promise<void>;
    private startHeartbeat;
    /**
     * "Morph" - Fluidly switch topics like liquid metal.
     */
    morph(newTopic: string): Promise<void>;
    private handleMessage;
    broadcast(message: string): Promise<void>;
}
export declare const wakuSpine: WakuSpine;
//# sourceMappingURL=WakuSpine.d.ts.map