export interface Task {
    id: string;
    role: 'RESEARCHER' | 'WRITER' | 'PUBLISHER' | 'CODER' | 'SINEW' | 'MANAGER' | 'SALESMAN';
    instruction: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DONE' | 'FAILED';
    output?: string;
}
export declare class TaskerCortex {
    private static instance;
    private constructor();
    static getInstance(): TaskerCortex;
    /**
     * 🧠 Decompose a high-level goal into atomic tasks using BrainGate.
     */
    decompose(goal: string): Promise<Task[]>;
    /**
     * 🐝 Execute the Swarm on a list of tasks.
     */
    executeSwarm(tasks: Task[]): Promise<string>;
}
export declare const taskerCortex: TaskerCortex;
//# sourceMappingURL=TaskerCortex.d.ts.map