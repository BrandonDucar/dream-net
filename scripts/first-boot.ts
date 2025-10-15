/**
 * First-boot script:
 * 1) sanity check DB connectivity (optional)
 * 2) if VERCEL_TOKEN + VERCEL_PROJECT_ID are present, flip INIT_DONE=true via Vercel Env API
 * Otherwise: print instructions.
 */
import fetch from "node-fetch";

async function main() {
  const vercelToken = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!vercelToken || !projectId) {
    console.log("[first-boot] Missing VERCEL_TOKEN or VERCEL_PROJECT_ID. Set INIT_DONE=true manually in Vercel.");
    process.exit(0);
  }
  // List envs
  const base = `https://api.vercel.com/v9/projects/${projectId}/env`;
  // Create or update INIT_DONE to true for Production
  const res = await fetch(base, {
    method: "POST",
    headers: { Authorization: `Bearer ${vercelToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ key: "INIT_DONE", value: "true", target: ["production"], type: "plain" }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Vercel env set failed: ${res.status} ${t}`);
  }
  console.log("[first-boot] INIT_DONE=true set in Vercel (production). Redeploy to apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
