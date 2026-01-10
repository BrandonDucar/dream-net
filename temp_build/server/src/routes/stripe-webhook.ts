import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { db } from '../db.js';
// stripeEvents table is optional - handle missing gracefully
let stripeEvents: any = null;
try {
  const schemaModule = require('../../shared/schema.js');
  stripeEvents = schemaModule.stripeEvents;
} catch {
  console.warn("[Stripe Webhook] stripeEvents table not available");
}
// Entitlements and plans are optional
let addCredits: any = null;
let ensureCreatorRole: any = null;
let getCreditsFromStripeEvent: any = null;
let getUserIdFromStripeEvent: any = null;

try {
  const entitlementsModule = require('../services/entitlements.js');
  addCredits = entitlementsModule.addCredits;
  ensureCreatorRole = entitlementsModule.ensureCreatorRole;
} catch {
  console.warn("[Stripe Webhook] Entitlements service not available");
}

try {
  const plansModule = require('../config/plans.js');
  getCreditsFromStripeEvent = plansModule.getCreditsFromStripeEvent;
  getUserIdFromStripeEvent = plansModule.getUserIdFromStripeEvent;
} catch {
  console.warn("[Stripe Webhook] Plans config not available");
}
import { eq } from 'drizzle-orm';

const router: express.Router = express.Router();

// Initialize Stripe with webhook secret
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

if (!webhookSecret) {
  console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured - webhook processing disabled');
}

router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const signature = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    // Check for duplicate event (idempotency)
    const existingEvent = await db
      .select()
      .from(stripeEvents)
      .where(stripeEvents ? eq(stripeEvents.id, event.id) : undefined)
      .limit(1);

    if (existingEvent.length > 0) {
      console.log('[Stripe Webhook] Event already processed:', event.id);
      return res.status(200).json({ received: true, duplicate: true });
    }

    // Store event for idempotency
    await db
      .insert(stripeEvents)
      .values({
        id: event.id,
        type: event.type,
        payload: event as any,
      });

    // Process relevant events
    if (event.type === 'checkout.session.completed' || event.type === 'invoice.payment_succeeded') {
      await processPaymentEvent(event);
    } else {
      console.log('[Stripe Webhook] Ignoring event type:', event.type);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('[Stripe Webhook] Event processing failed:', error);
    return res.status(500).json({ error: 'Event processing failed' });
  }
});

async function processPaymentEvent(event: Stripe.Event) {
  console.log('[Stripe Webhook] Processing payment event:', event.type, event.id);

  // Extract user ID and credits from event
  const userId = getUserIdFromStripeEvent(event);
  const creditsMapping = getCreditsFromStripeEvent(event);

  if (!userId) {
    console.error('[Stripe Webhook] No user ID found in event metadata');
    return;
  }

  if (!creditsMapping) {
    console.error('[Stripe Webhook] No credits mapping found for event');
    return;
  }

  const { credits, plan } = creditsMapping;

  try {
    // Add credits to user's entitlements
    if (addCredits) {
      await addCredits(userId, credits, 'stripe', plan);
      console.log(`[Stripe Webhook] Added ${credits} credits to user ${userId}`);
    }

    // Upgrade user to creator role if they purchased a plan
    if (ensureCreatorRole) {
      await ensureCreatorRole(userId);
    }

    console.log(`[Stripe Webhook] Successfully processed payment for user ${userId}: +${credits} credits`);
  } catch (error: any) {
    console.error('[Stripe Webhook] Failed to process payment for user', userId, ':', error);
    throw error;
  }
}

export default router;