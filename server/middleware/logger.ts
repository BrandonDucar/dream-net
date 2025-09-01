import pino from "pino";
import pinoHttp from "pino-http";

const redact = [
  "req.headers.authorization",
  "req.headers.cookie",
  "res.headers.set-cookie",
  "req.headers.x-agent-key",
];

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact,
});

export const httpLogger = pinoHttp({
  logger,
  customProps: (req) => ({ reqId: (req as any).reqId }),
});
