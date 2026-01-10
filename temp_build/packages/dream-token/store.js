"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOnchainAccount = getOnchainAccount;
exports.upsertOnchainAccount = upsertOnchainAccount;
exports.recordDreamTokenEvent = recordDreamTokenEvent;
exports.listDreamTokenEvents = listDreamTokenEvents;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const STORE_DIR = (0, node_path_1.join)(process.cwd(), "packages/dream-token/store");
const ACCOUNTS_FILE = (0, node_path_1.join)(STORE_DIR, "dream_onchain_accounts.json");
const EVENTS_FILE = (0, node_path_1.join)(STORE_DIR, "dream_token_events.json");
// Ensure store directory exists
if (!(0, node_fs_1.existsSync)(STORE_DIR)) {
    (0, node_fs_1.mkdirSync)(STORE_DIR, { recursive: true });
}
// Initialize empty files if they don't exist
if (!(0, node_fs_1.existsSync)(ACCOUNTS_FILE)) {
    (0, node_fs_1.writeFileSync)(ACCOUNTS_FILE, JSON.stringify([], null, 2));
}
if (!(0, node_fs_1.existsSync)(EVENTS_FILE)) {
    (0, node_fs_1.writeFileSync)(EVENTS_FILE, JSON.stringify([], null, 2));
}
function readAccounts() {
    try {
        const content = (0, node_fs_1.readFileSync)(ACCOUNTS_FILE, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
function writeAccounts(accounts) {
    (0, node_fs_1.writeFileSync)(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
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
async function getOnchainAccount(userId) {
    const accounts = readAccounts();
    const existing = accounts.find((a) => a.userId === userId);
    if (existing) {
        return existing;
    }
    // Create new account record
    const newAccount = {
        userId,
        onchainBalance: "0",
        claimableBalance: "0",
    };
    accounts.push(newAccount);
    writeAccounts(accounts);
    return newAccount;
}
async function upsertOnchainAccount(account) {
    const accounts = readAccounts();
    const index = accounts.findIndex((a) => a.userId === account.userId);
    if (index === -1) {
        accounts.push(account);
    }
    else {
        accounts[index] = account;
    }
    writeAccounts(accounts);
}
async function recordDreamTokenEvent(event) {
    const events = readEvents();
    events.push(event);
    writeEvents(events);
}
async function listDreamTokenEvents(filter) {
    const events = readEvents();
    let filtered = events;
    if (filter?.userId) {
        filtered = filtered.filter((e) => e.userId === filter.userId);
    }
    if (filter?.type) {
        filtered = filtered.filter((e) => e.type === filter.type);
    }
    return filtered
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, filter?.limit ?? 100);
}
