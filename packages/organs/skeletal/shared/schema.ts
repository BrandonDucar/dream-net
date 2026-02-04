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
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
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
    joinedAt: string;
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
export const dreamnetApiKeys = pgTable("dreamnet_api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyHash: text("key_hash").notNull().unique(),
  keyPrefix: text("key_prefix").notNull(),
  userId: varchar("user_id"),
  walletAddress: text("wallet_address"),
  name: text("name").notNull(),
  description: text("description"),
  permissions: jsonb("permissions").$type<string[]>().default(sql`'[]'::jsonb`),
  rateLimit: integer("rate_limit").default(1000),
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  revokedAt: timestamp("revoked_at"),
  createdBy: text("created_by"),
});

export const dreamReminders = pgTable("dream_reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dreamId: varchar("dream_id").notNull(),
  userPhone: text("user_phone").notNull(),
  remindAt: timestamp("remind_at").notNull(),
  status: text("status").$type<"pending" | "sent">().default("pending"),
  tags: text("tags").array().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Super Spine Tables - Agent Orchestration Backbone
export const agentStatusEnum = pgEnum("agent_status", ["idle", "active", "busy", "error", "offline"]);
export const agentCapabilityEnum = pgEnum("agent_capability", ["code", "design", "analysis", "communication", "funding", "deployment"]);
export const agentTierEnum = pgEnum("agent_tier", ["Standard", "Premium", "Nightmare"]);
export const taskStatusEnum = pgEnum("task_status", ["pending", "assigned", "processing", "completed", "failed"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "expired", "cancelled"]);

// Memory Spine Enums
export const intentTypeEnum = pgEnum("intent_type", ["shortcut", "refactor", "boundary_cross", "extension", "extension_risky", "repair"]);
export const resistanceLevelEnum = pgEnum("resistance_level", ["whisper", "pause", "weight", "block"]);

// Super Spine Agents table
export const superSpineAgents = pgTable("super_spine_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentKey: text("agent_key").notNull().unique(),
  name: text("name").notNull(),
  status: agentStatusEnum("status").notNull().default("idle"),
  capabilities: agentCapabilityEnum("capabilities").array().notNull().default(sql`'{}'::agent_capability[]`),
  currentTask: varchar("current_task"),
  taskQueue: varchar("task_queue").array().default(sql`'{}'::varchar[]`),
  health: jsonb("health").$type<{
    uptime: number;
    successRate: number;
    avgResponseTime: number;
    errorCount: number;
  }>().default(sql`'{"uptime": 100, "successRate": 100, "avgResponseTime": 0, "errorCount": 0}'::jsonb`),
  metadata: jsonb("metadata").$type<{
    tier: "Standard" | "Premium" | "Nightmare";
    unlock: string;
    subscriptionRequired?: boolean;
    price?: {
      amount: number;
      currency: string;
      period: "monthly" | "yearly";
    };
  }>().notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow().notNull(),
});

// Super Spine Tasks table
export const superSpineTasks = pgTable("super_spine_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  agentKey: text("agent_key").notNull(),
  type: text("type").notNull(),
  input: jsonb("input").notNull(),
  status: taskStatusEnum("status").notNull().default("pending"),
  result: jsonb("result"),
  error: text("error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
});

// Super Spine Subscriptions table
export const superSpineSubscriptions = pgTable("super_spine_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  agentKey: text("agent_key").notNull(),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  price: jsonb("price").$type<{
    amount: number;
    currency: string;
  }>().notNull(),
});

// Memory Spine - Intent & Principles
export const principles = pgTable("principles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(), // e.g. "SNAIL_BORING_IDENTITY"
  statement: text("statement").notNull(),
  identityContext: text("identity_context"), // The "Who we are" part
  version: integer("version").default(1),
  author: text("author"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const decisionFossils = pgTable("decision_fossils", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  context: text("context").notNull(),
  decision: text("decision").notNull(),
  alternatives: text("alternatives").array(),
  rationale: text("rationale").notNull(),
  riskLevel: integer("risk_level").default(0), // 0-10
  tags: text("tags").array().default(sql`'{}'::text[]`),
  anchorPath: text("anchor_path"), // File or module path
  author: text("author").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const justificationLedger = pgTable("justification_ledger", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  principalId: varchar("principal_id").notNull(),
  intentType: intentTypeEnum("intent_type").notNull(),
  resistanceLevel: resistanceLevelEnum("resistance_level").notNull(),
  justification: text("justification").notNull(),
  anchorHash: text("anchor_hash"), // Git commit hash or similar
  author: text("author").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
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

// Super Spine Relations
export const superSpineAgentsRelations = relations(superSpineAgents, ({ many }) => ({
  tasks: many(superSpineTasks),
  subscriptions: many(superSpineSubscriptions),
}));

export const superSpineTasksRelations = relations(superSpineTasks, ({ one }) => ({
  agent: one(superSpineAgents, {
    fields: [superSpineTasks.agentKey],
    references: [superSpineAgents.agentKey],
  }),
}));

export const superSpineSubscriptionsRelations = relations(superSpineSubscriptions, ({ one }) => ({
  agent: one(superSpineAgents, {
    fields: [superSpineSubscriptions.agentKey],
    references: [superSpineAgents.agentKey],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
}) as unknown as z.ZodTypeAny;

export const insertDreamSchema = createInsertSchema(dreams).pick({
  wallet: true,
  title: true,
  description: true,
  tags: true,
  urgency: true,
  origin: true,
  forkedFrom: true,
  bountyId: true,
}) as unknown as z.ZodTypeAny;

export const insertCocoonSchema = createInsertSchema(cocoons).pick({
  dreamId: true,
  title: true,
  description: true,
  creatorWallet: true,
  evolutionNotes: true,
}) as unknown as z.ZodTypeAny;

export const insertDreamCoreSchema = createInsertSchema(dreamCores).pick({
  name: true,
  type: true,
  ownerId: true,
}) as unknown as z.ZodTypeAny;

export const insertWalletSchema = createInsertSchema(wallets).pick({
  userId: true,
}) as unknown as z.ZodTypeAny;

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  recipientWallet: true,
  type: true,
  title: true,
  message: true,
  data: true,
}) as unknown as z.ZodTypeAny;

export const insertCocoonLogSchema = createInsertSchema(cocoonLogs).pick({
  cocoonId: true,
  previousStage: true,
  newStage: true,
  adminWallet: true,
  isOverride: true,
  notes: true,
}) as unknown as z.ZodTypeAny;

export const insertEvolutionChainSchema = createInsertSchema(evolutionChains).pick({
  dreamId: true,
  cocoonId: true,
  currentStage: true,
  evolvedAt: true,
  completedAt: true,
  metadata: true,
}) as unknown as z.ZodTypeAny;

export const insertDreamInviteSchema = createInsertSchema(dreamInvites).pick({
  dreamId: true,
  invitedWallet: true,
  inviterWallet: true,
  role: true,
  message: true,
}) as unknown as z.ZodTypeAny;

export const insertDreamTokenSchema = createInsertSchema(dreamTokens).pick({
  dreamId: true,
  cocoonId: true,
  holderWallet: true,
  purpose: true,
  milestone: true,
  metadata: true,
}) as unknown as z.ZodTypeAny;

export const insertSuperSpineAgentSchema = createInsertSchema(superSpineAgents).pick({
  agentKey: true,
  name: true,
  capabilities: true,
  metadata: true,
}) as unknown as z.ZodTypeAny;

export const insertSuperSpineTaskSchema = createInsertSchema(superSpineTasks).pick({
  userId: true,
  agentKey: true,
  type: true,
  input: true,
}) as unknown as z.ZodTypeAny;

export const insertSuperSpineSubscriptionSchema = createInsertSchema(superSpineSubscriptions).pick({
  userId: true,
  agentKey: true,
  expiresAt: true,
  price: true,
}) as unknown as z.ZodTypeAny;

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

// Super Spine Types
export type SuperSpineAgent = typeof superSpineAgents.$inferSelect;
export type InsertSuperSpineAgent = z.infer<typeof insertSuperSpineAgentSchema>;
export type SuperSpineTask = typeof superSpineTasks.$inferSelect;
export type InsertSuperSpineTask = z.infer<typeof insertSuperSpineTaskSchema>;
export type SuperSpineSubscription = typeof superSpineSubscriptions.$inferSelect;
export type InsertSuperSpineSubscription = z.infer<typeof insertSuperSpineSubscriptionSchema>;

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
  lastUpdated: string;
  coreType?: 'Vision' | 'Tool' | 'Movement' | 'Story';
  description?: string;
  image?: string;
  status?: 'Draft' | 'Live' | 'Abandoned';
  title?: string;
  wallet: string;
  dreamStatus?: 'pending' | 'approved' | 'rejected' | 'evolved';
  dreamScore?: number;
  contributors?: CocoonContributor[];
  urgency?: number;
  origin?: string;
  aiScore?: number;
  aiTags?: string[];
  scoreBreakdown?: {
    originality: number;
    traction: number;
    collaboration: number;
    updates: number;
  };
  views?: number;
  likes?: number;
  comments?: number;
  editCount?: number;
  uniquenessScore?: number;
  createdAt?: string;
  reviewedAt?: string;
  reviewerId?: string;
  forkedFrom?: string;
  remixOf?: string;
  bountyId?: string;
  bountyToken?: 'SHEEP' | 'FLBY' | 'CORE';
  bountyAmount?: string;
  dreamCloud?: 'defi' | 'gaming' | 'zksync' | 'desci' | 'memes' | 'ai' | 'tools' | 'social' | 'art' | 'custom';
  evolutionType?: 'Fractal' | 'Chimera' | 'Divine' | 'Shadow' | 'Ethereal';
  remixCount?: number;
  fusionCount?: number;
  blessCount?: number;
  nightmareEscapes?: number;
  xp?: number;
  level?: number;
  blessings?: Array<{
    wallet: string;
    message: string;
    amount: number;
    timestamp: number;
  }>;
  swarmBoosted?: boolean;
  swarmBoostTime?: number;
  linkedDreams?: string[];
  networkStrength?: number;
  evolutionPath?: string;
  specialAbility?: string;
  originalScore?: number;
  evolutionTimestamp?: number;
}

// Legacy alias for backward compatibility
export interface DreamInterface extends Dream { }

// Nano Jobs - AI Generation History
export const nanoJobs = pgTable("nano_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  mode: text("mode").notNull(), // text2img, img2img, edit
  prompt: text("prompt").notNull(),
  latencyMs: integer("latency_ms"),
  creditsUsed: integer("credits_used").default(1),
  provider: text("provider"),
  provenanceJson: jsonb("provenance_json"),
  imageUrl: text("image_url"),
  parameters: jsonb("parameters"),
  status: text("status").notNull(), // completed, failed
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Nano Rate Limits override table (optional, but referenced in nano.ts)
export const nanoRateLimits = pgTable("nano_rate_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  limitHourly: integer("limit_hourly").notNull().default(10),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Media Assets table
export const mediaAssets = pgTable("media_assets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").$type<"image" | "video">().notNull(),
  title: text("title").notNull(),
  source: text("source").$type<"grok" | "sora" | "camera" | "other">().notNull(),
  file_path: text("file_path").notNull(),
  hash: text("hash").notNull().unique(),
  width: integer("width").default(0),
  height: integer("height").default(0),
  duration_ms: integer("duration_ms").default(0),
  size_bytes: integer("size_bytes").default(0),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  entities: text("entities").array().default(sql`'{}'::text[]`),
  credits: jsonb("credits").default(sql`'{}'::jsonb`),
  caption: text("caption").default(""),
  rights: text("rights").$type<"owned" | "licensed" | "unknown">().default("unknown"),
  rating: text("rating").$type<"A" | "B" | "C">().default("C"),
  collections: text("collections").array().default(sql`'{}'::text[]`),
  usage: jsonb("usage").$type<{
    posts: number;
    downloads: number;
    last_used_at: string | null;
  }>().default(sql`'{"posts": 0, "downloads": 0, "last_used_at": null}'::jsonb`),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Social Media Post Queue
export const postQueue = pgTable("post_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  media_id: varchar("media_id").notNull(),
  platform: text("platform").notNull(),
  caption: text("caption"),
  hashtags: text("hashtags").array().default(sql`'{}'::text[]`),
  status: text("status").$type<"draft" | "scheduled" | "posted" | "failed">().default("scheduled"),
  scheduled_at: timestamp("scheduled_at").notNull(),
  post_url: text("post_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
// Metrics Daily table
export const metricsDaily = pgTable("metrics_daily", {
  date: text("date").primaryKey(), // YYYY-MM-DD
  uptimePercent: integer("uptime_percent").default(100),
  avgHeartbeatMs: integer("avg_heartbeat_ms").default(0),
  haloCycles: integer("halo_cycles").default(0),
  tasksCompleted: integer("tasks_completed").default(0),
  tasksPending: integer("tasks_pending").default(0),
  events: integer("events").default(0),
  mediaAdded: integer("media_added").default(0),
  mediaPublic: integer("media_public").default(0),
  postsQueued: integer("posts_queued").default(0),
  postsPosted: integer("posts_posted").default(0),
  daNsaCount: integer("da_nsa_count").default(0),
  lastHaloCycleAt: timestamp("last_halo_cycle_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Snail's Oath & Homeostasis Tables
export const homeostasisBandEnum = pgEnum("homeostasis_band", ["green", "yellow", "red"]);

export const oaths = pgTable("oaths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(), // Farcaster FID or Wallet
  username: text("username"),
  status: text("status").$type<"active" | "broken" | "rehabilitating">().default("active"),
  signDate: timestamp("sign_date").defaultNow().notNull(),
  evidenceUrl: text("evidence_url"), // URL to the cast or proof
  kineticScore: integer("kinetic_score").default(0),
  lastPulseAt: timestamp("last_pulse_at"),
});

export const homeostasisBands = pgTable("homeostasis_bands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  band: homeostasisBandEnum("band").notNull(),
  pulseFrequency: integer("pulse_frequency").notNull(), // pulses per hour
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const slowDownTokens = pgTable("slow_down_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  amount: text("amount").notNull().default("1"),
  reason: text("reason"),
  txHash: text("tx_hash"),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
});

// The Pineal - Chakra & Spiritual Metrics
export const chakraSensors = pgTable("chakra_sensors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  chakraType: text("chakra_type").$type<"root" | "sacral" | "solar_plexus" | "heart" | "throat" | "third_eye" | "crown">().notNull(),
  resonancePercentage: integer("resonance_percentage").default(0), // 0-100
  lastAlignmentAt: timestamp("last_alignment_at").defaultNow().notNull(),
  vibeScent: text("vibe_scent"), // Scent detected via info-foraging agents
});

// The Metabolic - Intestines/Bowels (Waste Handling & Nutrient Extraction)
export const metabolicScraps = pgTable("metabolic_scraps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceNode: text("source_node").notNull(), // The failed agent or module
  wasteType: text("waste_type").$type<"code_debt" | "failed_exec" | "stale_config" | "log_bloat">().notNull(),
  rawContent: text("raw_content"),
  toxicityLevel: integer("toxicity_level").default(0), // High toxicity = needs immediate purging
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const nutrientExtractionLedger = pgTable("nutrient_extraction_ledger", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scrapId: varchar("scrap_id").notNull(),
  extractedNutrient: text("extracted_nutrient"), // The "gold" found in the waste
  reusabilityScore: integer("reusability_score").default(0),
  targetOrgan: text("target_organ"), // Where this nutrient is being repurposed
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
});

// Relations for new tables
export const oathsRelations = relations(oaths, ({ many }) => ({
  bands: many(homeostasisBands),
  tokens: many(slowDownTokens),
}));

export const homeostasisBandsRelations = relations(homeostasisBands, ({ one }) => ({
  oath: one(oaths, {
    fields: [homeostasisBands.userId],
    references: [oaths.userId],
  }),
}));

// Insert schemas for new tables
export const insertOathSchema = createInsertSchema(oaths).pick({
  userId: true,
  username: true,
  evidenceUrl: true,
}) as unknown as z.ZodTypeAny;

export const insertHomeostasisBandSchema = createInsertSchema(homeostasisBands).pick({
  userId: true,
  band: true,
  pulseFrequency: true,
}) as unknown as z.ZodTypeAny;


export type Oath = typeof oaths.$inferSelect;
export type InsertOath = z.infer<typeof insertOathSchema>;
export type HomeostasisBand = typeof homeostasisBands.$inferSelect;
export type InsertHomeostasisBand = z.infer<typeof insertHomeostasisBandSchema>;
export type SlowDownToken = typeof slowDownTokens.$inferSelect;
