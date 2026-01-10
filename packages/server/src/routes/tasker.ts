
import { FastifyInstance } from 'fastify';
import { taskerCortex } from '@dreamnet/nerve';

export default async function taskerRoutes(fastify: FastifyInstance) {
    /**
     * POST /tasker/swarm
     * Body: { goal: string }
     * Desc: Decomposes a goal into a swarm of tasks and executes them.
     */
    fastify.post('/swarm', async (request, reply) => {
        const { goal } = request.body as { goal: string };

        if (!goal) {
            return reply.status(400).send({ error: "Goal is required." });
        }

        try {
            // 1. Decompose
            const planningTasks = await taskerCortex.decompose(goal);

            // 2. Execute (Async? or Sync? For now Sync to see result)
            // In production, this should be a background job.
            const resultContext = await taskerCortex.executeSwarm(planningTasks);

            return reply.send({
                success: true,
                plan: planningTasks,
                executionReport: resultContext
            });

        } catch (error: any) {
            request.log.error(error);
            return reply.status(500).send({ error: "Swarm Failure", details: error.message });
        }
    });
}
