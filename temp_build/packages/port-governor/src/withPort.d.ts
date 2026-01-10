/**
 * Port Governor Middleware
 * Enforces port access control, tier checks, and office/cabinet requirements
 */
import type { Response, NextFunction } from "express";
import type { PortId } from "./types";
import type { RequestWithIdentity } from "../../dreamnet-control-core/identityResolver";
export declare function withPort(portId: PortId): (req: RequestWithIdentity, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
