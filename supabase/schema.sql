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
