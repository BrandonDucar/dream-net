"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DreamBetCore = void 0;
const gameStore_1 = require("./store/gameStore");
const gameScheduler_1 = require("./scheduler/gameScheduler");
const rngEngine_1 = require("./logic/rngEngine");
exports.DreamBetCore = {
    // Game management
    upsertGame(game) {
        return gameStore_1.GameStore.upsertGame(game);
    },
    getGame(id) {
        return gameStore_1.GameStore.getGame(id);
    },
    listGames() {
        return gameStore_1.GameStore.listGames();
    },
    // Round management
    upsertRound(round) {
        return gameStore_1.GameStore.upsertRound(round);
    },
    listRoundsForGame(gameId) {
        return gameStore_1.GameStore.listRoundsForGame(gameId);
    },
    // RNG utilities
    generateRNG(req) {
        return (0, rngEngine_1.generateRNG)(req);
    },
    rngToUnit(resultHex) {
        return (0, rngEngine_1.rngToUnit)(resultHex);
    },
    rngToInt(resultHex, n) {
        return (0, rngEngine_1.rngToInt)(resultHex, n);
    },
    // Orchestration
    run(context) {
        return (0, gameScheduler_1.runDreamBetCycle)(context);
    },
    // Oracle & Prediction
    async predictOutcome(req) {
        const { OracleEngine } = await Promise.resolve().then(() => __importStar(require("./logic/oracle")));
        return OracleEngine.predict(req);
    },
    status() {
        return gameStore_1.GameStore.status();
    },
};
__exportStar(require("./types"), exports);
exports.default = exports.DreamBetCore;
