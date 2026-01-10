import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { DreamOnchainAccount, DreamTokenEvent } from "./types";

const STORE_DIR = join(process.cwd(), "packages/dream-token/store");
const ACCOUNTS_FILE = join(STORE_DIR, "dream_onchain_accounts.json");
const EVENTS_FILE = join(STORE_DIR, "dream_token_events.json");

// Ensure store directory exists
if (!existsSync(STORE_DIR)) {
  mkdirSync(STORE_DIR, { recursive: true });
}

// Initialize empty files if they don't exist
if (!existsSync(ACCOUNTS_FILE)) {
  writeFileSync(ACCOUNTS_FILE, JSON.stringify([], null, 2));
}

if (!existsSync(EVENTS_FILE)) {
  writeFileSync(EVENTS_FILE, JSON.stringify([], null, 2));
}

function readAccounts(): DreamOnchainAccount[] {
  try {
    const content = readFileSync(ACCOUNTS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeAccounts(accounts: DreamOnchainAccount[]): void {
  writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
}

function readEvents(): DreamTokenEvent[] {
  try {
    const content = readFileSync(EVENTS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeEvents(events: DreamTokenEvent[]): void {
  writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

export async function getOnchainAccount(userId: string): Promise<DreamOnchainAccount> {
  const accounts = readAccounts();
  const existing = accounts.find((a) => a.userId === userId);

  if (existing) {
    return existing;
  }

  // Create new account record
  const newAccount: DreamOnchainAccount = {
    userId,
    onchainBalance: "0",
    claimableBalance: "0",
  };

  accounts.push(newAccount);
  writeAccounts(accounts);
  return newAccount;
}

export async function upsertOnchainAccount(account: DreamOnchainAccount): Promise<void> {
  const accounts = readAccounts();
  const index = accounts.findIndex((a) => a.userId === account.userId);

  if (index === -1) {
    accounts.push(account);
  } else {
    accounts[index] = account;
  }

  writeAccounts(accounts);
}

export async function recordDreamTokenEvent(event: DreamTokenEvent): Promise<void> {
  const events = readEvents();
  events.push(event);
  writeEvents(events);
}

export async function listDreamTokenEvents(filter?: {
  userId?: string;
  type?: string;
  limit?: number;
}): Promise<DreamTokenEvent[]> {
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

