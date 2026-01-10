"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBalance = getUserBalance;
exports.setUserBalance = setUserBalance;
exports.recordRewardEvent = recordRewardEvent;
exports.listRewardEvents = listRewardEvents;
exports.getAllBalances = getAllBalances;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const STORE_DIR = (0, node_path_1.join)(process.cwd(), "packages/rewards-engine/store");
const BALANCES_FILE = (0, node_path_1.join)(STORE_DIR, "rewards_balances.json");
const EVENTS_FILE = (0, node_path_1.join)(STORE_DIR, "rewards_events.json");
// Ensure store directory exists
if (!(0, node_fs_1.existsSync)(STORE_DIR)) {
    (0, node_fs_1.mkdirSync)(STORE_DIR, { recursive: true });
}
// Initialize empty files if they don't exist
if (!(0, node_fs_1.existsSync)(BALANCES_FILE)) {
    (0, node_fs_1.writeFileSync)(BALANCES_FILE, JSON.stringify([], null, 2));
}
if (!(0, node_fs_1.existsSync)(EVENTS_FILE)) {
    (0, node_fs_1.writeFileSync)(EVENTS_FILE, JSON.stringify([], null, 2));
}
function readBalances() {
    try {
        const content = (0, node_fs_1.readFileSync)(BALANCES_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeBalances(balances) {
    (0, node_fs_1.writeFileSync)(BALANCES_FILE, JSON.stringify(balances, null, 2));
}
function readEvents() {
    try {
        const content = (0, node_fs_1.readFileSync)(EVENTS_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeEvents(events) {
    (0, node_fs_1.writeFileSync)(EVENTS_FILE, JSON.stringify(events, null, 2));
}
async function getUserBalance(userId) {
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
async function setUserBalance(balance) {
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
async function recordRewardEvent(event) {
    const events = readEvents();
    events.push(event);
    writeEvents(events);
}
async function listRewardEvents(userId, limit = 50) {
    const events = readEvents();
    return events
        .filter((e) => e.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
}
async function getAllBalances() {
    return readBalances();
}
