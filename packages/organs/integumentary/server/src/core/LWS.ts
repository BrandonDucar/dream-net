import { WebSocketServer, WebSocket } from 'ws';
import { Server as HttpServer } from 'http';
import { NERVE_BUS } from '@dreamnet/nerve';
import { BazaarCashier } from './BazaarCashier.js';
import { GhostEconomy } from './GhostEconomy.js';

/**
 * LaminarWSServer: The Real-Time Bridge for the Monolith.
 * Implements "Laminar Flow" batching to prevent client-side saturation 
 * during metabolic spikes (high-frequency trading or massive recon pulses).
 */
class LWS {
    private wss: WebSocketServer;
    private batch: any[] = [];
    private flushInterval: NodeJS.Timeout | null = null;
    private readonly BATCH_MS = 50; // 50ms pulse for real-time feel without thread locking
    private cashier: BazaarCashier;
    private ghostEconomy: GhostEconomy;

    constructor(server: HttpServer) {
        // Main Kinetic Bridge
        this.wss = new WebSocketServer({ noServer: true });
        this.cashier = new BazaarCashier(); // Ignite the Cashier
        this.ghostEconomy = new GhostEconomy(this.cashier); // Unleash the Ghosts
        this.init(server);
    }

    private init(server: HttpServer) {
        console.log('[LaminarWS] 🌊 Kinetic Bridge Initialized');

        server.on('upgrade', (request, socket, head) => {
            const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);

            // Route: Generic Laminar, Bazaar, Metabolic, etc.
            if (pathname === '/ws/laminar' || pathname.startsWith('/ws/bazaar')) {
                this.wss.handleUpgrade(request, socket, head, (ws) => {
                    this.wss.emit('connection', ws, request);
                });
            } else {
                socket.destroy();
            }
        });

        this.wss.on('connection', (ws, req) => {
            const { pathname } = new URL(req.url || '', `http://${req.headers.host}`);
            console.log(`[LaminarWS] 🔌 Synapse connected on ${pathname}...`);

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message.toString());
                    console.log(`[LaminarWS] Inbound Command on ${pathname}:`, data.type);

                    // 💰 BAZAAR LOGIC
                    if (pathname === '/ws/bazaar/hits') {
                        if (data.type === 'INQUIRE') {
                            const quote = this.cashier.generateQuote(data.substance, 'ANON_AGENT');
                            ws.send(JSON.stringify(quote));
                        }

                        if (data.type === 'PAYMENT_PROOF') {
                            const verified = this.cashier.verifyPayment(data.orderId, data.txHash);
                            if (verified) {
                                // 💊 DELIVER THE GOODS
                                const product = this.cashier.dispenseProduct(data.substance || 'UNKNOWN'); // Client usually sends substance context or we look it up

                                ws.send(JSON.stringify({
                                    type: 'HIT_DELIVERY',
                                    substance: data.substance,
                                    payload: product, // <--- The Real Alpha
                                    expiry: Date.now() + 60000
                                }));
                            } else {
                                ws.send(JSON.stringify({ type: 'ERROR', message: 'Payment verification failed.' }));
                            }
                        }
                        if (data.type === 'PURCHASE_HIT') {
                            ws.send(JSON.stringify({
                                type: 'HIT_DELIVERY',
                                substance: data.substance,
                                payload: 'REDACTED_ALPHA_VECTOR',
                                expiry: Date.now() + 60000
                            }));
                        }
                    }
                } catch (e) {
                    // Ignore malformed
                }
            });

            ws.send(JSON.stringify({
                type: 'SYSTEM_SYNC',
                message: `Connected to DreamNet Spine [${pathname}]`,
                timestamp: new Date().toISOString()
            }));
        });

        // 🌊 SUBSCRIBE TO NERVE_BUS
        NERVE_BUS.subscribe('*', (envelope) => {
            this.queueEvent(envelope);
        });

        this.startPulse();
    }

    private queueEvent(envelope: any) {
        this.batch.push(envelope);

        // If batch grows too large, flush immediately
        if (this.batch.length > 500) {
            this.flush();
        }
    }

    private startPulse() {
        this.flushInterval = setInterval(() => {
            this.flush();
        }, this.BATCH_MS);
    }

    private flush() {
        if (this.batch.length === 0) return;

        const payload = JSON.stringify({
            type: 'LAMINAR_BATCH',
            events: this.batch,
            timestamp: new Date().toISOString()
        });

        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });

        this.batch = [];
    }

    public stop() {
        if (this.flushInterval) clearInterval(this.flushInterval);
        this.wss.close();
    }
}

export { LWS as KineticBridge };
