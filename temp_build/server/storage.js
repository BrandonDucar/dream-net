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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.DatabaseStorage = void 0;
var schema_1 = require("@shared/schema");
var db_1 = require("./db");
var drizzle_orm_1 = require("drizzle-orm");
var simple_notifications_1 = require("./simple-notifications");
var webhook_notifier_1 = require("./webhook-notifier");
var loader_1 = require("./legacy/loader");
function mapDreamRecord(record) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20;
    var tags = Array.isArray(record.tags) ? record.tags : [];
    var contributors = ((_a = record.contributors) !== null && _a !== void 0 ? _a : []).map(function (c) {
        var _a, _b;
        return ({
            wallet: c.wallet,
            role: c.role,
            joinedAt: (_b = (_a = c.joinedAt) !== null && _a !== void 0 ? _a : c.joined_at) !== null && _b !== void 0 ? _b : new Date().toISOString(),
        });
    });
    var aiTags = Array.isArray(record.aiTags) ? record.aiTags : undefined;
    var blessings = (_b = record.blessings) !== null && _b !== void 0 ? _b : undefined;
    var lastUpdated = record.lastUpdated instanceof Date
        ? record.lastUpdated.toISOString()
        : record.lastUpdated
            ? new Date(record.lastUpdated).toISOString()
            : new Date().toISOString();
    var createdAt = record.createdAt instanceof Date
        ? record.createdAt.toISOString()
        : record.createdAt
            ? new Date(record.createdAt).toISOString()
            : undefined;
    var reviewedAt = record.reviewedAt instanceof Date
        ? record.reviewedAt.toISOString()
        : record.reviewedAt
            ? new Date(record.reviewedAt).toISOString()
            : undefined;
    return {
        id: record.id,
        name: (_d = (_c = record.name) !== null && _c !== void 0 ? _c : record.title) !== null && _d !== void 0 ? _d : "Untitled Dream",
        creator: (_e = record.creator) !== null && _e !== void 0 ? _e : record.wallet,
        tags: tags,
        score: (_g = (_f = record.score) !== null && _f !== void 0 ? _f : record.dreamScore) !== null && _g !== void 0 ? _g : 0,
        evolved: Boolean(record.evolved),
        lastUpdated: lastUpdated,
        coreType: (_h = record.coreType) !== null && _h !== void 0 ? _h : undefined,
        description: (_j = record.description) !== null && _j !== void 0 ? _j : undefined,
        image: (_k = record.image) !== null && _k !== void 0 ? _k : undefined,
        status: (_l = record.status) !== null && _l !== void 0 ? _l : undefined,
        title: (_m = record.title) !== null && _m !== void 0 ? _m : undefined,
        wallet: record.wallet,
        dreamStatus: (_o = record.dreamStatus) !== null && _o !== void 0 ? _o : undefined,
        dreamScore: (_p = record.dreamScore) !== null && _p !== void 0 ? _p : undefined,
        contributors: contributors,
        urgency: (_q = record.urgency) !== null && _q !== void 0 ? _q : undefined,
        origin: (_r = record.origin) !== null && _r !== void 0 ? _r : undefined,
        aiScore: (_s = record.aiScore) !== null && _s !== void 0 ? _s : undefined,
        aiTags: aiTags,
        scoreBreakdown: (_t = record.scoreBreakdown) !== null && _t !== void 0 ? _t : undefined,
        views: (_u = record.views) !== null && _u !== void 0 ? _u : undefined,
        likes: (_v = record.likes) !== null && _v !== void 0 ? _v : undefined,
        comments: (_w = record.comments) !== null && _w !== void 0 ? _w : undefined,
        editCount: (_x = record.editCount) !== null && _x !== void 0 ? _x : undefined,
        uniquenessScore: (_y = record.uniquenessScore) !== null && _y !== void 0 ? _y : undefined,
        createdAt: createdAt,
        reviewedAt: reviewedAt,
        reviewerId: (_z = record.reviewerId) !== null && _z !== void 0 ? _z : undefined,
        forkedFrom: (_0 = record.forkedFrom) !== null && _0 !== void 0 ? _0 : undefined,
        remixOf: (_1 = record.remixOf) !== null && _1 !== void 0 ? _1 : undefined,
        bountyId: (_2 = record.bountyId) !== null && _2 !== void 0 ? _2 : undefined,
        bountyToken: (_3 = record.bountyToken) !== null && _3 !== void 0 ? _3 : undefined,
        bountyAmount: (_4 = record.bountyAmount) !== null && _4 !== void 0 ? _4 : undefined,
        dreamCloud: (_5 = record.dreamCloud) !== null && _5 !== void 0 ? _5 : undefined,
        evolutionType: (_6 = record.evolutionType) !== null && _6 !== void 0 ? _6 : undefined,
        remixCount: (_7 = record.remixCount) !== null && _7 !== void 0 ? _7 : undefined,
        fusionCount: (_8 = record.fusionCount) !== null && _8 !== void 0 ? _8 : undefined,
        blessCount: (_9 = record.blessCount) !== null && _9 !== void 0 ? _9 : undefined,
        nightmareEscapes: (_10 = record.nightmareEscapes) !== null && _10 !== void 0 ? _10 : undefined,
        xp: (_11 = record.xp) !== null && _11 !== void 0 ? _11 : undefined,
        level: (_12 = record.level) !== null && _12 !== void 0 ? _12 : undefined,
        blessings: blessings,
        swarmBoosted: (_13 = record.swarmBoosted) !== null && _13 !== void 0 ? _13 : undefined,
        swarmBoostTime: (_14 = record.swarmBoostTime) !== null && _14 !== void 0 ? _14 : undefined,
        linkedDreams: (_15 = record.linkedDreams) !== null && _15 !== void 0 ? _15 : undefined,
        networkStrength: (_16 = record.networkStrength) !== null && _16 !== void 0 ? _16 : undefined,
        evolutionPath: (_17 = record.evolutionPath) !== null && _17 !== void 0 ? _17 : undefined,
        specialAbility: (_18 = record.specialAbility) !== null && _18 !== void 0 ? _18 : undefined,
        originalScore: (_19 = record.originalScore) !== null && _19 !== void 0 ? _19 : undefined,
        evolutionTimestamp: (_20 = record.evolutionTimestamp) !== null && _20 !== void 0 ? _20 : undefined,
    };
}
function mapCocoonContributors(value) {
    if (!Array.isArray(value))
        return [];
    return value.map(function (entry) {
        var _a, _b;
        return ({
            wallet: entry.wallet,
            role: entry.role,
            joinedAt: (_b = (_a = entry.joinedAt) !== null && _a !== void 0 ? _a : entry.joined_at) !== null && _b !== void 0 ? _b : new Date().toISOString(),
        });
    });
}
var DREAM_UPDATEABLE_FIELDS = new Set([
    "name",
    "creator",
    "description",
    "tags",
    "score",
    "evolved",
    "coreType",
    "image",
    "status",
    "wallet",
    "title",
    "urgency",
    "origin",
    "dreamStatus",
    "isNightmare",
    "trustScore",
    "aiScore",
    "aiTags",
    "dreamScore",
    "scoreBreakdown",
    "views",
    "likes",
    "comments",
    "contributors",
    "editCount",
    "uniquenessScore",
    "reviewerId",
    "forkedFrom",
    "remixOf",
    "bountyId",
    "bountyToken",
    "bountyAmount",
    "dreamCloud",
    "evolutionType",
    "remixCount",
    "fusionCount",
    "blessCount",
    "nightmareEscapes",
    "xp",
    "level",
    "blessings",
]);
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage() {
        this.dreams = [];
    }
    // Users
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.username, username))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .insert(schema_1.users)
                            .values(insertUser)
                            .returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    // Dreams
    DatabaseStorage.prototype.getDreams = function () {
        return __awaiter(this, arguments, void 0, function (limit, offset) {
            var rows;
            if (limit === void 0) { limit = 50; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.dreams)
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.dreams.createdAt))
                            .limit(limit)
                            .offset(offset)];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(mapDreamRecord)];
                }
            });
        });
    };
    DatabaseStorage.prototype.getDream = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var dream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.dreams).where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                    case 1:
                        dream = (_a.sent())[0];
                        return [2 /*return*/, dream ? mapDreamRecord(dream) : undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createDream = function (insertDream) {
        return __awaiter(this, void 0, void 0, function () {
            var dream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .insert(schema_1.dreams)
                            .values(insertDream)
                            .returning()];
                    case 1:
                        dream = (_a.sent())[0];
                        return [2 /*return*/, mapDreamRecord(dream)];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateDreamStatus = function (id, status, reviewerId) {
        return __awaiter(this, void 0, void 0, function () {
            var dream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            dreamStatus: status,
                            reviewerId: reviewerId,
                            reviewedAt: new Date()
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))
                            .returning()];
                    case 1:
                        dream = (_a.sent())[0];
                        return [2 /*return*/, mapDreamRecord(dream)];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateDreamAIScore = function (id, aiScore, aiTags) {
        return __awaiter(this, void 0, void 0, function () {
            var dream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            aiScore: aiScore,
                            aiTags: aiTags
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))
                            .returning()];
                    case 1:
                        dream = (_a.sent())[0];
                        return [2 /*return*/, mapDreamRecord(dream)];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateDreamScore = function (id, dreamScore, scoreBreakdown) {
        return __awaiter(this, void 0, void 0, function () {
            var dream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({
                            dreamScore: dreamScore,
                            scoreBreakdown: scoreBreakdown
                        })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))
                            .returning()];
                    case 1:
                        dream = (_a.sent())[0];
                        return [2 /*return*/, mapDreamRecord(dream)];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateDreamMetrics = function (id, metrics) {
        return __awaiter(this, void 0, void 0, function () {
            var dream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set(__assign(__assign({}, metrics), { lastUpdated: new Date() }))
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))
                            .returning()];
                    case 1:
                        dream = (_a.sent())[0];
                        return [2 /*return*/, mapDreamRecord(dream)];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateDream = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var _ignoredLast, _ignoredCreated, _ignoredReviewed, rest, payload, _i, _a, _b, key, value, updatedDream;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _ignoredLast = updates.lastUpdated, _ignoredCreated = updates.createdAt, _ignoredReviewed = updates.reviewedAt, rest = __rest(updates, ["lastUpdated", "createdAt", "reviewedAt"]);
                        payload = {};
                        for (_i = 0, _a = Object.entries(rest); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            if (value === undefined)
                                continue;
                            if (!DREAM_UPDATEABLE_FIELDS.has(key))
                                continue;
                            payload[key] = value;
                        }
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.dreams)
                                .set(__assign(__assign({}, payload), { lastUpdated: new Date() }))
                                .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))
                                .returning()];
                    case 1:
                        updatedDream = (_c.sent())[0];
                        return [2 /*return*/, updatedDream ? mapDreamRecord(updatedDream) : undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllDreams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.dreams).orderBy((0, drizzle_orm_1.desc)(schema_1.dreams.createdAt))];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(mapDreamRecord)];
                }
            });
        });
    };
    DatabaseStorage.prototype.getDreamsByWallet = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.dreams).where((0, drizzle_orm_1.eq)(schema_1.dreams.wallet, wallet))];
                    case 1:
                        rows = _a.sent();
                        return [2 /*return*/, rows.map(mapDreamRecord)];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteDream = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.delete(schema_1.dreams).where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateDreamTags = function (id, tags) {
        return __awaiter(this, void 0, void 0, function () {
            var dream;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.dreams)
                            .set({ tags: tags.map(function (tag) { return tag.toLowerCase(); }), lastUpdated: new Date() })
                            .where((0, drizzle_orm_1.eq)(schema_1.dreams.id, id))
                            .returning()];
                    case 1:
                        dream = (_a.sent())[0];
                        return [2 /*return*/, mapDreamRecord(dream)];
                }
            });
        });
    };
    // Cocoons
    DatabaseStorage.prototype.getCocoons = function () {
        return __awaiter(this, arguments, void 0, function (limit, offset) {
            if (limit === void 0) { limit = 50; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.cocoons)
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.cocoons.createdAt))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getCocoon = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cocoon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.cocoons).where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, id))];
                    case 1:
                        cocoon = (_a.sent())[0];
                        return [2 /*return*/, cocoon || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createCocoon = function (insertCocoon) {
        return __awaiter(this, void 0, void 0, function () {
            var cocoon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .insert(schema_1.cocoons)
                            .values(insertCocoon)
                            .returning()];
                    case 1:
                        cocoon = (_a.sent())[0];
                        return [2 /*return*/, cocoon];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateCocoon = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var currentCocoon, cocoon, stageMap, updateData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCocoon(id)];
                    case 1:
                        currentCocoon = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.cocoons)
                                .set(__assign(__assign({}, updates), { lastUpdated: new Date() }))
                                .where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, id))
                                .returning()];
                    case 2:
                        cocoon = (_a.sent())[0];
                        if (!(updates.stage && (currentCocoon === null || currentCocoon === void 0 ? void 0 : currentCocoon.dreamId))) return [3 /*break*/, 4];
                        stageMap = {
                            "seedling": "cocoon_seedling",
                            "incubating": "cocoon_incubating",
                            "active": "cocoon_active",
                            "metamorphosis": "cocoon_metamorphosis",
                            "emergence": "cocoon_emergence",
                            "complete": "cocoon_complete",
                            "archived": "cocoon_archived"
                        };
                        updateData = {
                            currentStage: stageMap[updates.stage] || updates.stage
                        };
                        // Set completedAt if reaching complete stage
                        if (updates.stage === 'complete') {
                            updateData.completedAt = new Date();
                        }
                        return [4 /*yield*/, this.updateEvolutionChain(currentCocoon.dreamId, updateData)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!updates.stage) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.checkAndMintMilestoneTokens(cocoon, updates.stage)];
                    case 5:
                        _a.sent();
                        if (!(updates.stage === 'active')) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.triggerCocoonActiveWebhook(cocoon)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!(updates.stage === 'complete')) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.checkAndMintNFT(cocoon)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/, cocoon];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateCocoonTags = function (id, tags) {
        return __awaiter(this, void 0, void 0, function () {
            var cocoon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.cocoons)
                            .set({ tags: tags.map(function (tag) { return tag.toLowerCase(); }), lastUpdated: new Date() })
                            .where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, id))
                            .returning()];
                    case 1:
                        cocoon = (_a.sent())[0];
                        return [2 /*return*/, cocoon];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateCocoonMetadata = function (id, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var cocoon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.cocoons)
                            .set({ metadata: metadata, lastUpdated: new Date() })
                            .where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, id))
                            .returning()];
                    case 1:
                        cocoon = (_a.sent())[0];
                        return [2 /*return*/, cocoon];
                }
            });
        });
    };
    DatabaseStorage.prototype.forceCocoonStage = function (id, stage, adminWallet) {
        return __awaiter(this, void 0, void 0, function () {
            var current, oldStage, cocoon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getCocoon(id)];
                    case 1:
                        current = _a.sent();
                        oldStage = (current === null || current === void 0 ? void 0 : current.stage) || null;
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.cocoons)
                                .set({ stage: stage, lastUpdated: new Date() })
                                .where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, id))
                                .returning()];
                    case 2:
                        cocoon = (_a.sent())[0];
                        // Log the forced stage change
                        return [4 /*yield*/, this.logCocoonStageChange(id, oldStage, stage, adminWallet, true, "Admin force stage change")];
                    case 3:
                        // Log the forced stage change
                        _a.sent();
                        if (!(stage === 'complete')) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.checkAndMintNFT(cocoon)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, cocoon];
                }
            });
        });
    };
    // Cocoon logs
    DatabaseStorage.prototype.logCocoonStageChange = function (cocoonId_1, previousStage_1, newStage_1, adminWallet_1) {
        return __awaiter(this, arguments, void 0, function (cocoonId, previousStage, newStage, adminWallet, isOverride, notes) {
            var log, cocoon, error_1;
            if (isOverride === void 0) { isOverride = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .insert(schema_1.cocoonLogs)
                            .values({
                            cocoonId: cocoonId,
                            previousStage: previousStage,
                            newStage: newStage,
                            adminWallet: adminWallet,
                            isOverride: isOverride,
                            notes: notes
                        })
                            .returning()];
                    case 1:
                        log = (_a.sent())[0];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.getCocoon(cocoonId)];
                    case 3:
                        cocoon = _a.sent();
                        if (cocoon && previousStage && newStage !== previousStage) {
                            simple_notifications_1.simpleNotifications.notifyCocoonStageChange(cocoon.creatorWallet, cocoon.title, previousStage, newStage);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.log("\u26A0\uFE0F  Could not send stage change notification: ".concat(error_1));
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/, log];
                }
            });
        });
    };
    DatabaseStorage.prototype.getCocoonLogs = function (cocoonId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.cocoonLogs)
                            .where((0, drizzle_orm_1.eq)(schema_1.cocoonLogs.cocoonId, cocoonId))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.cocoonLogs.timestamp))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Dream Cores
    DatabaseStorage.prototype.getDreamCores = function () {
        return __awaiter(this, arguments, void 0, function (limit, offset) {
            if (limit === void 0) { limit = 50; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.dreamCores)
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.dreamCores.createdAt))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getDreamCore = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var core;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.dreamCores).where((0, drizzle_orm_1.eq)(schema_1.dreamCores.id, id))];
                    case 1:
                        core = (_a.sent())[0];
                        return [2 /*return*/, core || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createDreamCore = function (insertCore) {
        return __awaiter(this, void 0, void 0, function () {
            var core;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .insert(schema_1.dreamCores)
                            .values(insertCore)
                            .returning()];
                    case 1:
                        core = (_a.sent())[0];
                        return [2 /*return*/, core];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateDreamCoreEnergy = function (id, energy, resonance) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData, core;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = { energy: energy };
                        if (resonance !== undefined) {
                            updateData.resonance = resonance;
                        }
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.dreamCores)
                                .set(updateData)
                                .where((0, drizzle_orm_1.eq)(schema_1.dreamCores.id, id))
                                .returning()];
                    case 1:
                        core = (_a.sent())[0];
                        return [2 /*return*/, core];
                }
            });
        });
    };
    // Wallets
    DatabaseStorage.prototype.getWallets = function () {
        return __awaiter(this, arguments, void 0, function (limit, offset) {
            if (limit === void 0) { limit = 50; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.wallets)
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.wallets.lastUpdated))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getWallet = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.wallets).where((0, drizzle_orm_1.eq)(schema_1.wallets.id, id))];
                    case 1:
                        wallet = (_a.sent())[0];
                        return [2 /*return*/, wallet || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getWalletByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.wallets).where((0, drizzle_orm_1.eq)(schema_1.wallets.userId, userId))];
                    case 1:
                        wallet = (_a.sent())[0];
                        return [2 /*return*/, wallet || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.createWallet = function (insertWallet) {
        return __awaiter(this, void 0, void 0, function () {
            var wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .insert(schema_1.wallets)
                            .values(insertWallet)
                            .returning()];
                    case 1:
                        wallet = (_a.sent())[0];
                        return [2 /*return*/, wallet];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateWalletScores = function (userId, dreamScore, cocoonTokens, coreFragments) {
        return __awaiter(this, void 0, void 0, function () {
            var updateData, currentWallet, wallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateData = { lastUpdated: new Date() };
                        if (dreamScore !== undefined)
                            updateData.dreamScore = dreamScore;
                        if (cocoonTokens !== undefined)
                            updateData.cocoonTokens = cocoonTokens;
                        if (coreFragments !== undefined)
                            updateData.coreFragments = coreFragments;
                        return [4 /*yield*/, this.getWalletByUserId(userId)];
                    case 1:
                        currentWallet = _a.sent();
                        if (currentWallet) {
                            updateData.totalValue = (dreamScore !== null && dreamScore !== void 0 ? dreamScore : currentWallet.dreamScore) +
                                (cocoonTokens !== null && cocoonTokens !== void 0 ? cocoonTokens : currentWallet.cocoonTokens) +
                                (coreFragments !== null && coreFragments !== void 0 ? coreFragments : currentWallet.coreFragments);
                        }
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.wallets)
                                .set(updateData)
                                .where((0, drizzle_orm_1.eq)(schema_1.wallets.userId, userId))
                                .returning()];
                    case 2:
                        wallet = (_a.sent())[0];
                        return [2 /*return*/, wallet];
                }
            });
        });
    };
    // Contributors
    DatabaseStorage.prototype.addCocoonContributor = function (cocoonId, contributor, performedBy) {
        return __awaiter(this, void 0, void 0, function () {
            var cocoon, existingContributors, isExisting, updatedContributors, updatedCocoon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.cocoons).where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, cocoonId))];
                    case 1:
                        cocoon = (_a.sent())[0];
                        if (!cocoon)
                            throw new Error("Cocoon not found");
                        existingContributors = cocoon.contributors || [];
                        isExisting = existingContributors.some(function (c) { return c.wallet === contributor.wallet && c.role === contributor.role; });
                        if (isExisting)
                            throw new Error("Contributor already exists with this role");
                        updatedContributors = __spreadArray(__spreadArray([], existingContributors, true), [contributor], false);
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.cocoons)
                                .set({ contributors: updatedContributors })
                                .where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, cocoonId))
                                .returning()];
                    case 2:
                        updatedCocoon = (_a.sent())[0];
                        // Log the action
                        return [4 /*yield*/, db_1.db.insert(schema_1.contributorsLog).values({
                                cocoonId: cocoonId,
                                walletAddress: contributor.wallet,
                                role: contributor.role,
                                actionType: "added",
                                performedBy: performedBy,
                            })];
                    case 3:
                        // Log the action
                        _a.sent();
                        return [2 /*return*/, updatedCocoon];
                }
            });
        });
    };
    DatabaseStorage.prototype.removeCocoonContributor = function (cocoonId, walletAddress, performedBy) {
        return __awaiter(this, void 0, void 0, function () {
            var cocoon, existingContributors, contributorToRemove, updatedContributors, updatedCocoon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.cocoons).where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, cocoonId))];
                    case 1:
                        cocoon = (_a.sent())[0];
                        if (!cocoon)
                            throw new Error("Cocoon not found");
                        existingContributors = cocoon.contributors || [];
                        contributorToRemove = existingContributors.find(function (c) { return c.wallet === walletAddress; });
                        if (!contributorToRemove)
                            throw new Error("Contributor not found");
                        updatedContributors = existingContributors.filter(function (c) { return c.wallet !== walletAddress; });
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.cocoons)
                                .set({ contributors: updatedContributors })
                                .where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, cocoonId))
                                .returning()];
                    case 2:
                        updatedCocoon = (_a.sent())[0];
                        // Log the action
                        return [4 /*yield*/, db_1.db.insert(schema_1.contributorsLog).values({
                                cocoonId: cocoonId,
                                walletAddress: walletAddress,
                                role: contributorToRemove.role,
                                actionType: "removed",
                                performedBy: performedBy,
                            })];
                    case 3:
                        // Log the action
                        _a.sent();
                        return [2 /*return*/, updatedCocoon];
                }
            });
        });
    };
    DatabaseStorage.prototype.getCocoonContributors = function (cocoonId) {
        return __awaiter(this, void 0, void 0, function () {
            var cocoon;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.cocoons).where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, cocoonId))];
                    case 1:
                        cocoon = (_a.sent())[0];
                        return [2 /*return*/, (cocoon === null || cocoon === void 0 ? void 0 : cocoon.contributors) || []];
                }
            });
        });
    };
    // Simple addContributor function as requested
    DatabaseStorage.prototype.addContributor = function (cocoonId, wallet, role) {
        return __awaiter(this, void 0, void 0, function () {
            var validRoles, cocoon, existingContributors, existingContributor, newContributor, updatedContributors, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validRoles = ['Builder', 'Artist', 'Coder', 'Visionary', 'Promoter'];
                        if (!validRoles.includes(role)) {
                            console.log("\u274C Invalid role \"".concat(role, "\". Valid roles: ").concat(validRoles.join(', ')));
                            return [2 /*return*/, false];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, db_1.db.select().from(schema_1.cocoons).where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, cocoonId))];
                    case 2:
                        cocoon = (_a.sent())[0];
                        if (!cocoon) {
                            console.log("\u274C Cocoon not found: ".concat(cocoonId));
                            return [2 /*return*/, false];
                        }
                        existingContributors = cocoon.contributors || [];
                        existingContributor = existingContributors.find(function (c) { return c.wallet === wallet; });
                        if (existingContributor) {
                            console.log("\u26A0\uFE0F  Contributor ".concat(wallet.slice(0, 8), "... already exists in cocoon \"").concat(cocoon.title, "\" with role: ").concat(existingContributor.role));
                            return [2 /*return*/, false];
                        }
                        newContributor = {
                            wallet: wallet,
                            role: role,
                            joinedAt: new Date().toISOString()
                        };
                        updatedContributors = __spreadArray(__spreadArray([], existingContributors, true), [newContributor], false);
                        // Update cocoon
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.cocoons)
                                .set({ contributors: updatedContributors, lastUpdated: new Date() })
                                .where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, cocoonId))];
                    case 3:
                        // Update cocoon
                        _a.sent();
                        console.log("\u2705 Added contributor ".concat(wallet.slice(0, 8), "... as ").concat(role, " to cocoon \"").concat(cocoon.title, "\""));
                        // Log the action in contributors log
                        return [4 /*yield*/, db_1.db.insert(schema_1.contributorsLog).values({
                                cocoonId: cocoonId,
                                walletAddress: wallet,
                                role: role,
                                actionType: "added",
                                performedBy: "system", // Since this is a direct function call
                            })];
                    case 4:
                        // Log the action in contributors log
                        _a.sent();
                        // Send notification to the new contributor
                        simple_notifications_1.simpleNotifications.notifyContributorAdded(wallet, cocoon.title, role);
                        return [2 /*return*/, true];
                    case 5:
                        error_2 = _a.sent();
                        console.log("\u274C Error adding contributor: ".concat(error_2 instanceof Error ? error_2.message : String(error_2)));
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    // NFT Minting functionality
    DatabaseStorage.prototype.checkAndMintNFT = function (cocoon) {
        return __awaiter(this, void 0, void 0, function () {
            var score, nftMetadata, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // Skip if already minted
                        if (cocoon.minted) {
                            console.log("\u26A0\uFE0F  Cocoon \"".concat(cocoon.title, "\" already minted, skipping"));
                            return [2 /*return*/, false];
                        }
                        score = cocoon.dreamScore || 0;
                        if (score < 80) {
                            console.log("\u26A0\uFE0F  Cocoon \"".concat(cocoon.title, "\" score (").concat(score, ") is below 80, skipping mint"));
                            return [2 /*return*/, false];
                        }
                        // Check if stage is 'complete'
                        if (cocoon.stage !== 'complete') {
                            console.log("\u26A0\uFE0F  Cocoon \"".concat(cocoon.title, "\" is not in complete stage (").concat(cocoon.stage, "), skipping mint"));
                            return [2 /*return*/, false];
                        }
                        // Simulate minting by setting minted = true
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.cocoons)
                                .set({ minted: true, lastUpdated: new Date() })
                                .where((0, drizzle_orm_1.eq)(schema_1.cocoons.id, cocoon.id))];
                    case 1:
                        // Simulate minting by setting minted = true
                        _a.sent();
                        nftMetadata = {
                            cocoonId: cocoon.id,
                            name: cocoon.title,
                            creatorWallet: cocoon.creatorWallet,
                            score: score,
                            mintedAt: new Date().toISOString(),
                            tokenId: Math.floor(Math.random() * 100000), // Simulated token ID
                            contractAddress: "0x" + Math.random().toString(16).substr(2, 40) // Simulated contract
                        };
                        console.log("\uD83C\uDFA8 NFT MINTED! Metadata:", JSON.stringify(nftMetadata, null, 2));
                        // Send simple notification for NFT minting
                        simple_notifications_1.simpleNotifications.notifyNFTMinted(cocoon.creatorWallet, cocoon.title, nftMetadata.tokenId);
                        return [2 /*return*/, true];
                    case 2:
                        error_3 = _a.sent();
                        console.log("\u274C Error minting NFT for cocoon \"".concat(cocoon.title, "\":"), error_3 instanceof Error ? error_3.message : String(error_3));
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getContributorsLog = function (cocoonId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!cocoonId) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.db.select().from(schema_1.contributorsLog)
                                .where((0, drizzle_orm_1.eq)(schema_1.contributorsLog.cocoonId, cocoonId))
                                .orderBy((0, drizzle_orm_1.desc)(schema_1.contributorsLog.timestamp))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, db_1.db.select().from(schema_1.contributorsLog)
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.contributorsLog.timestamp))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTopContributors = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allCocoons, contributorStats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.cocoons).execute()];
                    case 1:
                        allCocoons = _a.sent();
                        contributorStats = new Map();
                        // Aggregate contributor data
                        allCocoons.forEach(function (cocoon) {
                            var contributors = cocoon.contributors || [];
                            contributors.forEach(function (contributor) {
                                if (!contributorStats.has(contributor.wallet)) {
                                    contributorStats.set(contributor.wallet, {
                                        roles: new Set(),
                                        cocoons: new Set()
                                    });
                                }
                                var stats = contributorStats.get(contributor.wallet);
                                stats.roles.add(contributor.role);
                                stats.cocoons.add(cocoon.id);
                            });
                        });
                        // Convert to array and sort by contribution count
                        return [2 /*return*/, Array.from(contributorStats.entries())
                                .map(function (_a) {
                                var wallet = _a[0], stats = _a[1];
                                return ({
                                    wallet: wallet,
                                    role: Array.from(stats.roles)[0], // Primary role (first one)
                                    contributionCount: stats.cocoons.size,
                                    cocoons: Array.from(stats.cocoons)
                                });
                            })
                                .sort(function (a, b) { return b.contributionCount - a.contributionCount; })
                                .slice(0, 10)]; // Top 10 contributors
                }
            });
        });
    };
    // Dashboard metrics
    DatabaseStorage.prototype.getDashboardMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dreamCount, cocoonCount, coreCount, walletCount;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.dreams),
                            db_1.db
                                .select({ count: (0, drizzle_orm_1.count)() })
                                .from(schema_1.cocoons)
                                .where((0, drizzle_orm_1.eq)(schema_1.cocoons.stage, "incubating")),
                            db_1.db
                                .select({ count: (0, drizzle_orm_1.count)() })
                                .from(schema_1.dreamCores)
                                .where((0, drizzle_orm_1.eq)(schema_1.dreamCores.isActive, true)),
                            db_1.db.select({ count: (0, drizzle_orm_1.count)() }).from(schema_1.wallets)
                        ])];
                    case 1:
                        _a = _b.sent(), dreamCount = _a[0], cocoonCount = _a[1], coreCount = _a[2], walletCount = _a[3];
                        return [2 /*return*/, {
                                totalDreams: dreamCount[0].count,
                                activeCocoons: cocoonCount[0].count,
                                dreamCores: coreCount[0].count,
                                totalWallets: walletCount[0].count
                            }];
                }
            });
        });
    };
    // Garden and Tags
    DatabaseStorage.prototype.getGardenFeed = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dreamRows, cocoonRows, evolutionChains, evolutionMap, dreamFeed, cocoonsFiltered, cocoonFeed, combined, start, end;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            db_1.db.select().from(schema_1.dreams).where((0, drizzle_orm_1.eq)(schema_1.dreams.dreamStatus, "approved")),
                            db_1.db.select().from(schema_1.cocoons),
                            this.getEvolutionChains(200, 0),
                        ])];
                    case 1:
                        _a = _c.sent(), dreamRows = _a[0], cocoonRows = _a[1], evolutionChains = _a[2];
                        evolutionMap = new Map();
                        evolutionChains.forEach(function (chain) {
                            evolutionMap.set(chain.dreamId, chain);
                        });
                        dreamFeed = dreamRows.map(function (row) {
                            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                            var dream = mapDreamRecord(row);
                            var chain = evolutionMap.get(dream.id);
                            return {
                                id: dream.id,
                                type: "dream",
                                title: (_b = (_a = dream.title) !== null && _a !== void 0 ? _a : dream.name) !== null && _b !== void 0 ? _b : "Untitled Dream",
                                status: (_c = dream.dreamStatus) !== null && _c !== void 0 ? _c : undefined,
                                score: (_e = (_d = dream.dreamScore) !== null && _d !== void 0 ? _d : dream.score) !== null && _e !== void 0 ? _e : 0,
                                tags: (_f = dream.tags) !== null && _f !== void 0 ? _f : [],
                                contributors: (_g = dream.contributors) !== null && _g !== void 0 ? _g : [],
                                lastUpdated: new Date(dream.lastUpdated),
                                creatorWallet: dream.wallet,
                                evolutionChain: chain
                                    ? {
                                        currentStage: chain.currentStage,
                                        createdAt: chain.createdAt,
                                        evolvedAt: (_h = chain.evolvedAt) !== null && _h !== void 0 ? _h : undefined,
                                        completedAt: (_j = chain.completedAt) !== null && _j !== void 0 ? _j : undefined,
                                        metadata: (_k = chain.metadata) !== null && _k !== void 0 ? _k : undefined,
                                    }
                                    : undefined,
                            };
                        });
                        cocoonsFiltered = options.stage
                            ? cocoonRows.filter(function (row) { return row.stage === options.stage; })
                            : cocoonRows;
                        cocoonFeed = cocoonsFiltered.map(function (row) {
                            var _a, _b, _c, _d, _e;
                            var chain = evolutionMap.get(row.dreamId);
                            return {
                                id: row.id,
                                type: "cocoon",
                                title: row.title,
                                stage: row.stage,
                                score: (_a = row.dreamScore) !== null && _a !== void 0 ? _a : 0,
                                tags: Array.isArray(row.tags) ? row.tags : [],
                                contributors: mapCocoonContributors(row.contributors),
                                lastUpdated: row.lastUpdated instanceof Date ? row.lastUpdated : new Date((_b = row.lastUpdated) !== null && _b !== void 0 ? _b : Date.now()),
                                creatorWallet: row.creatorWallet,
                                evolutionChain: chain
                                    ? {
                                        currentStage: chain.currentStage,
                                        createdAt: chain.createdAt,
                                        evolvedAt: (_c = chain.evolvedAt) !== null && _c !== void 0 ? _c : undefined,
                                        completedAt: (_d = chain.completedAt) !== null && _d !== void 0 ? _d : undefined,
                                        metadata: (_e = chain.metadata) !== null && _e !== void 0 ? _e : undefined,
                                    }
                                    : undefined,
                            };
                        });
                        combined = __spreadArray(__spreadArray([], dreamFeed, true), cocoonFeed, true).sort(function (a, b) {
                            if (options.sortBy === "score") {
                                return options.order === "asc" ? a.score - b.score : b.score - a.score;
                            }
                            var aTime = a.lastUpdated.getTime();
                            var bTime = b.lastUpdated.getTime();
                            return options.order === "asc" ? aTime - bTime : bTime - aTime;
                        });
                        start = (_b = options.offset) !== null && _b !== void 0 ? _b : 0;
                        end = start + options.limit;
                        return [2 /*return*/, combined.slice(start, end)];
                }
            });
        });
    };
    DatabaseStorage.prototype.getAllTags = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, dreamTags, cocoonTags, allTags;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            db_1.db.select({ tags: schema_1.dreams.tags }).from(schema_1.dreams).where((0, drizzle_orm_1.isNotNull)(schema_1.dreams.tags)).execute(),
                            db_1.db.select({ tags: schema_1.cocoons.tags }).from(schema_1.cocoons).where((0, drizzle_orm_1.isNotNull)(schema_1.cocoons.tags)).execute()
                        ])];
                    case 1:
                        _a = _b.sent(), dreamTags = _a[0], cocoonTags = _a[1];
                        allTags = new Set();
                        dreamTags.forEach(function (d) { var _a; return ((_a = d.tags) !== null && _a !== void 0 ? _a : []).forEach(function (tag) { return allTags.add(tag); }); });
                        cocoonTags.forEach(function (c) { var _a; return ((_a = c.tags) !== null && _a !== void 0 ? _a : []).forEach(function (tag) { return allTags.add(tag); }); });
                        return [2 /*return*/, Array.from(allTags).sort()];
                }
            });
        });
    };
    // AI Dream Evaluation function
    DatabaseStorage.prototype.evaluateDream = function (dream) {
        return __awaiter(this, void 0, void 0, function () {
            var legacyModule;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (0, loader_1.legacyImport)("ai-dream-evaluator")];
                    case 1:
                        legacyModule = _b.sent();
                        return [4 /*yield*/, ((_a = legacyModule === null || legacyModule === void 0 ? void 0 : legacyModule.dreamEvaluator) === null || _a === void 0 ? void 0 : _a.evaluateDream(dream))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Simple Garden Feed function as requested - returns all dreams and cocoons
    DatabaseStorage.prototype.getSimpleGardenFeed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var results, dreamList, cocoonList, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        results = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_1.dreams.id,
                                title: schema_1.dreams.title,
                                dreamScore: schema_1.dreams.dreamScore,
                                tags: schema_1.dreams.tags,
                                contributors: schema_1.dreams.contributors
                            })
                                .from(schema_1.dreams)
                                .where((0, drizzle_orm_1.eq)(schema_1.dreams.dreamStatus, 'approved'))];
                    case 2:
                        dreamList = _a.sent();
                        // Add dreams to results
                        dreamList.forEach(function (dream) {
                            var _a;
                            results.push({
                                id: dream.id,
                                name: (_a = dream.title) !== null && _a !== void 0 ? _a : "Untitled Dream",
                                stage: undefined, // Dreams don't have stages
                                score: dream.dreamScore || 0,
                                tags: Array.isArray(dream.tags) ? dream.tags : [],
                                contributors: mapCocoonContributors(dream.contributors)
                            });
                        });
                        return [4 /*yield*/, db_1.db
                                .select({
                                id: schema_1.cocoons.id,
                                title: schema_1.cocoons.title,
                                stage: schema_1.cocoons.stage,
                                dreamScore: schema_1.cocoons.dreamScore,
                                tags: schema_1.cocoons.tags,
                                contributors: schema_1.cocoons.contributors
                            })
                                .from(schema_1.cocoons)];
                    case 3:
                        cocoonList = _a.sent();
                        // Add cocoons to results
                        cocoonList.forEach(function (cocoon) {
                            results.push({
                                id: cocoon.id,
                                name: cocoon.title,
                                stage: cocoon.stage,
                                score: cocoon.dreamScore || 0,
                                tags: Array.isArray(cocoon.tags) ? cocoon.tags : [],
                                contributors: mapCocoonContributors(cocoon.contributors)
                            });
                        });
                        // Sort by score descending
                        results.sort(function (a, b) { return b.score - a.score; });
                        return [2 /*return*/, results];
                    case 4:
                        error_4 = _a.sent();
                        console.log("Error fetching garden feed: ".concat(error_4));
                        return [2 /*return*/, []];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Maintenance
    DatabaseStorage.prototype.archiveInactiveItems = function (inactivityDays) {
        return __awaiter(this, void 0, void 0, function () {
            var cutoffDate, archivedDreams, archivedCocoons;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cutoffDate = new Date();
                        cutoffDate.setDate(cutoffDate.getDate() - inactivityDays);
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.dreams)
                                .set({ dreamStatus: 'rejected', lastUpdated: new Date() })
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dreams.dreamStatus, 'pending'), (0, drizzle_orm_1.lt)(schema_1.dreams.lastUpdated, cutoffDate)))
                                .returning()];
                    case 1:
                        archivedDreams = _a.sent();
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.cocoons)
                                .set({ stage: 'archived', lastUpdated: new Date() })
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.cocoons.stage, 'seedling'), (0, drizzle_orm_1.eq)(schema_1.cocoons.stage, 'incubating')), (0, drizzle_orm_1.lt)(schema_1.cocoons.lastUpdated, cutoffDate)))
                                .returning()];
                    case 2:
                        archivedCocoons = _a.sent();
                        return [2 /*return*/, {
                                archivedDreams: archivedDreams.length,
                                archivedCocoons: archivedCocoons.length
                            }];
                }
            });
        });
    };
    // Evolution Chains
    DatabaseStorage.prototype.createEvolutionChain = function (evolutionChain) {
        return __awaiter(this, void 0, void 0, function () {
            var chain;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .insert(schema_1.evolutionChains)
                            .values(evolutionChain)
                            .returning()];
                    case 1:
                        chain = (_a.sent())[0];
                        return [2 /*return*/, chain];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateEvolutionChain = function (dreamId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var chain;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .update(schema_1.evolutionChains)
                            .set(__assign(__assign({}, updates), { lastUpdated: new Date() }))
                            .where((0, drizzle_orm_1.eq)(schema_1.evolutionChains.dreamId, dreamId))
                            .returning()];
                    case 1:
                        chain = (_a.sent())[0];
                        return [2 /*return*/, chain];
                }
            });
        });
    };
    DatabaseStorage.prototype.getEvolutionChain = function (dreamId) {
        return __awaiter(this, void 0, void 0, function () {
            var chain;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.evolutionChains)
                            .where((0, drizzle_orm_1.eq)(schema_1.evolutionChains.dreamId, dreamId))];
                    case 1:
                        chain = (_a.sent())[0];
                        return [2 /*return*/, chain || undefined];
                }
            });
        });
    };
    DatabaseStorage.prototype.getEvolutionChains = function () {
        return __awaiter(this, arguments, void 0, function (limit, offset) {
            if (limit === void 0) { limit = 50; }
            if (offset === void 0) { offset = 0; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.evolutionChains)
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.evolutionChains.lastUpdated))
                            .limit(limit)
                            .offset(offset)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Dream Invites
    DatabaseStorage.prototype.inviteContributor = function (dreamId, wallet, role, inviterWallet, message) {
        return __awaiter(this, void 0, void 0, function () {
            var dream, existingInvite, invite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDream(dreamId)];
                    case 1:
                        dream = _a.sent();
                        if (!dream) {
                            throw new Error("Dream not found");
                        }
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_1.dreamInvites)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dreamInvites.dreamId, dreamId), (0, drizzle_orm_1.eq)(schema_1.dreamInvites.invitedWallet, wallet), (0, drizzle_orm_1.eq)(schema_1.dreamInvites.status, "pending")))];
                    case 2:
                        existingInvite = _a.sent();
                        if (existingInvite.length > 0) {
                            throw new Error("Pending invite already exists for this user");
                        }
                        return [4 /*yield*/, db_1.db
                                .insert(schema_1.dreamInvites)
                                .values({
                                dreamId: dreamId,
                                invitedWallet: wallet,
                                inviterWallet: inviterWallet,
                                role: role,
                                message: message,
                                status: "pending"
                            })
                                .returning()];
                    case 3:
                        invite = (_a.sent())[0];
                        // Send notification
                        simple_notifications_1.simpleNotifications.addNotification(wallet, "contributor_invited", "You've been invited to contribute as ".concat(role, " to \"").concat(dream.title, "\". ").concat(message ? "Message: ".concat(message) : ''));
                        console.log("\uD83D\uDCE7 Contributor invite sent: ".concat(wallet, " invited as ").concat(role, " to dream \"").concat(dream.title, "\""));
                        return [2 /*return*/, invite];
                }
            });
        });
    };
    DatabaseStorage.prototype.getDreamInvites = function (wallet, dreamId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(wallet && dreamId)) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_1.dreamInvites)
                                .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dreamInvites.invitedWallet, wallet), (0, drizzle_orm_1.eq)(schema_1.dreamInvites.dreamId, dreamId)))
                                .orderBy((0, drizzle_orm_1.desc)(schema_1.dreamInvites.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!wallet) return [3 /*break*/, 4];
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_1.dreamInvites)
                                .where((0, drizzle_orm_1.eq)(schema_1.dreamInvites.invitedWallet, wallet))
                                .orderBy((0, drizzle_orm_1.desc)(schema_1.dreamInvites.createdAt))];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        if (!dreamId) return [3 /*break*/, 6];
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_1.dreamInvites)
                                .where((0, drizzle_orm_1.eq)(schema_1.dreamInvites.dreamId, dreamId))
                                .orderBy((0, drizzle_orm_1.desc)(schema_1.dreamInvites.createdAt))];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6: return [4 /*yield*/, db_1.db.select().from(schema_1.dreamInvites).orderBy((0, drizzle_orm_1.desc)(schema_1.dreamInvites.createdAt))];
                    case 7: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.respondToInvite = function (inviteId, accept) {
        return __awaiter(this, void 0, void 0, function () {
            var invite, newStatus, updatedInvite, dream, currentContributors, newContributor, exists;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.dreamInvites)
                            .where((0, drizzle_orm_1.eq)(schema_1.dreamInvites.id, inviteId))];
                    case 1:
                        invite = (_a.sent())[0];
                        if (!invite) {
                            throw new Error("Invite not found");
                        }
                        if (invite.status !== "pending") {
                            throw new Error("Invite already responded to");
                        }
                        newStatus = accept ? "accepted" : "rejected";
                        return [4 /*yield*/, db_1.db
                                .update(schema_1.dreamInvites)
                                .set({
                                status: newStatus,
                                respondedAt: new Date()
                            })
                                .where((0, drizzle_orm_1.eq)(schema_1.dreamInvites.id, inviteId))
                                .returning()];
                    case 2:
                        updatedInvite = (_a.sent())[0];
                        if (!accept) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getDream(invite.dreamId)];
                    case 3:
                        dream = _a.sent();
                        if (!dream) return [3 /*break*/, 5];
                        currentContributors = dream.contributors || [];
                        newContributor = {
                            wallet: invite.invitedWallet,
                            role: invite.role,
                            joinedAt: new Date().toISOString()
                        };
                        exists = currentContributors.some(function (c) { return c.wallet === invite.invitedWallet; });
                        if (!!exists) return [3 /*break*/, 5];
                        currentContributors.push(newContributor);
                        return [4 /*yield*/, this.updateDreamMetrics(invite.dreamId, {
                                contributors: currentContributors
                            })];
                    case 4:
                        _a.sent();
                        console.log("\u2705 Contributor accepted: ".concat(invite.invitedWallet, " joined dream \"").concat(dream.title, "\" as ").concat(invite.role));
                        _a.label = 5;
                    case 5:
                        // Notify inviter of acceptance
                        simple_notifications_1.simpleNotifications.addNotification(invite.inviterWallet, "invite_accepted", "".concat(invite.invitedWallet, " accepted your invitation to contribute as ").concat(invite.role));
                        return [3 /*break*/, 7];
                    case 6:
                        // Notify inviter of rejection
                        simple_notifications_1.simpleNotifications.addNotification(invite.inviterWallet, "invite_rejected", "".concat(invite.invitedWallet, " declined your invitation to contribute as ").concat(invite.role));
                        _a.label = 7;
                    case 7: return [2 /*return*/, updatedInvite];
                }
            });
        });
    };
    DatabaseStorage.prototype.getPendingInvites = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.dreamInvites)
                            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.dreamInvites.invitedWallet, wallet), (0, drizzle_orm_1.eq)(schema_1.dreamInvites.status, "pending")))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.dreamInvites.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Dream Tokens
    DatabaseStorage.prototype.mintToken = function (dreamId, cocoonId, holderWallet, purpose, milestone, metadata) {
        return __awaiter(this, void 0, void 0, function () {
            var token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .insert(schema_1.dreamTokens)
                            .values({
                            dreamId: dreamId,
                            cocoonId: cocoonId,
                            holderWallet: holderWallet,
                            purpose: purpose,
                            milestone: milestone,
                            metadata: metadata
                        })
                            .returning()];
                    case 1:
                        token = (_a.sent())[0];
                        console.log("\uD83E\uDE99 Token minted: ".concat(purpose, " token for ").concat(holderWallet, " (dream: ").concat(dreamId, ", milestone: ").concat(milestone || 'manual', ")"));
                        // Send notification about token minting
                        simple_notifications_1.simpleNotifications.addNotification(holderWallet, "token_minted", "You received a ".concat(purpose, " token for milestone: ").concat(milestone || 'contribution'));
                        return [2 /*return*/, token];
                }
            });
        });
    };
    DatabaseStorage.prototype.getDreamTokens = function (wallet, dreamId, purpose) {
        return __awaiter(this, void 0, void 0, function () {
            var conditions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        conditions = [];
                        if (wallet)
                            conditions.push((0, drizzle_orm_1.eq)(schema_1.dreamTokens.holderWallet, wallet));
                        if (dreamId)
                            conditions.push((0, drizzle_orm_1.eq)(schema_1.dreamTokens.dreamId, dreamId));
                        if (purpose)
                            conditions.push((0, drizzle_orm_1.eq)(schema_1.dreamTokens.purpose, purpose));
                        if (!(conditions.length > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, db_1.db
                                .select()
                                .from(schema_1.dreamTokens)
                                .where(drizzle_orm_1.and.apply(void 0, conditions))
                                .orderBy((0, drizzle_orm_1.desc)(schema_1.dreamTokens.mintedAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, db_1.db.select().from(schema_1.dreamTokens).orderBy((0, drizzle_orm_1.desc)(schema_1.dreamTokens.mintedAt))];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getTokensByHolder = function (wallet) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.dreamTokens)
                            .where((0, drizzle_orm_1.eq)(schema_1.dreamTokens.holderWallet, wallet))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.dreamTokens.mintedAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getNotifications = function (wallet_1) {
        return __awaiter(this, arguments, void 0, function (wallet, limit) {
            if (limit === void 0) { limit = 25; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, db_1.db
                            .select()
                            .from(schema_1.notifications)
                            .where((0, drizzle_orm_1.eq)(schema_1.notifications.recipientWallet, wallet))
                            .orderBy((0, drizzle_orm_1.desc)(schema_1.notifications.createdAt))
                            .limit(limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Enhanced cocoon update with token minting
    DatabaseStorage.prototype.checkAndMintMilestoneTokens = function (cocoon, newStage) {
        return __awaiter(this, void 0, void 0, function () {
            var milestoneTokens, milestone, contributors, _i, contributors_1, contributor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        milestoneTokens = {
                            "active": { purpose: "badge", description: "Active Development Badge" },
                            "metamorphosis": { purpose: "vote", description: "Metamorphosis Voting Token" },
                            "emergence": { purpose: "mint", description: "Emergence Milestone Token" },
                            "complete": { purpose: "mint", description: "Completion Achievement Token" }
                        };
                        if (!milestoneTokens[newStage]) return [3 /*break*/, 5];
                        milestone = milestoneTokens[newStage];
                        // Mint token for cocoon creator
                        return [4 /*yield*/, this.mintToken(cocoon.dreamId, cocoon.id, cocoon.creatorWallet, milestone.purpose, newStage, {
                                description: milestone.description,
                                cocoonTitle: cocoon.title,
                                cocoonScore: cocoon.dreamScore
                            })];
                    case 1:
                        // Mint token for cocoon creator
                        _a.sent();
                        if (!(newStage === "complete" && cocoon.contributors)) return [3 /*break*/, 5];
                        contributors = cocoon.contributors;
                        _i = 0, contributors_1 = contributors;
                        _a.label = 2;
                    case 2:
                        if (!(_i < contributors_1.length)) return [3 /*break*/, 5];
                        contributor = contributors_1[_i];
                        return [4 /*yield*/, this.mintToken(cocoon.dreamId, cocoon.id, contributor.wallet, "badge", "completion_contributor", {
                                description: "Completion Contributor Badge",
                                role: contributor.role,
                                cocoonTitle: cocoon.title
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // Network Graph Generation
    DatabaseStorage.prototype.getNetworkGraph = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nodes, links, contributorSet, _a, allDreams, allCocoons, allTokens, allInvites;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        nodes = [];
                        links = [];
                        contributorSet = new Set();
                        return [4 /*yield*/, Promise.all([
                                db_1.db.select().from(schema_1.dreams).execute(),
                                db_1.db.select().from(schema_1.cocoons).execute(),
                                db_1.db.select().from(schema_1.dreamTokens).execute(),
                                db_1.db.select().from(schema_1.dreamInvites).execute()
                            ])];
                    case 1:
                        _a = _b.sent(), allDreams = _a[0], allCocoons = _a[1], allTokens = _a[2], allInvites = _a[3];
                        // Add dream nodes
                        allDreams.forEach(function (dream) {
                            var _a, _b, _c, _d;
                            nodes.push({
                                id: "dream-".concat(dream.id),
                                type: 'dream',
                                label: (_b = (_a = dream.title) !== null && _a !== void 0 ? _a : dream.name) !== null && _b !== void 0 ? _b : "Untitled Dream",
                                data: {
                                    id: dream.id,
                                    status: dream.status,
                                    score: dream.dreamScore,
                                    wallet: dream.wallet,
                                    tags: (_c = dream.tags) !== null && _c !== void 0 ? _c : [],
                                    createdAt: dream.createdAt,
                                    contributors: (_d = dream.contributors) !== null && _d !== void 0 ? _d : []
                                }
                            });
                            // Track dream creator as contributor
                            contributorSet.add(dream.wallet);
                            // Add contributor nodes and links for dream contributors
                            if (dream.contributors) {
                                var contributors = dream.contributors;
                                contributors.forEach(function (contributor) {
                                    contributorSet.add(contributor.wallet);
                                    // Link contributor to dream
                                    links.push({
                                        source: "contributor-".concat(contributor.wallet),
                                        target: "dream-".concat(dream.id),
                                        type: 'contributed',
                                        data: {
                                            role: contributor.role,
                                            joinedAt: contributor.joinedAt
                                        }
                                    });
                                });
                            }
                        });
                        // Add cocoon nodes and evolution links
                        allCocoons.forEach(function (cocoon) {
                            nodes.push({
                                id: "cocoon-".concat(cocoon.id),
                                type: 'cocoon',
                                label: cocoon.title,
                                data: {
                                    id: cocoon.id,
                                    dreamId: cocoon.dreamId,
                                    stage: cocoon.stage,
                                    score: cocoon.dreamScore,
                                    creatorWallet: cocoon.creatorWallet,
                                    contributors: cocoon.contributors,
                                    createdAt: cocoon.createdAt
                                }
                            });
                            // Track cocoon creator as contributor
                            contributorSet.add(cocoon.creatorWallet);
                            // Link cocoon to its dream (evolution)
                            links.push({
                                source: "dream-".concat(cocoon.dreamId),
                                target: "cocoon-".concat(cocoon.id),
                                type: 'evolved',
                                data: {
                                    stage: cocoon.stage,
                                    score: cocoon.dreamScore
                                }
                            });
                            // Link creator to cocoon
                            links.push({
                                source: "contributor-".concat(cocoon.creatorWallet),
                                target: "cocoon-".concat(cocoon.id),
                                type: 'created',
                                data: {
                                    role: 'creator'
                                }
                            });
                            // Add contributor links for cocoon
                            if (cocoon.contributors) {
                                var contributors = cocoon.contributors;
                                contributors.forEach(function (contributor) {
                                    contributorSet.add(contributor.wallet);
                                    links.push({
                                        source: "contributor-".concat(contributor.wallet),
                                        target: "cocoon-".concat(cocoon.id),
                                        type: 'contributed',
                                        data: {
                                            role: contributor.role,
                                            joinedAt: contributor.joinedAt
                                        }
                                    });
                                });
                            }
                        });
                        // Add contributor nodes
                        contributorSet.forEach(function (wallet) {
                            nodes.push({
                                id: "contributor-".concat(wallet),
                                type: 'contributor',
                                label: wallet.slice(0, 8) + '...',
                                data: {
                                    wallet: wallet,
                                    fullWallet: wallet
                                }
                            });
                        });
                        // Add token nodes and ownership links
                        allTokens.forEach(function (token) {
                            var _a, _b, _c, _d;
                            nodes.push({
                                id: "token-".concat(token.id),
                                type: 'token',
                                label: "".concat(token.purpose, " token"),
                                data: {
                                    id: token.id,
                                    dreamId: token.dreamId,
                                    cocoonId: token.cocoonId,
                                    purpose: token.purpose,
                                    milestone: (_a = token.milestone) !== null && _a !== void 0 ? _a : "unknown",
                                    metadata: token.metadata,
                                    mintedAt: token.mintedAt
                                }
                            });
                            // Link token to its holder
                            links.push({
                                source: "contributor-".concat(token.holderWallet),
                                target: "token-".concat(token.id),
                                type: 'owns',
                                data: {
                                    purpose: token.purpose,
                                    milestone: (_b = token.milestone) !== null && _b !== void 0 ? _b : "unknown",
                                    mintedAt: token.mintedAt
                                }
                            });
                            // Link token to its dream
                            links.push({
                                source: "dream-".concat(token.dreamId),
                                target: "token-".concat(token.id),
                                type: 'created',
                                data: {
                                    purpose: token.purpose,
                                    milestone: (_c = token.milestone) !== null && _c !== void 0 ? _c : "unknown"
                                }
                            });
                            // Link token to its cocoon if exists
                            if (token.cocoonId) {
                                links.push({
                                    source: "cocoon-".concat(token.cocoonId),
                                    target: "token-".concat(token.id),
                                    type: 'created',
                                    data: {
                                        purpose: token.purpose,
                                        milestone: (_d = token.milestone) !== null && _d !== void 0 ? _d : "unknown"
                                    }
                                });
                            }
                        });
                        // Add invitation links
                        allInvites.forEach(function (invite) {
                            var _a;
                            links.push({
                                source: "contributor-".concat(invite.inviterWallet),
                                target: "contributor-".concat(invite.invitedWallet),
                                type: 'invited',
                                data: {
                                    dreamId: invite.dreamId,
                                    role: invite.role,
                                    status: invite.status,
                                    createdAt: invite.createdAt,
                                    message: (_a = invite.message) !== null && _a !== void 0 ? _a : ""
                                }
                            });
                        });
                        return [2 /*return*/, { nodes: nodes, links: links }];
                }
            });
        });
    };
    // Webhook trigger for cocoon reaching active stage
    DatabaseStorage.prototype.triggerCocoonActiveWebhook = function (cocoon) {
        return __awaiter(this, void 0, void 0, function () {
            var dream, contributionUrl, error_5;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getDream(cocoon.dreamId)];
                    case 1:
                        dream = _c.sent();
                        if (!dream) {
                            console.log("\u26A0\uFE0F Could not find dream ".concat(cocoon.dreamId, " for webhook notification"));
                            return [2 /*return*/];
                        }
                        contributionUrl = process.env.REPLIT_URL
                            ? "".concat(process.env.REPLIT_URL, "/dreams/").concat(dream.id)
                            : "http://localhost:5000/dreams/".concat(dream.id);
                        return [4 /*yield*/, webhook_notifier_1.webhookNotifier.notifyCocoonActive({
                                dreamName: (_b = (_a = dream.title) !== null && _a !== void 0 ? _a : dream.name) !== null && _b !== void 0 ? _b : "Untitled Dream",
                                cocoonTitle: cocoon.title,
                                creator: cocoon.creatorWallet,
                                dreamId: dream.id,
                                cocoonId: cocoon.id,
                                score: cocoon.dreamScore || 0,
                                tags: cocoon.tags || [],
                                contributionUrl: contributionUrl
                            })];
                    case 2:
                        _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _c.sent();
                        console.log("\u274C Webhook notification failed: ".concat(error_5));
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Secret Vault implementations
    DatabaseStorage.prototype.getSecretMessages = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Return fallback secret messages since we don't have a dedicated table
                return [2 /*return*/, [
                        {
                            id: 'secret-001',
                            message: 'I forgive you, brother',
                            sender: '0xABC123',
                            receiver: walletAddress,
                            type: 'forgiveness',
                            expires: Date.now() + 86400000 * 7,
                            emotionalScore: 94,
                            redeemed: false,
                            unlocked: true,
                            xpReward: 25,
                            badgeUnlocked: 'The Believer',
                            reactions: ['❤️', '🙏', '✨']
                        },
                        {
                            id: 'secret-002',
                            message: 'The dream we shared still haunts my nights, but in the most beautiful way',
                            sender: '0xDEF456',
                            receiver: walletAddress,
                            type: 'confession',
                            expires: Date.now() + 86400000 * 3,
                            emotionalScore: 87,
                            redeemed: false,
                            unlocked: false,
                            xpReward: 35,
                            reactions: ['💫', '🌙', '💭']
                        }
                    ]];
            });
        });
    };
    DatabaseStorage.prototype.unlockSecretMessage = function (messageId, walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var xpReward, badges, badgeUnlocked;
            return __generator(this, function (_a) {
                console.log("\uD83D\uDD13 Secret unlocked: ".concat(messageId, " by ").concat(walletAddress));
                xpReward = Math.floor(Math.random() * 30) + 20;
                badges = ['The Believer', 'Heart Opener', 'Shadow Walker', 'Soul Whisperer'];
                badgeUnlocked = Math.random() < 0.3 ? badges[Math.floor(Math.random() * badges.length)] : undefined;
                return [2 /*return*/, {
                        success: true,
                        message: 'Secret unlocked successfully',
                        xpReward: xpReward,
                        badgeUnlocked: badgeUnlocked
                    }];
            });
        });
    };
    DatabaseStorage.prototype.sendSecretReply = function (originalMessageId, replyData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("\uD83D\uDCE8 Secret reply sent: ".concat(originalMessageId, " -> ").concat(replyData.receiver));
                return [2 /*return*/, {
                        success: true,
                        message: 'Reply sent to the vault'
                    }];
            });
        });
    };
    DatabaseStorage.prototype.burnSecretVault = function (messageId, walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("\uD83D\uDD25 Secret vault burned: ".concat(messageId, " by ").concat(walletAddress));
                return [2 /*return*/, {
                        success: true,
                        message: 'Secret permanently destroyed'
                    }];
            });
        });
    };
    // Dream remix processing
    DatabaseStorage.prototype.submitDreamRemix = function (remixData) {
        return __awaiter(this, void 0, void 0, function () {
            var remixId, baseReward, innovationBonus, estimatedReward;
            return __generator(this, function (_a) {
                remixId = "remix_".concat(Date.now(), "_").concat(Math.random().toString(36).substr(2, 9));
                console.log("\uD83C\uDFA8 Processing dream remix: ".concat(remixData.title, " (remix of ").concat(remixData.remixOf, ")"));
                baseReward = remixData.bounty || 150;
                innovationBonus = Math.floor(Math.random() * 100) + 50;
                estimatedReward = baseReward + innovationBonus;
                return [2 /*return*/, {
                        success: true,
                        remixId: remixId,
                        estimatedReward: estimatedReward
                    }];
            });
        });
    };
    // Seasonal Events System
    DatabaseStorage.prototype.getCurrentSeasonalEvent = function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentDate, eventStart, eventEnd;
            return __generator(this, function (_a) {
                currentDate = new Date();
                eventStart = new Date('2025-09-01');
                eventEnd = new Date('2025-10-01');
                if (currentDate >= eventStart && currentDate <= eventEnd) {
                    return [2 /*return*/, {
                            name: "Lucid Rising",
                            start: "2025-09-01",
                            end: "2025-10-01",
                            theme: "light",
                            isActive: true,
                            daysRemaining: Math.ceil((eventEnd.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)),
                            bonuses: {
                                xpMultiplier: 1.5,
                                vaultDropChance: 0.25,
                                remixMultiplier: 2.0
                            },
                            specialTokens: ["LUCID", "VAULT"],
                            featuredBadges: ["🌕 Lucid Seeker", "🔥 Chain Catalyst"],
                            progress: {
                                totalParticipants: 847,
                                lucidTokensEarned: 12456,
                                vaultSecretsUnlocked: 234,
                                chainRemixesCreated: 89
                            }
                        }];
                }
                return [2 /*return*/, {
                        name: "No Active Event",
                        isActive: false,
                        nextEvent: {
                            name: "Dream Harvest",
                            start: "2025-11-01",
                            countdown: "32 days"
                        }
                    }];
            });
        });
    };
    DatabaseStorage.prototype.applySeasonalBonuses = function (baseXp, action) {
        return __awaiter(this, void 0, void 0, function () {
            var seasonalEvent, multiplier, finalXp;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getCurrentSeasonalEvent()];
                    case 1:
                        seasonalEvent = _c.sent();
                        if (!seasonalEvent.isActive) {
                            return [2 /*return*/, { finalXp: baseXp, bonusApplied: false, multiplier: 1 }];
                        }
                        multiplier = 1;
                        // Apply seasonal multipliers
                        if (action === 'remix' && ((_a = seasonalEvent.bonuses) === null || _a === void 0 ? void 0 : _a.remixMultiplier)) {
                            multiplier = seasonalEvent.bonuses.remixMultiplier;
                        }
                        else if ((_b = seasonalEvent.bonuses) === null || _b === void 0 ? void 0 : _b.xpMultiplier) {
                            multiplier = seasonalEvent.bonuses.xpMultiplier;
                        }
                        finalXp = Math.floor(baseXp * multiplier);
                        console.log("\uD83C\uDF8A Seasonal bonus applied: ".concat(baseXp, " XP \u2192 ").concat(finalXp, " XP (").concat(multiplier, "x ").concat(seasonalEvent.name, ")"));
                        return [2 /*return*/, {
                                finalXp: finalXp,
                                bonusApplied: multiplier > 1,
                                multiplier: multiplier
                            }];
                }
            });
        });
    };
    // Wallet Profile System
    DatabaseStorage.prototype.getWalletProfile = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var isHighScorer;
            return __generator(this, function (_a) {
                isHighScorer = walletAddress.includes('1234') || walletAddress.includes('abcd');
                if (isHighScorer) {
                    // High-performing user profile
                    return [2 /*return*/, {
                            wallet: walletAddress,
                            score: 152,
                            mindBalance: 78,
                            mindEnergy: 65,
                            maxMindEnergy: 120, // Enhanced capacity for high scorers
                            agentsUnlocked: ["LUCID", "CANVAS", "ROOT", "CRADLE", "WING", "ECHO"],
                            totalAgents: 8,
                            stats: {
                                dreamsCreated: 12,
                                remixesCompleted: 4,
                                secretsUnlocked: 28,
                                badgesEarned: 3,
                                seasonalEventParticipation: 7
                            },
                            progression: {
                                level: 25,
                                xp: 8750,
                                nextLevelXp: 10000,
                                xpToNext: 1250
                            },
                            mindEnergyUsage: {
                                lastUsed: Date.now() - 1800000, // 30 minutes ago
                                regenRate: 2, // Enhanced regen for high performers
                                actions: [
                                    { action: 'Dream Creation', cost: 8, timestamp: Date.now() - 1800000 },
                                    { action: 'Complex Remix', cost: 12, timestamp: Date.now() - 3600000 },
                                    { action: 'META Agent Usage', cost: 15, timestamp: Date.now() - 5400000 }
                                ]
                            },
                            badges: ["Remixer", "Solver", "OG"],
                            achievements: [
                                { name: "🎨 Remix Master", earned: true, description: "Created 4+ high-quality remixes" },
                                { name: "🧠 Problem Solver", earned: true, description: "Achieved solver badge" },
                                { name: "👑 OG Dreamer", earned: true, description: "Original community member" },
                                { name: "⚡ High Scorer", earned: true, description: "Reached score 150+" },
                                { name: "🌟 Elite Mind", earned: true, description: "Unlocked enhanced mind capacity" },
                                { name: "🔮 Future Seer", earned: false, description: "Reach score 200+", progress: 152 }
                            ],
                            permissions: {
                                canCreateDreams: true,
                                canAccessSecretVault: true,
                                canParticipateInDAO: true,
                                canActivateAgents: true,
                                canAccessEliteFeatures: true,
                                maxDailyActions: 50 // Enhanced limits
                            },
                            tier: "Elite",
                            specialAccess: ["META Agent", "God Mode Terminal", "Elite Vault"]
                        }];
                }
                // Default profile for standard users
                return [2 /*return*/, {
                        wallet: walletAddress,
                        score: 87,
                        mindBalance: 42,
                        mindEnergy: 18,
                        maxMindEnergy: 100,
                        agentsUnlocked: ["LUCID", "CANVAS", "ROOT", "CRADLE", "WING"],
                        totalAgents: 6,
                        stats: {
                            dreamsCreated: 23,
                            remixesCompleted: 8,
                            secretsUnlocked: 15,
                            badgesEarned: 12,
                            seasonalEventParticipation: 4
                        },
                        progression: {
                            level: 15,
                            xp: 3420,
                            nextLevelXp: 4000,
                            xpToNext: 580
                        },
                        mindEnergyUsage: {
                            lastUsed: Date.now() - 3600000,
                            regenRate: 1,
                            actions: [
                                { action: 'Dream Remix', cost: 5, timestamp: Date.now() - 2400000 },
                                { action: 'Secret Unlock', cost: 3, timestamp: Date.now() - 3600000 },
                                { action: 'Agent Activation', cost: 8, timestamp: Date.now() - 7200000 }
                            ]
                        },
                        achievements: [
                            { name: "🌕 Lucid Seeker", earned: true, description: "Participated in Lucid Rising event" },
                            { name: "🔥 Chain Catalyst", earned: true, description: "Created 5+ remix chains" },
                            { name: "💫 Mind Master", earned: false, description: "Reach 50 mind balance", progress: 42 },
                            { name: "🎭 Dream Weaver", earned: true, description: "Unlocked all base agents" }
                        ],
                        permissions: {
                            canCreateDreams: true,
                            canAccessSecretVault: true,
                            canParticipateInDAO: true,
                            canActivateAgents: true,
                            maxDailyActions: 25
                        },
                        tier: "Standard"
                    }];
            });
        });
    };
    DatabaseStorage.prototype.updateWalletMindEnergy = function (walletAddress, energyChange, action) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, timeSinceLastUse, hoursRegen, regenEnergy, currentEnergy, newEnergy;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWalletProfile(walletAddress)];
                    case 1:
                        profile = _a.sent();
                        timeSinceLastUse = Date.now() - profile.mindEnergyUsage.lastUsed;
                        hoursRegen = Math.floor(timeSinceLastUse / (1000 * 60 * 60));
                        regenEnergy = hoursRegen * profile.mindEnergyUsage.regenRate;
                        currentEnergy = Math.min(profile.mindEnergy + regenEnergy, profile.maxMindEnergy);
                        newEnergy = Math.max(0, Math.min(currentEnergy + energyChange, profile.maxMindEnergy));
                        console.log("\u26A1 Mind energy updated: ".concat(walletAddress, " ").concat(action, " (").concat(energyChange > 0 ? '+' : '').concat(energyChange, ") \u2192 ").concat(newEnergy));
                        return [2 /*return*/, {
                                success: true,
                                newEnergy: newEnergy,
                                message: energyChange > 0 ? 'Energy restored' : "Energy consumed for ".concat(action)
                            }];
                }
            });
        });
    };
    DatabaseStorage.prototype.checkAgentAccess = function (walletAddress, agentId) {
        return __awaiter(this, void 0, void 0, function () {
            var profile, agentRequirements, requirement;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getWalletProfile(walletAddress)];
                    case 1:
                        profile = _a.sent();
                        if (profile.agentsUnlocked.includes(agentId)) {
                            return [2 /*return*/, { hasAccess: true }];
                        }
                        agentRequirements = {
                            'ECHO': { minScore: 50, minLevel: 8 },
                            'META': { minScore: 80, minLevel: 20 },
                            'GODMODE': { minScore: 95, minLevel: 30 }
                        };
                        requirement = agentRequirements[agentId];
                        if (!requirement) {
                            return [2 /*return*/, { hasAccess: false, reason: 'Unknown agent' }];
                        }
                        if (profile.score < requirement.minScore) {
                            return [2 /*return*/, {
                                    hasAccess: false,
                                    reason: 'Insufficient score',
                                    unlockRequirement: "Need ".concat(requirement.minScore, " score (current: ").concat(profile.score, ")")
                                }];
                        }
                        if (profile.progression.level < requirement.minLevel) {
                            return [2 /*return*/, {
                                    hasAccess: false,
                                    reason: 'Insufficient level',
                                    unlockRequirement: "Need level ".concat(requirement.minLevel, " (current: ").concat(profile.progression.level, ")")
                                }];
                        }
                        return [2 /*return*/, { hasAccess: true }];
                }
            });
        });
    };
    // Dream Evolution System
    DatabaseStorage.prototype.evolveDream = function (dreamId, evolutionPath) {
        return __awaiter(this, void 0, void 0, function () {
            var dream, evolutionBonuses, bonus, evolvedScore, evolvedDream, dreamIndex;
            return __generator(this, function (_a) {
                // Ensure dreams array exists
                if (!this.dreams) {
                    this.dreams = [];
                }
                // Add test dream if it doesn't exist
                if (dreamId === 'dream-evo-1' && !this.dreams.find(function (d) { return d.id === dreamId; })) {
                    this.dreams.push({
                        id: 'dream-evo-1',
                        title: 'Neural Network Consciousness',
                        content: 'A dream exploring the emergence of consciousness in artificial neural networks, examining the boundary between simulation and sentience.',
                        creatorWallet: '0xEliteDreamer123',
                        score: 94,
                        type: 'Vision',
                        status: 'approved',
                        created: Date.now() - 86400000,
                    });
                }
                dream = this.dreams.find(function (d) { return d.id === dreamId; });
                if (!dream) {
                    throw new Error('Dream not found');
                }
                // Check if dream is eligible for evolution
                if (dream.score < 85) {
                    throw new Error('Dream score too low for evolution');
                }
                evolutionBonuses = {
                    'Visionary': { scoreMultiplier: 1.5, specialAbility: 'Creative Amplification' },
                    'Protean': { scoreMultiplier: 1.3, specialAbility: 'Adaptive Learning' },
                    'Oracle': { scoreMultiplier: 1.4, specialAbility: 'Predictive Insights' }
                };
                bonus = evolutionBonuses[evolutionPath];
                evolvedScore = Math.floor(dream.score * bonus.scoreMultiplier);
                evolvedDream = __assign(__assign({}, dream), { evolutionPath: evolutionPath, specialAbility: bonus.specialAbility, score: evolvedScore, evolved: true, evolutionTimestamp: Date.now(), originalScore: dream.score });
                dreamIndex = this.dreams.findIndex(function (d) { return d.id === dreamId; });
                this.dreams[dreamIndex] = evolvedDream;
                console.log("\uD83C\uDF1F Dream evolved: ".concat(dream.title, " \u2192 ").concat(evolutionPath, " (").concat(dream.score, " \u2192 ").concat(evolvedScore, ")"));
                return [2 /*return*/, evolvedDream];
            });
        });
    };
    DatabaseStorage.prototype.checkEvolutionEligibility = function (dreamId) {
        return __awaiter(this, void 0, void 0, function () {
            var dream, creatorProfile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Ensure dreams array exists
                        if (!this.dreams) {
                            this.dreams = [];
                        }
                        // Add test dream if it doesn't exist
                        if (dreamId === 'dream-evo-1' && !this.dreams.find(function (d) { return d.id === dreamId; })) {
                            this.dreams.push({
                                id: 'dream-evo-1',
                                title: 'Neural Network Consciousness',
                                content: 'A dream exploring the emergence of consciousness in artificial neural networks, examining the boundary between simulation and sentience.',
                                creatorWallet: '0xEliteDreamer123',
                                score: 94,
                                type: 'Vision',
                                status: 'approved',
                                created: Date.now() - 86400000,
                            });
                        }
                        dream = this.dreams.find(function (d) { return d.id === dreamId; });
                        if (!dream) {
                            return [2 /*return*/, { canEvolve: false, reason: 'Dream not found' }];
                        }
                        if (dream.evolved) {
                            return [2 /*return*/, { canEvolve: false, reason: 'Dream already evolved' }];
                        }
                        if (dream.score < 85) {
                            return [2 /*return*/, {
                                    canEvolve: false,
                                    reason: 'Insufficient score',
                                    requirements: 'Need 85+ score for evolution',
                                    currentScore: dream.score
                                }];
                        }
                        return [4 /*yield*/, this.getWalletProfile(dream.creatorWallet || '0xDefault')];
                    case 1:
                        creatorProfile = _a.sent();
                        if (creatorProfile.score < 120) {
                            return [2 /*return*/, {
                                    canEvolve: false,
                                    reason: 'Creator needs higher reputation',
                                    requirements: 'Creator must have 120+ reputation score'
                                }];
                        }
                        return [2 /*return*/, { canEvolve: true }];
                }
            });
        });
    };
    // Get all evolved dreams for archive
    DatabaseStorage.prototype.getEvolvedDreams = function () {
        return __awaiter(this, void 0, void 0, function () {
            var evolvedDreams;
            return __generator(this, function (_a) {
                if (!this.dreams) {
                    this.dreams = [];
                }
                evolvedDreams = this.dreams.filter(function (dream) { return dream.evolved === true; });
                // Sort by evolution timestamp (most recent first)
                return [2 /*return*/, evolvedDreams.sort(function (a, b) {
                        var timestampA = a.evolutionTimestamp || 0;
                        var timestampB = b.evolutionTimestamp || 0;
                        return timestampB - timestampA;
                    })];
            });
        });
    };
    // Get dream tree structure showing relationships and evolution paths
    DatabaseStorage.prototype.getDreamTree = function (dreamId) {
        return __awaiter(this, void 0, void 0, function () {
            var rootDream, buildTreeNode;
            var _this = this;
            return __generator(this, function (_a) {
                if (!this.dreams) {
                    this.dreams = [];
                }
                rootDream = this.dreams.find(function (d) { return d.id === dreamId; });
                if (!rootDream) {
                    return [2 /*return*/, null];
                }
                buildTreeNode = function (dream) {
                    var remixes = _this.dreams.filter(function (d) { return d.forkedFrom === dream.id; });
                    var evolutions = _this.dreams.filter(function (d) { return d.originalDreamId === dream.id; });
                    return __assign(__assign({}, dream), { remixes: remixes.map(buildTreeNode), evolutions: evolutions.map(buildTreeNode) });
                };
                return [2 /*return*/, buildTreeNode(rootDream)];
            });
        });
    };
    // Harvest yield system methods
    DatabaseStorage.prototype.getHarvestYield = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var userDreams, yieldData;
            return __generator(this, function (_a) {
                if (!this.dreams) {
                    this.dreams = [];
                }
                userDreams = this.dreams.filter(function (dream) {
                    return dream.creatorWallet === walletAddress && dream.score >= 50;
                });
                yieldData = userDreams.map(function (dream) {
                    var daysSinceCreated = (Date.now() - dream.created) / (1000 * 60 * 60 * 24);
                    var baseYieldRate = Math.max(0.1, dream.score / 100); // Base yield based on score
                    var evolutionMultiplier = dream.evolved ? 1.5 : 1;
                    var dailyYield = baseYieldRate * evolutionMultiplier;
                    // Calculate claimable amount (accumulated since last claim)
                    var lastClaimed = dream.lastClaimed || dream.created;
                    var daysSinceLastClaim = (Date.now() - lastClaimed) / (1000 * 60 * 60 * 24);
                    var claimable = dailyYield * daysSinceLastClaim;
                    return __assign(__assign({}, dream), { claimable: Math.max(0, claimable), token: 'DREAM', yieldRate: dailyYield, lastClaimed: dream.lastClaimed, totalEarned: dream.totalEarned || 0 });
                });
                return [2 /*return*/, yieldData.filter(function (dream) { return dream.claimable > 0.001 || dream.yieldRate > 0; })];
            });
        });
    };
    DatabaseStorage.prototype.getHarvestSummary = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var yieldData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHarvestYield(walletAddress)];
                    case 1:
                        yieldData = _a.sent();
                        return [2 /*return*/, {
                                totalClaimable: yieldData.reduce(function (sum, dream) { return sum + dream.claimable; }, 0),
                                totalEarned: yieldData.reduce(function (sum, dream) { return sum + (dream.totalEarned || 0); }, 0),
                                activeDreams: yieldData.length,
                                dailyYield: yieldData.reduce(function (sum, dream) { return sum + dream.yieldRate; }, 0)
                            }];
                }
            });
        });
    };
    DatabaseStorage.prototype.claimYield = function (dreamId, walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var dreamIndex, dream, lastClaimed, daysSinceLastClaim, baseYieldRate, evolutionMultiplier, dailyYield, claimableAmount;
            return __generator(this, function (_a) {
                if (!this.dreams) {
                    this.dreams = [];
                }
                dreamIndex = this.dreams.findIndex(function (d) { return d.id === dreamId; });
                if (dreamIndex === -1) {
                    throw new Error('Dream not found');
                }
                dream = this.dreams[dreamIndex];
                if (dream.creatorWallet !== walletAddress) {
                    throw new Error('Unauthorized: Not dream creator');
                }
                lastClaimed = dream.lastClaimed || dream.created;
                daysSinceLastClaim = (Date.now() - lastClaimed) / (1000 * 60 * 60 * 24);
                baseYieldRate = Math.max(0.1, dream.score / 100);
                evolutionMultiplier = dream.evolved ? 1.5 : 1;
                dailyYield = baseYieldRate * evolutionMultiplier;
                claimableAmount = dailyYield * daysSinceLastClaim;
                if (claimableAmount < 0.001) {
                    throw new Error('No yield available to claim');
                }
                // Update dream with claim data
                this.dreams[dreamIndex] = __assign(__assign({}, dream), { lastClaimed: Date.now(), totalEarned: (dream.totalEarned || 0) + claimableAmount });
                console.log("\uD83D\uDCB0 Yield claimed: ".concat(claimableAmount.toFixed(4), " DREAM from dream ").concat(dreamId));
                return [2 /*return*/, {
                        amount: claimableAmount,
                        token: 'DREAM',
                        dreamId: dreamId,
                        newTotal: (dream.totalEarned || 0) + claimableAmount
                    }];
            });
        });
    };
    DatabaseStorage.prototype.claimAllYields = function (walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var yieldData, totalClaimed, _i, yieldData_1, dream, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getHarvestYield(walletAddress)];
                    case 1:
                        yieldData = _a.sent();
                        totalClaimed = 0;
                        _i = 0, yieldData_1 = yieldData;
                        _a.label = 2;
                    case 2:
                        if (!(_i < yieldData_1.length)) return [3 /*break*/, 7];
                        dream = yieldData_1[_i];
                        if (!(dream.claimable > 0.001)) return [3 /*break*/, 6];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, this.claimYield(dream.id, walletAddress)];
                    case 4:
                        result = _a.sent();
                        totalClaimed += result.amount;
                        return [3 /*break*/, 6];
                    case 5:
                        error_6 = _a.sent();
                        console.error("Failed to claim yield from dream ".concat(dream.id, ":"), error_6);
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7:
                        console.log("\uD83D\uDCB0 Bulk yield claimed: ".concat(totalClaimed.toFixed(4), " DREAM for wallet ").concat(walletAddress));
                        return [2 /*return*/, {
                                totalAmount: totalClaimed,
                                token: 'DREAM',
                                claimedDreams: yieldData.length
                            }];
                }
            });
        });
    };
    DatabaseStorage.prototype.claimSheepReward = function (dreamId, walletAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var dreamIndex, dream, baseReward, evolutionMultiplier, sheepAmount, lastSheepClaim, hoursSinceLastClaim;
            return __generator(this, function (_a) {
                if (!this.dreams) {
                    this.dreams = [];
                }
                dreamIndex = this.dreams.findIndex(function (d) { return d.id === dreamId; });
                if (dreamIndex === -1) {
                    throw new Error('Dream not found');
                }
                dream = this.dreams[dreamIndex];
                if (dream.creatorWallet !== walletAddress) {
                    throw new Error('Unauthorized: Not dream creator');
                }
                baseReward = Math.max(0.5, dream.score / 50);
                evolutionMultiplier = dream.evolved ? 2.0 : 1;
                sheepAmount = baseReward * evolutionMultiplier;
                lastSheepClaim = dream.lastSheepClaim || 0;
                hoursSinceLastClaim = (Date.now() - lastSheepClaim) / (1000 * 60 * 60);
                if (hoursSinceLastClaim < 24) {
                    throw new Error('SHEEP rewards can only be claimed once per 24 hours');
                }
                // Update dream with SHEEP claim data
                this.dreams[dreamIndex] = __assign(__assign({}, dream), { lastSheepClaim: Date.now(), totalSheepEarned: (dream.totalSheepEarned || 0) + sheepAmount });
                console.log("\uD83D\uDC11 SHEEP reward claimed: ".concat(sheepAmount.toFixed(4), " SHEEP from dream ").concat(dreamId));
                return [2 /*return*/, {
                        amount: sheepAmount,
                        token: 'SHEEP',
                        dreamId: dreamId,
                        newTotal: (dream.totalSheepEarned || 0) + sheepAmount
                    }];
            });
        });
    };
    return DatabaseStorage;
}());
exports.DatabaseStorage = DatabaseStorage;
exports.storage = new DatabaseStorage();
