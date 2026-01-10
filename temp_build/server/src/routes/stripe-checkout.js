"use strict";
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
var stripe_1 = require("stripe");
// Services are optional
var IntegrationFlagsService = null;
var ProviderConfigurationService = null;
try {
    var flagsModule = require('../services/IntegrationFlagsService');
    IntegrationFlagsService = flagsModule.IntegrationFlagsService;
    var configModule = require('../services/ProviderConfigurationService');
    ProviderConfigurationService = configModule.ProviderConfigurationService;
}
catch (_a) {
    console.warn("[Stripe Checkout] Services not available");
}
var router = (0, express_1.Router)();
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required for Stripe integration');
}
var stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
// Create Checkout Session for testing
router.post('/create-session', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var session, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                // Verify Stripe integration is enabled
                return [4 /*yield*/, IntegrationFlagsService.requireEnabled('stripe')];
            case 1:
                // Verify Stripe integration is enabled
                _a.sent();
                // Verify billing write permission
                return [4 /*yield*/, ProviderConfigurationService.requireFlowPermission('stripe', 'Billing', 'write')];
            case 2:
                // Verify billing write permission
                _a.sent();
                return [4 /*yield*/, stripe.checkout.sessions.create({
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
                        success_url: "".concat(process.env.PUBLIC_BASE_URL || 'http://localhost:5000', "/account?sid={CHECKOUT_SESSION_ID}"),
                        cancel_url: "".concat(process.env.PUBLIC_BASE_URL || 'http://localhost:5000', "/stripe-cancel"),
                        metadata: {
                            test_mode: 'true',
                            proof_plan: 'integration_test',
                            timestamp: new Date().toISOString(),
                        },
                    })];
            case 3:
                session = _a.sent();
                console.log("\uD83D\uDCB3 [Stripe] Created checkout session: ".concat(session.id));
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
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error('[Stripe] Checkout session creation failed:', error_1);
                res.status(500).json({
                    error: 'Failed to create checkout session',
                    message: error_1.message,
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Handle webhook events
router.post('/webhook', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sig, event_1, isValidEvent, session, subscription, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                sig = req.headers['stripe-signature'];
                if (!process.env.STRIPE_WEBHOOK_SECRET) {
                    console.log('⚠️ [Stripe] STRIPE_WEBHOOK_SECRET not configured, skipping signature verification');
                }
                if (process.env.STRIPE_WEBHOOK_SECRET && sig) {
                    try {
                        event_1 = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
                    }
                    catch (err) {
                        console.error('[Stripe] Webhook signature verification failed:', err.message);
                        return [2 /*return*/, res.status(400).send("Webhook Error: ".concat(err.message))];
                    }
                }
                else {
                    // For testing without webhook secret
                    event_1 = req.body;
                }
                console.log("\uD83C\uDFA3 [Stripe] Received webhook: ".concat(event_1.type));
                return [4 /*yield*/, ProviderConfigurationService.validateWebhookEvent('stripe', event_1.type)];
            case 1:
                isValidEvent = _b.sent();
                if (!isValidEvent) {
                    console.log("\u26A0\uFE0F [Stripe] Webhook event type ".concat(event_1.type, " not configured for this provider"));
                }
                switch (event_1.type) {
                    case 'checkout.session.completed':
                        session = event_1.data.object;
                        console.log("\u2705 [Stripe] Checkout session completed: ".concat(session.id));
                        console.log("\uD83D\uDCB0 [Stripe] Amount: $".concat(session.amount_total / 100));
                        console.log("\uD83D\uDCE7 [Stripe] Customer email: ".concat((_a = session.customer_details) === null || _a === void 0 ? void 0 : _a.email));
                        // Log subscription status change
                        if (session.mode === 'subscription') {
                            console.log("\uD83D\uDD04 [Stripe] Subscription status: ACTIVE");
                            console.log("\uD83D\uDCC5 [Stripe] Subscription ID: ".concat(session.subscription));
                        }
                        break;
                    case 'customer.subscription.updated':
                        subscription = event_1.data.object;
                        console.log("\uD83D\uDD04 [Stripe] Subscription updated: ".concat(subscription.id));
                        console.log("\uD83D\uDCCA [Stripe] Status: ".concat(subscription.status));
                        console.log("\uD83D\uDCB3 [Stripe] Current period: ".concat(new Date(subscription.current_period_start * 1000).toISOString(), " - ").concat(new Date(subscription.current_period_end * 1000).toISOString()));
                        break;
                    default:
                        console.log("\u2139\uFE0F [Stripe] Unhandled event type: ".concat(event_1.type));
                }
                res.json({ received: true, eventType: event_1.type });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error('[Stripe] Webhook processing failed:', error_2);
                res.status(500).json({
                    error: 'Webhook processing failed',
                    message: error_2.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Test subscription status endpoint
router.get('/subscription/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var subscription, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, IntegrationFlagsService.requireEnabled('stripe')];
            case 1:
                _a.sent();
                return [4 /*yield*/, stripe.subscriptions.retrieve(req.params.id)];
            case 2:
                subscription = _a.sent();
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
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).json({
                    error: 'Failed to retrieve subscription',
                    message: error_3.message,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
