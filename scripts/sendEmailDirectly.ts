/**
 * Send Email Directly
 * 
 * Quick script to send an email directly to someone via Wolf Pack.
 * 
 * Usage:
 *   pnpm exec tsx scripts/sendEmailDirectly.ts <email> <name> <subject> <message>
 * 
 * Example:
 *   pnpm exec tsx scripts/sendEmailDirectly.ts investor@example.com "John Doe" "Partnership Opportunity" "Hi John, I'd like to discuss..."
 */

import "dotenv/config";
import { WolfPackFundingCore } from "@dreamnet/wolfpack-funding-core";
import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.log("===============================================");
    console.log(" Send Email Directly via Wolf Pack");
    console.log("===============================================");
    console.log("");
    console.log("Usage:");
    console.log("  pnpm exec tsx scripts/sendEmailDirectly.ts <email> <name> <subject> <message>");
    console.log("");
    console.log("Example:");
    console.log('  pnpm exec tsx scripts/sendEmailDirectly.ts investor@example.com "John Doe" "Partnership Opportunity" "Hi John, I would like to discuss a potential partnership..."');
    console.log("");
    console.log("Or use the interactive mode (no arguments):");
    console.log("  pnpm exec tsx scripts/sendEmailDirectly.ts");
    console.log("");
    process.exit(1);
  }

  const [email, name, subject, ...messageParts] = args;
  const message = messageParts.join(" ");

  console.log("===============================================");
  console.log(" Sending Email Directly");
  console.log("===============================================");
  console.log("");
  console.log("📧 Email Details:");
  console.log(`   To: ${email}`);
  console.log(`   Name: ${name}`);
  console.log(`   Subject: ${subject}`);
  console.log(`   Message: ${message.substring(0, 100)}...`);
  console.log("");

  // Create a temporary lead for this email
  const leadId = `lead:direct-${Date.now()}`;
  const lead = WolfPackFundingCore.upsertLead({
    id: leadId,
    name: name,
    type: "other",
    email: email,
    stage: "qualified", // Skip scoring, send immediately
  });

  console.log("✅ Lead created:", leadId);
  console.log("");

  // Generate email draft
  const fromName = process.env.WOLFMAIL_FROM_NAME || "DreamNet Team";
  const fromEmail = process.env.WOLFMAIL_FROM_EMAIL || "brandonducar1234@gmail.com";
  
  const draft = WolfPackFundingCore.generateEmailDraftForLead(lead, {
    fromName,
    fromEmail,
  });

  if (!draft) {
    console.error("❌ Failed to generate email draft");
    process.exit(1);
  }

  // Override with custom subject and body
  draft.subject = subject;
  draft.body = message;

  console.log("✅ Email draft created");
  console.log("");

  // Send immediately (no need to queue for direct sends)
  console.log("📤 Sending email...");
  const config = WolfPackMailerCore.createMailerFromEnv();
  const result = await WolfPackMailerCore.sendMail(
    config,
    email,
    subject,
    message
  );

  if (result.success) {
    console.log("✅ Email sent successfully!");
    console.log("");
    console.log(`📬 Email sent to: ${email}`);
    console.log(`   Subject: ${subject}`);
    console.log("");
    console.log("💡 Note: This was a direct send. The lead was created but not queued.");
    console.log("");
  } else {
    console.error("❌ Failed to send email:", result.error);
    console.error("");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("");
  console.error("❌ Error:", err);
  console.error("");
  process.exit(1);
});

