import { dreamEventBus } from '../../nerve/src/spine/dreamnet-event-bus/DreamEventBus';

export type WorkerRole = 'SIFTER' | 'AUDITOR' | 'CODER' | 'RESEARCHER';

export interface WorkerManifest {
    workerId: string;
    role: WorkerRole;
    jouleLimit: number;
    status: 'IDLE' | 'BUSY' | 'TERMINATED';
}

/**
 * 🏭 WorkerFactory
 * Role: Spawns specialized sub-agents to fulfill mercenary bounties.
 * Logic: Assigns roles and sets compute limits (JouleLimit).
 */
export class WorkerFactory {
    private activeWorkers: Map<string, WorkerManifest> = new Map();

    public spawnWorker(role: WorkerRole, jouleLimit: number = 100): WorkerManifest {
        const workerId = `worker-${role.toLowerCase()}-${Math.random().toString(36).slice(2, 7)}`;

        console.log(`🏭 [WorkerFactory] Spawning ${role} worker: ${workerId} (Limit: ${jouleLimit}J)`);

        const manifest: WorkerManifest = {
            workerId,
            role,
            jouleLimit,
            status: 'IDLE'
        };

        this.activeWorkers.set(workerId, manifest);

        // Broadcast spawn event
        dreamEventBus.publish(dreamEventBus.createEnvelope(
            'Worker.Spawned',
            'WorkerFactory',
            manifest,
            { severity: 'medium' }
        ));

        return manifest;
    }

    public getWorkerStatus(workerId: string): WorkerManifest | undefined {
        return this.activeWorkers.get(workerId);
    }

    public listActiveWorkers(): WorkerManifest[] {
        return Array.from(this.activeWorkers.values());
    }

    public terminateWorker(workerId: string) {
        console.log(`🏭 [WorkerFactory] Terminating worker: ${workerId}`);
        const worker = this.activeWorkers.get(workerId);
        if (worker) {
            worker.status = 'TERMINATED';
            this.activeWorkers.delete(workerId);
        }
    }
}

export const workerFactory = new WorkerFactory();
