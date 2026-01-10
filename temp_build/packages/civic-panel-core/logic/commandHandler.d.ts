import type { CivicPanelContext, CivicCommand, CommandType } from "../types";
export declare function enqueueCommand(type: CommandType, label?: string, meta?: Record<string, any>): CivicCommand;
export declare function processCommands(ctx: CivicPanelContext): Promise<void>;
