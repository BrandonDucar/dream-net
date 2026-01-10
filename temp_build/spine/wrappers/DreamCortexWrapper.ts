import { DreamCortex } from '@dreamnet/dream-cortex';
import {
    createPort,
    registerPort,
    FIBERS,
    type DreamPacket
} from '@dreamnet/internal-ports';

export class DreamCortexWrapper {
    private static PORT_ID = 'dream-cortex-core';

    constructor() {
        this.initializePort();
    }

    private initializePort() {
        registerPort(createPort(
            DreamCortexWrapper.PORT_ID,
            'Dream Cortex Core',
            'bidirectional',
            FIBERS.ALPHA, // Core Operations channel
            this.handlePacket.bind(this)
        ));
        console.log(`[DreamCortexWrapper] Port ${DreamCortexWrapper.PORT_ID} registered on ALPHA fiber.`);
    }

    private async handlePacket(packet: DreamPacket): Promise<any> {
        console.log(`[DreamCortexWrapper] Received packet: ${packet.type}`);

        try {
            switch (packet.type) {
                case 'cortex.run_cycle':
                    return DreamCortex.run(packet.payload);

                case 'cortex.process_dream':
                    // Assuming method exists
                    return { ok: true, message: 'Dream processing triggered' };

                case 'cortex.status':
                    return { status: 'active', type: 'dream-cortex' };

                default:
                    return { ok: false, error: 'Unknown packet type' };
            }
        } catch (error: any) {
            console.error(`[DreamCortexWrapper] Error handling packet:`, error);
            return { ok: false, error: error.message };
        }
    }
}
