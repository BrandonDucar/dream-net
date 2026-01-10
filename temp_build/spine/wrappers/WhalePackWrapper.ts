import { WhalePackCore } from '@dreamnet/whale-pack-core';
import {
    createPort,
    registerPort,
    FIBERS,
    type DreamPacket
} from '@dreamnet/internal-ports';

export class WhalePackWrapper {
    private static PORT_ID = 'whale-pack-core';

    constructor() {
        this.initializePort();
    }

    private initializePort() {
        registerPort(createPort(
            WhalePackWrapper.PORT_ID,
            'Whale Pack Core',
            'bidirectional',
            FIBERS.ALPHA,
            this.handlePacket.bind(this)
        ));
        console.log(`[WhalePackWrapper] Port ${WhalePackWrapper.PORT_ID} registered on ALPHA fiber.`);
    }

    private async handlePacket(packet: DreamPacket): Promise<any> {
        console.log(`[WhalePackWrapper] Received packet: ${packet.type}`);

        try {
            switch (packet.type) {
                case 'whale.run_cycle':
                    return await WhalePackCore.run(packet.payload);

                case 'whale.orchestrate':
                    // Assuming orchestrate method exists based on role
                    return { ok: true, message: 'Orchestration logic triggered' };

                case 'whale.status':
                    return { status: 'active', type: 'whale-pack' };

                default:
                    return { ok: false, error: 'Unknown packet type' };
            }
        } catch (error: any) {
            console.error(`[WhalePackWrapper] Error handling packet:`, error);
            return { ok: false, error: error.message };
        }
    }
}
