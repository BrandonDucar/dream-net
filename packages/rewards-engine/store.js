import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
const STORE_DIR = join(process.cwd(), "packages/rewards-engine/store");
const BALANCES_FILE = join(STORE_DIR, "rewards_balances.json");
const EVENTS_FILE = join(STORE_DIR, "rewards_events.json");
// Ensure store directory exists
if (!existsSync(STORE_DIR)) {
    mkdirSync(STORE_DIR, { recursive: true });
}
// Initialize empty files if they don't exist
if (!existsSync(BALANCES_FILE)) {
    writeFileSync(BALANCES_FILE, JSON.stringify([], null, 2));
}
if (!existsSync(EVENTS_FILE)) {
    writeFileSync(EVENTS_FILE, JSON.stringify([], null, 2));
}
function readBalances() {
    try {
        const content = readFileSync(BALANCES_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeBalances(balances) {
    writeFileSync(BALANCES_FILE, JSON.stringify(balances, null, 2));
}
function readEvents() {
    try {
        const content = readFileSync(EVENTS_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeEvents(events) {
    writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}
export async function getUserBalance(userId) {
    const balances = readBalances();
    const existing = balances.find((b) => b.userId === userId);
    if (existing) {
        return existing;
    }
    // Create new balance record
    const newBalance = {
        userId,
        dream: 0,
        sheep: 0,
        weeklyGasClaims: 0,
        streakDays: 0,
    };
    balances.push(newBalance);
    writeBalances(balances);
    return newBalance;
}
export async function setUserBalance(balance) {
    const balances = readBalances();
    const index = balances.findIndex((b) => b.userId === balance.userId);
    if (index === -1) {
        balances.push(balance);
    }
    else {
        balances[index] = balance;
    }
    writeBalances(balances);
}
export async function recordRewardEvent(event) {
    const events = readEvents();
    events.push(event);
    writeEvents(events);
}
export async function listRewardEvents(userId, limit = 50) {
    const events = readEvents();
    return events
        .filter((e) => e.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
}
export async function getAllBalances() {
    return readBalances();
}
//# sourceMappingURL=store.js.map