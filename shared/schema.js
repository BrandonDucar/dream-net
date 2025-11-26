// Temporary schema stub for deployment
// TODO: Restore full schema from git or migrations
import { pgTable, text, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
// Enums
export const dreamStatusEnum = pgEnum("dream_status", ["pending", "approved", "rejected", "evolved"]);
export const contributorRoleEnum = pgEnum("contributor_role", ["Builder", "Artist", "Coder", "Visionary", "Promoter"]);
// Minimal table definitions - just enough to satisfy imports
export const dreams = pgTable("dreams", {
    id: text("id").primaryKey(),
    name: text("name"),
    creator: text("creator"),
    description: text("description"),
    tags: jsonb("tags").$type(),
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
// Zod schemas (minimal)
export const insertDreamSchema = createInsertSchema(dreams);
export const insertCocoonSchema = createInsertSchema(cocoons);
export const insertDreamCoreSchema = createInsertSchema(dreamCores);
export const insertWalletSchema = createInsertSchema(wallets);
