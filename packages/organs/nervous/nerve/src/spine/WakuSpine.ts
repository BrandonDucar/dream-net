/**
 * 🕸️ WakuSpine: The Mycelial Comms Layer
 * 
 * Target: Logos Network (Waku)
 * Role: Provides unstoppable, censorship-resistant P2P gossipsub for the Wolf Pack.
 * 
 * "We do not need servers. We whisper in the dark."
 */

import { createLightNode, waitForRemotePeer, createEncoder, createDecoder } from '@waku/sdk';
import { dreamEventBus } from './EventBus.js';

const CONTENT_TOPIC = '/dreamnet/1/wolfpack/proto';

export class WakuSpine {
    private static instance: WakuSpine;
    private node: any;
    private encoder: any;
    private decoder: any;

    private constructor() {
        this.encoder = createEncoder({ contentTopic: CONTENT_TOPIC });
        this.decoder = createDecoder(CONTENT_TOPIC);
    }

    public static getInstance(): WakuSpine {
        if (!WakuSpine.instance) {
            WakuSpine.instance = new WakuSpine();
        }
        return WakuSpine.instance;
    }

    public async ignite() {
        console.log("[🕸️ WakuSpine] Igniting Mycelial Layer...");
        try {
            this.node = await createLightNode({ defaultBootstrap: true });
            await this.node.start();
            await waitForRemotePeer(this.node);
            console.log("[🕸️ WakuSpine] Connected to Logos Network. Peers found.");

            // Listen for whispers
            await this.node.filter.subscribe([this.decoder], this.handleMessage.bind(this));

            console.log("[🕸️ WakuSpine] 🩸 T-1000 IDENTITY: Mimetic Poly-Alloy active.");
        } catch (error) {
            console.error("[🕸️ WakuSpine] Connection Failure:", error);
        }
    }

    /**
     * "Socket In" - The T-1000 connection alias.
     */
    public async socketIn() {
        await this.ignite();
        this.startHeartbeat();
    }

    private startHeartbeat() {
        setInterval(() => {
            this.broadcast(`[💓 T-1000 PULSE] System Active. Time: ${Date.now()}`);
        }, 30000); // 30s Pulse
    }

    /**
     * "Morph" - Fluidly switch topics like liquid metal.
     */
    public async morph(newTopic: string) {
        console.log(`[🕸️ WakuSpine] 🧪 MORPHING shape to topic: ${newTopic}`);
        this.encoder = createEncoder({ contentTopic: newTopic });
        this.decoder = createDecoder(newTopic);
        await this.node.filter.subscribe([this.decoder], this.handleMessage.bind(this));
    }

    private handleMessage(wakuMessage: any) {
        if (!wakuMessage.payload) return;
        const text = new TextDecoder().decode(wakuMessage.payload);
        console.log(`[🕸️ WakuSpine] 👂 Whisper Received: ${text}`);
        // Forward to internal EventBus
        // dreamEventBus.publish(...) 
    }

    public async broadcast(message: string) {
        if (!this.node) return;
        console.log(`[🕸️ WakuSpine] 🗣️ Whispering to Swarm: ${message}`);
        await this.node.lightPush.send(this.encoder, {
            payload: new TextEncoder().encode(message)
        });
    }
}

export const wakuSpine = WakuSpine.getInstance();
