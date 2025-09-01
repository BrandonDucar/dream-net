import type { Request, Response, NextFunction } from "express";

/** Comma-separated IPs in env: "1.2.3.4,5.6.7.8" */
export function ipAllowlist(envVar: string = "IP_ALLOWLIST") {
  const list = (process.env[envVar] || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  const set = new Set(list);

  return (req: Request, res: Response, next: NextFunction) => {
    if (set.size === 0) return next();
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";
    if (set.has(ip)) return next();
    return res.status(403).json({ error: "IP not allowed" });
  };
}
