export const runtime = "edge";

export async function GET() {
  const agents = [
    { name: "DeployKeeper", status: "stopped" },
    { name: "DreamKeeper", status: "stopped" },
    { name: "DreamOps Launcher", status: "stopped" },
    { name: "AI Surgeon Agent", status: "stopped" },
    { name: "DreamDefenseNet", status: "stopped" },
    { name: "EvolutionEngine", status: "stopped" },
  ];
  return new Response(JSON.stringify({ agents }), {
    headers: { "Content-Type": "application/json" },
  });
}
