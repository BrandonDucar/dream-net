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
var shared_dream_storage_1 = require("./shared-dream-storage");
var router = express_1.default.Router();
router.get('/my-dreams', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var wallet_1, dreams;
    return __generator(this, function (_a) {
        try {
            wallet_1 = req.query.wallet;
            if (!wallet_1) {
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'Wallet parameter is required'
                    })];
            }
            console.log("Fetching dreams for wallet: ".concat(wallet_1));
            dreams = (0, shared_dream_storage_1.getAllDreams)().map(function (dream) { return (__assign(__assign({}, dream), { wallet: wallet_1 })); });
            res.json(dreams);
        }
        catch (error) {
            console.error('My dreams fetch error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to fetch user dreams'
            });
        }
        return [2 /*return*/];
    });
}); });
// Add a dream to user's vault
router.post('/my-dreams', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, wallet, title, type, createdByAgent, lineage, newDream;
    return __generator(this, function (_b) {
        try {
            _a = req.body, wallet = _a.wallet, title = _a.title, type = _a.type, createdByAgent = _a.createdByAgent, lineage = _a.lineage;
            if (!wallet || !title || !type) {
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        error: 'Wallet, title, and type are required'
                    })];
            }
            newDream = {
                id: "dream-".concat(Date.now()),
                title: title,
                description: req.body.description || '',
                tags: req.body.tags || [],
                type: type,
                createdByAgent: createdByAgent,
                lineage: lineage,
                wallet: wallet,
                createdAt: new Date().toISOString()
            };
            (0, shared_dream_storage_1.saveDream)(newDream.id, newDream);
            console.log("Added dream to vault: ".concat(title, " for wallet ").concat(wallet));
            res.json({
                success: true,
                dream: newDream,
                message: 'Dream added to vault successfully'
            });
        }
        catch (error) {
            console.error('Add dream to vault error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to add dream to vault'
            });
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
