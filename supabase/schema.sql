-- Run this SQL in your Supabase SQL Editor to create the evaluations table
-- Supabase Dashboard → SQL Editor → New Query → Paste & Run

create table if not exists evaluations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  sermon_title text not null,
  preach_date date,
  primary_goal text,
  total_score integer not null default 0,
  sacred_foundation jsonb not null default '{}',
  structural_weight jsonb not null default '{}',
  vocal_cadence jsonb not null default '{}',
  post_analysis jsonb not null default '{}',
  evaluator_type text not null default 'human',
  evaluator_name text not null default ''
);

-- Enable Row Level Security (recommended)
alter table evaluations enable row level security;

-- Allow all operations for authenticated users (adjust as needed)
create policy "Allow all for authenticated users"
  on evaluations
  for all
  using (true)
  with check (true);

-- ============================================================================
-- STORAGE BUCKET for sermon uploads (used by Deepgram transcription)
-- ============================================================================
-- This bucket holds audio/video files temporarily while Deepgram transcribes
-- them. Files are auto-deleted after transcription completes.
--
-- STEP 1: Create the bucket (skip if you already made it in the dashboard)

insert into storage.buckets (id, name, public)
values ('sermon-uploads', 'sermon-uploads', true)
on conflict (id) do nothing;

-- STEP 2: Storage policies — MUST be run even if you created the bucket
-- in the dashboard. These grant permission to upload, read, and delete files.
-- Safe to re-run — drops old policies first to avoid "already exists" errors.

drop policy if exists "Allow public uploads to sermon-uploads" on storage.objects;
create policy "Allow public uploads to sermon-uploads"
  on storage.objects for insert
  with check (bucket_id = 'sermon-uploads');

drop policy if exists "Allow public reads from sermon-uploads" on storage.objects;
create policy "Allow public reads from sermon-uploads"
  on storage.objects for select
  using (bucket_id = 'sermon-uploads');

drop policy if exists "Allow public deletes from sermon-uploads" on storage.objects;
create policy "Allow public deletes from sermon-uploads"
  on storage.objects for delete
  using (bucket_id = 'sermon-uploads');
