"use strict";
/**
 * Whale Pack Actions Handler
 * Processes actions and updates system state
 */
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
exports.processWhaleAction = processWhaleAction;
exports.getActionState = getActionState;
exports.setActionState = setActionState;
// In-memory action state (would be in DB/Redis in production)
var actionState = {};
/**
 * Process a Whale Pack action
 */
function processWhaleAction(appId, action, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("[WhalePack] Processing action: ".concat(appId, ".").concat(action), payload);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 11, , 12]);
                    _a = "".concat(appId, ".").concat(action);
                    switch (_a) {
                        case 'governance.highlightCreateProposal': return [3 /*break*/, 2];
                        case 'onboarding.increasePriority': return [3 /*break*/, 4];
                        case 'prediction.highlightCreateMarket': return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 2: return [4 /*yield*/, handleHighlightCreateProposal(payload)];
                case 3: return [2 /*return*/, _b.sent()];
                case 4: return [4 /*yield*/, handleIncreasePriority(payload)];
                case 5: return [2 /*return*/, _b.sent()];
                case 6: return [4 /*yield*/, handleHighlightCreateMarket(payload)];
                case 7: return [2 /*return*/, _b.sent()];
                case 8: return [4 /*yield*/, handleGenericAction(appId, action, payload)];
                case 9: 
                // Generic action handler
                return [2 /*return*/, _b.sent()];
                case 10: return [3 /*break*/, 12];
                case 11:
                    err_1 = _b.sent();
                    console.error("[WhalePack] Action failed: ".concat(appId, ".").concat(action), err_1);
                    return [2 /*return*/, {
                            success: false,
                            message: err_1.message || 'Action failed',
                        }];
                case 12: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get current action state for an app
 */
function getActionState(appId) {
    return actionState[appId] || {};
}
/**
 * Set action state for an app
 */
function setActionState(appId, state) {
    actionState[appId] = __assign(__assign({}, actionState[appId]), state);
}
function handleHighlightCreateProposal(payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setActionState('governance', __assign({ highlightCreateProposal: true, highlightUntil: Date.now() + (payload.duration || 3600000) }, payload));
            return [2 /*return*/, {
                    success: true,
                    message: 'Governance create proposal highlighted',
                    actionId: "governance.highlightCreateProposal.".concat(Date.now()),
                }];
        });
    });
}
function handleIncreasePriority(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var priority;
        return __generator(this, function (_a) {
            priority = payload.priority || 1;
            setActionState('onboarding', __assign({ priority: priority, priorityUntil: Date.now() + (payload.duration || 7200000) }, payload));
            return [2 /*return*/, {
                    success: true,
                    message: "Onboarding priority increased to ".concat(priority),
                    actionId: "onboarding.increasePriority.".concat(Date.now()),
                }];
        });
    });
}
function handleHighlightCreateMarket(payload) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            setActionState('prediction', __assign({ highlightCreateMarket: true, highlightUntil: Date.now() + (payload.duration || 3600000) }, payload));
            return [2 /*return*/, {
                    success: true,
                    message: 'Prediction create market highlighted',
                    actionId: "prediction.highlightCreateMarket.".concat(Date.now()),
                }];
        });
    });
}
function handleGenericAction(appId, action, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var currentState;
        var _a;
        return __generator(this, function (_b) {
            currentState = getActionState(appId);
            setActionState(appId, __assign(__assign({}, currentState), (_a = {}, _a[action] = __assign(__assign({}, payload), { timestamp: Date.now() }), _a)));
            return [2 /*return*/, {
                    success: true,
                    message: "Action ".concat(action, " processed for ").concat(appId),
                    actionId: "".concat(appId, ".").concat(action, ".").concat(Date.now()),
                }];
        });
    });
}
