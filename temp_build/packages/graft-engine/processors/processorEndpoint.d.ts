import type { GraftModel, GraftProcessor, InstallResult } from "../types";
export declare class EndpointProcessor implements GraftProcessor {
    install(graft: GraftModel): Promise<InstallResult>;
}
