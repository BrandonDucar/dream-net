import type { GraftModel, GraftProcessor, InstallResult } from "../types";
export declare class UIProcessor implements GraftProcessor {
    install(graft: GraftModel): Promise<InstallResult>;
}
