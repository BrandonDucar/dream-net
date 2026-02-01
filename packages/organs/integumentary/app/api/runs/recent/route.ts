export const runtime = "edge";

export async function GET() {
  const runs = [
    { agent: "DeployKeeper", runId: "run1", status: "success", timestamp: "2025-10-15T00:00:00Z" },
    { agent: "DreamKeeper", runId: "run2", status: "failed", timestamp: "2025-10-15T00:00:00Z" },
  ];
  return new Response(JSON.stringify({ runs }), {
    headers: { "Content-Type": "application/json" },
  });
}
