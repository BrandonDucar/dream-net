import type { DreamNode, DreamStatus, DreamPriority } from "../types";
export declare const DreamRegistry: {
    upsert(dream: Partial<DreamNode> & {
        id: string;
        name: string;
    }): DreamNode;
    get(id: string): DreamNode | undefined;
    getAll(): DreamNode[];
    setStatus(id: string, status: DreamStatus): void;
    setPriority(id: string, priority: DreamPriority): void;
    status(): {
        count: number;
        sample: DreamNode[];
    };
};
