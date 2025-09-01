mport type { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = Number(err?.status || err?.code || 500);
  logger.error({ err, status }, "Unhandled Error");
  res.status(status).json({
    error: err?.name || "Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : (err?.message || String(err)),
  });
}
