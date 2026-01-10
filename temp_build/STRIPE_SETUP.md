# Stripe Payment Setup Guide

## 🎯 What You Have Now

**HYBRID PAYMENT SYSTEM (BEST OF BOTH WORLDS):**

1. **Stripe Checkout** - For Starter ($297) & Pro ($997) tiers
   - Automated, self-service payments
   - Instant credibility ("Powered by Stripe")
   - Industry-standard security
   
2. **Contact Sales Form** - For Enterprise deals
   - High-touch manual outreach
   - Custom pricing negotiations
   - Leads logged to console (check server logs with `💰 SALES INQUIRY`)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Create Products in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/products
2. Click **"+ Add product"**

**Create Product 1: DreamNet Starter**
- Name: `DreamNet Starter`
- Description: `5 AI Agents, Real-time Agent Mesh, Basic Analytics`
- Pricing Model: `Recurring`
- Price: `$297.00 USD`
- Billing period: `Monthly`
- Click **Save**
- **COPY THE PRICE ID** (looks like `price_1ABC123...`)

**Create Product 2: DreamNet Professional**
- Name: `DreamNet Professional`
- Description: `13 AI Agents, Full Agent Orchestration, Advanced Analytics`
- Pricing Model: `Recurring`
- Price: `$997.00 USD`
- Billing period: `Monthly`
- Click **Save**
- **COPY THE PRICE ID** (looks like `price_1XYZ789...`)

---

### Step 2: Update Your Checkout Page

Open `client/src/pages/Checkout.jsx` and replace the placeholder price IDs:

```javascript
const tierDetails = {
  starter: {
    name: 'Starter',
    price: '$297',
    priceId: 'price_YOUR_STARTER_PRICE_ID_HERE', // ← PASTE HERE
    features: [...]
  },
  pro: {
    name: 'Professional',
    price: '$997',
    priceId: 'price_YOUR_PRO_PRICE_ID_HERE', // ← PASTE HERE
    features: [...]
  }
};
```

---

### Step 3: Rebuild Frontend

```bash
cd client && npx vite build --outDir dist
```

---

## ✅ You're Done! Test It

### Test Flow:
1. **Landing Page** → Click "Subscribe" on Starter or Pro
2. **Checkout Page** → Shows tier details + "Proceed to Stripe Checkout" button
3. **Stripe Hosted Checkout** → Handles payment (test mode: use card `4242 4242 4242 4242`)
4. **Success Page** → Celebration + next steps

### Test Enterprise Flow:
1. **Landing Page** → Click "Contact Sales" on Enterprise tier
2. **Contact Sales Form** → Fill out form
3. **Success Message** → Confirmation
4. **Server Logs** → Check console for `💰 SALES INQUIRY` with lead details

---

## 🔥 Production Checklist

Before going live:

- [ ] Switch Stripe keys from Test to Live mode
- [ ] Create products in **Live** Stripe dashboard (not test)
- [ ] Update price IDs in `Checkout.jsx` with **live** price IDs
- [ ] Set up webhook for subscription events (optional but recommended)
- [ ] Add real email notification for Contact Sales form
- [ ] Test full payment flow end-to-end
- [ ] Publish to production

---

## 🎁 What's Included

### Frontend Pages:
- `Landing.jsx` - Professional money-making landing page
- `Checkout.jsx` - Stripe checkout integration
- `ContactSales.jsx` - Enterprise lead capture form
- `Success.jsx` - Post-payment success page

### Backend APIs:
- `POST /api/stripe/create-checkout` - Creates Stripe checkout sessions
- `POST /api/contact-sales` - Handles enterprise inquiries

### Routing:
- `/` - Landing page
- `/checkout?tier=starter` - Starter checkout
- `/checkout?tier=pro` - Pro checkout
- `/contact-sales` - Enterprise form
- `/success?session_id=xxx` - Post-payment success

---

## 💡 Next Steps (Optional)

1. **Email Notifications**: Add SendGrid/Mailgun to send emails when someone fills Contact Sales form
2. **CRM Integration**: Send leads to HubSpot/Salesforce
3. **Webhooks**: Handle Stripe subscription events (payment succeeded, failed, canceled)
4. **Analytics**: Track conversion rates with Google Analytics or Mixpanel
5. **A/B Testing**: Test different pricing tiers to optimize revenue

---

## 🚀 Ready to Make Money

Your platform is now a **professional money-making machine**:
- Stripe credibility for automated sales
- Manual outreach for high-value deals
- 13 agents ready to deliver value

**SHIP IT! 💰**
