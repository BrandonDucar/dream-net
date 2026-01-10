import type { GraftModel, GraftProcessor, InstallResult } from "../types";
export declare class AgentProcessor implements GraftProcessor {
    install(graft: GraftModel): Promise<InstallResult>;
}
