import { HaloLoop } from '@dreamnet/halo-loop';
import {
    createPort,
    registerPort,
    FIBERS,
    type DreamPacket
} from '@dreamnet/internal-ports';

export class HaloLoopWrapper {
    private static PORT_ID = 'halo-loop-core';

    constructor() {
        this.initializePort();
    }

    private initializePort() {
        registerPort(createPort(
            HaloLoopWrapper.PORT_ID,
            'Halo Loop Core',
            'bidirectional',
            FIBERS.GAMMA, // Network Health channel
            this.handlePacket.bind(this)
        ));
        console.log(`[HaloLoopWrapper] Port ${HaloLoopWrapper.PORT_ID} registered on GAMMA fiber.`);
    }

    private async handlePacket(packet: DreamPacket): Promise<any> {
        console.log(`[HaloLoopWrapper] Received packet: ${packet.type}`);

        try {
            switch (packet.type) {
                case 'halo.run_cycle':
                    return HaloLoop.run(packet.payload);

                case 'halo.health_check':
                    return HaloLoop.checkHealth();

                case 'halo.status':
                    return { status: 'active', type: 'halo-loop' };

                default:
                    return { ok: false, error: 'Unknown packet type' };
            }
        } catch (error: any) {
            console.error(`[HaloLoopWrapper] Error handling packet:`, error);
            return { ok: false, error: error.message };
        }
    }
}
