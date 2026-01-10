"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("../db");
// Stripe tables are optional
var stripeCustomers = null;
var stripeSubs = null;
try {
    var schemaModule = require('../../shared/schema');
    stripeCustomers = schemaModule.stripeCustomers;
    stripeSubs = schemaModule.stripeSubs;
}
catch (_a) {
    console.warn("[Stripe Billing] Stripe tables not available");
}
var drizzle_orm_1 = require("drizzle-orm");
var router = express_1.default.Router();
// Configure Stripe - using existing configuration
var stripe = null;
try {
    var Stripe = require('stripe');
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
    });
}
catch (error) {
    console.error('❌ [STRIPE] Stripe not configured properly');
}
// Account page route that handles Stripe checkout success
router.get('/account', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sid, customerId, session, email, now, error_1, subscription, sub, status_1, priceId, currentPeriodEnd, nextBill, html, error_2;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 9, , 10]);
                sid = req.query.sid;
                customerId = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.customer_id;
                if (!(sid && stripe)) return [3 /*break*/, 6];
                _e.label = 1;
            case 1:
                _e.trys.push([1, 5, , 6]);
                return [4 /*yield*/, stripe.checkout.sessions.retrieve(sid, {
                        expand: ['customer', 'subscription']
                    })];
            case 2:
                session = _e.sent();
                customerId = typeof session.customer === 'string'
                    ? session.customer
                    : (_b = session.customer) === null || _b === void 0 ? void 0 : _b.id;
                email = ((_c = session.customer_details) === null || _c === void 0 ? void 0 : _c.email) || ((_d = session.customer) === null || _d === void 0 ? void 0 : _d.email);
                now = Math.floor(Date.now() / 1000);
                if (!customerId) return [3 /*break*/, 4];
                return [4 /*yield*/, db_1.db.insert(stripeCustomers).values({
                        customerId: customerId,
                        email: email,
                        lastSessionId: sid,
                        createdAt: now,
                        updatedAt: now
                    }).onConflictDoUpdate({
                        target: stripeCustomers.customerId,
                        set: {
                            email: email,
                            lastSessionId: sid,
                            updatedAt: now
                        }
                    })];
            case 3:
                _e.sent();
                _e.label = 4;
            case 4:
                // Set cookie and redirect to clean URL
                res.cookie('customer_id', customerId, {
                    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax'
                });
                return [2 /*return*/, res.redirect('/account')];
            case 5:
                error_1 = _e.sent();
                console.error('❌ [STRIPE] Error processing checkout session:', error_1);
                return [3 /*break*/, 6];
            case 6:
                subscription = null;
                if (!customerId) return [3 /*break*/, 8];
                return [4 /*yield*/, db_1.db.select()
                        .from(stripeSubs)
                        .where((0, drizzle_orm_1.eq)(stripeSubs.customerId, customerId))
                        .orderBy(stripeSubs.updatedAt)
                        .limit(1)];
            case 7:
                sub = (_e.sent())[0];
                subscription = sub;
                _e.label = 8;
            case 8:
                status_1 = (subscription === null || subscription === void 0 ? void 0 : subscription.status) || 'none';
                priceId = (subscription === null || subscription === void 0 ? void 0 : subscription.priceId) || '—';
                currentPeriodEnd = subscription === null || subscription === void 0 ? void 0 : subscription.currentPeriodEnd;
                nextBill = currentPeriodEnd
                    ? new Date(currentPeriodEnd * 1000).toLocaleDateString()
                    : '—';
                html = "\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <title>Account \u2013 DreamNet</title>\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n      <style>\n        body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif; margin: 32px; background: #0a0a0a; color: #fff; }\n        .card { max-width: 720px; margin: auto; border: 1px solid #333; border-radius: 12px; padding: 32px; background: #111; }\n        .row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin: 16px 0; }\n        button { \n          padding: 12px 20px; \n          border-radius: 8px; \n          border: 1px solid #444; \n          cursor: pointer; \n          background: #222; \n          color: #fff; \n          font-weight: 500;\n          transition: all 0.2s;\n        }\n        button:hover { background: #333; border-color: #666; }\n        .pill { \n          display: inline-block; \n          border-radius: 999px; \n          padding: 6px 14px; \n          border: 1px solid #444; \n          margin: 0 8px;\n          font-size: 14px;\n        }\n        .status-active { border-color: #22c55e; color: #22c55e; }\n        .status-none, .status-canceled { border-color: #ef4444; color: #ef4444; }\n        .status-past_due { border-color: #f59e0b; color: #f59e0b; }\n        h1 { color: #fff; margin-bottom: 24px; }\n        code { background: #222; padding: 4px 8px; border-radius: 4px; font-family: monospace; }\n      </style>\n    </head>\n    <body>\n      <div class=\"card\">\n        <h1>\uD83D\uDE80 DreamNet Account</h1>\n        \n        <p><strong>Customer ID:</strong> <code>".concat(customerId || 'Not set', "</code></p>\n        \n        <p>\n          <strong>Subscription:</strong> \n          <span class=\"pill status-").concat(status_1, "\">").concat(status_1, "</span>\n          ").concat(priceId !== '—' ? "<span class=\"pill\">Plan: ".concat(priceId, "</span>") : '', "\n          <span class=\"pill\">Next billing: ").concat(nextBill, "</span>\n        </p>\n\n        <div class=\"row\">\n          <button onclick=\"manageBilling()\">\uD83D\uDD27 Manage Billing</button>\n          ").concat((['none', 'canceled', 'past_due', 'unpaid', 'incomplete'].includes(status_1))
                    ? '<button onclick="startSubscription()">⚡ Start Subscription</button>'
                    : '', "\n        </div>\n\n        <hr style=\"border-color: #333; margin: 32px 0;\">\n        \n        <p style=\"color: #888; font-size: 14px;\">\n          If you just completed checkout and don't see your subscription, \n          wait a moment and refresh \u2013 our webhook may still be processing.\n        </p>\n      </div>\n\n      <script>\n        async function manageBilling() {\n          const cid = getCustomerId();\n          if (!cid) return alert('No customer ID found. Please complete checkout first.');\n          \n          try {\n            const response = await fetch('/api/stripe/portal', {\n              method: 'POST',\n              headers: { 'Content-Type': 'application/json' },\n              body: JSON.stringify({ customer_id: cid })\n            });\n            \n            const data = await response.json();\n            if (data.url) {\n              window.location = data.url;\n            } else {\n              alert('Unable to open billing portal. Please try again.');\n            }\n          } catch (error) {\n            alert('Error opening billing portal. Please try again.');\n          }\n        }\n\n        async function startSubscription() {\n          try {\n            const response = await fetch('/api/checkout/session', {\n              method: 'POST',\n              headers: { 'Content-Type': 'application/json' },\n              body: JSON.stringify({})\n            });\n            \n            const data = await response.json();\n            if (data.url) {\n              window.location = data.url;\n            } else {\n              alert('Unable to start checkout. Please try again.');\n            }\n          } catch (error) {\n            alert('Error starting checkout. Please try again.');\n          }\n        }\n\n        function getCustomerId() {\n          const match = document.cookie.match(/(?:^|; )customer_id=([^;]+)/);\n          return match ? decodeURIComponent(match[1]) : '';\n        }\n      </script>\n    </body>\n    </html>\n    ");
                res.send(html);
                return [3 /*break*/, 10];
            case 9:
                error_2 = _e.sent();
                console.error('❌ [STRIPE] Error rendering account page:', error_2);
                res.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// Enhanced Stripe webhook handler that stores subscription details
router.post('/api/stripe/webhook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sig, endpointSecret, event_1, type, data, now, sessionData, subId, custId, sub, planPrice, currentPeriodEnd, subData, priceId, error_3;
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                if (!stripe) {
                    return [2 /*return*/, res.status(500).json({ error: 'Stripe not configured' })];
                }
                _j.label = 1;
            case 1:
                _j.trys.push([1, 8, , 9]);
                sig = req.headers['stripe-signature'];
                endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
                try {
                    event_1 = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
                }
                catch (err) {
                    console.error('❌ [STRIPE] Webhook signature verification failed:', err.message);
                    return [2 /*return*/, res.status(400).send("Webhook Error: ".concat(err.message))];
                }
                type = event_1.type, data = event_1.data;
                now = Math.floor(Date.now() / 1000);
                console.log("\uD83D\uDD14 [STRIPE] Webhook received: ".concat(type));
                if (!(type === 'checkout.session.completed')) return [3 /*break*/, 5];
                sessionData = data.object;
                subId = sessionData.subscription;
                custId = sessionData.customer;
                if (!(subId && custId)) return [3 /*break*/, 4];
                return [4 /*yield*/, stripe.subscriptions.retrieve(subId)];
            case 2:
                sub = _j.sent();
                planPrice = (_d = (_c = (_b = (_a = sub.items) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.price) === null || _d === void 0 ? void 0 : _d.id;
                currentPeriodEnd = sub.current_period_end;
                return [4 /*yield*/, db_1.db.insert(stripeSubs).values({
                        id: subId,
                        customerId: custId,
                        status: 'active',
                        priceId: planPrice || null,
                        currentPeriodEnd: currentPeriodEnd,
                        updatedAt: now
                    }).onConflictDoUpdate({
                        target: stripeSubs.id,
                        set: {
                            status: 'active',
                            priceId: planPrice || null,
                            currentPeriodEnd: currentPeriodEnd,
                            updatedAt: now
                        }
                    })];
            case 3:
                _j.sent();
                console.log("\u2705 [STRIPE] Subscription activated: ".concat(subId, " for customer ").concat(custId));
                _j.label = 4;
            case 4: return [3 /*break*/, 7];
            case 5:
                if (!['customer.subscription.updated', 'customer.subscription.deleted'].includes(type)) return [3 /*break*/, 7];
                subData = data.object;
                priceId = (_h = (_g = (_f = (_e = subData.items) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.price) === null || _h === void 0 ? void 0 : _h.id;
                return [4 /*yield*/, db_1.db.insert(stripeSubs).values({
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
                    })];
            case 6:
                _j.sent();
                console.log("\uD83D\uDD04 [STRIPE] Subscription updated: ".concat(subData.id, " status=").concat(subData.status));
                _j.label = 7;
            case 7:
                res.json({ received: true });
                return [3 /*break*/, 9];
            case 8:
                error_3 = _j.sent();
                console.error('❌ [STRIPE] Webhook processing failed:', error_3);
                res.status(500).json({ error: 'Webhook processing failed' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
// Subscription status API
router.get('/api/subs/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var customerId, subscription, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerId = req.query.customer_id;
                if (!customerId) {
                    return [2 /*return*/, res.status(400).json({ error: 'customer_id required' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.select()
                        .from(stripeSubs)
                        .where((0, drizzle_orm_1.eq)(stripeSubs.customerId, customerId))
                        .orderBy(stripeSubs.updatedAt)
                        .limit(1)];
            case 2:
                subscription = (_a.sent())[0];
                if (!subscription) {
                    return [2 /*return*/, res.json({
                            success: true,
                            customer_id: customerId,
                            status: 'none'
                        })];
                }
                res.json(__assign({ success: true, customer_id: customerId }, subscription));
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('❌ [STRIPE] Error fetching subscription status:', error_4);
                res.status(500).json({ error: 'Failed to fetch subscription status' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Customer lookup by email
router.get('/api/customers/by_email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, customer, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.query.email;
                if (!email) {
                    return [2 /*return*/, res.status(400).json({ error: 'email required' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, db_1.db.select()
                        .from(stripeCustomers)
                        .where((0, drizzle_orm_1.eq)(stripeCustomers.email, email))
                        .limit(1)];
            case 2:
                customer = (_a.sent())[0];
                if (!customer) {
                    return [2 /*return*/, res.json({
                            success: true,
                            found: false
                        })];
                }
                res.json({
                    success: true,
                    found: true,
                    customer_id: customer.customerId
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('❌ [STRIPE] Error looking up customer by email:', error_5);
                res.status(500).json({ error: 'Failed to lookup customer' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
