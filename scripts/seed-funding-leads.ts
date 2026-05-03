
import { WolfPackFundingCore } from "../packages/wolfpack-funding-core";

async function seed() {
  console.log("🌱 Seeding test funding leads...");

  const leads = [
    {
      id: "lead:test-self",
      name: "DreamNet Test Recipient",
      type: "other" as any,
      email: process.env.TEST_LEAD_EMAIL || "brand@example.com",
      notes: "Internal test lead for verifying the Wolf Pack Mailer infrastructure.",
      stage: "new" as any,
    },
    {
      id: "lead:a16z-crypto",
      name: "a16z Crypto",
      type: "vc" as any,
      email: "contact@a16z.com",
      website: "https://a16zcrypto.com",
      notes: "Top tier crypto VC. Potential fit for DreamNet infrastructure.",
      stage: "new" as any,
    }
  ];

  for (const lead of leads) {
    WolfPackFundingCore.upsertLead(lead);
    console.log(`✅ Seeded lead: ${lead.name} (${lead.id})`);
  }

  console.log("🏁 Seeding complete.");
}

seed().catch(console.error);
