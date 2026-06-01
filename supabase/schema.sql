create extension if not exists "uuid-ossp";

create table if not exists radar_runs (
  id uuid primary key default uuid_generate_v4(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null check (status in ('running', 'succeeded', 'failed')),
  keywords text[] not null default '{}',
  notes_scanned integer not null default 0,
  notes_selected integer not null default 0,
  error_message text
);

create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references radar_runs(id) on delete cascade,
  source_note_id text not null,
  keyword text not null,
  title text not null,
  author_name text not null,
  content text not null,
  note_url text,
  cover_url text,
  like_count integer not null default 0,
  comment_count integer not null default 0,
  collect_count integer not null default 0,
  heat_score numeric not null default 0,
  published_at timestamptz not null,
  captured_at timestamptz not null default now(),
  raw jsonb not null default '{}'::jsonb,
  unique (run_id, source_note_id, keyword)
);

create table if not exists analyses (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid references radar_runs(id) on delete cascade,
  keyword text,
  summary text not null,
  viral_patterns jsonb not null default '[]'::jsonb,
  title_formulas jsonb not null default '[]'::jsonb,
  shooting_suggestions jsonb not null default '[]'::jsonb,
  talking_script text not null,
  storyboard jsonb not null default '[]'::jsonb,
  risks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists notes_keyword_heat_idx on notes (keyword, heat_score desc);
create index if not exists notes_run_id_heat_idx on notes (run_id, heat_score desc);
create index if not exists notes_published_at_idx on notes (published_at desc);
create index if not exists analyses_created_at_idx on analyses (created_at desc);
