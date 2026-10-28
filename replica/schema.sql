-- AI Video Clipper Schema

create type project_status as enum ('processing', 'completed', 'failed');
create type clip_status as enum ('pending', 'processed', 'exported');

create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  plan_type text not null default 'free' check (plan_type in ('free', 'pro', 'business')),
  credits_remaining int not null default 60,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table brand_kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null default 'Default Kit',
  logo_url text,
  primary_color text not null default '#8B5CF6',
  secondary_color text not null default '#3B82F6',
  font_family text not null default 'Inter',
  caption_style text not null default 'modern',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  source_url text,
  source_file_path text,
  status project_status not null default 'processing',
  duration_seconds int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on projects (user_id, status);

create table clips (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  start_time float not null,
  end_time float not null,
  virality_score int check (virality_score between 0 and 100),
  transcript_json jsonb not null default '[]',
  status clip_status not null default 'pending',
  output_file_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on clips (project_id);
