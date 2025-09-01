import type { Request, Response, NextFunction } from "express";

export type Role = "admin" | "orchestrator" | "agent" | "viewer";
const HDR_ROLE = "x-role"; // let the agent present a role; you still validate server-side

export function requireRole(allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req.header(HDR_ROLE) as Role) || "viewer";
    if (allowed.includes(role)) return next();
    return res.status(403).json({ error: "Forbidden" });
  };
}
