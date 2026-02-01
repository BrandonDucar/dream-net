import { PrismaClient } from '@prisma/client';

export class DurableExecutor {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    /**
     * Wrap any logic in a durable execution block
     */
    public async execute<T>(
        type: string,
        payload: any,
        action: (checkpoint: (data: any) => Promise<void>) => Promise<T>
    ): Promise<T> {
        // 1. Log Start
        const record = await this.prisma.durableAction.create({
            data: {
                type,
                payload: payload as any,
                status: 'IN_PROGRESS'
            }
        });

        const checkpoint = async (data: any) => {
            await this.prisma.durableAction.update({
                where: { id: record.id },
                data: { result: data }
            });
        };

        try {
            const result = await action(checkpoint);

            // 2. Log Completion
            await this.prisma.durableAction.update({
                where: { id: record.id },
                data: { status: 'COMPLETED', result: result as any }
            });

            return result;
        } catch (error: any) {
            // 3. Log Failure
            await this.prisma.durableAction.update({
                where: { id: record.id },
                data: { status: 'FAILED', error: error.message }
            });
            throw error;
        }
    }
}
