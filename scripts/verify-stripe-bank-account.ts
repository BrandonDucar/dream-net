/**
 * Verify Stripe Bank Account Connection
 * 
 * Checks that Stripe is properly configured and connected to your bank account
 * for direct deposits.
 * 
 * Run with: tsx scripts/verify-stripe-bank-account.ts
 */

import Stripe from "stripe";

async function verifyStripeBankAccount() {
  console.log("💳 Verifying Stripe Bank Account Connection\n");
  console.log("=".repeat(60) + "\n");

  // Check environment variables
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    console.error("❌ STRIPE_SECRET_KEY not found in environment");
    console.error("\n💡 Add to .env:");
    console.error("   STRIPE_SECRET_KEY=sk_live_...");
    console.error("   STRIPE_WEBHOOK_SECRET=whsec_...");
    return;
  }

  // Check if using test or live key
  const isLive = stripeSecretKey.startsWith("sk_live_");
  const isTest = stripeSecretKey.startsWith("sk_test_");

  console.log(`🔑 Stripe Key Type: ${isLive ? "✅ LIVE (Production)" : isTest ? "⚠️  TEST (Development)" : "❓ Unknown"}`);
  console.log(`🔐 Webhook Secret: ${stripeWebhookSecret ? "✅ Configured" : "❌ Missing"}\n`);

  if (!isLive) {
    console.warn("⚠️  Using TEST key - payments won't go to real bank account!");
    console.warn("   Switch to LIVE key (sk_live_...) for production\n");
  }

  try {
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get account information
    console.log("📊 Fetching Stripe Account Information...\n");
    const account = await stripe.accounts.retrieve();

    console.log(`✅ Account ID: ${account.id}`);
    console.log(`✅ Account Type: ${account.type}`);
    console.log(`✅ Country: ${account.country}`);
    console.log(`✅ Default Currency: ${account.default_currency}`);
    console.log(`✅ Charges Enabled: ${account.charges_enabled ? "✅ Yes" : "❌ No"}`);
    console.log(`✅ Payouts Enabled: ${account.payouts_enabled ? "✅ Yes" : "❌ No"}\n`);

    if (!account.payouts_enabled) {
      console.error("❌ PAYOUTS NOT ENABLED!");
      console.error("\n💡 To enable payouts:");
      console.error("   1. Go to https://dashboard.stripe.com/settings/payouts");
      console.error("   2. Add your bank account");
      console.error("   3. Complete verification");
      console.error("   4. Enable payouts\n");
    }

    // Get bank account information
    console.log("🏦 Fetching Bank Account Information...\n");
    try {
      const externalAccounts = await stripe.accounts.listExternalAccounts(account.id, {
        object: "bank_account",
        limit: 10,
      });

      if (externalAccounts.data.length === 0) {
        console.error("❌ NO BANK ACCOUNTS CONNECTED!");
        console.error("\n💡 To add bank account:");
        console.error("   1. Go to https://dashboard.stripe.com/settings/payouts");
        console.error("   2. Click 'Add bank account'");
        console.error("   3. Enter your bank details");
        console.error("   4. Complete verification (micro-deposits)\n");
      } else {
        console.log(`✅ Found ${externalAccounts.data.length} bank account(s):\n`);
        for (const bank of externalAccounts.data) {
          const bankAccount = bank as Stripe.BankAccount;
          console.log(`   Bank: ${bankAccount.bank_name || "Unknown"}`);
          console.log(`   Account: ****${bankAccount.last4}`);
          console.log(`   Status: ${bankAccount.status}`);
          console.log(`   Currency: ${bankAccount.currency.toUpperCase()}`);
          console.log(`   Default: ${bankAccount.default_for_currency ? "✅ Yes" : "❌ No"}\n`);
        }
      }
    } catch (error: any) {
      console.warn("⚠️  Could not fetch bank accounts:", error.message);
      console.warn("   This might be a permissions issue\n");
    }

    // Get payout schedule
    console.log("📅 Fetching Payout Schedule...\n");
    try {
      const accountSettings = await stripe.accounts.retrieve(account.id);
      const payoutSchedule = (accountSettings as any).settings?.payouts?.schedule;

      if (payoutSchedule) {
        console.log(`✅ Payout Schedule: ${payoutSchedule.interval || "Manual"}`);
        if (payoutSchedule.weekly_anchor) {
          console.log(`   Weekly Anchor: ${payoutSchedule.weekly_anchor}`);
        }
        if (payoutSchedule.monthly_anchor) {
          console.log(`   Monthly Anchor: Day ${payoutSchedule.monthly_anchor}`);
        }
        if (payoutSchedule.delay_days) {
          console.log(`   Delay: ${payoutSchedule.delay_days} days`);
        }
      } else {
        console.log("⚠️  Payout schedule not configured (manual payouts)");
      }
      console.log();
    } catch (error: any) {
      console.warn("⚠️  Could not fetch payout schedule:", error.message);
    }

    // Get recent payouts
    console.log("💰 Recent Payouts (Last 5)...\n");
    try {
      const payouts = await stripe.payouts.list({ limit: 5 });

      if (payouts.data.length === 0) {
        console.log("   No payouts yet");
      } else {
        for (const payout of payouts.data) {
          const status = payout.status === "paid" ? "✅" : payout.status === "pending" ? "⏳" : "❌";
          console.log(`   ${status} ${new Date(payout.created * 1000).toLocaleDateString()}`);
          console.log(`      Amount: ${(payout.amount / 100).toFixed(2)} ${payout.currency.toUpperCase()}`);
          console.log(`      Status: ${payout.status}`);
          console.log(`      Method: ${payout.method}`);
          if (payout.arrival_date) {
            console.log(`      Arrival: ${new Date(payout.arrival_date * 1000).toLocaleDateString()}`);
          }
          console.log();
        }
      }
    } catch (error: any) {
      console.warn("⚠️  Could not fetch payouts:", error.message);
    }

    // Get account balance
    console.log("💵 Account Balance...\n");
    try {
      const balance = await stripe.balance.retrieve();
      console.log(`   Available: ${(balance.available[0]?.amount || 0) / 100} ${balance.available[0]?.currency?.toUpperCase() || "USD"}`);
      console.log(`   Pending: ${(balance.pending[0]?.amount || 0) / 100} ${balance.pending[0]?.currency?.toUpperCase() || "USD"}`);
      console.log();
    } catch (error: any) {
      console.warn("⚠️  Could not fetch balance:", error.message);
    }

    // Summary
    console.log("=".repeat(60));
    console.log("\n📋 Summary:\n");

    const checks = [
      { name: "Stripe Key Configured", pass: !!stripeSecretKey },
      { name: "Using LIVE Key", pass: isLive },
      { name: "Webhook Secret Set", pass: !!stripeWebhookSecret },
      { name: "Payouts Enabled", pass: account.payouts_enabled },
      { name: "Charges Enabled", pass: account.charges_enabled },
    ];

    for (const check of checks) {
      console.log(`   ${check.pass ? "✅" : "❌"} ${check.name}`);
    }

    if (checks.every((c) => c.pass)) {
      console.log("\n✅ Stripe is fully configured and ready for direct bank deposits!");
    } else {
      console.log("\n⚠️  Some configuration is missing. See above for details.");
    }

    console.log("\n💡 Next Steps:");
    console.log("   1. Ensure bank account is verified in Stripe Dashboard");
    console.log("   2. Set payout schedule (Settings → Payouts)");
    console.log("   3. Test with a small payment");
    console.log("   4. Monitor payouts in Stripe Dashboard\n");
  } catch (error: any) {
    console.error("❌ Error verifying Stripe:", error.message);
    if (error.type === "StripeAuthenticationError") {
      console.error("\n💡 Your Stripe secret key may be invalid");
      console.error("   Check that STRIPE_SECRET_KEY is correct in .env\n");
    }
  }
}

verifyStripeBankAccount().catch(console.error);

