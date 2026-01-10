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
exports.getGardenFeed = getGardenFeed;
var storage_1 = require("./storage");
/**
 * Get the garden feed data with dreams and cocoons
 * Falls back to mock data if database is unavailable
 */
function getGardenFeed() {
    return __awaiter(this, void 0, void 0, function () {
        var feedData, error_1, mockData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, storage_1.storage.getSimpleGardenFeed()];
                case 1:
                    feedData = _a.sent();
                    return [2 /*return*/, {
                            gardenFeed: feedData.map(function (item) { return ({
                                id: item.id,
                                name: item.name,
                                stage: item.stage,
                                score: item.score,
                                tags: item.tags,
                                contributors: item.contributors
                            }); }),
                            metadata: {
                                totalItems: feedData.length,
                                timestamp: new Date().toISOString(),
                                dreamCount: feedData.filter(function (item) { return !item.stage; }).length,
                                cocoonCount: feedData.filter(function (item) { return item.stage; }).length
                            }
                        }];
                case 2:
                    error_1 = _a.sent();
                    console.log('Database unavailable, using fallback data for garden feed');
                    mockData = [
                        {
                            id: "dream-0",
                            name: "Dream 0",
                            stage: undefined,
                            score: 75,
                            tags: ["ai"],
                            contributors: []
                        },
                        {
                            id: "dream-1",
                            name: "Dream 1",
                            stage: undefined,
                            score: 68,
                            tags: ["crypto"],
                            contributors: []
                        },
                        {
                            id: "dream-2",
                            name: "Dream 2",
                            stage: undefined,
                            score: 82,
                            tags: ["music"],
                            contributors: []
                        }
                    ];
                    return [2 /*return*/, {
                            gardenFeed: mockData,
                            metadata: {
                                totalItems: mockData.length,
                                timestamp: new Date().toISOString(),
                                dreamCount: mockData.filter(function (item) { return !item.stage; }).length,
                                cocoonCount: mockData.filter(function (item) { return item.stage; }).length
                            }
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
