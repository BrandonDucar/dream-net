import { Router } from 'express';
import Stripe from 'stripe';
// Services are optional
let IntegrationFlagsService: any = null;
let ProviderConfigurationService: any = null;
try {
  const flagsModule = require('../services/IntegrationFlagsService');
  IntegrationFlagsService = flagsModule.IntegrationFlagsService;
  const configModule = require('../services/ProviderConfigurationService');
  ProviderConfigurationService = configModule.ProviderConfigurationService;
} catch {
  console.warn("[Stripe Checkout] Services not available");
}

const router: Router = Router();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required for Stripe integration');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Create Checkout Session for testing
router.post('/create-session', async (req, res) => {
  try {
    // Verify Stripe integration is enabled
    await IntegrationFlagsService.requireEnabled('stripe');
    
    // Verify billing write permission
    await ProviderConfigurationService.requireFlowPermission('stripe', 'Billing', 'write');
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'DreamNet Test Subscription',
              description: 'Integration proof test subscription',
            },
            unit_amount: 1000, // $10.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.PUBLIC_BASE_URL || 'http://localhost:5000'}/account?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.PUBLIC_BASE_URL || 'http://localhost:5000'}/stripe-cancel`,
      metadata: {
        test_mode: 'true',
        proof_plan: 'integration_test',
        timestamp: new Date().toISOString(),
      },
    });

    console.log(`💳 [Stripe] Created checkout session: ${session.id}`);
    
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      testCard: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 2025,
        cvc: '123',
      },
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('[Stripe] Checkout session creation failed:', error);
    res.status(500).json({
      error: 'Failed to create checkout session',
      message: error.message,
    });
  }
});

// Handle webhook events
router.post('/webhook', async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('⚠️ [Stripe] STRIPE_WEBHOOK_SECRET not configured, skipping signature verification');
    }
    
    let event;
    
    if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.error('[Stripe] Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // For testing without webhook secret
      event = req.body;
    }

    console.log(`🎣 [Stripe] Received webhook: ${event.type}`);

    // Validate webhook event type
    const isValidEvent = await ProviderConfigurationService.validateWebhookEvent('stripe', event.type);
    if (!isValidEvent) {
      console.log(`⚠️ [Stripe] Webhook event type ${event.type} not configured for this provider`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        console.log(`✅ [Stripe] Checkout session completed: ${session.id}`);
        console.log(`💰 [Stripe] Amount: $${session.amount_total / 100}`);
        console.log(`📧 [Stripe] Customer email: ${session.customer_details?.email}`);
        
        // Log subscription status change
        if (session.mode === 'subscription') {
          console.log(`🔄 [Stripe] Subscription status: ACTIVE`);
          console.log(`📅 [Stripe] Subscription ID: ${session.subscription}`);
        }
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object;
        console.log(`🔄 [Stripe] Subscription updated: ${subscription.id}`);
        console.log(`📊 [Stripe] Status: ${subscription.status}`);
        console.log(`💳 [Stripe] Current period: ${new Date(subscription.current_period_start * 1000).toISOString()} - ${new Date(subscription.current_period_end * 1000).toISOString()}`);
        break;

      default:
        console.log(`ℹ️ [Stripe] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true, eventType: event.type });
  } catch (error) {
    console.error('[Stripe] Webhook processing failed:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message,
    });
  }
});

// Test subscription status endpoint
router.get('/subscription/:id', async (req, res) => {
  try {
    await IntegrationFlagsService.requireEnabled('stripe');
    
    const subscription = await stripe.subscriptions.retrieve(req.params.id);
    
    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        customer: subscription.customer,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve subscription',
      message: error.message,
    });
  }
});

export default router;