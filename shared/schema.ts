import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const dreamStatusEnum = pgEnum("dream_status", ["pending", "approved", "rejected", "evolved"]);
export const dreamCategoryEnum = pgEnum("dream_category", ["lucid", "nightmare", "recurring", "prophetic", "abstract"]);
export const cocoonStageEnum = pgEnum("cocoon_stage", ["seedling", "incubating", "active", "metamorphosis", "emergence", "complete", "archived"]);
export const coreTypeEnum = pgEnum("core_type", ["resonance", "energy", "memory", "lucidity", "nightmare"]);
export const contributorRoleEnum = pgEnum("contributor_role", ["Builder", "Artist", "Coder", "Visionary", "Promoter"]);
export const actionTypeEnum = pgEnum("action_type", ["added", "removed"]);
export const starbridgeTopicEnum = pgEnum("starbridge_topic", ["Governor", "Deploy", "System", "Economy", "Vault"]);
export const starbridgeSourceEnum = pgEnum("starbridge_source", ["Runtime", "ComputeGovernor", "DeployKeeper", "DreamKeeper", "RelayBot", "External"]);

// New enums for Dream interface compatibility
export const dreamCoreTypeEnum = pgEnum("dream_core_type", ["Vision", "Tool", "Movement", "Story"]);
export const dreamStatusSimpleEnum = pgEnum("dream_status_simple", ["Draft", "Live", "Abandoned"]);

// Users table (existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Dreams table - updated to match Dream interface
export const dreams = pgTable("dreams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Updated from 'title' to 'name'
  creator: text("creator").notNull(), // Updated from 'wallet' to 'creator'
  description: text("description"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  score: integer("score").default(0), // Simplified from dreamScore
  evolved: boolean("evolved").default(false),
  last_updated: timestamp("last_updated").defaultNow().notNull(),
  coreType: dreamCoreTypeEnum("core_type"),
  image: text("image"),
  status: dreamStatusSimpleEnum("status").default("Draft"),
  
  // Keep some existing fields for backward compatibility
  wallet: text("wallet").notNull(), // Legacy field
  title: text("title"), // Legacy field
  urgency: integer("urgency"),
  origin: text("origin"),
  dreamStatus: dreamStatusEnum("dream_status").default("pending"), // Legacy status
  isNightmare: boolean("is_nightmare").default(false), // Trust score based flag
  trustScore: integer("trust_score").default(50), // Wallet trust score
  aiScore: integer("ai_score"),
  aiTags: text("ai_tags").array().default(sql`'{}'::text[]`),
  dreamScore: integer("dream_score"),
  scoreBreakdown: jsonb("score_breakdown").$type<{
    originality: number;
    traction: number;
    collaboration: number;
    updates: number;
  }>(),
  // Metrics for scoring calculations
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  contributors: jsonb("contributors").$type<Array<{
    wallet: string;
    role: 'Builder' | 'Artist' | 'Coder' | 'Visionary' | 'Promoter';
    joined_at: string;
  }>>().default(sql`'[]'::jsonb`),
  editCount: integer("edit_count").default(0),
  uniquenessScore: integer("uniqueness_score"), // From NLP analysis
  createdAt: timestamp("created_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  reviewerId: varchar("reviewer_id"),
  
  // Dream lineage and bounty tracking
  forkedFrom: varchar("forked_from"), // Original dream ID for lineage tracking
  remixOf: varchar("remix_of"), // Parent dream ID for remix tracking
  bountyId: varchar("bounty_id"), // Associated bounty ID for nightmare remediation
  bountyToken: text("bounty_token").$type<'SHEEP' | 'FLBY' | 'CORE'>(), // Bounty token type
  bountyAmount: text("bounty_amount").default('1000000000000000000'), // 1.0 in token units
  dreamCloud: text("dream_cloud").$type<'defi' | 'gaming' | 'zksync' | 'desci' | 'memes' | 'ai' | 'tools' | 'social' | 'art' | 'custom'>(),
  
  // Evolution tracking
  evolutionType: text("evolution_type").$type<'Fractal' | 'Chimera' | 'Divine' | 'Shadow' | 'Ethereal'>(),
  remixCount: integer("remix_count").default(0),
  fusionCount: integer("fusion_count").default(0),
  blessCount: integer("bless_count").default(0),
  nightmareEscapes: integer("nightmare_escapes").default(0),
  
  // XP and leveling
  xp: integer("xp").default(0),
  level: integer("level").default(1),
  
  // Blessings system
  blessings: jsonb("blessings").$type<Array<{
    wallet: string;
    message: string;
    amount: number;
    timestamp: number;
  }>>().default(sql`'[]'::jsonb`),
});

// Cocoons table
export const cocoons = pgTable("cocoons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dreamId: varchar("dream_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  creatorWallet: text("creator_wallet").notNull(),
  stage: cocoonStageEnum("stage").notNull().default("seedling"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  dreamScore: integer("dream_score").default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  evolutionNotes: text("evolution_notes").array().default(sql`'{}'::text[]`),
  metadata: jsonb("metadata"),
  contributors: jsonb("contributors").default(sql`'[]'::jsonb`),
  minted: boolean("minted").default(false).notNull(),
});

// Contributors log table
export const contributorsLog = pgTable("contributors_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cocoonId: varchar("cocoon_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  role: contributorRoleEnum("role").notNull(),
  actionType: actionTypeEnum("action_type").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  performedBy: text("performed_by").notNull(), // Admin wallet who performed the action
});

// Cocoon logs table for stage transitions
export const cocoonLogs = pgTable("cocoon_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cocoonId: varchar("cocoon_id").notNull(),
  previousStage: cocoonStageEnum("previous_stage"),
  newStage: cocoonStageEnum("new_stage").notNull(),
  adminWallet: text("admin_wallet").notNull(),
  isOverride: boolean("is_override").default(false).notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Notification types enum
export const notificationTypeEnum = pgEnum("notification_type", [
  "dream_approved",
  "cocoon_created", 
  "cocoon_stage_updated",
  "contributor_added",
  "contributor_removed",
  "dream_score_updated",
  "cocoon_score_insufficient",
  "nft_minted",
  "cocoon_archived"
]);

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientWallet: text("recipient_wallet").notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data"), // Additional data like dreamId, cocoonId, etc.
  isRead: boolean("is_read").default(false).notNull(),
  emailSent: boolean("email_sent").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

// Evolution Chains - Track dream progression through stages
export const evolutionChains = pgTable("evolution_chains", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dreamId: varchar("dream_id").notNull(),
  cocoonId: varchar("cocoon_id"),
  currentStage: text("current_stage").notNull(), // "dream", "cocoon_incubating", "cocoon_active", "cocoon_metamorphosis", "cocoon_emergence", "cocoon_complete"
  createdAt: timestamp("created_at").defaultNow().notNull(),
  evolvedAt: timestamp("evolved_at"), // When dream became cocoon
  completedAt: timestamp("completed_at"), // When cocoon reached complete stage
  metadata: jsonb("metadata"), // Additional evolution data
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Dream Invites - Track contributor invitations to dreams
export const dreamInvites = pgTable("dream_invites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dreamId: varchar("dream_id").notNull(),
  invitedWallet: text("invited_wallet").notNull(),
  inviterWallet: text("inviter_wallet").notNull(),
  role: contributorRoleEnum("role").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "accepted", "rejected"
  message: text("message"), // Optional invitation message
  createdAt: timestamp("created_at").defaultNow().notNull(),
  respondedAt: timestamp("responded_at"),
});

// Dream Core Tokens - Track token minting for cocoon milestones
export const dreamTokens = pgTable("dream_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dreamId: varchar("dream_id").notNull(),
  cocoonId: varchar("cocoon_id"),
  holderWallet: text("holder_wallet").notNull(),
  purpose: text("purpose").notNull(), // "badge", "mint", "vote"
  milestone: text("milestone"), // Stage that triggered the minting
  metadata: jsonb("metadata"), // Additional token data
  mintedAt: timestamp("minted_at").defaultNow().notNull(),
});


export type DreamstarReference = {
  title?: string;
  url?: string;
  type: "playlist" | "track" | "stem" | "file";
};

export const dreamstarIngestions = pgTable("dreamstar_ingestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  artist: text("artist").notNull(),
  project: text("project").notNull(),
  references: jsonb("references").$type<DreamstarReference[]>().default(sql`'[]'::jsonb`),
  notes: text("notes"),
  status: text("status").$type<"pending" | "processing" | "completed" | "failed">().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dreamstarGenerations = pgTable("dreamstar_generations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  artist: text("artist").notNull(),
  project: text("project").notNull(),
  influenceWeights: jsonb("influence_weights").$type<Record<string, number>>().default(sql`'{}'::jsonb`),
  deliverables: text("deliverables").array().default(sql`'{}'::text[]`),
  deadline: timestamp("deadline"),
  notes: text("notes"),
  status: text("status").$type<"pending" | "processing" | "completed" | "failed">().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const starbridgeEvents = pgTable("starbridge_events", {
  id: varchar("id").primaryKey(),
  topic: starbridgeTopicEnum("topic").notNull(),
  source: starbridgeSourceEnum("source").notNull(),
  type: text("type").notNull(),
  ts: timestamp("ts").defaultNow().notNull(),
  payload: jsonb("payload"),
  replayed: boolean("replayed").default(false).notNull(),
});

// Dream Cores table
export const dreamCores = pgTable("dream_cores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: coreTypeEnum("type").notNull(),
  energy: integer("energy").notNull().default(100), // 0-100
  resonance: integer("resonance").notNull().default(50), // 0-100
  isActive: boolean("is_active").notNull().default(true),
  ownerId: varchar("owner_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Wallets table
export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  dreamScore: integer("dream_score").notNull().default(0),
  cocoonTokens: integer("cocoon_tokens").notNull().default(0),
  coreFragments: integer("core_fragments").notNull().default(0),
  totalValue: integer("total_value").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

// Dream Reminders table for SMS scheduling
export const dreamReminders = pgTable("dream_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dreamId: varchar("dream_id").notNull(),
  userPhone: text("user_phone").notNull(),
  remindAt: timestamp("remind_at").notNull(),
  status: text("status").$type<"pending" | "sent">().default("pending"),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  reviewedDreams: many(dreams, { relationName: "reviewer" }),
  cocoons: many(cocoons),
  dreamCores: many(dreamCores),
  wallet: one(wallets),
}));

export const dreamsRelations = relations(dreams, ({ one }) => ({
  reviewer: one(users, {
    fields: [dreams.reviewerId],
    references: [users.id],
    relationName: "reviewer",
  }),
  cocoon: one(cocoons),
}));

export const cocoonsRelations = relations(cocoons, ({ one, many }) => ({
  dream: one(dreams, {
    fields: [cocoons.dreamId],
    references: [dreams.id],
  }),
  contributorLogs: many(contributorsLog),
  cocoonLogs: many(cocoonLogs),
}));

export const contributorsLogRelations = relations(contributorsLog, ({ one }) => ({
  cocoon: one(cocoons, {
    fields: [contributorsLog.cocoonId],
    references: [cocoons.id],
  }),
}));

export const cocoonLogsRelations = relations(cocoonLogs, ({ one }) => ({
  cocoon: one(cocoons, {
    fields: [cocoonLogs.cocoonId],
    references: [cocoons.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  // No direct relations needed for now, but can be added later
}));

export const evolutionChainsRelations = relations(evolutionChains, ({ one }) => ({
  dream: one(dreams, {
    fields: [evolutionChains.dreamId],
    references: [dreams.id],
  }),
  cocoon: one(cocoons, {
    fields: [evolutionChains.cocoonId],
    references: [cocoons.id],
  }),
}));

export const dreamInvitesRelations = relations(dreamInvites, ({ one }) => ({
  dream: one(dreams, {
    fields: [dreamInvites.dreamId],
    references: [dreams.id],
  }),
}));

export const dreamTokensRelations = relations(dreamTokens, ({ one }) => ({
  dream: one(dreams, {
    fields: [dreamTokens.dreamId],
    references: [dreams.id],
  }),
  cocoon: one(cocoons, {
    fields: [dreamTokens.cocoonId],
    references: [cocoons.id],
  }),
}));

export const dreamCoresRelations = relations(dreamCores, ({ one }) => ({
  owner: one(users, {
    fields: [dreamCores.ownerId],
    references: [users.id],
  }),
}));

export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDreamSchema = createInsertSchema(dreams).pick({
  wallet: true,
  title: true,
  description: true,
  tags: true,
  urgency: true,
  origin: true,
  forkedFrom: true,
  bountyId: true,
});

export const insertCocoonSchema = createInsertSchema(cocoons).pick({
  dreamId: true,
  title: true,
  description: true,
  creatorWallet: true,
  evolutionNotes: true,
});

export const insertDreamCoreSchema = createInsertSchema(dreamCores).pick({
  name: true,
  type: true,
  ownerId: true,
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  recipientWallet: true,
  type: true,
  title: true,
  message: true,
  data: true,
});

export const insertCocoonLogSchema = createInsertSchema(cocoonLogs).pick({
  cocoonId: true,
  previousStage: true,
  newStage: true,
  adminWallet: true,
  isOverride: true,
  notes: true,
});

export const insertEvolutionChainSchema = createInsertSchema(evolutionChains).pick({
  dreamId: true,
  cocoonId: true,
  currentStage: true,
  evolvedAt: true,
  completedAt: true,
  metadata: true,
});

export const insertDreamInviteSchema = createInsertSchema(dreamInvites).pick({
  dreamId: true,
  invitedWallet: true,
  inviterWallet: true,
  role: true,
  message: true,
});

export const insertDreamTokenSchema = createInsertSchema(dreamTokens).pick({
  dreamId: true,
  cocoonId: true,
  holderWallet: true,
  purpose: true,
  milestone: true,
  metadata: true,
});

export const insertStarbridgeEventSchema = createInsertSchema(starbridgeEvents).pick({
  id: true,
  topic: true,
  source: true,
  type: true,
  ts: true,
  payload: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type DreamRecord = typeof dreams.$inferSelect;
export type InsertDream = z.infer<typeof insertDreamSchema>;

export type Cocoon = typeof cocoons.$inferSelect;
export type InsertCocoon = z.infer<typeof insertCocoonSchema>;

export type DreamCore = typeof dreamCores.$inferSelect;
export type InsertDreamCore = z.infer<typeof insertDreamCoreSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type ContributorsLog = typeof contributorsLog.$inferSelect;
export type CocoonLog = typeof cocoonLogs.$inferSelect;
export type InsertCocoonLog = z.infer<typeof insertCocoonLogSchema>;

export type EvolutionChain = typeof evolutionChains.$inferSelect;
export type InsertEvolutionChain = z.infer<typeof insertEvolutionChainSchema>;

export type DreamInvite = typeof dreamInvites.$inferSelect;
export type InsertDreamInvite = z.infer<typeof insertDreamInviteSchema>;

export type DreamToken = typeof dreamTokens.$inferSelect;
export type InsertDreamToken = z.infer<typeof insertDreamTokenSchema>;

export type DreamReminder = typeof dreamReminders.$inferSelect;
export type InsertDreamReminder = {
  dreamId: string;
  userPhone: string;
  remindAt: Date;
  status?: "pending" | "sent";
  tags?: string[];
};

export type StarbridgeEventRecord = typeof starbridgeEvents.$inferSelect;
export type InsertStarbridgeEvent = z.infer<typeof insertStarbridgeEventSchema>;

// Contributor types
export type ContributorRole = "Builder" | "Artist" | "Coder" | "Visionary" | "Promoter";
export type ContributorAction = "added" | "removed";
export type CocoonContributor = {
  wallet: string;
  role: ContributorRole;
  joinedAt: string;
};

// Dream interface - canonical specification
// This is the authoritative Dream interface that all components must follow
export interface Dream {
  id: string;
  name: string;
  creator: string;
  tags: string[];
  score: number;
  evolved: boolean;
  last_updated: string;
  coreType?: 'Vision' | 'Tool' | 'Movement' | 'Story';
  description?: string;
  image?: string;
  status?: 'Draft' | 'Live' | 'Abandoned';
}

// Legacy alias for backward compatibility
export interface DreamInterface extends Dream {}


export const insertDreamstarIngestionSchema = createInsertSchema(dreamstarIngestions, {
  references: z
    .array(
      z.object({
        title: z.string().optional(),
        url: z.string().url().optional(),
        type: z.enum(["playlist", "track", "stem", "file"]),
      }),
    )
    .optional(),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
});

export const insertDreamstarGenerationSchema = createInsertSchema(dreamstarGenerations, {
  influenceWeights: z.record(z.string(), z.number()).optional(),
  deliverables: z.array(z.string()).optional(),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
});
