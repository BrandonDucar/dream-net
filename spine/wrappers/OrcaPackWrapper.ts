import { OrcaPackCore } from '@dreamnet/orca-pack-core';
import {
    createPort,
    registerPort,
    FIBERS,
    type DreamPacket
} from '@dreamnet/internal-ports';

export class OrcaPackWrapper {
    private static PORT_ID = 'orca-pack-core';

    constructor() {
        this.initializePort();
    }

    private initializePort() {
        registerPort(createPort(
            OrcaPackWrapper.PORT_ID,
            'Orca Pack Core',
            'bidirectional',
            FIBERS.BETA, // Defense/Security channel
            this.handlePacket.bind(this)
        ));
        console.log(`[OrcaPackWrapper] Port ${OrcaPackWrapper.PORT_ID} registered on BETA fiber.`);
    }

    private async handlePacket(packet: DreamPacket): Promise<any> {
        console.log(`[OrcaPackWrapper] Received packet: ${packet.type}`);

        try {
            switch (packet.type) {
                case 'orca.run_cycle':
                    return await OrcaPackCore.run(packet.payload);

                case 'orca.hunt':
                    // Assuming hunt/defense logic
                    return { ok: true, message: 'Hunt logic triggered' };

                case 'orca.status':
                    return { status: 'active', type: 'orca-pack' };

                default:
                    return { ok: false, error: 'Unknown packet type' };
            }
        } catch (error: any) {
            console.error(`[OrcaPackWrapper] Error handling packet:`, error);
            return { ok: false, error: error.message };
        }
    }
}
