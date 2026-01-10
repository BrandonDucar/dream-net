#!/usr/bin/env tsx
"use strict";
/**
 * Archive Scheduler
 *
 * Runs every 6 hours to check for dreams or cocoons with no updates for over 7 days.
 * Automatically sets their stage to "Archived" and logs the activity.
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
exports.startArchiveScheduler = startArchiveScheduler;
exports.stopArchiveScheduler = stopArchiveScheduler;
exports.triggerArchiveNow = triggerArchiveNow;
exports.getSchedulerStatus = getSchedulerStatus;
var storage_1 = require("./storage");
var INACTIVITY_DAYS = parseInt(process.env.INACTIVITY_DAYS_BEFORE_ARCHIVE || '7');
var SCHEDULE_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
var schedulerTimeout = null;
function runArchiveProcess() {
    return __awaiter(this, void 0, void 0, function () {
        var timestamp, result, error_1, nextRun;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timestamp = new Date().toISOString();
                    console.log("\uD83D\uDDC4\uFE0F  [".concat(timestamp, "] Starting archive process..."));
                    console.log("\u23F0 Checking for items inactive for ".concat(INACTIVITY_DAYS, "+ days"));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, storage_1.storage.archiveInactiveItems(INACTIVITY_DAYS)];
                case 2:
                    result = _a.sent();
                    console.log("\uD83D\uDCCA Archive Results:");
                    console.log("   Dreams archived: ".concat(result.archivedDreams));
                    console.log("   Cocoons archived: ".concat(result.archivedCocoons));
                    if (result.archivedDreams > 0 || result.archivedCocoons > 0) {
                        console.log("\u2705 Archive process completed successfully");
                        // TODO: In a real system, you might want to:
                        // - Send summary notification to admin
                        // - Log to external monitoring system
                        // - Update metrics dashboard
                    }
                    else {
                        console.log("\u2139\uFE0F  No items needed archiving");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("\u274C Archive process failed:", error_1);
                    return [3 /*break*/, 4];
                case 4:
                    nextRun = new Date(Date.now() + SCHEDULE_INTERVAL);
                    console.log("\u23F0 Next archive check scheduled for: ".concat(nextRun.toISOString()));
                    return [2 /*return*/];
            }
        });
    });
}
function startArchiveScheduler() {
    console.log("\uD83D\uDE80 Starting archive scheduler...");
    console.log("\uD83D\uDCC5 Will run every 6 hours");
    console.log("\u2699\uFE0F  Inactivity threshold: ".concat(INACTIVITY_DAYS, " days"));
    // Run immediately on start
    runArchiveProcess();
    // Schedule recurring runs
    schedulerTimeout = setInterval(runArchiveProcess, SCHEDULE_INTERVAL);
    console.log("\u2705 Archive scheduler started successfully");
}
function stopArchiveScheduler() {
    if (schedulerTimeout) {
        clearInterval(schedulerTimeout);
        schedulerTimeout = null;
        console.log("\uD83D\uDED1 Archive scheduler stopped");
    }
}
// Manual trigger function for testing/admin use
function triggerArchiveNow() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("\uD83D\uDD27 Manual archive trigger activated");
                    return [4 /*yield*/, storage_1.storage.archiveInactiveItems(INACTIVITY_DAYS)];
                case 1:
                    result = _a.sent();
                    console.log("\uD83D\uDCCA Manual archive completed: ".concat(result.archivedDreams, " dreams, ").concat(result.archivedCocoons, " cocoons"));
                    return [2 /*return*/, result];
            }
        });
    });
}
// Status function
function getSchedulerStatus() {
    return {
        running: schedulerTimeout !== null,
        inactivityDays: INACTIVITY_DAYS,
        intervalHours: 6,
        nextRunEstimate: schedulerTimeout ? new Date(Date.now() + SCHEDULE_INTERVAL) : undefined
    };
}
// Graceful shutdown
process.on('SIGINT', function () {
    console.log("\n\uD83D\uDED1 Received SIGINT, stopping archive scheduler...");
    stopArchiveScheduler();
    process.exit(0);
});
process.on('SIGTERM', function () {
    console.log("\n\uD83D\uDED1 Received SIGTERM, stopping archive scheduler...");
    stopArchiveScheduler();
    process.exit(0);
});
// Run if called directly
if (require.main === module) {
    console.log("\n\uD83D\uDCE6 Dream Network Archive Scheduler\n==================================\nConfiguration:\n- Inactivity threshold: ".concat(INACTIVITY_DAYS, " days\n- Check interval: 6 hours\n- Environment: ").concat(process.env.NODE_ENV || 'development', "\n\nStarting scheduler...\n  "));
    startArchiveScheduler();
    // Keep process alive
    process.stdin.resume();
}
