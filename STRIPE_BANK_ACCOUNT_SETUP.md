# 💳 Stripe Bank Account Setup - Direct Deposits

## ✅ Quick Verification

Run this to check your Stripe bank account connection:

```bash
tsx scripts/verify-stripe-bank-account.ts
```

This will show:
- ✅ If Stripe is configured
- ✅ If payouts are enabled
- ✅ Your connected bank account(s)
- ✅ Payout schedule
- ✅ Recent payouts
- ✅ Account balance

---

## 🏦 Setting Up Bank Account (If Not Done)

### Step 1: Go to Stripe Dashboard

1. **Log in** to: https://dashboard.stripe.com
2. **Go to**: Settings → Payouts
3. **Click**: "Add bank account" or "Manage payouts"

### Step 2: Add Bank Account

1. **Enter bank details:**
   - Account number
   - Routing number
   - Account type (checking/savings)
   - Account holder name

2. **Verify account:**
   - Stripe will send 2 micro-deposits (usually $0.32 each)
   - Check your bank statement
   - Enter amounts in Stripe Dashboard to verify

### Step 3: Set Payout Schedule

**Automatic Payouts (Recommended):**
- **Daily**: Payouts every day
- **Weekly**: Payouts on specific day (e.g., every Friday)
- **Monthly**: Payouts on specific day (e.g., 1st of month)

**Manual Payouts:**
- You manually trigger payouts when ready

**To Set Schedule:**
1. Go to: Settings → Payouts
2. Click "Edit" on payout schedule
3. Choose frequency
4. Save

---

## 🔑 Required Environment Variables

Add these to your `.env`:

```env
# Stripe Secret Key (LIVE for production)
STRIPE_SECRET_KEY=sk_live_...

# Stripe Webhook Secret (for webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Publishable Key (for frontend)
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Important:**
- Use `sk_live_...` for production (real money → real bank)
- Use `sk_test_...` for testing (test money only)

---

## 💰 How Payouts Work

1. **Customer pays** → Money goes to Stripe
2. **Stripe holds** → Usually 2-7 days (rolling reserve)
3. **Automatic payout** → Money sent to your bank account
4. **Arrives** → Usually 1-2 business days

**Timeline:**
- Payment received: Day 0
- Available for payout: Day 2-7 (depending on account age)
- Payout initiated: Based on schedule
- Money in bank: +1-2 business days

---

## 📊 Current Status Check

### What's Already Configured

✅ **Stripe Integration:**
- Webhook handler: `/api/stripe/webhook`
- Checkout sessions: `/api/stripe-checkout/*`
- Billing management: `/api/stripe-billing/*`
- Order processing: `/api/public/checkout/stripe`

✅ **API Keeper Auto-Discovery:**
- Automatically finds `STRIPE_SECRET_KEY` from `.env`
- No manual registration needed

### What You Need to Verify

1. **Bank Account Connected:**
   - Run verification script
   - Or check Stripe Dashboard → Settings → Payouts

2. **Payouts Enabled:**
   - Should show "Payouts enabled: Yes" in verification

3. **Using LIVE Key:**
   - Check that `STRIPE_SECRET_KEY` starts with `sk_live_`
   - Test keys (`sk_test_`) won't send real money

---

## 🚨 Troubleshooting

### "Payouts Not Enabled"

**Solution:**
1. Go to Stripe Dashboard → Settings → Payouts
2. Complete account verification
3. Add and verify bank account
4. Enable payouts

### "No Bank Account Connected"

**Solution:**
1. Go to Stripe Dashboard → Settings → Payouts
2. Click "Add bank account"
3. Enter bank details
4. Verify with micro-deposits

### "Using Test Key"

**Solution:**
1. Get LIVE key from Stripe Dashboard → Developers → API keys
2. Update `.env`:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   ```
3. Restart server

### "Webhook Not Working"

**Solution:**
1. Get webhook secret from Stripe Dashboard → Developers → Webhooks
2. Add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. Ensure webhook URL is set in Stripe Dashboard:
   ```
   https://dreamnet.ink/api/stripe/webhook
   ```

---

## ✅ Verification Checklist

- [ ] `STRIPE_SECRET_KEY` is set (LIVE key for production)
- [ ] `STRIPE_WEBHOOK_SECRET` is set
- [ ] Bank account is connected in Stripe Dashboard
- [ ] Bank account is verified (micro-deposits confirmed)
- [ ] Payouts are enabled
- [ ] Payout schedule is set (automatic or manual)
- [ ] Webhook URL is configured in Stripe Dashboard
- [ ] Test payment works
- [ ] Payout arrives in bank account

---

## 💡 Pro Tips

1. **Start with Test Mode:**
   - Test everything with `sk_test_` key first
   - Switch to `sk_live_` when ready

2. **Monitor Payouts:**
   - Check Stripe Dashboard regularly
   - Set up email notifications for payouts

3. **Rolling Reserve:**
   - New accounts: 7-day hold
   - Established accounts: 2-day hold
   - This is normal and protects against chargebacks

4. **Multiple Bank Accounts:**
   - You can add multiple bank accounts
   - Set default for each currency

---

## 🎯 Next Steps

1. **Run verification:**
   ```bash
   tsx scripts/verify-stripe-bank-account.ts
   ```

2. **If bank account missing:**
   - Follow setup steps above
   - Verify with micro-deposits

3. **Test payment:**
   - Make a test purchase
   - Verify payment appears in Stripe
   - Wait for payout (if automatic)

4. **Monitor:**
   - Check Stripe Dashboard regularly
   - Verify payouts arrive in bank

---

**Your Stripe is already integrated - just need to verify bank account connection!** 🚀

