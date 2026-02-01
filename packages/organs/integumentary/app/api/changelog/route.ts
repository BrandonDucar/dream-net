export const runtime = "edge";

export async function GET() {
  const changelog = [
    { message: "Add runs recent endpoint returning stubbed run data", date: "2025-10-15" },
    { message: "Add agents endpoint returning stubbed agent list", date: "2025-10-15" },
    { message: "Add minimal health endpoint returning ok status", date: "2025-10-15" },
    { message: "Add placeholder hybrid homepage page.tsx", date: "2025-10-14" },
    { message: "Add agent manifest file for DreamNet agents", date: "2025-10-14" },
    { message: "Add ops file inventory CSVs", date: "2025-10-14" }
  ];
  return new Response(JSON.stringify(changelog), {
    headers: { "Content-Type": "application/json" },
  });
}
