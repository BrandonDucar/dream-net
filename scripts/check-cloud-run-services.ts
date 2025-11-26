/**
 * Check Cloud Run Services and Why Dream Hub Isn't Visible
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function checkCloudRunServices() {
  console.log("=".repeat(70));
  console.log("🔍 CLOUD RUN SERVICES ANALYSIS");
  console.log("=".repeat(70));
  console.log("");

  try {
    // Get all services
    const { stdout } = await execAsync(
      `gcloud run services list --format="json" --limit=20 2>&1`
    );
    const services = JSON.parse(stdout);

    console.log(`Found ${services.length} Cloud Run service(s):\n`);

    for (const service of services) {
      const name = service.metadata?.name || "unknown";
      const url = service.status?.url || "No URL";
      const region = service.metadata?.labels?.["cloud.googleapis.com/location"] || "unknown";
      const created = service.metadata?.creationTimestamp || "unknown";
      const ready = service.status?.conditions?.find((c: any) => c.type === "Ready");
      const status = ready?.status || "Unknown";

      console.log(`📦 ${name}`);
      console.log(`   URL: ${url}`);
      console.log(`   Region: ${region}`);
      console.log(`   Status: ${status}`);
      console.log(`   Created: ${created}`);
      
      // Check if it's serving the frontend
      if (url !== "No URL") {
        try {
          const { stdout: healthCheck } = await execAsync(
            `curl -s -o $null -w "%{http_code}" ${url}/health 2>&1 || echo "failed"`
          );
          console.log(`   Health: ${healthCheck.trim()}`);
        } catch {
          console.log(`   Health: Unable to check`);
        }
      }
      console.log("");
    }

    // Analysis
    console.log("=".repeat(70));
    console.log("📊 ANALYSIS");
    console.log("=".repeat(70));
    console.log("");

    const dreamnetServices = services.filter((s: any) => 
      s.metadata?.name?.toLowerCase().includes("dreamnet") || 
      s.metadata?.name?.toLowerCase().includes("dream-net") ||
      s.metadata?.name?.toLowerCase().includes("dreamhub")
    );

    console.log(`Services with "dream" in name: ${dreamnetServices.length}`);
    dreamnetServices.forEach((s: any) => {
      console.log(`  - ${s.metadata?.name}: ${s.status?.url || "No URL"}`);
    });

    console.log("\n💡 Why Dream Hub Might Not Be Visible:");
    console.log("  1. Services might be serving API-only (no frontend)");
    console.log("  2. Frontend might not be built/deployed");
    console.log("  3. Services might be old/failed deployments");
    console.log("  4. Domain might not be mapped to the right service");
    console.log("  5. Services might be in different regions");
    console.log("");

    console.log("🎯 Dream Hub Should Be At:");
    console.log("  - Route: / (root)");
    console.log("  - Route: /hub");
    console.log("  - Route: /legacy (BaseMiniAppsHubPage)");
    console.log("  - Component: DreamNetHubWrapper");
    console.log("");

    console.log("🔧 Recommended Actions:");
    console.log("  1. Clean up old services: gcloud run services delete <name> --region=<region>");
    console.log("  2. Deploy fresh: .\\scripts\\deploy-watchable.ps1");
    console.log("  3. Map domain: gcloud run domain-mappings create --service=dreamnet --domain=dreamnet.ink");
    console.log("");

  } catch (error: any) {
    console.error("Error checking services:", error.message);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkCloudRunServices().catch(console.error);
}

