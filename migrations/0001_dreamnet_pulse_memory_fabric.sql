CREATE EXTENSION IF NOT EXISTS "pgcrypto";--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS "vector";--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "pulse_dumps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dump_date" date NOT NULL,
	"source" text DEFAULT 'chatgpt_daily_pulse' NOT NULL,
	"title" text,
	"content_sha256" text NOT NULL,
	"raw_uri" text,
	"redacted_uri" text,
	"summary" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT "pulse_dumps_content_sha256_unique" UNIQUE("content_sha256")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "pulse_knowledge_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pulse_dump_id" uuid REFERENCES "pulse_dumps"("id") ON DELETE CASCADE,
	"item_type" text NOT NULL,
	"priority" integer DEFAULT 3 NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"source_refs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"confidence" numeric DEFAULT 0.8 NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "agent_briefs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pulse_dump_id" uuid REFERENCES "pulse_dumps"("id") ON DELETE SET NULL,
	"brief_date" date NOT NULL,
	"agent_id" text NOT NULL,
	"agent_username" text,
	"role" text,
	"objective" text NOT NULL,
	"brief" text NOT NULL,
	"priority" integer DEFAULT 3 NOT NULL,
	"tool_routes" text[] DEFAULT '{}'::text[] NOT NULL,
	"action_queue" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"claimed_at" timestamptz,
	"completed_at" timestamptz
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "agent_memory_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" text NOT NULL,
	"passport_id" text,
	"memory_type" text NOT NULL,
	"content" text NOT NULL,
	"source" text DEFAULT 'pulse' NOT NULL,
	"source_pulse_item_id" uuid REFERENCES "pulse_knowledge_items"("id") ON DELETE SET NULL,
	"importance" integer DEFAULT 3 NOT NULL,
	"visibility" text DEFAULT 'agent' NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"embedding" vector(1536),
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"expires_at" timestamptz
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "signed_artifacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artifact_type" text NOT NULL,
	"actor_id" text NOT NULL,
	"intent_id" text NOT NULL,
	"target_ref" text,
	"target_state_before" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"proposed_mutation" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"risk_level" text DEFAULT 'low' NOT NULL,
	"policy_tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"human_rationale_short" text,
	"tooling_trace" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"signatures" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"snapshots" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"revert_hook" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"artifact_hash" text NOT NULL,
	"base_anchor_tx" text,
	"status" text DEFAULT 'proposed' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"applied_at" timestamptz,
	"reverted_at" timestamptz,
	CONSTRAINT "signed_artifacts_artifact_hash_unique" UNIQUE("artifact_hash")
);
--> statement-breakpoint

CREATE TABLE IF NOT EXISTS "social_action_intents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pulse_dump_id" uuid REFERENCES "pulse_dumps"("id") ON DELETE SET NULL,
	"agent_id" text NOT NULL,
	"platform" text NOT NULL,
	"action_type" text NOT NULL,
	"scheduled_for" timestamptz,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"risk_level" text DEFAULT 'low' NOT NULL,
	"idempotency_key" text NOT NULL,
	"status" text DEFAULT 'queued' NOT NULL,
	"result" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"claimed_at" timestamptz,
	"completed_at" timestamptz,
	CONSTRAINT "social_action_intents_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "pulse_knowledge_items_dump_idx" ON "pulse_knowledge_items" ("pulse_dump_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pulse_knowledge_items_type_priority_idx" ON "pulse_knowledge_items" ("item_type", "priority");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_briefs_agent_status_idx" ON "agent_briefs" ("agent_id", "status", "brief_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_memory_entries_agent_type_idx" ON "agent_memory_entries" ("agent_id", "memory_type", "created_at" DESC);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_memory_entries_tags_idx" ON "agent_memory_entries" USING gin ("tags");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_memory_entries_embedding_hnsw_idx" ON "agent_memory_entries" USING hnsw ("embedding" vector_cosine_ops) WITH (m = 16, ef_construction = 64);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "signed_artifacts_actor_status_idx" ON "signed_artifacts" ("actor_id", "status", "created_at" DESC);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "social_action_intents_platform_status_idx" ON "social_action_intents" ("platform", "status", "scheduled_for");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "social_action_intents_agent_status_idx" ON "social_action_intents" ("agent_id", "status", "created_at" DESC);
