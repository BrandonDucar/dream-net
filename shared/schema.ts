import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, pgEnum, jsonb, serial } from "drizzle-orm/pg-core";
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

// Swarm Agents Table
export const swarmAgents = pgTable("swarm_agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  guildId: text("guild_id"),
  status: text("status").default("idle"), // idle, active, offline
  walletAddress: text("wallet_address"),
  capabilities: text("capabilities").array().default(sql`'{}'::text[]`),
  lastHeartbeat: timestamp("last_heartbeat").defaultNow(),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  
  // Farcaster Identity
  fid: integer("fid"),
  signerUuid: text("signer_uuid"),
  
  // Genealogy & Maturity
  parentId: varchar("parent_id"), // Lineage tracking
  licenseLevel: integer("license_level").default(0), // 0=Hatchling, 1=Worker, 2=Sovereign, 3=Elder
  workspaceId: varchar("workspace_id"), // Registered home/workspace
  maturation: jsonb("maturation").$type<{
    skills: string[];
    isMature: boolean;
    registrationDate: number;
    mentors: string[];
  }>().default(sql`'{"skills": [], "isMature": false, "registrationDate": 0, "mentors": []}'::jsonb`),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  // Social Health
  qualityScore: integer("quality_score").default(50), // 0-100 (from Neynar/Internal)
  isBanned: boolean("is_banned").default(false),
});

// Swarm Memories Table
export const swarmMemories = pgTable("swarm_memories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pieceId: text("piece_id"), // Reference to Pieces OS ID
  content: text("content").notNull(),
  source: text("source").default("PiecesOS"),
  tags: text("tags").array().default(sql`'{}'::text[]`),
  relevanceScore: integer("relevance_score").default(0),
  agentId: varchar("agent_id"), // Optional: Which agent "extracted" or "owns" this memory
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Farcaster Outbound Actions (The Action Ledger)
export const farcasterOutboundActions = pgTable("farcaster_outbound_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull(),
  actionType: text("action_type").notNull(), // cast, reply, reaction, follow
  targetId: text("target_id"), // cast hash, FID, or channel ID
  content: text("content"),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  status: text("status").default("pending"), // pending, sent, failed
  txHash: text("tx_hash"), // Farcaster cast hash or onchain tx
  errorMessage: text("error_message"),
  scheduledAt: timestamp("scheduled_at"),
  executedAt: timestamp("executed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Farcaster Channels Registry
export const farcasterChannels = pgTable("farcaster_channels", {
  id: text("id").primaryKey(), // channel_id
  name: text("name").notNull(),
  description: text("description"),
  pfpUrl: text("pfp_url"),
  parentUrl: text("parent_url"),
  followerCount: integer("follower_count").default(0),
  isModerated: boolean("is_moderated").default(false),
  lastIndexedAt: timestamp("last_indexed_at"),
});

export const fundingLeads = pgTable("funding_leads", {
  id: text("id").primaryKey(), // lead:a16z-crypto
  name: text("name").notNull(),
  type: text("type").notNull(), // vc, angel, grant, etc.
  email: text("email"),
  website: text("website"),
  tags: text("tags").array(),
  notes: text("notes"),
  stage: text("stage").notNull().default("new"), // new, qualified, contacted, replied, hot, dead
  
  // Scores
  dreamFitScore: integer("dream_fit_score"),
  riskScore: integer("risk_score"),
  trustScore: integer("trust_score"),
  priorityScore: integer("priority_score"),
  hotScore: integer("hot_score"),
  isHot: boolean("is_hot").default(false),
  
  // Metadata
  lastContactedAt: timestamp("last_contacted_at"),
  lastReplyAt: timestamp("last_reply_at"),
  nextFollowUpAt: timestamp("next_follow_up_at"),
  contactCount: integer("contact_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const emailQueue = pgTable("email_queue", {
  id: text("id").primaryKey(), // queue:lead-id:timestamp
  leadId: text("lead_id").references(() => fundingLeads.id).notNull(),
  toEmail: text("to_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").notNull().default("pending"), // pending, sent, failed
  lastError: text("last_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
});

export const emailDrafts = pgTable("email_drafts", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").references(() => fundingLeads.id),
  toEmail: text("to_email").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  html: text("html"),
  metadata: jsonb("metadata"), // For InboxSquared research/geo/topics
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const grantApplicationDrafts = pgTable("grant_application_drafts", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => fundingLeads.id).notNull(),
  applicationType: text("application_type").notNull(), // 'email', 'form', 'proposal'
  content: jsonb("content").notNull(),
  status: text("status").default("draft").notNull(), // 'draft', 'finalized', 'submitted'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const libraries = pgTable("libraries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  version: text("version").notNull(),
  description: text("description"),
  packagePath: text("package_path").notNull().unique(),
  author: text("author"),
  license: text("license"),
  dependencies: jsonb("dependencies"),
  metadata: jsonb("metadata"),
  lastScannedAt: timestamp("last_scanned_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Agent Licenses Table
export const agentLicenses = pgTable("agent_licenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  agentId: varchar("agent_id").notNull(),
  licenseType: text("license_type").notNull(), // "Child-Spawning", "Financial-Autonomy", "Cross-Chain-Execution"
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  revoked: boolean("revoked").default(false).notNull(),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
});

// Guilds Table
export const guilds = pgTable("guilds", {
  id: text("id").primaryKey(), // piclaw, pyclaw, etc.
  name: text("name").notNull(),
  charter: text("charter"),
  leaderId: varchar("leader_id"),
  memberCount: integer("member_count").default(0),
  metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

export const swarmAgentsRelations = relations(swarmAgents, ({ one, many }) => ({
  parent: one(swarmAgents, {
    fields: [swarmAgents.parentId],
    references: [swarmAgents.id],
    relationName: "lineage",
  }),
  children: many(swarmAgents, { relationName: "lineage" }),
  licenses: many(agentLicenses),
}));

export const fundingLeadsRelations = relations(fundingLeads, ({ many }) => ({
  queueItems: many(emailQueue),
  drafts: many(emailDrafts),
  grantDrafts: many(grantApplicationDrafts),
}));

export const emailQueueRelations = relations(emailQueue, ({ one }) => ({
  lead: one(fundingLeads, {
    fields: [emailQueue.leadId],
    references: [fundingLeads.id],
  }),
}));

export const emailDraftsRelations = relations(emailDrafts, ({ one }) => ({
  lead: one(fundingLeads, {
    fields: [emailDrafts.leadId],
    references: [fundingLeads.id],
  }),
}));

export const grantApplicationDraftsRelations = relations(grantApplicationDrafts, ({ one }) => ({
  lead: one(fundingLeads, {
    fields: [grantApplicationDrafts.leadId],
    references: [fundingLeads.id],
  }),
}));

export const agentLicensesRelations = relations(agentLicenses, ({ one }) => ({
  agent: one(swarmAgents, {
    fields: [agentLicenses.agentId],
    references: [swarmAgents.id],
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

export const insertFundingLeadSchema = createInsertSchema(fundingLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}) as unknown as z.ZodTypeAny;

export const insertEmailQueueSchema = createInsertSchema(emailQueue).omit({
  id: true,
  createdAt: true,
}) as unknown as z.ZodTypeAny;

export const insertEmailDraftSchema = createInsertSchema(emailDrafts).omit({
  id: true,
  createdAt: true,
}) as unknown as z.ZodTypeAny;

export const insertGrantApplicationDraftSchema = createInsertSchema(grantApplicationDrafts).omit({
  id: true,
  createdAt: true,
}) as unknown as z.ZodTypeAny;

export const insertLibrarySchema = createInsertSchema(libraries).omit({
  id: true,
  lastScannedAt: true,
  createdAt: true,
}) as unknown as z.ZodTypeAny;

export const insertDreamInviteSchema = createInsertSchema(dreamInvites).pick({
  dreamId: true,
  invitedWallet: true,
  inviterWallet: true,
  role: true,
  message: true,
}) as unknown as z.ZodTypeAny;

export const dreamTokenSchema = createInsertSchema(dreamTokens).pick({
  dreamId: true,
  cocoonId: true,
  holderWallet: true,
  purpose: true,
  milestone: true,
  metadata: true,
});

export const insertSwarmAgentSchema = createInsertSchema(swarmAgents).pick({
  name: true,
  type: true,
  guildId: true,
  walletAddress: true,
  capabilities: true,
  parentId: true,
  licenseLevel: true,
  workspaceId: true,
  maturation: true,
}) as unknown as z.ZodTypeAny;

export const insertAgentLicenseSchema = createInsertSchema(agentLicenses).pick({
  agentId: true,
  licenseType: true,
  expiresAt: true,
  metadata: true,
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

export type FundingLeadRecord = typeof fundingLeads.$inferSelect;
export type EmailQueueRecord = typeof emailQueue.$inferSelect;
export type EmailDraftRecord = typeof emailDrafts.$inferSelect;
export type GrantApplicationDraftRecord = typeof grantApplicationDrafts.$inferSelect;
export type LibraryRecord = typeof libraries.$inferSelect;
export type InsertLibrary = z.infer<typeof insertLibrarySchema>;

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
export interface DreamInterface extends Dream {}
