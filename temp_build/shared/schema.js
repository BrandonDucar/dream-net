"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertNotificationSchema = exports.insertWalletSchema = exports.insertDreamCoreSchema = exports.insertCocoonSchema = exports.insertDreamSchema = exports.insertUserSchema = exports.superSpineSubscriptionsRelations = exports.superSpineTasksRelations = exports.superSpineAgentsRelations = exports.walletsRelations = exports.dreamCoresRelations = exports.dreamTokensRelations = exports.dreamInvitesRelations = exports.evolutionChainsRelations = exports.notificationsRelations = exports.cocoonLogsRelations = exports.contributorsLogRelations = exports.cocoonsRelations = exports.dreamsRelations = exports.usersRelations = exports.superSpineSubscriptions = exports.superSpineTasks = exports.superSpineAgents = exports.subscriptionStatusEnum = exports.taskStatusEnum = exports.agentTierEnum = exports.agentCapabilityEnum = exports.agentStatusEnum = exports.dreamReminders = exports.dreamnetApiKeys = exports.wallets = exports.dreamCores = exports.dreamTokens = exports.dreamInvites = exports.evolutionChains = exports.notifications = exports.notificationTypeEnum = exports.cocoonLogs = exports.contributorsLog = exports.cocoons = exports.dreams = exports.users = exports.dreamStatusSimpleEnum = exports.dreamCoreTypeEnum = exports.actionTypeEnum = exports.contributorRoleEnum = exports.coreTypeEnum = exports.cocoonStageEnum = exports.dreamCategoryEnum = exports.dreamStatusEnum = void 0;
exports.insertSuperSpineSubscriptionSchema = exports.insertSuperSpineTaskSchema = exports.insertSuperSpineAgentSchema = exports.insertDreamTokenSchema = exports.insertDreamInviteSchema = exports.insertEvolutionChainSchema = exports.insertCocoonLogSchema = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_2 = require("drizzle-orm");
const drizzle_zod_1 = require("drizzle-zod");
// Enums
exports.dreamStatusEnum = (0, pg_core_1.pgEnum)("dream_status", ["pending", "approved", "rejected", "evolved"]);
exports.dreamCategoryEnum = (0, pg_core_1.pgEnum)("dream_category", ["lucid", "nightmare", "recurring", "prophetic", "abstract"]);
exports.cocoonStageEnum = (0, pg_core_1.pgEnum)("cocoon_stage", ["seedling", "incubating", "active", "metamorphosis", "emergence", "complete", "archived"]);
exports.coreTypeEnum = (0, pg_core_1.pgEnum)("core_type", ["resonance", "energy", "memory", "lucidity", "nightmare"]);
exports.contributorRoleEnum = (0, pg_core_1.pgEnum)("contributor_role", ["Builder", "Artist", "Coder", "Visionary", "Promoter"]);
exports.actionTypeEnum = (0, pg_core_1.pgEnum)("action_type", ["added", "removed"]);
// New enums for Dream interface compatibility
exports.dreamCoreTypeEnum = (0, pg_core_1.pgEnum)("dream_core_type", ["Vision", "Tool", "Movement", "Story"]);
exports.dreamStatusSimpleEnum = (0, pg_core_1.pgEnum)("dream_status_simple", ["Draft", "Live", "Abandoned"]);
// Users table (existing)
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
});
// Dreams table - updated to match Dream interface
exports.dreams = (0, pg_core_1.pgTable)("dreams", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(), // Updated from 'title' to 'name'
    creator: (0, pg_core_1.text)("creator").notNull(), // Updated from 'wallet' to 'creator'
    description: (0, pg_core_1.text)("description"),
    tags: (0, pg_core_1.text)("tags").array().default((0, drizzle_orm_1.sql) `'{}'::text[]`),
    score: (0, pg_core_1.integer)("score").default(0), // Simplified from dreamScore
    evolved: (0, pg_core_1.boolean)("evolved").default(false),
    lastUpdated: (0, pg_core_1.timestamp)("last_updated").defaultNow().notNull(),
    coreType: (0, exports.dreamCoreTypeEnum)("core_type"),
    image: (0, pg_core_1.text)("image"),
    status: (0, exports.dreamStatusSimpleEnum)("status").default("Draft"),
    // Keep some existing fields for backward compatibility
    wallet: (0, pg_core_1.text)("wallet").notNull(), // Legacy field
    title: (0, pg_core_1.text)("title"), // Legacy field
    urgency: (0, pg_core_1.integer)("urgency"),
    origin: (0, pg_core_1.text)("origin"),
    dreamStatus: (0, exports.dreamStatusEnum)("dream_status").default("pending"), // Legacy status
    isNightmare: (0, pg_core_1.boolean)("is_nightmare").default(false), // Trust score based flag
    trustScore: (0, pg_core_1.integer)("trust_score").default(50), // Wallet trust score
    aiScore: (0, pg_core_1.integer)("ai_score"),
    aiTags: (0, pg_core_1.text)("ai_tags").array().default((0, drizzle_orm_1.sql) `'{}'::text[]`),
    dreamScore: (0, pg_core_1.integer)("dream_score"),
    scoreBreakdown: (0, pg_core_1.jsonb)("score_breakdown").$type(),
    // Metrics for scoring calculations
    views: (0, pg_core_1.integer)("views").default(0),
    likes: (0, pg_core_1.integer)("likes").default(0),
    comments: (0, pg_core_1.integer)("comments").default(0),
    contributors: (0, pg_core_1.jsonb)("contributors").$type().default((0, drizzle_orm_1.sql) `'[]'::jsonb`),
    editCount: (0, pg_core_1.integer)("edit_count").default(0),
    uniquenessScore: (0, pg_core_1.integer)("uniqueness_score"), // From NLP analysis
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    reviewedAt: (0, pg_core_1.timestamp)("reviewed_at"),
    reviewerId: (0, pg_core_1.varchar)("reviewer_id"),
    // Dream lineage and bounty tracking
    forkedFrom: (0, pg_core_1.varchar)("forked_from"), // Original dream ID for lineage tracking
    remixOf: (0, pg_core_1.varchar)("remix_of"), // Parent dream ID for remix tracking
    bountyId: (0, pg_core_1.varchar)("bounty_id"), // Associated bounty ID for nightmare remediation
    bountyToken: (0, pg_core_1.text)("bounty_token").$type(), // Bounty token type
    bountyAmount: (0, pg_core_1.text)("bounty_amount").default('1000000000000000000'), // 1.0 in token units
    dreamCloud: (0, pg_core_1.text)("dream_cloud").$type(),
    // Evolution tracking
    evolutionType: (0, pg_core_1.text)("evolution_type").$type(),
    remixCount: (0, pg_core_1.integer)("remix_count").default(0),
    fusionCount: (0, pg_core_1.integer)("fusion_count").default(0),
    blessCount: (0, pg_core_1.integer)("bless_count").default(0),
    nightmareEscapes: (0, pg_core_1.integer)("nightmare_escapes").default(0),
    // XP and leveling
    xp: (0, pg_core_1.integer)("xp").default(0),
    level: (0, pg_core_1.integer)("level").default(1),
    // Blessings system
    blessings: (0, pg_core_1.jsonb)("blessings").$type().default((0, drizzle_orm_1.sql) `'[]'::jsonb`),
});
// Cocoons table
exports.cocoons = (0, pg_core_1.pgTable)("cocoons", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    dreamId: (0, pg_core_1.varchar)("dream_id").notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    description: (0, pg_core_1.text)("description").notNull(),
    creatorWallet: (0, pg_core_1.text)("creator_wallet").notNull(),
    stage: (0, exports.cocoonStageEnum)("stage").notNull().default("seedling"),
    tags: (0, pg_core_1.text)("tags").array().default((0, drizzle_orm_1.sql) `'{}'::text[]`),
    dreamScore: (0, pg_core_1.integer)("dream_score").default(0),
    lastUpdated: (0, pg_core_1.timestamp)("last_updated").defaultNow().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    evolutionNotes: (0, pg_core_1.text)("evolution_notes").array().default((0, drizzle_orm_1.sql) `'{}'::text[]`),
    metadata: (0, pg_core_1.jsonb)("metadata"),
    contributors: (0, pg_core_1.jsonb)("contributors").default((0, drizzle_orm_1.sql) `'[]'::jsonb`),
    minted: (0, pg_core_1.boolean)("minted").default(false).notNull(),
});
// Contributors log table
exports.contributorsLog = (0, pg_core_1.pgTable)("contributors_log", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    cocoonId: (0, pg_core_1.varchar)("cocoon_id").notNull(),
    walletAddress: (0, pg_core_1.text)("wallet_address").notNull(),
    role: (0, exports.contributorRoleEnum)("role").notNull(),
    actionType: (0, exports.actionTypeEnum)("action_type").notNull(),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow().notNull(),
    performedBy: (0, pg_core_1.text)("performed_by").notNull(), // Admin wallet who performed the action
});
// Cocoon logs table for stage transitions
exports.cocoonLogs = (0, pg_core_1.pgTable)("cocoon_logs", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    cocoonId: (0, pg_core_1.varchar)("cocoon_id").notNull(),
    previousStage: (0, exports.cocoonStageEnum)("previous_stage"),
    newStage: (0, exports.cocoonStageEnum)("new_stage").notNull(),
    adminWallet: (0, pg_core_1.text)("admin_wallet").notNull(),
    isOverride: (0, pg_core_1.boolean)("is_override").default(false).notNull(),
    notes: (0, pg_core_1.text)("notes"),
    timestamp: (0, pg_core_1.timestamp)("timestamp").defaultNow().notNull(),
});
// Notification types enum
exports.notificationTypeEnum = (0, pg_core_1.pgEnum)("notification_type", [
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
exports.notifications = (0, pg_core_1.pgTable)("notifications", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    recipientWallet: (0, pg_core_1.text)("recipient_wallet").notNull(),
    type: (0, exports.notificationTypeEnum)("type").notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    message: (0, pg_core_1.text)("message").notNull(),
    data: (0, pg_core_1.jsonb)("data"), // Additional data like dreamId, cocoonId, etc.
    isRead: (0, pg_core_1.boolean)("is_read").default(false).notNull(),
    emailSent: (0, pg_core_1.boolean)("email_sent").default(false).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    readAt: (0, pg_core_1.timestamp)("read_at"),
});
// Evolution Chains - Track dream progression through stages
exports.evolutionChains = (0, pg_core_1.pgTable)("evolution_chains", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    dreamId: (0, pg_core_1.varchar)("dream_id").notNull(),
    cocoonId: (0, pg_core_1.varchar)("cocoon_id"),
    currentStage: (0, pg_core_1.text)("current_stage").notNull(), // "dream", "cocoon_incubating", "cocoon_active", "cocoon_metamorphosis", "cocoon_emergence", "cocoon_complete"
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    evolvedAt: (0, pg_core_1.timestamp)("evolved_at"), // When dream became cocoon
    completedAt: (0, pg_core_1.timestamp)("completed_at"), // When cocoon reached complete stage
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional evolution data
    lastUpdated: (0, pg_core_1.timestamp)("last_updated").defaultNow().notNull(),
});
// Dream Invites - Track contributor invitations to dreams
exports.dreamInvites = (0, pg_core_1.pgTable)("dream_invites", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    dreamId: (0, pg_core_1.varchar)("dream_id").notNull(),
    invitedWallet: (0, pg_core_1.text)("invited_wallet").notNull(),
    inviterWallet: (0, pg_core_1.text)("inviter_wallet").notNull(),
    role: (0, exports.contributorRoleEnum)("role").notNull(),
    status: (0, pg_core_1.text)("status").notNull().default("pending"), // "pending", "accepted", "rejected"
    message: (0, pg_core_1.text)("message"), // Optional invitation message
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    respondedAt: (0, pg_core_1.timestamp)("responded_at"),
});
// Dream Core Tokens - Track token minting for cocoon milestones
exports.dreamTokens = (0, pg_core_1.pgTable)("dream_tokens", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    dreamId: (0, pg_core_1.varchar)("dream_id").notNull(),
    cocoonId: (0, pg_core_1.varchar)("cocoon_id"),
    holderWallet: (0, pg_core_1.text)("holder_wallet").notNull(),
    purpose: (0, pg_core_1.text)("purpose").notNull(), // "badge", "mint", "vote"
    milestone: (0, pg_core_1.text)("milestone"), // Stage that triggered the minting
    metadata: (0, pg_core_1.jsonb)("metadata"), // Additional token data
    mintedAt: (0, pg_core_1.timestamp)("minted_at").defaultNow().notNull(),
});
// Dream Cores table
exports.dreamCores = (0, pg_core_1.pgTable)("dream_cores", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.text)("name").notNull(),
    type: (0, exports.coreTypeEnum)("type").notNull(),
    energy: (0, pg_core_1.integer)("energy").notNull().default(100), // 0-100
    resonance: (0, pg_core_1.integer)("resonance").notNull().default(50), // 0-100
    isActive: (0, pg_core_1.boolean)("is_active").notNull().default(true),
    ownerId: (0, pg_core_1.varchar)("owner_id").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// Wallets table
exports.wallets = (0, pg_core_1.pgTable)("wallets", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull().unique(),
    dreamScore: (0, pg_core_1.integer)("dream_score").notNull().default(0),
    cocoonTokens: (0, pg_core_1.integer)("cocoon_tokens").notNull().default(0),
    coreFragments: (0, pg_core_1.integer)("core_fragments").notNull().default(0),
    totalValue: (0, pg_core_1.integer)("total_value").notNull().default(0),
    lastUpdated: (0, pg_core_1.timestamp)("last_updated").defaultNow().notNull(),
});
// Dream Reminders table for SMS scheduling
exports.dreamnetApiKeys = (0, pg_core_1.pgTable)("dreamnet_api_keys", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    keyHash: (0, pg_core_1.text)("key_hash").notNull().unique(),
    keyPrefix: (0, pg_core_1.text)("key_prefix").notNull(),
    userId: (0, pg_core_1.varchar)("user_id"),
    walletAddress: (0, pg_core_1.text)("wallet_address"),
    name: (0, pg_core_1.text)("name").notNull(),
    description: (0, pg_core_1.text)("description"),
    permissions: (0, pg_core_1.jsonb)("permissions").$type().default((0, drizzle_orm_1.sql) `'[]'::jsonb`),
    rateLimit: (0, pg_core_1.integer)("rate_limit").default(1000),
    lastUsedAt: (0, pg_core_1.timestamp)("last_used_at"),
    expiresAt: (0, pg_core_1.timestamp)("expires_at"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    revokedAt: (0, pg_core_1.timestamp)("revoked_at"),
    createdBy: (0, pg_core_1.text)("created_by"),
});
exports.dreamReminders = (0, pg_core_1.pgTable)("dream_reminders", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    dreamId: (0, pg_core_1.varchar)("dream_id").notNull(),
    userPhone: (0, pg_core_1.text)("user_phone").notNull(),
    remindAt: (0, pg_core_1.timestamp)("remind_at").notNull(),
    status: (0, pg_core_1.text)("status").$type().default("pending"),
    tags: (0, pg_core_1.text)("tags").array().default([]),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
// Super Spine Tables - Agent Orchestration Backbone
exports.agentStatusEnum = (0, pg_core_1.pgEnum)("agent_status", ["idle", "active", "busy", "error", "offline"]);
exports.agentCapabilityEnum = (0, pg_core_1.pgEnum)("agent_capability", ["code", "design", "analysis", "communication", "funding", "deployment"]);
exports.agentTierEnum = (0, pg_core_1.pgEnum)("agent_tier", ["Standard", "Premium", "Nightmare"]);
exports.taskStatusEnum = (0, pg_core_1.pgEnum)("task_status", ["pending", "assigned", "processing", "completed", "failed"]);
exports.subscriptionStatusEnum = (0, pg_core_1.pgEnum)("subscription_status", ["active", "expired", "cancelled"]);
// Super Spine Agents table
exports.superSpineAgents = (0, pg_core_1.pgTable)("super_spine_agents", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    agentKey: (0, pg_core_1.text)("agent_key").notNull().unique(),
    name: (0, pg_core_1.text)("name").notNull(),
    status: (0, exports.agentStatusEnum)("status").notNull().default("idle"),
    capabilities: (0, exports.agentCapabilityEnum)("capabilities").array().notNull().default((0, drizzle_orm_1.sql) `'{}'::agent_capability[]`),
    currentTask: (0, pg_core_1.varchar)("current_task"),
    taskQueue: (0, pg_core_1.varchar)("task_queue").array().default((0, drizzle_orm_1.sql) `'{}'::varchar[]`),
    health: (0, pg_core_1.jsonb)("health").$type().default((0, drizzle_orm_1.sql) `'{"uptime": 100, "successRate": 100, "avgResponseTime": 0, "errorCount": 0}'::jsonb`),
    metadata: (0, pg_core_1.jsonb)("metadata").$type().notNull(),
    registeredAt: (0, pg_core_1.timestamp)("registered_at").defaultNow().notNull(),
    lastActiveAt: (0, pg_core_1.timestamp)("last_active_at").defaultNow().notNull(),
});
// Super Spine Tasks table
exports.superSpineTasks = (0, pg_core_1.pgTable)("super_spine_tasks", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id"),
    agentKey: (0, pg_core_1.text)("agent_key").notNull(),
    type: (0, pg_core_1.text)("type").notNull(),
    input: (0, pg_core_1.jsonb)("input").notNull(),
    status: (0, exports.taskStatusEnum)("status").notNull().default("pending"),
    result: (0, pg_core_1.jsonb)("result"),
    error: (0, pg_core_1.text)("error"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
    startedAt: (0, pg_core_1.timestamp)("started_at"),
    completedAt: (0, pg_core_1.timestamp)("completed_at"),
});
// Super Spine Subscriptions table
exports.superSpineSubscriptions = (0, pg_core_1.pgTable)("super_spine_subscriptions", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.varchar)("user_id").notNull(),
    agentKey: (0, pg_core_1.text)("agent_key").notNull(),
    status: (0, exports.subscriptionStatusEnum)("status").notNull().default("active"),
    startedAt: (0, pg_core_1.timestamp)("started_at").defaultNow().notNull(),
    expiresAt: (0, pg_core_1.timestamp)("expires_at").notNull(),
    price: (0, pg_core_1.jsonb)("price").$type().notNull(),
});
// Relations
exports.usersRelations = (0, drizzle_orm_2.relations)(exports.users, ({ many, one }) => ({
    reviewedDreams: many(exports.dreams, { relationName: "reviewer" }),
    cocoons: many(exports.cocoons),
    dreamCores: many(exports.dreamCores),
    wallet: one(exports.wallets),
}));
exports.dreamsRelations = (0, drizzle_orm_2.relations)(exports.dreams, ({ one }) => ({
    reviewer: one(exports.users, {
        fields: [exports.dreams.reviewerId],
        references: [exports.users.id],
        relationName: "reviewer",
    }),
    cocoon: one(exports.cocoons),
}));
exports.cocoonsRelations = (0, drizzle_orm_2.relations)(exports.cocoons, ({ one, many }) => ({
    dream: one(exports.dreams, {
        fields: [exports.cocoons.dreamId],
        references: [exports.dreams.id],
    }),
    contributorLogs: many(exports.contributorsLog),
    cocoonLogs: many(exports.cocoonLogs),
}));
exports.contributorsLogRelations = (0, drizzle_orm_2.relations)(exports.contributorsLog, ({ one }) => ({
    cocoon: one(exports.cocoons, {
        fields: [exports.contributorsLog.cocoonId],
        references: [exports.cocoons.id],
    }),
}));
exports.cocoonLogsRelations = (0, drizzle_orm_2.relations)(exports.cocoonLogs, ({ one }) => ({
    cocoon: one(exports.cocoons, {
        fields: [exports.cocoonLogs.cocoonId],
        references: [exports.cocoons.id],
    }),
}));
exports.notificationsRelations = (0, drizzle_orm_2.relations)(exports.notifications, ({ one }) => ({
// No direct relations needed for now, but can be added later
}));
exports.evolutionChainsRelations = (0, drizzle_orm_2.relations)(exports.evolutionChains, ({ one }) => ({
    dream: one(exports.dreams, {
        fields: [exports.evolutionChains.dreamId],
        references: [exports.dreams.id],
    }),
    cocoon: one(exports.cocoons, {
        fields: [exports.evolutionChains.cocoonId],
        references: [exports.cocoons.id],
    }),
}));
exports.dreamInvitesRelations = (0, drizzle_orm_2.relations)(exports.dreamInvites, ({ one }) => ({
    dream: one(exports.dreams, {
        fields: [exports.dreamInvites.dreamId],
        references: [exports.dreams.id],
    }),
}));
exports.dreamTokensRelations = (0, drizzle_orm_2.relations)(exports.dreamTokens, ({ one }) => ({
    dream: one(exports.dreams, {
        fields: [exports.dreamTokens.dreamId],
        references: [exports.dreams.id],
    }),
    cocoon: one(exports.cocoons, {
        fields: [exports.dreamTokens.cocoonId],
        references: [exports.cocoons.id],
    }),
}));
exports.dreamCoresRelations = (0, drizzle_orm_2.relations)(exports.dreamCores, ({ one }) => ({
    owner: one(exports.users, {
        fields: [exports.dreamCores.ownerId],
        references: [exports.users.id],
    }),
}));
exports.walletsRelations = (0, drizzle_orm_2.relations)(exports.wallets, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.wallets.userId],
        references: [exports.users.id],
    }),
}));
// Super Spine Relations
exports.superSpineAgentsRelations = (0, drizzle_orm_2.relations)(exports.superSpineAgents, ({ many }) => ({
    tasks: many(exports.superSpineTasks),
    subscriptions: many(exports.superSpineSubscriptions),
}));
exports.superSpineTasksRelations = (0, drizzle_orm_2.relations)(exports.superSpineTasks, ({ one }) => ({
    agent: one(exports.superSpineAgents, {
        fields: [exports.superSpineTasks.agentKey],
        references: [exports.superSpineAgents.agentKey],
    }),
}));
exports.superSpineSubscriptionsRelations = (0, drizzle_orm_2.relations)(exports.superSpineSubscriptions, ({ one }) => ({
    agent: one(exports.superSpineAgents, {
        fields: [exports.superSpineSubscriptions.agentKey],
        references: [exports.superSpineAgents.agentKey],
    }),
}));
// Insert schemas
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
});
exports.insertDreamSchema = (0, drizzle_zod_1.createInsertSchema)(exports.dreams).pick({
    wallet: true,
    title: true,
    description: true,
    tags: true,
    urgency: true,
    origin: true,
    forkedFrom: true,
    bountyId: true,
});
exports.insertCocoonSchema = (0, drizzle_zod_1.createInsertSchema)(exports.cocoons).pick({
    dreamId: true,
    title: true,
    description: true,
    creatorWallet: true,
    evolutionNotes: true,
});
exports.insertDreamCoreSchema = (0, drizzle_zod_1.createInsertSchema)(exports.dreamCores).pick({
    name: true,
    type: true,
    ownerId: true,
});
exports.insertWalletSchema = (0, drizzle_zod_1.createInsertSchema)(exports.wallets).pick({
    userId: true,
});
exports.insertNotificationSchema = (0, drizzle_zod_1.createInsertSchema)(exports.notifications).pick({
    recipientWallet: true,
    type: true,
    title: true,
    message: true,
    data: true,
});
exports.insertCocoonLogSchema = (0, drizzle_zod_1.createInsertSchema)(exports.cocoonLogs).pick({
    cocoonId: true,
    previousStage: true,
    newStage: true,
    adminWallet: true,
    isOverride: true,
    notes: true,
});
exports.insertEvolutionChainSchema = (0, drizzle_zod_1.createInsertSchema)(exports.evolutionChains).pick({
    dreamId: true,
    cocoonId: true,
    currentStage: true,
    evolvedAt: true,
    completedAt: true,
    metadata: true,
});
exports.insertDreamInviteSchema = (0, drizzle_zod_1.createInsertSchema)(exports.dreamInvites).pick({
    dreamId: true,
    invitedWallet: true,
    inviterWallet: true,
    role: true,
    message: true,
});
exports.insertDreamTokenSchema = (0, drizzle_zod_1.createInsertSchema)(exports.dreamTokens).pick({
    dreamId: true,
    cocoonId: true,
    holderWallet: true,
    purpose: true,
    milestone: true,
    metadata: true,
});
exports.insertSuperSpineAgentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.superSpineAgents).pick({
    agentKey: true,
    name: true,
    capabilities: true,
    metadata: true,
});
exports.insertSuperSpineTaskSchema = (0, drizzle_zod_1.createInsertSchema)(exports.superSpineTasks).pick({
    userId: true,
    agentKey: true,
    type: true,
    input: true,
});
exports.insertSuperSpineSubscriptionSchema = (0, drizzle_zod_1.createInsertSchema)(exports.superSpineSubscriptions).pick({
    userId: true,
    agentKey: true,
    expiresAt: true,
    price: true,
});
