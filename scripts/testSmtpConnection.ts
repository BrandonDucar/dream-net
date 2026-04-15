/**
 * Test SMTP Connection
 * 
 * Directly tests the SMTP connection to diagnose authentication issues
 */

import "dotenv/config";
import { WolfPackMailerCore } from "@dreamnet/wolfpack-mailer-core";

async function main() {
  console.log("===============================================");
  console.log(" SMTP Connection Test");
  console.log("===============================================");
  console.log("");

  const fromEmail = process.env.WOLFMAIL_FROM_EMAIL || "dreamnetgeo@gmail.com";
  const smtpPass = process.env.WOLFMAIL_SMTP_PASS;

  console.log("🔍 Configuration:");
  console.log(`   From Email: ${fromEmail}`);
  console.log(`   SMTP Password: ${smtpPass ? `${smtpPass.substring(0, 4)}...${smtpPass.substring(smtpPass.length - 4)} (${smtpPass.length} chars)` : "❌ NOT SET"}`);
  console.log("");

  if (!smtpPass) {
    console.error("❌ ERROR: WOLFMAIL_SMTP_PASS is not set in .env");
    process.exit(1);
  }

  if (smtpPass.length !== 16) {
    console.warn(`⚠️  WARNING: App Password should be 16 characters, but yours is ${smtpPass.length}`);
    console.warn("   Make sure there are no spaces and it's the full password");
    console.log("");
  }

  console.log("🔌 Testing SMTP Connection...");
  console.log("");

  try {
    console.log("   Step 1: Creating SMTP config...");
    const config = WolfPackMailerCore.createMailerFromEnv();
    console.log("   ✅ SMTP config created");
    console.log("");

    console.log("   Step 2: Sending test email...");
    const testEmail = process.env.TEST_LEAD_EMAIL || fromEmail;
    
    const result = await WolfPackMailerCore.sendMail(
      config,
      testEmail,
      "DreamNet SMTP Test Email",
      `This is a test email from DreamNet Wolf Pack.

If you received this, your SMTP configuration is working correctly!

Sent at: ${new Date().toISOString()}`
    );

    if (result.success) {
      console.log("   ✅ Test email sent successfully!");
      console.log("");
      console.log(`📬 Check your inbox: ${testEmail}`);
      console.log("   (Also check spam/junk folder)");
      console.log("");
    } else {
      throw new Error(result.error || "Unknown error sending email");
    }

  } catch (err: any) {
    console.error("   ❌ SMTP Error:");
    console.error(`   ${err.message}`);
    console.error("");

    if (err.message.includes("Invalid login") || err.message.includes("BadCredentials")) {
      console.error("🔧 Troubleshooting Steps:");
      console.error("");
      console.error("1. Verify 2-Step Verification is enabled:");
      console.error("   https://myaccount.google.com/security");
      console.error("");
      console.error("2. Generate a NEW App Password:");
      console.error("   - Go to: https://myaccount.google.com/apppasswords");
      console.error("   - Select 'Mail' and 'Other (Custom name)'");
      console.error("   - Name it 'DreamNet'");
      console.error("   - Copy the 16-character password (NO SPACES)");
      console.error("");
      console.error("3. Update .env file:");
      console.error(`   WOLFMAIL_SMTP_PASS=your-16-char-password`);
      console.error("   (Make sure there are no quotes, no spaces)");
      console.error("");
      console.error("4. Make sure you're using the App Password, NOT your regular Gmail password");
      console.error("");
    } else if (err.message.includes("ENOTFOUND") || err.message.includes("ETIMEDOUT")) {
      console.error("🔧 Network Issue:");
      console.error("   - Check your internet connection");
      console.error("   - Gmail SMTP might be blocked by firewall");
      console.error("");
    } else {
      console.error("🔧 Unknown Error:");
      console.error("   Check the error message above for details");
      console.error("");
    }

    process.exit(1);
  }
}

main().catch((err) => {
  console.error("");
  console.error("❌ Unexpected error:", err);
  console.error("");
  process.exit(1);
});

