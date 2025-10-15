import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  const initDone = String(process.env.INIT_DONE || "").toLowerCase() === "true";
  return Response.json({
    ok: true,
    initDone,
    env: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasAdminToken: Boolean(process.env.ADMIN_TOKEN),
    },
    ts: new Date().toISOString(),
  });
}
