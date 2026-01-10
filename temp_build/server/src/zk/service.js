"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.proveContent = proveContent;
exports.verifyContent = verifyContent;
exports.getAttestation = getAttestation;
var promises_1 = require("fs/promises");
var path_1 = require("path");
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("../db");
var hash_1 = require("../trust/hash");
var metrics_1 = require("../trust/metrics");
var starbridge_1 = require("../starbridge");
var TABLE = "dreamnet_trust.zk_attestations";
var ROOTS_TABLE = "dreamnet_trust.zk_roots";
var snark = null;
function getSnark() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!snark) return [3 /*break*/, 2];
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("snarkjs"); })];
                case 1:
                    snark = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, snark];
            }
        });
    });
}
function artifactPaths() {
    var _a, _b, _c, _d;
    var base = (_a = process.env.ZK_ARTIFACT_BUCKET) !== null && _a !== void 0 ? _a : path_1.default.resolve(process.cwd(), "zk-artifacts");
    var wasm = (_b = process.env.ZK_WASM_PATH) !== null && _b !== void 0 ? _b : path_1.default.join(base, "content_ok.wasm");
    var zkey = (_c = process.env.ZK_ZKEY_PATH) !== null && _c !== void 0 ? _c : path_1.default.join(base, "content_ok.zkey");
    var vkey = (_d = process.env.ZK_VKEY_PATH) !== null && _d !== void 0 ? _d : path_1.default.join(base, "content_ok.vkey.json");
    return { wasm: wasm, zkey: zkey, vkey: vkey };
}
function ensureArtifacts() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, wasm, zkey, vkey, _i, _b, file, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = artifactPaths(), wasm = _a.wasm, zkey = _a.zkey, vkey = _a.vkey;
                    _i = 0, _b = [wasm, zkey, vkey];
                    _d.label = 1;
                case 1:
                    if (!(_i < _b.length)) return [3 /*break*/, 6];
                    file = _b[_i];
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, promises_1.default.access(file)];
                case 3:
                    _d.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _c = _d.sent();
                    return [2 /*return*/, false];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, true];
            }
        });
    });
}
function proveContent(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var snarkjs, _a, wasm, zkey, input, proof;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!process.env.ZK_BACKEND || process.env.ZK_BACKEND !== "circom") {
                        throw new Error("ZK_BACKEND must be set to circom");
                    }
                    return [4 /*yield*/, ensureArtifacts()];
                case 1:
                    if (!(_b.sent())) {
                        throw new Error("ZK artifacts missing; ensure wasm/zkey/vkey are present");
                    }
                    return [4 /*yield*/, getSnark()];
                case 2:
                    snarkjs = _b.sent();
                    _a = artifactPaths(), wasm = _a.wasm, zkey = _a.zkey;
                    input = { content: (0, hash_1.hashJson)(payload, hash_1.activeHashAlgo) };
                    return [4 /*yield*/, snarkjs.groth16.fullProve(input, wasm, zkey)];
                case 3:
                    proof = _b.sent();
                    return [2 /*return*/, {
                            proof: proof.proof,
                            publicSignals: proof.publicSignals,
                            contentHash: input.content,
                        }];
            }
        });
    });
}
function verifyContent(content, proof, publicSignals) {
    return __awaiter(this, void 0, void 0, function () {
        var snarkjs, vkey, vKeyJson, _a, _b, ok, contentHash;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, ensureArtifacts()];
                case 1:
                    if (!(_d.sent())) {
                        throw new Error("ZK artifacts missing; ensure wasm/zkey/vkey are present");
                    }
                    return [4 /*yield*/, getSnark()];
                case 2:
                    snarkjs = _d.sent();
                    vkey = artifactPaths().vkey;
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, promises_1.default.readFile(vkey, "utf-8")];
                case 3:
                    vKeyJson = _b.apply(_a, [_d.sent()]);
                    return [4 /*yield*/, snarkjs.groth16.verify(vKeyJson, publicSignals, proof)];
                case 4:
                    ok = _d.sent();
                    if (!ok) {
                        return [2 /*return*/, { ok: false }];
                    }
                    contentHash = (0, hash_1.hashJson)(content, hash_1.activeHashAlgo);
                    return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    INSERT INTO ", " (content_hash, proof_hash, backend, anchor_root)\n    VALUES (", ", ", ", ", ", NULL)\n    ON CONFLICT (content_hash)\n    DO UPDATE SET proof_hash = EXCLUDED.proof_hash, created_at = NOW();\n  "], ["\n    INSERT INTO ", " (content_hash, proof_hash, backend, anchor_root)\n    VALUES (", ", ", ", ", ", NULL)\n    ON CONFLICT (content_hash)\n    DO UPDATE SET proof_hash = EXCLUDED.proof_hash, created_at = NOW();\n  "])), drizzle_orm_1.sql.raw(TABLE), contentHash, (0, hash_1.hashJson)({ proof: proof, publicSignals: publicSignals }, hash_1.activeHashAlgo), (_c = process.env.ZK_BACKEND) !== null && _c !== void 0 ? _c : "circom"))];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, (0, metrics_1.recordMetric)("zk.attestations", {
                            lastContentHash: contentHash,
                            lastProvedAt: new Date().toISOString(),
                        })];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, (0, starbridge_1.publishInternalEvent)({
                            topic: starbridge_1.StarbridgeTopic.System,
                            source: starbridge_1.StarbridgeSource.Runtime,
                            type: "zk.attestation.recorded",
                            payload: { contentHash: contentHash },
                        })];
                case 7:
                    _d.sent();
                    return [2 /*return*/, { ok: true, contentHash: contentHash }];
            }
        });
    });
}
function getAttestation(contentHash) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db_1.db.execute((0, drizzle_orm_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    SELECT * FROM ", " WHERE content_hash = ", "\n  "], ["\n    SELECT * FROM ", " WHERE content_hash = ", "\n  "])), drizzle_orm_1.sql.raw(TABLE), contentHash))];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, (_b = (_a = result.rows) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null];
            }
        });
    });
}
var templateObject_1, templateObject_2;
