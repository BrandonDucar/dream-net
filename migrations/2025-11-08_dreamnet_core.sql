-- DreamNet core migration: DreamStar persistence and Atlas Foundry registries
-- Generated 2025-11-08

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- DreamStar ingestion tracking
CREATE TABLE IF NOT EXISTS dreamstar_ingestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist text NOT NULL,
  project text NOT NULL,
  "references" jsonb DEFAULT '[]'::jsonb,
  notes text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dreamstar_ingestions_created_at_idx
  ON dreamstar_ingestions (created_at DESC);

-- DreamStar generation tracking
CREATE TABLE IF NOT EXISTS dreamstar_generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  artist text NOT NULL,
  project text NOT NULL,
  influence_weights jsonb DEFAULT '{}'::jsonb,
  deliverables text[] DEFAULT ARRAY[]::text[],
  deadline timestamptz,
  notes text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dreamstar_generations_created_at_idx
  ON dreamstar_generations (created_at DESC);

-- Atlas Agent Foundry trait registry
CREATE TABLE IF NOT EXISTS foundry_traits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source text NOT NULL,
  vector jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS foundry_traits_created_at_idx
  ON foundry_traits (created_at DESC);

-- Atlas Agent Foundry hybrid proposals
CREATE TABLE IF NOT EXISTS foundry_hybrids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parents jsonb DEFAULT '[]'::jsonb,
  score integer DEFAULT 0,
  notes text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS foundry_hybrids_created_at_idx
  ON foundry_hybrids (created_at DESC);
