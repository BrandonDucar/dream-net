import cors from "cors";

export function corsStrict() {
  const allowed = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  return cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
      return cb(new Error("CORS not allowed"), false);
    },
    credentials: true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-agent-key",
      "x-role",
      "x-idempotency-key",
      "x-vercel-cron",
      "x-job-signature",
      "x-request-id",
    ],
  });
}
