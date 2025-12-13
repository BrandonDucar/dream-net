// Temporary schema stub for deployment
// TODO: Restore full schema from git or migrations

import { pgTable, text, timestamp, jsonb, integer, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const dreamStatusEnum = pgEnum("dream_status", ["pending", "approved", "rejected", "evolved"]);
export const contributorRoleEnum = pgEnum("contributor_role", ["Builder", "Artist", "Coder", "Visionary", "Promoter"]);

// Minimal table definitions - just enough to satisfy imports
export const dreams = pgTable("dreams", {
  id: text("id").primaryKey(),
  name: text("name"),
  creator: text("creator"),
  description: text("description"),
  tags: jsonb("tags").$type<string[]>(),
  // Add other fields as needed
});

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username"),
  // Add other fields as needed
});

export const cocoons = pgTable("cocoons", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const dreamCores = pgTable("dream_cores", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const wallets = pgTable("wallets", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const contributorsLog = pgTable("contributors_log", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const cocoonLogs = pgTable("cocoon_logs", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const evolutionChains = pgTable("evolution_chains", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const dreamInvites = pgTable("dream_invites", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const dreamTokens = pgTable("dream_tokens", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  // Add other fields as needed
});

export const dreamnetApiKeys = pgTable("dreamnet_api_keys", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  walletAddress: text("wallet_address"),
  keyHash: text("key_hash"),
  revokedAt: timestamp("revoked_at"),
  // Add other fields as needed
});

export const latentSessions = pgTable("latent_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  source: text("source"), // "Citadel", "DroneDome", "DreamKeeper", etc.
  task: text("task"),
  inputPrompt: text("input_prompt"),
  latentRep: jsonb("latent_rep").$type<number[]>(), // Vector representation
  decodedOutput: text("decoded_output"),
  relatedAgents: jsonb("related_agents").$type<string[]>(),
  onchainContext: jsonb("onchain_context").$type<{
    chain?: string;
    walletAddress?: string;
    tokenAddress?: string;
  }>(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
});

// Types
export type Dream = typeof dreams.$inferSelect;
export type DreamRecord = Dream;
export type InsertDream = typeof dreams.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Cocoon = typeof cocoons.$inferSelect;
export type InsertCocoon = typeof cocoons.$inferInsert;
export type DreamCore = typeof dreamCores.$inferSelect;
export type InsertDreamCore = typeof dreamCores.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;
export type ContributorsLog = typeof contributorsLog.$inferSelect;
export type CocoonLog = typeof cocoonLogs.$inferSelect;
export type CocoonContributor = { wallet: string; role: string; joinedAt: string };
export type ContributorRole = "Builder" | "Artist" | "Coder" | "Visionary" | "Promoter";
export type ContributorAction = string;
export type EvolutionChain = typeof evolutionChains.$inferSelect;
export type InsertEvolutionChain = typeof evolutionChains.$inferInsert;
export type DreamInvite = typeof dreamInvites.$inferSelect;
export type InsertDreamInvite = typeof dreamInvites.$inferInsert;
export type DreamToken = typeof dreamTokens.$inferSelect;
export type InsertDreamToken = typeof dreamTokens.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type LatentSession = typeof latentSessions.$inferSelect;
export type InsertLatentSession = typeof latentSessions.$inferInsert;

// Zod schemas (minimal)
export const insertDreamSchema = createInsertSchema(dreams);
export const insertCocoonSchema = createInsertSchema(cocoons);
export const insertDreamCoreSchema = createInsertSchema(dreamCores);
export const insertWalletSchema = createInsertSchema(wallets);

