import type { GraftModel, GraftStatus } from "./types";
export declare function registerGraft(graft: GraftModel): Promise<GraftModel>;
export declare function getGrafts(): Promise<GraftModel[]>;
export declare function getGraftById(id: string): Promise<GraftModel | undefined>;
export declare function updateGraftStatus(id: string, status: GraftStatus, update?: Partial<GraftModel>): Promise<GraftModel | undefined>;
export declare function removeGraft(id: string): Promise<void>;
