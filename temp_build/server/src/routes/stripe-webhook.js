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
var db_js_1 = require("../db.js");
// stripeEvents table is optional - handle missing gracefully
var stripeEvents = null;
try {
    var schemaModule = require('../../shared/schema.js');
    stripeEvents = schemaModule.stripeEvents;
}
catch (_a) {
    console.warn("[Stripe Webhook] stripeEvents table not available");
}
// Entitlements and plans are optional
var addCredits = null;
var ensureCreatorRole = null;
var getCreditsFromStripeEvent = null;
var getUserIdFromStripeEvent = null;
try {
    var entitlementsModule = require('../services/entitlements.js');
    addCredits = entitlementsModule.addCredits;
    ensureCreatorRole = entitlementsModule.ensureCreatorRole;
}
catch (_b) {
    console.warn("[Stripe Webhook] Entitlements service not available");
}
try {
    var plansModule = require('../config/plans.js');
    getCreditsFromStripeEvent = plansModule.getCreditsFromStripeEvent;
    getUserIdFromStripeEvent = plansModule.getUserIdFromStripeEvent;
}
catch (_c) {
    console.warn("[Stripe Webhook] Plans config not available");
}
var drizzle_orm_1 = require("drizzle-orm");
var router = express_1.default.Router();
// Initialize Stripe with webhook secret
var stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16'
});
var webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured - webhook processing disabled');
}
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var signature, event, existingEvent, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!webhookSecret) {
                    console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
                    return [2 /*return*/, res.status(500).json({ error: 'Webhook not configured' })];
                }
                signature = req.headers['stripe-signature'];
                try {
                    // Verify webhook signature
                    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
                }
                catch (err) {
                    console.error('[Stripe Webhook] Signature verification failed:', err.message);
                    return [2 /*return*/, res.status(400).json({ error: "Webhook signature verification failed: ".concat(err.message) })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, db_js_1.db
                        .select()
                        .from(stripeEvents)
                        .where(stripeEvents ? (0, drizzle_orm_1.eq)(stripeEvents.id, event.id) : undefined)
                        .limit(1)];
            case 2:
                existingEvent = _a.sent();
                if (existingEvent.length > 0) {
                    console.log('[Stripe Webhook] Event already processed:', event.id);
                    return [2 /*return*/, res.status(200).json({ received: true, duplicate: true })];
                }
                // Store event for idempotency
                return [4 /*yield*/, db_js_1.db
                        .insert(stripeEvents)
                        .values({
                        id: event.id,
                        type: event.type,
                        payload: event,
                    })];
            case 3:
                // Store event for idempotency
                _a.sent();
                if (!(event.type === 'checkout.session.completed' || event.type === 'invoice.payment_succeeded')) return [3 /*break*/, 5];
                return [4 /*yield*/, processPaymentEvent(event)];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                console.log('[Stripe Webhook] Ignoring event type:', event.type);
                _a.label = 6;
            case 6: return [2 /*return*/, res.status(200).json({ received: true })];
            case 7:
                error_1 = _a.sent();
                console.error('[Stripe Webhook] Event processing failed:', error_1);
                return [2 /*return*/, res.status(500).json({ error: 'Event processing failed' })];
            case 8: return [2 /*return*/];
        }
    });
}); });
function processPaymentEvent(event) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, creditsMapping, credits, plan, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[Stripe Webhook] Processing payment event:', event.type, event.id);
                    userId = getUserIdFromStripeEvent(event);
                    creditsMapping = getCreditsFromStripeEvent(event);
                    if (!userId) {
                        console.error('[Stripe Webhook] No user ID found in event metadata');
                        return [2 /*return*/];
                    }
                    if (!creditsMapping) {
                        console.error('[Stripe Webhook] No credits mapping found for event');
                        return [2 /*return*/];
                    }
                    credits = creditsMapping.credits, plan = creditsMapping.plan;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!addCredits) return [3 /*break*/, 3];
                    return [4 /*yield*/, addCredits(userId, credits, 'stripe', plan)];
                case 2:
                    _a.sent();
                    console.log("[Stripe Webhook] Added ".concat(credits, " credits to user ").concat(userId));
                    _a.label = 3;
                case 3:
                    if (!ensureCreatorRole) return [3 /*break*/, 5];
                    return [4 /*yield*/, ensureCreatorRole(userId)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    console.log("[Stripe Webhook] Successfully processed payment for user ".concat(userId, ": +").concat(credits, " credits"));
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('[Stripe Webhook] Failed to process payment for user', userId, ':', error_2);
                    throw error_2;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.default = router;
