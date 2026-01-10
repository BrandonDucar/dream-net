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
exports.createOrdersRouter = createOrdersRouter;
var express_1 = require("express");
var orders_1 = require("../../packages/orders");
var metrics_engine_1 = require("../../packages/metrics-engine");
// Simple auth middleware for admin routes
function requireOperatorToken(req, res, next) {
    var authHeader = req.headers.authorization;
    var token = process.env.OPERATOR_TOKEN;
    if (!token) {
        return res.status(500).json({ error: "OPERATOR_TOKEN not configured" });
    }
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid authorization header" });
    }
    var providedToken = authHeader.substring(7);
    if (providedToken !== token) {
        return res.status(403).json({ error: "Invalid token" });
    }
    next();
}
// Send Telegram notification if configured
function sendTelegramNotification(message) {
    return __awaiter(this, void 0, void 0, function () {
        var token, chatId, fetchWithTimeout, traceId, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = process.env.RELAYBOT_TELEGRAM_TOKEN;
                    chatId = process.env.RELAYBOT_TELEGRAM_CHAT_ID;
                    if (!token || !chatId) {
                        return [2 /*return*/]; // Not configured, silently skip
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../utils/fetchWithTimeout'); })];
                case 2:
                    fetchWithTimeout = (_a.sent()).fetchWithTimeout;
                    traceId = req.traceId;
                    return [4 /*yield*/, fetchWithTimeout("https://api.telegram.org/bot".concat(token, "/sendMessage"), {
                            timeout: 10000,
                            requestId: traceId,
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: message,
                                parse_mode: "HTML",
                            }),
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error("Failed to send Telegram notification:", err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function createOrdersRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // ============================================
    // PUBLIC ROUTES
    // ============================================
    // POST /api/public/contact
    router.post("/public/contact", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, name_1, email, channel, message, category, tags, contact, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, name_1 = _a.name, email = _a.email, channel = _a.channel, message = _a.message, category = _a.category, tags = _a.tags;
                    if (!name_1 || !email || !message || !category) {
                        return [2 /*return*/, res.status(400).json({ error: "Missing required fields: name, email, message, category" })];
                    }
                    contact = (0, orders_1.addContactRequest)({
                        name: name_1,
                        email: email,
                        channel: channel,
                        message: message,
                        category: category,
                        tags: tags,
                    });
                    // Record metrics
                    return [4 /*yield*/, (0, metrics_engine_1.recordEvent)().catch(console.error)];
                case 1:
                    // Record metrics
                    _b.sent();
                    // Send Telegram notification
                    return [4 /*yield*/, sendTelegramNotification("\uD83C\uDD95 <b>New Contact Request</b>\n" +
                            "Name: ".concat(name_1, "\n") +
                            "Email: ".concat(email, "\n") +
                            "Category: ".concat(category, "\n") +
                            "Message: ".concat(message.substring(0, 100)).concat(message.length > 100 ? "..." : ""))];
                case 2:
                    // Send Telegram notification
                    _b.sent();
                    res.json({ ok: true, contact: contact });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error("Failed to create contact request:", error_1);
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/public/order
    router.post("/public/order", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, itemName, sku, quantity, currency, amount, paymentMethod, customerEmail, meta, order, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, itemName = _a.itemName, sku = _a.sku, quantity = _a.quantity, currency = _a.currency, amount = _a.amount, paymentMethod = _a.paymentMethod, customerEmail = _a.customerEmail, meta = _a.meta;
                    if (!itemName || !quantity || !currency || !amount || !paymentMethod) {
                        return [2 /*return*/, res.status(400).json({
                                error: "Missing required fields: itemName, quantity, currency, amount, paymentMethod",
                            })];
                    }
                    order = (0, orders_1.addOrder)({
                        itemName: itemName,
                        sku: sku,
                        quantity: quantity,
                        currency: currency,
                        amount: amount,
                        paymentMethod: paymentMethod,
                        customerEmail: customerEmail,
                        meta: meta,
                    });
                    // Record metrics
                    return [4 /*yield*/, (0, metrics_engine_1.recordEvent)().catch(console.error)];
                case 1:
                    // Record metrics
                    _b.sent();
                    // Send Telegram notification
                    return [4 /*yield*/, sendTelegramNotification("\uD83D\uDCB0 <b>New Order</b>\n" +
                            "Item: ".concat(itemName, "\n") +
                            "Amount: ".concat(amount, " ").concat(currency, "\n") +
                            "Payment: ".concat(paymentMethod, "\n") +
                            "Email: ".concat(customerEmail || "N/A"))];
                case 2:
                    // Send Telegram notification
                    _b.sent();
                    res.json({ ok: true, order: order });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    console.error("Failed to create order:", error_2);
                    res.status(500).json({ error: error_2.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/public/checkout/stripe
    router.post("/public/checkout/stripe", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, orderId, successUrl, cancelUrl, order, stripeSecret, stripe, session, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, orderId = _a.orderId, successUrl = _a.successUrl, cancelUrl = _a.cancelUrl;
                    if (!orderId) {
                        return [2 /*return*/, res.status(400).json({ error: "Missing orderId" })];
                    }
                    order = (0, orders_1.getOrder)(orderId);
                    if (!order) {
                        return [2 /*return*/, res.status(404).json({ error: "Order not found" })];
                    }
                    stripeSecret = process.env.STRIPE_SECRET;
                    if (!stripeSecret) {
                        return [2 /*return*/, res.status(503).json({ error: "Stripe not configured" })];
                    }
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("stripe"); })];
                case 1:
                    stripe = (_b.sent()).default(stripeSecret);
                    return [4 /*yield*/, stripe.checkout.sessions.create({
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
                            success_url: successUrl || "".concat(req.headers.origin || "", "/checkout/success?session_id={CHECKOUT_SESSION_ID}"),
                            cancel_url: cancelUrl || "".concat(req.headers.origin || "", "/checkout/cancel"),
                            customer_email: order.customerEmail,
                            metadata: {
                                orderId: order.id,
                            },
                        })];
                case 2:
                    session = _b.sent();
                    // Update order with session ID
                    (0, orders_1.updateOrder)(orderId, { stripeSessionId: session.id, paymentStatus: "pending" });
                    res.json({ ok: true, checkoutUrl: session.url });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    console.error("Failed to create Stripe checkout:", error_3);
                    res.status(500).json({ error: error_3.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // POST /api/public/checkout/crypto
    router.post("/public/checkout/crypto", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, orderId, network, order, addressKey, address, amount, paymentIntent;
        return __generator(this, function (_b) {
            try {
                _a = req.body, orderId = _a.orderId, network = _a.network;
                if (!orderId || !network) {
                    return [2 /*return*/, res.status(400).json({ error: "Missing orderId or network" })];
                }
                order = (0, orders_1.getOrder)(orderId);
                if (!order) {
                    return [2 /*return*/, res.status(404).json({ error: "Order not found" })];
                }
                addressKey = network === "base" ? "CRYPTO_ADDRESS_BASE" : "CRYPTO_ADDRESS_ETH";
                address = process.env[addressKey];
                if (!address) {
                    return [2 /*return*/, res.status(503).json({ error: "Crypto address not configured for ".concat(network) })];
                }
                amount = void 0;
                if (order.currency === "ETH") {
                    // Amount is in wei (smallest unit)
                    amount = order.amount.toString();
                }
                else if (order.currency === "USDC") {
                    // Amount is in smallest unit (6 decimals for USDC)
                    amount = order.amount.toString();
                }
                else {
                    // USD -> convert to ETH or USDC equivalent (simplified)
                    amount = order.amount.toString();
                }
                paymentIntent = {
                    address: address,
                    amount: amount,
                    currency: order.currency,
                    memo: "Order ".concat(orderId),
                    network: network,
                };
                // Update order status
                (0, orders_1.updateOrder)(orderId, { paymentStatus: "pending" });
                res.json({ ok: true, paymentIntent: paymentIntent });
            }
            catch (error) {
                console.error("Failed to create crypto checkout:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // ============================================
    // ADMIN ROUTES (require OPERATOR_TOKEN)
    // ============================================
    // GET /api/admin/orders
    router.get("/admin/orders", requireOperatorToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var filter_1, orders;
        return __generator(this, function (_a) {
            try {
                filter_1 = {
                    status: req.query.status,
                    paymentStatus: req.query.paymentStatus,
                    currency: req.query.currency,
                    paymentMethod: req.query.paymentMethod,
                };
                // Remove undefined values
                Object.keys(filter_1).forEach(function (key) {
                    if (filter_1[key] === undefined) {
                        delete filter_1[key];
                    }
                });
                orders = (0, orders_1.listOrders)(Object.keys(filter_1).length > 0 ? filter_1 : undefined);
                res.json({ ok: true, orders: orders });
            }
            catch (error) {
                console.error("Failed to list orders:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // GET /api/admin/orders/:id
    router.get("/admin/orders/:id", requireOperatorToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var order;
        return __generator(this, function (_a) {
            try {
                order = (0, orders_1.getOrder)(req.params.id);
                if (!order) {
                    return [2 /*return*/, res.status(404).json({ error: "Order not found" })];
                }
                res.json({ ok: true, order: order });
            }
            catch (error) {
                console.error("Failed to get order:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // PUT /api/admin/orders/:id
    router.put("/admin/orders/:id", requireOperatorToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, status_1, paymentStatus, notes, txId, stripeSessionId, meta, order, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = req.body, status_1 = _a.status, paymentStatus = _a.paymentStatus, notes = _a.notes, txId = _a.txId, stripeSessionId = _a.stripeSessionId, meta = _a.meta;
                    order = (0, orders_1.updateOrder)(req.params.id, {
                        status: status_1,
                        paymentStatus: paymentStatus,
                        notes: notes,
                        txId: txId,
                        stripeSessionId: stripeSessionId,
                        meta: meta,
                    });
                    if (!order) {
                        return [2 /*return*/, res.status(404).json({ error: "Order not found" })];
                    }
                    if (!(paymentStatus === "paid" && order.paymentStatus === "paid")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, metrics_engine_1.recordTaskCompletion)("order", "success").catch(console.error)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    res.json({ ok: true, order: order });
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _b.sent();
                    console.error("Failed to update order:", error_4);
                    res.status(500).json({ error: error_4.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/admin/contacts
    router.get("/admin/contacts", requireOperatorToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var filter_2, contacts;
        return __generator(this, function (_a) {
            try {
                filter_2 = {
                    category: req.query.category,
                    status: req.query.status,
                };
                // Remove undefined values
                Object.keys(filter_2).forEach(function (key) {
                    if (filter_2[key] === undefined) {
                        delete filter_2[key];
                    }
                });
                contacts = (0, orders_1.listContacts)(Object.keys(filter_2).length > 0 ? filter_2 : undefined);
                res.json({ ok: true, contacts: contacts });
            }
            catch (error) {
                console.error("Failed to list contacts:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    // PUT /api/admin/contacts/:id
    router.put("/admin/contacts/:id", requireOperatorToken, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var _a, status_2, tags, contact;
        return __generator(this, function (_b) {
            try {
                _a = req.body, status_2 = _a.status, tags = _a.tags;
                contact = (0, orders_1.updateContact)(req.params.id, {
                    status: status_2,
                    tags: tags,
                });
                if (!contact) {
                    return [2 /*return*/, res.status(404).json({ error: "Contact not found" })];
                }
                res.json({ ok: true, contact: contact });
            }
            catch (error) {
                console.error("Failed to update contact:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}
