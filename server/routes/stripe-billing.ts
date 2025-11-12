import express from 'express';
import { db } from '../db';
import { stripeCustomers, stripeSubs } from '../../shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Configure Stripe - using existing configuration
let stripe: any = null;
try {
  const Stripe = require('stripe');
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });
} catch (error) {
  console.error('❌ [STRIPE] Stripe not configured properly');
}

// Account page route that handles Stripe checkout success
router.get('/account', async (req, res) => {
  try {
    // If a Checkout sid is present, attach and set cookie
    const sid = req.query.sid as string;
    let customerId = req.cookies?.customer_id;
    
    if (sid && stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sid, {
          expand: ['customer', 'subscription']
        });
        
        customerId = typeof session.customer === 'string' 
          ? session.customer 
          : session.customer?.id;
        
        const email = session.customer_details?.email || session.customer?.email;
        const now = Math.floor(Date.now() / 1000);
        
        // Store customer mapping
        if (customerId) {
          await db.insert(stripeCustomers).values({
            customerId,
            email,
            lastSessionId: sid,
            createdAt: now,
            updatedAt: now
          }).onConflictDoUpdate({
            target: stripeCustomers.customerId,
            set: {
              email,
              lastSessionId: sid,
              updatedAt: now
            }
          });
        }
        
        // Set cookie and redirect to clean URL
        res.cookie('customer_id', customerId, {
          maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
          secure: true,
          httpOnly: true,
          sameSite: 'lax'
        });
        
        return res.redirect('/account');
      } catch (error) {
        console.error('❌ [STRIPE] Error processing checkout session:', error);
      }
    }

    // Pull subscription if we have a customer id
    let subscription = null;
    if (customerId) {
      const [sub] = await db.select()
        .from(stripeSubs)
        .where(eq(stripeSubs.customerId, customerId))
        .orderBy(stripeSubs.updatedAt)
        .limit(1);
      subscription = sub;
    }

    // Render account page
    const status = subscription?.status || 'none';
    const priceId = subscription?.priceId || '—';
    const currentPeriodEnd = subscription?.currentPeriodEnd;
    const nextBill = currentPeriodEnd 
      ? new Date(currentPeriodEnd * 1000).toLocaleDateString() 
      : '—';

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Account – DreamNet</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; margin: 32px; background: #0a0a0a; color: #fff; }
        .card { max-width: 720px; margin: auto; border: 1px solid #333; border-radius: 12px; padding: 32px; background: #111; }
        .row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin: 16px 0; }
        button { 
          padding: 12px 20px; 
          border-radius: 8px; 
          border: 1px solid #444; 
          cursor: pointer; 
          background: #222; 
          color: #fff; 
          font-weight: 500;
          transition: all 0.2s;
        }
        button:hover { background: #333; border-color: #666; }
        .pill { 
          display: inline-block; 
          border-radius: 999px; 
          padding: 6px 14px; 
          border: 1px solid #444; 
          margin: 0 8px;
          font-size: 14px;
        }
        .status-active { border-color: #22c55e; color: #22c55e; }
        .status-none, .status-canceled { border-color: #ef4444; color: #ef4444; }
        .status-past_due { border-color: #f59e0b; color: #f59e0b; }
        h1 { color: #fff; margin-bottom: 24px; }
        code { background: #222; padding: 4px 8px; border-radius: 4px; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>🚀 DreamNet Account</h1>
        
        <p><strong>Customer ID:</strong> <code>${customerId || 'Not set'}</code></p>
        
        <p>
          <strong>Subscription:</strong> 
          <span class="pill status-${status}">${status}</span>
          ${priceId !== '—' ? `<span class="pill">Plan: ${priceId}</span>` : ''}
          <span class="pill">Next billing: ${nextBill}</span>
        </p>

        <div class="row">
          <button onclick="manageBilling()">🔧 Manage Billing</button>
          ${(['none', 'canceled', 'past_due', 'unpaid', 'incomplete'].includes(status)) 
            ? '<button onclick="startSubscription()">⚡ Start Subscription</button>' 
            : ''}
        </div>

        <hr style="border-color: #333; margin: 32px 0;">
        
        <p style="color: #888; font-size: 14px;">
          If you just completed checkout and don't see your subscription, 
          wait a moment and refresh – our webhook may still be processing.
        </p>
      </div>

      <script>
        async function manageBilling() {
          const cid = getCustomerId();
          if (!cid) return alert('No customer ID found. Please complete checkout first.');
          
          try {
            const response = await fetch('/api/stripe/portal', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customer_id: cid })
            });
            
            const data = await response.json();
            if (data.url) {
              window.location = data.url;
            } else {
              alert('Unable to open billing portal. Please try again.');
            }
          } catch (error) {
            alert('Error opening billing portal. Please try again.');
          }
        }

        async function startSubscription() {
          try {
            const response = await fetch('/api/checkout/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
            });
            
            const data = await response.json();
            if (data.url) {
              window.location = data.url;
            } else {
              alert('Unable to start checkout. Please try again.');
            }
          } catch (error) {
            alert('Error starting checkout. Please try again.');
          }
        }

        function getCustomerId() {
          const match = document.cookie.match(/(?:^|; )customer_id=([^;]+)/);
          return match ? decodeURIComponent(match[1]) : '';
        }
      </script>
    </body>
    </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('❌ [STRIPE] Error rendering account page:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced Stripe webhook handler that stores subscription details
router.post('/api/stripe/webhook', async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error('❌ [STRIPE] Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const { type, data } = event;
    const now = Math.floor(Date.now() / 1000);

    console.log(`🔔 [STRIPE] Webhook received: ${type}`);

    if (type === 'checkout.session.completed') {
      const sessionData = data.object;
      const subId = sessionData.subscription;
      const custId = sessionData.customer;
      
      if (subId && custId) {
        // Retrieve subscription details for period dates
        const sub = await stripe.subscriptions.retrieve(subId);
        const planPrice = sub.items?.data?.[0]?.price?.id;
        const currentPeriodEnd = sub.current_period_end;
        
        await db.insert(stripeSubs).values({
          id: subId,
          customerId: custId,
          status: 'active',
          priceId: planPrice || null,
          currentPeriodEnd,
          updatedAt: now
        }).onConflictDoUpdate({
          target: stripeSubs.id,
          set: {
            status: 'active',
            priceId: planPrice || null,
            currentPeriodEnd,
            updatedAt: now
          }
        });

        console.log(`✅ [STRIPE] Subscription activated: ${subId} for customer ${custId}`);
      }
    } 
    else if (['customer.subscription.updated', 'customer.subscription.deleted'].includes(type)) {
      const subData = data.object;
      const priceId = subData.items?.data?.[0]?.price?.id;
      
      await db.insert(stripeSubs).values({
        id: subData.id,
        customerId: subData.customer,
        status: subData.status,
        priceId: priceId || null,
        currentPeriodEnd: subData.current_period_end,
        updatedAt: now
      }).onConflictDoUpdate({
        target: stripeSubs.id,
        set: {
          status: subData.status,
          priceId: priceId || null,
          currentPeriodEnd: subData.current_period_end,
          updatedAt: now
        }
      });

      console.log(`🔄 [STRIPE] Subscription updated: ${subData.id} status=${subData.status}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ [STRIPE] Webhook processing failed:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Subscription status API
router.get('/api/subs/status', async (req, res) => {
  const customerId = req.query.customer_id as string;
  
  if (!customerId) {
    return res.status(400).json({ error: 'customer_id required' });
  }
  
  try {
    const [subscription] = await db.select()
      .from(stripeSubs)
      .where(eq(stripeSubs.customerId, customerId))
      .orderBy(stripeSubs.updatedAt)
      .limit(1);
    
    if (!subscription) {
      return res.json({
        success: true,
        customer_id: customerId,
        status: 'none'
      });
    }
    
    res.json({
      success: true,
      customer_id: customerId,
      ...subscription
    });
  } catch (error) {
    console.error('❌ [STRIPE] Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// Customer lookup by email
router.get('/api/customers/by_email', async (req, res) => {
  const email = req.query.email as string;
  
  if (!email) {
    return res.status(400).json({ error: 'email required' });
  }
  
  try {
    const [customer] = await db.select()
      .from(stripeCustomers)
      .where(eq(stripeCustomers.email, email))
      .limit(1);
    
    if (!customer) {
      return res.json({
        success: true,
        found: false
      });
    }
    
    res.json({
      success: true,
      found: true,
      customer_id: customer.customerId
    });
  } catch (error) {
    console.error('❌ [STRIPE] Error looking up customer by email:', error);
    res.status(500).json({ error: 'Failed to lookup customer' });
  }
});

export default router;