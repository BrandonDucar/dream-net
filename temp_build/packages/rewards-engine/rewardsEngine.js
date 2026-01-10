"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBalance = exports.listRewardEvents = void 0;
exports.calculateDailyReward = calculateDailyReward;
exports.calculateWeeklyReward = calculateWeeklyReward;
exports.grantReward = grantReward;
const store_1 = require("./store");
const config_1 = require("./config");
const node_crypto_1 = require("node:crypto");
function calculateDailyReward(streakDays = 0) {
    const baseDream = config_1.defaultConfig.dailyBaseDream;
    const baseSheep = config_1.defaultConfig.dailyBaseSheep;
    const multiplier = Math.pow(config_1.defaultConfig.streakBonusMultiplier, Math.min(streakDays, 7)); // Cap at 7 days
    return {
        dream: Math.floor(baseDream * multiplier),
        sheep: Math.floor(baseSheep * multiplier),
    };
}
function calculateWeeklyReward() {
    return {
        dream: config_1.defaultConfig.weeklyBaseDream,
        sheep: config_1.defaultConfig.weeklyBaseSheep,
    };
}
function canClaimLogin(lastLoginAt) {
    if (!lastLoginAt)
        return true;
    const lastLogin = new Date(lastLoginAt);
    const now = new Date();
    const hoursSince = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
    return hoursSince >= config_1.defaultConfig.loginCooldownHours;
}
function canClaimDaily(lastDailyClaimAt) {
    if (!lastDailyClaimAt)
        return true;
    const lastClaim = new Date(lastDailyClaimAt);
    const now = new Date();
    const hoursSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
    return hoursSince >= 24;
}
function canClaimWeekly(lastWeeklyClaimAt) {
    // Check if claimed in last 7 days
    if (lastWeeklyClaimAt) {
        const lastClaim = new Date(lastWeeklyClaimAt);
        const now = new Date();
        const daysSince = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince < 7)
            return false;
    }
    return true;
}
async function grantReward(userId, type, options) {
    const balance = await (0, store_1.getUserBalance)(userId);
    const now = new Date().toISOString();
    let deltaDream = 0;
    let deltaSheep = 0;
    let updatedBalance = { ...balance };
    switch (type) {
        case "login":
            if (!canClaimLogin(balance.lastLoginAt)) {
                return balance; // Already claimed recently
            }
            deltaDream = 5; // Small login reward
            deltaSheep = 10;
            updatedBalance.lastLoginAt = now;
            break;
        case "daily-claim":
            if (!canClaimDaily(balance.lastDailyClaimAt)) {
                throw new Error("Daily claim already used. Try again in 24 hours.");
            }
            const dailyReward = calculateDailyReward(balance.streakDays || 0);
            deltaDream = dailyReward.dream;
            deltaSheep = dailyReward.sheep;
            // Update streak
            if (balance.lastDailyClaimAt) {
                const lastClaim = new Date(balance.lastDailyClaimAt);
                const nowDate = new Date();
                const daysSince = Math.floor((nowDate.getTime() - lastClaim.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSince === 1) {
                    // Consecutive day
                    updatedBalance.streakDays = (balance.streakDays || 0) + 1;
                }
                else if (daysSince > 1) {
                    // Streak broken
                    updatedBalance.streakDays = 1;
                }
            }
            else {
                updatedBalance.streakDays = 1;
            }
            updatedBalance.lastDailyClaimAt = now;
            break;
        case "weekly-claim":
            if (!canClaimWeekly(balance.lastWeeklyClaimAt)) {
                throw new Error("Weekly claim already used. Try again in 7 days.");
            }
            const weeklyReward = calculateWeeklyReward();
            deltaDream = weeklyReward.dream;
            deltaSheep = weeklyReward.sheep;
            updatedBalance.lastWeeklyClaimAt = now;
            updatedBalance.weeklyGasClaims = (balance.weeklyGasClaims || 0) + 1;
            break;
        case "task-complete":
            deltaDream = options?.deltaDream ?? 5;
            deltaSheep = options?.deltaSheep ?? 0;
            break;
        case "media-upload":
            deltaDream = 10;
            deltaSheep = 25;
            break;
        case "procurement":
            deltaDream = options?.deltaDream ?? 50;
            deltaSheep = options?.deltaSheep ?? 0;
            break;
        case "halo-contrib":
            deltaDream = options?.deltaDream ?? 20;
            deltaSheep = options?.deltaSheep ?? 10;
            break;
        case "referral":
            deltaDream = 100;
            deltaSheep = 50;
            break;
        case "admin-adjust":
            deltaDream = options?.deltaDream ?? 0;
            deltaSheep = options?.deltaSheep ?? 0;
            if (deltaDream === 0 && deltaSheep === 0) {
                throw new Error("At least one delta must be provided for admin-adjust");
            }
            break;
    }
    // Apply daily SHEEP cap
    const todayEvents = await (0, store_1.listRewardEvents)(userId, 100);
    const today = new Date().toISOString().split("T")[0];
    const todaySheepEarned = todayEvents
        .filter((e) => e.createdAt.startsWith(today))
        .reduce((sum, e) => sum + e.deltaSheep, 0);
    const remainingDailySheep = Math.max(0, config_1.defaultConfig.maxDailySheep - todaySheepEarned);
    if (deltaSheep > 0) {
        deltaSheep = Math.min(deltaSheep, remainingDailySheep);
    }
    // Update balance
    updatedBalance.dream = Math.max(0, balance.dream + deltaDream);
    updatedBalance.sheep = Math.max(0, balance.sheep + deltaSheep);
    // Record event
    const event = {
        id: (0, node_crypto_1.randomUUID)(),
        userId,
        type,
        deltaDream,
        deltaSheep,
        createdAt: now,
        meta: options?.meta ?? {},
    };
    await (0, store_1.recordRewardEvent)(event);
    await (0, store_1.setUserBalance)(updatedBalance);
    return updatedBalance;
}
// Re-export for convenience
var store_2 = require("./store");
Object.defineProperty(exports, "listRewardEvents", { enumerable: true, get: function () { return store_2.listRewardEvents; } });
Object.defineProperty(exports, "getUserBalance", { enumerable: true, get: function () { return store_2.getUserBalance; } });
