import type { GraftModel, ValidationResult } from "./types";
import * as graftEvents from "./events/emitter";
export declare function submitGraft(partial: Partial<GraftModel>): Promise<GraftModel>;
export declare function validateGraft(graft: GraftModel): Promise<ValidationResult>;
export declare function installGraft(graft: GraftModel): Promise<void>;
export declare function applyGraft(id: string): Promise<GraftModel>;
export declare function runPostInstallTasks(graft: GraftModel): Promise<void>;
export declare function broadcastGraftEvent(event: Parameters<typeof graftEvents.emit>[0], graft: GraftModel): void;
