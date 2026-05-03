CREATE TYPE "public"."action_type" AS ENUM('added', 'removed');--> statement-breakpoint
CREATE TYPE "public"."cocoon_stage" AS ENUM('seedling', 'incubating', 'active', 'metamorphosis', 'emergence', 'complete', 'archived');--> statement-breakpoint
CREATE TYPE "public"."contributor_role" AS ENUM('Builder', 'Artist', 'Coder', 'Visionary', 'Promoter');--> statement-breakpoint
CREATE TYPE "public"."core_type" AS ENUM('resonance', 'energy', 'memory', 'lucidity', 'nightmare');--> statement-breakpoint
CREATE TYPE "public"."dream_category" AS ENUM('lucid', 'nightmare', 'recurring', 'prophetic', 'abstract');--> statement-breakpoint
CREATE TYPE "public"."dream_core_type" AS ENUM('Vision', 'Tool', 'Movement', 'Story');--> statement-breakpoint
CREATE TYPE "public"."dream_status" AS ENUM('pending', 'approved', 'rejected', 'evolved');--> statement-breakpoint
CREATE TYPE "public"."dream_status_simple" AS ENUM('Draft', 'Live', 'Abandoned');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('dream_approved', 'cocoon_created', 'cocoon_stage_updated', 'contributor_added', 'contributor_removed', 'dream_score_updated', 'cocoon_score_insufficient', 'nft_minted', 'cocoon_archived');--> statement-breakpoint
CREATE TABLE "agent_licenses" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" varchar NOT NULL,
	"license_type" text NOT NULL,
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"revoked" boolean DEFAULT false NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "cocoon_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cocoon_id" varchar NOT NULL,
	"previous_stage" "cocoon_stage",
	"new_stage" "cocoon_stage" NOT NULL,
	"admin_wallet" text NOT NULL,
	"is_override" boolean DEFAULT false NOT NULL,
	"notes" text,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cocoons" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dream_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"creator_wallet" text NOT NULL,
	"stage" "cocoon_stage" DEFAULT 'seedling' NOT NULL,
	"tags" text[] DEFAULT '{}'::text[],
	"dream_score" integer DEFAULT 0,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"evolution_notes" text[] DEFAULT '{}'::text[],
	"metadata" jsonb,
	"contributors" jsonb DEFAULT '[]'::jsonb,
	"minted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contributors_log" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cocoon_id" varchar NOT NULL,
	"wallet_address" text NOT NULL,
	"role" "contributor_role" NOT NULL,
	"action_type" "action_type" NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"performed_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dream_cores" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "core_type" NOT NULL,
	"energy" integer DEFAULT 100 NOT NULL,
	"resonance" integer DEFAULT 50 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"owner_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dream_invites" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dream_id" varchar NOT NULL,
	"invited_wallet" text NOT NULL,
	"inviter_wallet" text NOT NULL,
	"role" "contributor_role" NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "dream_reminders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dream_id" varchar NOT NULL,
	"user_phone" text NOT NULL,
	"remind_at" timestamp NOT NULL,
	"status" text DEFAULT 'pending',
	"tags" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dream_tokens" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dream_id" varchar NOT NULL,
	"cocoon_id" varchar,
	"holder_wallet" text NOT NULL,
	"purpose" text NOT NULL,
	"milestone" text,
	"metadata" jsonb,
	"minted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dreamnet_api_keys" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key_hash" text NOT NULL,
	"key_prefix" text NOT NULL,
	"user_id" varchar,
	"wallet_address" text,
	"name" text NOT NULL,
	"description" text,
	"permissions" jsonb DEFAULT '[]'::jsonb,
	"rate_limit" integer DEFAULT 1000,
	"last_used_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp,
	"created_by" text,
	CONSTRAINT "dreamnet_api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "dreams" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"creator" text NOT NULL,
	"description" text,
	"tags" text[] DEFAULT '{}'::text[],
	"score" integer DEFAULT 0,
	"evolved" boolean DEFAULT false,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"core_type" "dream_core_type",
	"image" text,
	"status" "dream_status_simple" DEFAULT 'Draft',
	"wallet" text NOT NULL,
	"title" text,
	"urgency" integer,
	"origin" text,
	"dream_status" "dream_status" DEFAULT 'pending',
	"is_nightmare" boolean DEFAULT false,
	"trust_score" integer DEFAULT 50,
	"ai_score" integer,
	"ai_tags" text[] DEFAULT '{}'::text[],
	"dream_score" integer,
	"score_breakdown" jsonb,
	"views" integer DEFAULT 0,
	"likes" integer DEFAULT 0,
	"comments" integer DEFAULT 0,
	"contributors" jsonb DEFAULT '[]'::jsonb,
	"edit_count" integer DEFAULT 0,
	"uniqueness_score" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"reviewer_id" varchar,
	"forked_from" varchar,
	"remix_of" varchar,
	"bounty_id" varchar,
	"bounty_token" text,
	"bounty_amount" text DEFAULT '1000000000000000000',
	"dream_cloud" text,
	"evolution_type" text,
	"remix_count" integer DEFAULT 0,
	"fusion_count" integer DEFAULT 0,
	"bless_count" integer DEFAULT 0,
	"nightmare_escapes" integer DEFAULT 0,
	"xp" integer DEFAULT 0,
	"level" integer DEFAULT 1,
	"blessings" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "evolution_chains" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dream_id" varchar NOT NULL,
	"cocoon_id" varchar,
	"current_stage" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"evolved_at" timestamp,
	"completed_at" timestamp,
	"metadata" jsonb,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guilds" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"charter" text,
	"leader_id" varchar,
	"member_count" integer DEFAULT 0,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_wallet" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"email_sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "swarm_agents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"guild_id" text,
	"status" text DEFAULT 'idle',
	"wallet_address" text,
	"capabilities" text[] DEFAULT '{}'::text[],
	"last_heartbeat" timestamp DEFAULT now(),
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"parent_id" varchar,
	"license_level" integer DEFAULT 0,
	"workspace_id" varchar,
	"maturation" jsonb DEFAULT '{"skills": [], "isMature": false, "registrationDate": 0, "mentors": []}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"dream_score" integer DEFAULT 0 NOT NULL,
	"cocoon_tokens" integer DEFAULT 0 NOT NULL,
	"core_fragments" integer DEFAULT 0 NOT NULL,
	"total_value" integer DEFAULT 0 NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "wallets_user_id_unique" UNIQUE("user_id")
);
