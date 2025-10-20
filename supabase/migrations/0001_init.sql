-- Initial schema for Predict app
-- This SQL is intended to be applied to your Supabase Postgres project.
-- It creates core tables and open policies for the MVP (no Auth yet).

-- Extensions (for UUID generation)
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ==========================
-- Core entities
-- ==========================

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  thumbnail text,
  votes integer not null default 0,
  pool numeric(18,2) not null default 0,
  comments jsonb default '[]'::jsonb,
  options jsonb default '[]'::jsonb,
  duration integer not null default 0, -- milliseconds
  created_at timestamptz not null default now(),
  author jsonb,
  top_voters jsonb default '[]'::jsonb
);

create index if not exists predictions_createdAt_idx on public.predictions ("created_at");

-- Users (for future Auth integration)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username varchar(64) not null,
  twitter_handle varchar(64),
  avatar_url text,
  banner_url text,
  votes_count integer not null default 0,
  accuracy_percentage numeric(5,2) not null default 0,
  winnings_amount numeric(18,2) not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Votes
create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null references public.predictions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  option_selected integer not null, -- index into options array
  amount numeric(18,2) not null,
  timestamp timestamptz default now()
);

-- Comments
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  prediction_id uuid not null references public.predictions(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  text text not null,
  timestamp timestamptz default now()
);

-- ==========================
-- Storage buckets (avatars, banners, thumbnails, option-images)
-- ==========================
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('banners', 'banners', true),
  ('thumbnails', 'thumbnails', true),
  ('option-images', 'option-images', true)
on conflict (id) do nothing;

-- ==========================
-- RLS policies (open for MVP; restrict later when Auth is added)
-- ==========================

-- Predictions
alter table public.predictions enable row level security;
create policy "Public read predictions" on public.predictions for select using (true);
create policy "Public insert predictions" on public.predictions for insert with check (true);
create policy "Public update predictions" on public.predictions for update using (true) with check (true);

-- Votes
alter table public.votes enable row level security;
create policy "Public read votes" on public.votes for select using (true);
create policy "Public insert votes" on public.votes for insert with check (true);

-- Comments
alter table public.comments enable row level security;
create policy "Public read comments" on public.comments for select using (true);
create policy "Public insert comments" on public.comments for insert with check (true);
