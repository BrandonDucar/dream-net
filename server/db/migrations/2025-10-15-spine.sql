-- agent registry
create table if not exists agent_registry (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null, -- orchestrator|analyzer|harvester|notifier|ui
  capabilities jsonb not null, -- { "topics": ["score","archive","diagnostic"] }
  last_heartbeat timestamptz,
  status text default 'UNKNOWN', -- HEALTHY|DEGRADED|OFFLINE|UNKNOWN
  created_at timestamptz default now()
);

-- event bus
create table if not exists spine_events (
  id uuid primary key default gen_random_uuid(),
  topic text not null,            -- e.g. "score","archive","diagnostic"
  payload jsonb not null,
  priority int default 5,         -- 1 urgent .. 9 low
  status text default 'QUEUED',   -- QUEUED|CLAIMED|DONE|FAILED
  created_at timestamptz default now(),
  claimed_by uuid null,
  claimed_at timestamptz null
);

create index if not exists idx_spine_events_status_priority_created
  on spine_events(status, priority, created_at);
