import { randomUUID } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { UserBalances, RewardEvent } from "./types";

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

function readBalances(): UserBalances[] {
  try {
    const content = readFileSync(BALANCES_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeBalances(balances: UserBalances[]): void {
  writeFileSync(BALANCES_FILE, JSON.stringify(balances, null, 2));
}

function readEvents(): RewardEvent[] {
  try {
    const content = readFileSync(EVENTS_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeEvents(events: RewardEvent[]): void {
  writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
}

export async function getUserBalance(userId: string): Promise<UserBalances> {
  const balances = readBalances();
  const existing = balances.find((b) => b.userId === userId);

  if (existing) {
    return existing;
  }

  // Create new balance record
  const newBalance: UserBalances = {
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

export async function setUserBalance(balance: UserBalances): Promise<void> {
  const balances = readBalances();
  const index = balances.findIndex((b) => b.userId === balance.userId);

  if (index === -1) {
    balances.push(balance);
  } else {
    balances[index] = balance;
  }

  writeBalances(balances);
}

export async function recordRewardEvent(event: RewardEvent): Promise<void> {
  const events = readEvents();
  events.push(event);
  writeEvents(events);
}

export async function listRewardEvents(userId: string, limit = 50): Promise<RewardEvent[]> {
  const events = readEvents();
  return events
    .filter((e) => e.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getAllBalances(): Promise<UserBalances[]> {
  return readBalances();
}

