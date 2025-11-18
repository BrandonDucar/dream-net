/**
 * Seed a test lead into WolfPackFundingCore
 * 
 * Usage:
 *   tsx scripts/seedWolfpackTestLead.ts
 */

import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";

async function main() {
  console.log("Seeding test lead into Wolf Pack...");

  // ⚠️ IMPORTANT: Replace this email with your actual email address
  // This is where you'll receive the test email from Wolf Pack
  const testEmail = process.env.TEST_LEAD_EMAIL || "YOUR_PERSONAL_EMAIL@example.com";
  
  if (testEmail === "YOUR_PERSONAL_EMAIL@example.com") {
    console.warn("⚠️  WARNING: Using placeholder email. Set TEST_LEAD_EMAIL env var or edit this script.");
    console.warn("   The email will not be sent until you provide a real email address.");
  }

  WolfPackFundingCore.upsertLead({
    id: "lead:test-self",
    name: "Test Self Lead",
    type: "angel",
    email: testEmail,
    tags: ["test", "ai", "infra"],
    stage: "new",
  });

  const status = WolfPackFundingCore.status();
  console.log("Seeded lead. Status:", {
    leadCount: status.leadCount,
    sampleLeads: status.sampleLeads,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

