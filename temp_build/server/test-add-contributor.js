#!/usr/bin/env tsx
"use strict";
/**
 * Test addContributor function
 *
 * Tests the addContributor(cocoonId, wallet, role) function with validation
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
exports.testAddContributor = testAddContributor;
var storage_1 = require("./storage");
function testAddContributor() {
    return __awaiter(this, void 0, void 0, function () {
        var testCocoonId, testCocoon, error_1, result1, result2, result3, result4, validRoles, testWallets, i, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🧪 Testing addContributor function");
                    console.log("================================");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 14, , 15]);
                    testCocoonId = "test-cocoon-001";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, storage_1.storage.createCocoon({
                            dreamId: "test-dream-001",
                            title: "Test Music Cocoon",
                            description: "A test cocoon for contributor testing",
                            creatorWallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e"
                        })];
                case 3:
                    testCocoon = _a.sent();
                    testCocoonId = testCocoon.id;
                    console.log("\u2705 Created test cocoon: ".concat(testCocoonId));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.log("ℹ️  Using mock cocoon ID for testing");
                    return [3 /*break*/, 5];
                case 5:
                    // Test 1: Valid role addition
                    console.log("\n1. Testing valid role addition:");
                    return [4 /*yield*/, storage_1.storage.addContributor(testCocoonId, "0x8ba1f109551bD432803012645Hac136c9.5928e", "Artist")];
                case 6:
                    result1 = _a.sent();
                    console.log("Result: ".concat(result1));
                    // Test 2: Valid role addition - different contributor
                    console.log("\n2. Testing another valid contributor:");
                    return [4 /*yield*/, storage_1.storage.addContributor(testCocoonId, "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed", "Coder")];
                case 7:
                    result2 = _a.sent();
                    console.log("Result: ".concat(result2));
                    // Test 3: Duplicate contributor
                    console.log("\n3. Testing duplicate contributor (should fail):");
                    return [4 /*yield*/, storage_1.storage.addContributor(testCocoonId, "0x8ba1f109551bD432803012645Hac136c9.5928e", "Builder")];
                case 8:
                    result3 = _a.sent();
                    console.log("Result: ".concat(result3));
                    // Test 4: Invalid role
                    console.log("\n4. Testing invalid role (should fail):");
                    return [4 /*yield*/, storage_1.storage.addContributor(testCocoonId, "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359", "InvalidRole")];
                case 9:
                    result4 = _a.sent();
                    console.log("Result: ".concat(result4));
                    // Test 5: Test all valid roles
                    console.log("\n5. Testing all valid roles:");
                    validRoles = ['Builder', 'Artist', 'Coder', 'Visionary', 'Promoter'];
                    testWallets = [
                        "0xaAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
                        "0xbFb6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
                        "0xcCb6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
                        "0xdDb6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
                        "0xeEb6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
                    ];
                    i = 0;
                    _a.label = 10;
                case 10:
                    if (!(i < validRoles.length)) return [3 /*break*/, 13];
                    return [4 /*yield*/, storage_1.storage.addContributor(testCocoonId, testWallets[i], validRoles[i])];
                case 11:
                    result = _a.sent();
                    console.log("  ".concat(validRoles[i], ": ").concat(result));
                    _a.label = 12;
                case 12:
                    i++;
                    return [3 /*break*/, 10];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_2 = _a.sent();
                    console.log("❌ Test error:", error_2);
                    return [3 /*break*/, 15];
                case 15:
                    console.log("\n✅ addContributor function testing completed");
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testAddContributor()];
                case 1:
                    _a.sent();
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
// Run if called directly
if (import.meta.url === "file://".concat(process.argv[1])) {
    main().catch(console.error);
}
