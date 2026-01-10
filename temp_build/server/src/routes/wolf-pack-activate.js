"use strict";
/**
 * Wolf Pack Activation Route
 *
 * Immediately start hunting for funding opportunities
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
exports.createWolfPackActivateRouter = createWolfPackActivateRouter;
var express_1 = require("express");
var WolfPack_1 = require("../agents/WolfPack");
var DreamNetEmail_1 = require("../email/DreamNetEmail");
function createWolfPackActivateRouter() {
    var _this = this;
    var router = (0, express_1.Router)();
    // POST /api/wolf-pack/activate - Activate Wolf Pack hunting
    router.post("/wolf-pack/activate", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var opportunities, existingHunts, hunt, _i, opportunities_1, opp, emailErr_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    console.log("🐺 [Wolf Pack] ACTIVATION REQUESTED - Starting hunt...");
                    return [4 /*yield*/, WolfPack_1.wolfPack.discoverOpportunities()];
                case 1:
                    opportunities = _a.sent();
                    console.log("\uD83D\uDC3A [Wolf Pack] Discovered ".concat(opportunities.length, " opportunities"));
                    existingHunts = WolfPack_1.wolfPack.getHunts();
                    hunt = void 0;
                    if (existingHunts.length === 0) {
                        hunt = WolfPack_1.wolfPack.createHunt(10, ["base", "optimism"], undefined);
                        console.log("\uD83D\uDC3A [Wolf Pack] Created default hunt: ".concat(hunt.id));
                    }
                    else {
                        hunt = existingHunts[0];
                    }
                    // Add all opportunities to hunt
                    for (_i = 0, opportunities_1 = opportunities; _i < opportunities_1.length; _i++) {
                        opp = opportunities_1[_i];
                        WolfPack_1.wolfPack.addOpportunityToHunt(hunt.id, opp.id);
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, DreamNetEmail_1.dreamNetEmail.sendEmail(process.env.DREAMNET_EMAIL || "dreamnet@dreamnet.ink", "🐺 Wolf Pack Activated - Hunt Started", "Wolf Pack has been activated and is now hunting for funding opportunities.\n\nDiscovered Opportunities: ".concat(opportunities.length, "\n- Base Builder Grants: ").concat(opportunities.filter(function (o) { return o.source === "base"; }).length, "\n- Optimism Retro Funding: ").concat(opportunities.filter(function (o) { return o.source === "optimism"; }).length, "\n\nActive Hunt: ").concat(hunt.id, "\nTarget: ").concat(hunt.targetAmount, " ETH\nSources: ").concat(hunt.targetSources.join(", "), "\n\nThe pack is on the hunt! \uD83D\uDC3A\uD83D\uDCB0"), "<h1>\uD83D\uDC3A Wolf Pack Activated</h1>\n<p>Wolf Pack has been activated and is now hunting for funding opportunities.</p>\n<ul>\n  <li>Discovered Opportunities: <strong>".concat(opportunities.length, "</strong></li>\n  <li>Base Builder Grants: ").concat(opportunities.filter(function (o) { return o.source === "base"; }).length, "</li>\n          <li>Optimism Retro Funding: ").concat(opportunities.filter(function (o) { return o.source === "optimism"; }).length, "</li>\n</ul>\n<p><strong>Active Hunt:</strong> ").concat(hunt.id, "</p>\n<p><strong>Target:</strong> ").concat(hunt.targetAmount, " ETH</p>\n<p><strong>Sources:</strong> ").concat(hunt.targetSources.join(", "), "</p>\n<p>The pack is on the hunt! \uD83D\uDC3A\uD83D\uDCB0</p>"), { type: "wolf-pack-activation" })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    emailErr_1 = _a.sent();
                    console.warn("Failed to send activation email:", emailErr_1);
                    return [3 /*break*/, 5];
                case 5:
                    res.json({
                        ok: true,
                        message: "Wolf Pack activated and hunting!",
                        hunt: hunt,
                        opportunities: opportunities.length,
                        status: "hunting",
                    });
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error("Failed to activate Wolf Pack:", error_1);
                    res.status(500).json({ error: error_1.message });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    // GET /api/wolf-pack/status - Get hunting status
    router.get("/wolf-pack/status", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var hunts, opportunities, activeHunts;
        return __generator(this, function (_a) {
            try {
                hunts = WolfPack_1.wolfPack.getHunts();
                opportunities = WolfPack_1.wolfPack.getOpportunities();
                activeHunts = hunts.filter(function (h) { return h.status === "active"; });
                res.json({
                    ok: true,
                    status: "hunting",
                    activeHunts: activeHunts.length,
                    totalOpportunities: opportunities.length,
                    opportunitiesBySource: {
                        base: opportunities.filter(function (o) { return o.source === "base"; }).length,
                        optimism: opportunities.filter(function (o) { return o.source === "optimism"; }).length,
                        other: opportunities.filter(function (o) { return !["base", "optimism"].includes(o.source); }).length,
                    },
                    hunts: activeHunts.map(function (h) { return ({
                        id: h.id,
                        targetAmount: h.targetAmount,
                        targetSources: h.targetSources,
                        opportunities: h.opportunities.length,
                    }); }),
                });
            }
            catch (error) {
                console.error("Failed to get Wolf Pack status:", error);
                res.status(500).json({ error: error.message });
            }
            return [2 /*return*/];
        });
    }); });
    return router;
}
