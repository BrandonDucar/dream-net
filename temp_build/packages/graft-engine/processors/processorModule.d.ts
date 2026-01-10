import type { GraftModel, GraftProcessor, InstallResult } from "../types";
export declare class ModuleProcessor implements GraftProcessor {
    install(graft: GraftModel): Promise<InstallResult>;
}
