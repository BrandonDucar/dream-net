/**
 * Browser Agent Core Examples
 * Collection of example implementations for common use cases
 */

export { automateGrantApplication } from "./grant-application";
export { monitorDashboard } from "./dashboard-monitor";
export { fillAffiliateForm, type FormData } from "./form-filler";
export { checkDreamNetSite, type SiteCheckResult } from "./site-checker";

/**
 * Run all examples (for testing)
 */
export async function runAllExamples() {
  console.log("🚀 Running Browser Agent Core Examples\n");

  // Example 1: Grant Application
  console.log("1️⃣  Grant Application Example");
  console.log("─────────────────────────────");
  // await automateGrantApplication();
  console.log("(Skipped - requires real grant portal)\n");

  // Example 2: Dashboard Monitoring
  console.log("2️⃣  Dashboard Monitoring Example");
  console.log("─────────────────────────────");
  // await monitorDashboard();
  console.log("(Skipped - requires real dashboard)\n");

  // Example 3: Form Filling
  console.log("3️⃣  Form Filling Example");
  console.log("─────────────────────────────");
  // await fillAffiliateForm("https://example.com/apply", {
  //   name: "DreamNet",
  //   email: "contact@dreamnet.ink",
  //   company: "DreamNet",
  //   description: "Biomimetic AI platform",
  // });
  console.log("(Skipped - requires real form URL)\n");

  // Example 4: Site Checking
  console.log("4️⃣  Site Checker Example");
  console.log("─────────────────────────────");
  // await checkDreamNetSite("https://dreamnet.ink");
  console.log("(Skipped - requires real site URL)\n");

  console.log("✅ All examples loaded successfully!");
  console.log("\nTo run examples, uncomment the function calls above and provide real URLs.");
}

