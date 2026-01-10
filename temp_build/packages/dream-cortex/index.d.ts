import type { DreamNode, DreamStatus, DreamPriority, CortexContext, CortexStatus } from "./types";
import { DreamRegistry } from "./store/dreamRegistry";
export declare const DreamCortex: {
    upsertDream(dream: Partial<DreamNode> & {
        id: string;
        name: string;
    }): DreamNode;
    setDreamStatus(id: string, status: DreamStatus): void;
    setDreamPriority(id: string, priority: DreamPriority): void;
    listDreams(): DreamNode[];
    run(context: CortexContext): CortexStatus;
    status(): CortexStatus;
};
export * from "./types";
export { DreamRegistry };
export default DreamCortex;
