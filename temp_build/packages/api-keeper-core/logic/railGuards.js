"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRailGuards = checkRailGuards;
exports.ensureDefaultRailGuards = ensureDefaultRailGuards;
exports.createRailGuard = createRailGuard;
const apiStore_1 = require("../store/apiStore");
let guardCounter = 0;
function nextGuardId() {
    guardCounter += 1;
    return `guard:${Date.now()}:${guardCounter}`;
}
/**
 * Check rail guards before allowing a request
 */
function checkRailGuards(request) {
    const guards = apiStore_1.APIStore.listActiveRailGuards();
    for (const guard of guards) {
        const check = checkGuard(guard, request);
        if (!check.allowed) {
            return check;
        }
    }
    return { allowed: true };
}
/**
 * Check a single guard
 */
function checkGuard(guard, request) {
    switch (guard.type) {
        case "daily-cost":
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayStart = today.getTime();
            const requestsToday = apiStore_1.APIStore.listRequests()
                .filter((r) => r.requestedAt >= todayStart);
            const costToday = requestsToday.reduce((sum, r) => sum + (r.cost || 0), 0);
            if (costToday + (request.maxCost || 0) > guard.limit) {
                if (guard.action === "block") {
                    return {
                        allowed: false,
                        reason: `Daily cost limit exceeded ($${costToday.toFixed(2)}/${guard.limit})`,
                    };
                }
            }
            break;
        case "monthly-cost":
            const thisMonth = new Date();
            thisMonth.setDate(1);
            thisMonth.setHours(0, 0, 0, 0);
            const monthStart = thisMonth.getTime();
            const requestsThisMonth = apiStore_1.APIStore.listRequests()
                .filter((r) => r.requestedAt >= monthStart);
            const costThisMonth = requestsThisMonth.reduce((sum, r) => sum + (r.cost || 0), 0);
            if (costThisMonth + (request.maxCost || 0) > guard.limit) {
                if (guard.action === "block") {
                    return {
                        allowed: false,
                        reason: `Monthly cost limit exceeded ($${costThisMonth.toFixed(2)}/${guard.limit})`,
                    };
                }
            }
            break;
        case "rate-limit":
            const recentRequests = apiStore_1.APIStore.listRequests()
                .filter((r) => Date.now() - r.requestedAt < 60000); // Last minute
            if (recentRequests.length >= guard.limit) {
                if (guard.action === "block") {
                    return {
                        allowed: false,
                        reason: `Rate limit exceeded (${recentRequests.length}/${guard.limit} per minute)`,
                    };
                }
            }
            break;
    }
    return { allowed: true };
}
/**
 * Create default rail guards
 */
function ensureDefaultRailGuards() {
    const existing = apiStore_1.APIStore.listRailGuards();
    if (existing.length > 0)
        return existing;
    const now = Date.now();
    const guards = [
        {
            id: nextGuardId(),
            name: "Daily Cost Limit",
            type: "daily-cost",
            limit: 10, // $10/day default
            current: 0,
            action: "block",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: nextGuardId(),
            name: "Monthly Cost Limit",
            type: "monthly-cost",
            limit: 100, // $100/month default
            current: 0,
            action: "block",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: nextGuardId(),
            name: "Rate Limit",
            type: "rate-limit",
            limit: 60, // 60 requests per minute
            current: 0,
            action: "throttle",
            enabled: true,
            createdAt: now,
            updatedAt: now,
        },
    ];
    for (const guard of guards) {
        apiStore_1.APIStore.addRailGuard(guard);
    }
    console.log(`[RailGuards] Created ${guards.length} default rail guards`);
    return guards;
}
/**
 * Create a custom rail guard
 */
function createRailGuard(name, type, limit, action) {
    const guard = {
        id: nextGuardId(),
        name,
        type,
        limit,
        current: 0,
        action,
        enabled: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    apiStore_1.APIStore.addRailGuard(guard);
    return guard;
}
