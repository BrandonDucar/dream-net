import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from "express";

export function requestId() {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = (req.headers["x-request-id"] as string) || randomUUID();
    (req as any).reqId = id;
    res.setHeader("x-request-id", id);
    next();
  };
}
