"use strict";
/**
 * Two-Phase Commit Pattern for Billable Actions
 * Charge only after response is confirmed stored
 */
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
exports.reserveCharge = reserveCharge;
exports.confirmAndCharge = confirmAndCharge;
exports.billableActionMiddleware = billableActionMiddleware;
exports.getBillableAction = getBillableAction;
exports.getBillableStats = getBillableStats;
var traceId_1 = require("./traceId");
var idempotency_1 = require("./idempotency");
var crypto_1 = require("crypto");
var billableActions = new Map();
/**
 * Generate action ID
 */
function generateActionId() {
    return "billable-".concat(Date.now(), "-").concat(Math.random().toString(36).substring(7));
}
/**
 * Two-phase commit: Phase 1 - Reserve charge
 */
function reserveCharge(idempotencyKey_1, action_1, amount_1) {
    return __awaiter(this, arguments, void 0, function (idempotencyKey, action, amount, currency, traceId) {
        var actionId, finalTraceId, digest, _a, isReplay, record, existing, billableAction;
        if (currency === void 0) { currency = "USD"; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    actionId = generateActionId();
                    finalTraceId = traceId || "trace-".concat(Date.now());
                    digest = (0, crypto_1.createHash)("sha256").update("".concat(idempotencyKey, "-").concat(action, "-").concat(amount)).digest("hex").substring(0, 16);
                    return [4 /*yield*/, (0, idempotency_1.checkIdempotency)(idempotencyKey, finalTraceId, digest)];
                case 1:
                    _a = _b.sent(), isReplay = _a.isReplay, record = _a.record;
                    if (isReplay && record) {
                        existing = Array.from(billableActions.values()).find(function (a) { return a.idempotencyKey === idempotencyKey && a.status !== "failed"; });
                        if (existing) {
                            console.log("\uD83D\uDCB0 [Billable] Replay detected - Action: ".concat(existing.id, ", Status: ").concat(existing.status, ", Trace: ").concat(finalTraceId));
                            return [2 /*return*/, { actionId: existing.id, reserved: existing.status === "charged" || existing.status === "confirmed" }];
                        }
                    }
                    billableAction = {
                        id: actionId,
                        traceId: finalTraceId,
                        idempotencyKey: idempotencyKey,
                        action: action,
                        amount: amount,
                        currency: currency,
                        status: "pending",
                        createdAt: Date.now(),
                    };
                    billableActions.set(actionId, billableAction);
                    console.log("\uD83D\uDCB0 [Billable] Charge reserved - Action: ".concat(actionId, ", Amount: ").concat(amount, " ").concat(currency, ", Trace: ").concat(finalTraceId));
                    return [2 /*return*/, { actionId: actionId, reserved: true }];
            }
        });
    });
}
/**
 * Two-phase commit: Phase 2 - Confirm and charge
 */
function confirmAndCharge(actionId, response) {
    return __awaiter(this, void 0, void 0, function () {
        var action;
        return __generator(this, function (_a) {
            action = billableActions.get(actionId);
            if (!action) {
                return [2 /*return*/, { charged: false, error: "Action not found" }];
            }
            if (action.status === "charged") {
                console.log("\uD83D\uDCB0 [Billable] Already charged - Action: ".concat(actionId, ", Trace: ").concat(action.traceId));
                return [2 /*return*/, { charged: true }];
            }
            if (action.status === "failed") {
                return [2 /*return*/, { charged: false, error: "Action previously failed" }];
            }
            // Mark as confirmed (response stored)
            action.status = "confirmed";
            action.confirmedAt = Date.now();
            action.response = response;
            // Now charge (after confirmation)
            try {
                // TODO: Integrate with actual payment processor
                // For now, just mark as charged
                action.status = "charged";
                action.chargedAt = Date.now();
                // Store idempotency response
                (0, idempotency_1.storeIdempotencyResponse)(action.idempotencyKey, response);
                console.log("\u2705 [Billable] Charge confirmed - Action: ".concat(actionId, ", Amount: ").concat(action.amount, " ").concat(action.currency, ", Trace: ").concat(action.traceId));
                return [2 /*return*/, { charged: true }];
            }
            catch (error) {
                action.status = "failed";
                console.error("\u274C [Billable] Charge failed - Action: ".concat(actionId, ", Error: ").concat(error.message, ", Trace: ").concat(action.traceId));
                return [2 /*return*/, { charged: false, error: error.message }];
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Billable action middleware - wraps billable endpoints
 */
function billableActionMiddleware(action) {
    var _this = this;
    return function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var traceId, idempotencyKey, amount, currency, _a, actionId, reserved, originalJson;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    traceId = req.traceId || (0, traceId_1.getTraceId)(req);
                    idempotencyKey = req.headers["x-idempotency-key"];
                    if (!idempotencyKey) {
                        return [2 /*return*/, res.status(400).json({
                                ok: false,
                                error: "idempotency_key_required",
                                message: "X-Idempotency-Key header required for billable actions",
                            })];
                    }
                    amount = req.body.amount || req.body.cost || 0;
                    currency = req.body.currency || "USD";
                    return [4 /*yield*/, reserveCharge(idempotencyKey, action, amount, currency, traceId)];
                case 1:
                    _a = _b.sent(), actionId = _a.actionId, reserved = _a.reserved;
                    if (!reserved) {
                        return [2 /*return*/, res.status(409).json({
                                ok: false,
                                error: "charge_already_processed",
                                message: "This billable action was already processed",
                                traceId: traceId,
                                idempotencyKey: idempotencyKey,
                            })];
                    }
                    // Attach action ID to request
                    req.billableActionId = actionId;
                    req.billableAmount = amount;
                    req.billableCurrency = currency;
                    originalJson = res.json.bind(res);
                    res.json = function (body) {
                        // Phase 2: Confirm and charge after response is sent
                        confirmAndCharge(actionId, body).catch(function (error) {
                            console.error("[Billable] Failed to confirm charge for ".concat(actionId, ":"), error);
                        });
                        return originalJson(body);
                    };
                    next();
                    return [2 /*return*/];
            }
        });
    }); };
}
/**
 * Get billable action status
 */
function getBillableAction(actionId) {
    return billableActions.get(actionId);
}
/**
 * Get billable stats
 */
function getBillableStats() {
    var actions = Array.from(billableActions.values());
    var pending = actions.filter(function (a) { return a.status === "pending"; }).length;
    var confirmed = actions.filter(function (a) { return a.status === "confirmed"; }).length;
    var charged = actions.filter(function (a) { return a.status === "charged"; }).length;
    var failed = actions.filter(function (a) { return a.status === "failed"; }).length;
    var totalAmount = actions.filter(function (a) { return a.status === "charged"; }).reduce(function (sum, a) { return sum + a.amount; }, 0);
    return {
        total: actions.length,
        pending: pending,
        confirmed: confirmed,
        charged: charged,
        failed: failed,
        totalAmount: totalAmount,
    };
}
