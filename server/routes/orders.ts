import { Router } from "express";
import {
  addContactRequest,
  addOrder,
  updateOrder,
  updateContact,
  getOrder,
  getContact,
  listOrders,
  listContacts,
} from "../../packages/orders";
import { recordEvent, recordTaskCompletion } from "../../packages/metrics-engine";

// Simple auth middleware for admin routes
function requireOperatorToken(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  const token = process.env.OPERATOR_TOKEN;

  if (!token) {
    return res.status(500).json({ error: "OPERATOR_TOKEN not configured" });
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const providedToken = authHeader.substring(7);
  if (providedToken !== token) {
    return res.status(403).json({ error: "Invalid token" });
  }

  next();
}

// Send Telegram notification if configured
async function sendTelegramNotification(message: string): Promise<void> {
  const token = process.env.RELAYBOT_TELEGRAM_TOKEN;
  const chatId = process.env.RELAYBOT_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return; // Not configured, silently skip
  }

  try {
    const { fetchWithTimeout } = await import('../utils/fetchWithTimeout');
    const traceId = (req as any).traceId;
    await fetchWithTimeout(`https://api.telegram.org/bot${token}/sendMessage`, {
      timeout: 10000,
      requestId: traceId,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch (err) {
    console.error("Failed to send Telegram notification:", err);
  }
}

export function createOrdersRouter(): Router {
  const router = Router();

  // ============================================
  // PUBLIC ROUTES
  // ============================================

  // POST /api/public/contact
  router.post("/public/contact", async (req, res) => {
    try {
      const { name, email, channel, message, category, tags } = req.body;

      if (!name || !email || !message || !category) {
        return res.status(400).json({ error: "Missing required fields: name, email, message, category" });
      }

      const contact = addContactRequest({
        name,
        email,
        channel,
        message,
        category,
        tags,
      });

      // Record metrics
      await recordEvent().catch(console.error);

      // Send Telegram notification
      await sendTelegramNotification(
        `🆕 <b>New Contact Request</b>\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Category: ${category}\n` +
          `Message: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`
      );

      res.json({ ok: true, contact });
    } catch (error) {
      console.error("Failed to create contact request:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/public/order
  router.post("/public/order", async (req, res) => {
    try {
      const { itemName, sku, quantity, currency, amount, paymentMethod, customerEmail, meta } = req.body;

      if (!itemName || !quantity || !currency || !amount || !paymentMethod) {
        return res.status(400).json({
          error: "Missing required fields: itemName, quantity, currency, amount, paymentMethod",
        });
      }

      const order = addOrder({
        itemName,
        sku,
        quantity,
        currency,
        amount,
        paymentMethod,
        customerEmail,
        meta,
      });

      // Record metrics
      await recordEvent().catch(console.error);

      // Send Telegram notification
      await sendTelegramNotification(
        `💰 <b>New Order</b>\n` +
          `Item: ${itemName}\n` +
          `Amount: ${amount} ${currency}\n` +
          `Payment: ${paymentMethod}\n` +
          `Email: ${customerEmail || "N/A"}`
      );

      res.json({ ok: true, order });
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/public/checkout/stripe
  router.post("/public/checkout/stripe", async (req, res) => {
    try {
      const { orderId, successUrl, cancelUrl } = req.body;

      if (!orderId) {
        return res.status(400).json({ error: "Missing orderId" });
      }

      const order = getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const stripeSecret = process.env.STRIPE_SECRET;
      if (!stripeSecret) {
        return res.status(503).json({ error: "Stripe not configured" });
      }

      // Import Stripe dynamically
      const stripe = (await import("stripe")).default(stripeSecret);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: order.currency.toLowerCase(),
              product_data: {
                name: order.itemName,
              },
              unit_amount: order.amount, // Amount in cents (or smallest unit)
            },
            quantity: order.quantity,
          },
        ],
        mode: "payment",
        success_url: successUrl || `${req.headers.origin || ""}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${req.headers.origin || ""}/checkout/cancel`,
        customer_email: order.customerEmail,
        metadata: {
          orderId: order.id,
        },
      });

      // Update order with session ID
      updateOrder(orderId, { stripeSessionId: session.id, paymentStatus: "pending" });

      res.json({ ok: true, checkoutUrl: session.url });
    } catch (error) {
      console.error("Failed to create Stripe checkout:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // POST /api/public/checkout/crypto
  router.post("/public/checkout/crypto", async (req, res) => {
    try {
      const { orderId, network } = req.body;

      if (!orderId || !network) {
        return res.status(400).json({ error: "Missing orderId or network" });
      }

      const order = getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const addressKey = network === "base" ? "CRYPTO_ADDRESS_BASE" : "CRYPTO_ADDRESS_ETH";
      const address = process.env[addressKey];

      if (!address) {
        return res.status(503).json({ error: `Crypto address not configured for ${network}` });
      }

      // Convert amount based on currency
      let amount: string;
      if (order.currency === "ETH") {
        // Amount is in wei (smallest unit)
        amount = order.amount.toString();
      } else if (order.currency === "USDC") {
        // Amount is in smallest unit (6 decimals for USDC)
        amount = order.amount.toString();
      } else {
        // USD -> convert to ETH or USDC equivalent (simplified)
        amount = order.amount.toString();
      }

      const paymentIntent = {
        address,
        amount,
        currency: order.currency,
        memo: `Order ${orderId}`,
        network,
      };

      // Update order status
      updateOrder(orderId, { paymentStatus: "pending" });

      res.json({ ok: true, paymentIntent });
    } catch (error) {
      console.error("Failed to create crypto checkout:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // ============================================
  // ADMIN ROUTES (require OPERATOR_TOKEN)
  // ============================================

  // GET /api/admin/orders
  router.get("/admin/orders", requireOperatorToken, async (req, res) => {
    try {
      const filter = {
        status: req.query.status as any,
        paymentStatus: req.query.paymentStatus as any,
        currency: req.query.currency as any,
        paymentMethod: req.query.paymentMethod as any,
      };

      // Remove undefined values
      Object.keys(filter).forEach((key) => {
        if (filter[key as keyof typeof filter] === undefined) {
          delete filter[key as keyof typeof filter];
        }
      });

      const orders = listOrders(Object.keys(filter).length > 0 ? filter : undefined);
      res.json({ ok: true, orders });
    } catch (error) {
      console.error("Failed to list orders:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/admin/orders/:id
  router.get("/admin/orders/:id", requireOperatorToken, async (req, res) => {
    try {
      const order = getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json({ ok: true, order });
    } catch (error) {
      console.error("Failed to get order:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // PUT /api/admin/orders/:id
  router.put("/admin/orders/:id", requireOperatorToken, async (req, res) => {
    try {
      const { status, paymentStatus, notes, txId, stripeSessionId, meta } = req.body;

      const order = updateOrder(req.params.id, {
        status,
        paymentStatus,
        notes,
        txId,
        stripeSessionId,
        meta,
      });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Record metrics if payment status changed to paid
      if (paymentStatus === "paid" && order.paymentStatus === "paid") {
        await recordTaskCompletion("order", "success").catch(console.error);
      }

      res.json({ ok: true, order });
    } catch (error) {
      console.error("Failed to update order:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // GET /api/admin/contacts
  router.get("/admin/contacts", requireOperatorToken, async (req, res) => {
    try {
      const filter = {
        category: req.query.category as any,
        status: req.query.status as any,
      };

      // Remove undefined values
      Object.keys(filter).forEach((key) => {
        if (filter[key as keyof typeof filter] === undefined) {
          delete filter[key as keyof typeof filter];
        }
      });

      const contacts = listContacts(Object.keys(filter).length > 0 ? filter : undefined);
      res.json({ ok: true, contacts });
    } catch (error) {
      console.error("Failed to list contacts:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // PUT /api/admin/contacts/:id
  router.put("/admin/contacts/:id", requireOperatorToken, async (req, res) => {
    try {
      const { status, tags } = req.body;

      const contact = updateContact(req.params.id, {
        status,
        tags,
      });

      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      res.json({ ok: true, contact });
    } catch (error) {
      console.error("Failed to update contact:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  return router;
}

