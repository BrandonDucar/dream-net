import { PrismaClient } from '@prisma/client';
import { dreamEventBus } from '../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';

const prisma = new PrismaClient();

export type MoltType = 'MOLTING' | 'SOPHLET' | 'TINY_TURTLE';

export interface MoltDNA {
    hue: number;
    noise: number;
    glow: number;
    primaryColor: string;
    traits: string[];
}

export class MoltingService {
    /**
     * Incubates a new visual hybrid (Molting) from two parents.
     */
    async incubate(
        name: string,
        parent1Id: string,
        parent2Id: string,
        type: MoltType,
        dna: MoltDNA
    ) {
        console.log(`[Molting Engine] Incubating visual hybrid: ${name} (${type})`);

        // 1. Transaction & Receipt Creation (Simulated payment check)
        const receipt = await prisma.remixReceipt.create({
            data: {
                payerId: parent1Id,
                amount: type === 'TINY_TURTLE' ? '1000' : '500',
                token: 'DREAM'
            }
        });

        // 2. Visual Persistence
        // In a real scenario, this would trigger an Ohara/Dall-E generation.
        // For now, we simulate the URL generation.
        const imageUrl = `https://api.dicebear.com/7.x/shapes/svg?seed=${name}-${Date.now()}`;

        const molting = await prisma.molting.create({
            data: {
                name,
                type,
                dna: dna as any,
                imageUrl,
                parent1Id,
                parent2Id,
                generation: 1, // Logic for incrementing gen based on parents could be added
                remixReceiptId: receipt.id
            }
        });

        // 3. Emit Event
        dreamEventBus.publish('MOLTING_BORN', {
            moltingId: molting.id,
            name: molting.name,
            type: molting.type,
            imageUrl: molting.imageUrl,
            timestamp: new Date().toISOString()
        });

        return molting;
    }

    async getLineage(moltingId: string) {
        return await prisma.molting.findUnique({
            where: { id: moltingId },
            include: { remixReceipt: true }
        });
    }
}

export const moltingService = new MoltingService();
