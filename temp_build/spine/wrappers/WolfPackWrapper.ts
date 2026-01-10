import { WolfPack } from '@dreamnet/wolf-pack';
import {
    createPort,
    registerPort,
    FIBERS,
    type DreamPacket
} from '@dreamnet/internal-ports';

export class WolfPackWrapper {
    private static PORT_ID = 'wolf-pack-core';

    constructor() {
        this.initializePort();
    }

    private initializePort() {
        registerPort(createPort(
            WolfPackWrapper.PORT_ID,
            'Wolf Pack Core',
            'bidirectional',
            FIBERS.ALPHA,
            this.handlePacket.bind(this)
        ));
        console.log(`[WolfPackWrapper] Port ${WolfPackWrapper.PORT_ID} registered on ALPHA fiber.`);
    }

    private async handlePacket(packet: DreamPacket): Promise<any> {
        console.log(`[WolfPackWrapper] Received packet: ${packet.type}`);

        try {
            switch (packet.type) {
                case 'wolf.run_cycle':
                    return await WolfPack.run(packet.payload);

                case 'wolf.create_agent':
                    return await WolfPack.createAgent(packet.payload);

                case 'wolf.list_agents':
                    return WolfPack.listAgents();

                case 'wolf.assign_task':
                    return await WolfPack.assignTask(packet.payload.agentId, packet.payload.task);

                default:
                    console.warn(`[WolfPackWrapper] Unknown packet type: ${packet.type}`);
                    return { ok: false, error: 'Unknown packet type' };
            }
        } catch (error: any) {
            console.error(`[WolfPackWrapper] Error handling packet:`, error);
            return { ok: false, error: error.message };
        }
    }
}
