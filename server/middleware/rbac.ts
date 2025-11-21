/**
 * RBAC Middleware
 * Checks permissions before allowing actions
 */

import { Request, Response, NextFunction } from "express";
import { DreamNetRBACCore } from "../../packages/dreamnet-rbac-core";
import type { Permission } from "@dreamnet/dreamnet-rbac-core/types";

export function createRBACMiddleware(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId || req.headers["x-user-id"] as string || "anonymous";
    const walletAddress = (req as any).walletAddress || req.headers["x-wallet-address"] as string;
    const clusterId = req.params.clusterId || req.query.clusterId as string;
    const traceId = (req as any).traceId;

    const hasPermission = DreamNetRBACCore.checkPermission({
      userId,
      walletAddress,
      permission,
      clusterId,
      resourceId: req.params.id,
    });

    if (!hasPermission) {
      return res.status(403).json({
        ok: false,
        error: "permission_denied",
        message: `Permission '${permission}' required`,
        traceId,
        userId,
        permission,
        clusterId,
      });
    }

    next();
  };
}

