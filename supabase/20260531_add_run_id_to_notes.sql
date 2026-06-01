alter table notes
  add column if not exists run_id uuid references radar_runs(id) on delete cascade;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conname = 'notes_source_note_id_keyword_key'
      and conrelid = 'notes'::regclass
  ) then
    alter table notes drop constraint notes_source_note_id_keyword_key;
  end if;
end $$;

create unique index if not exists notes_run_source_keyword_key
  on notes (run_id, source_note_id, keyword);

create index if not exists notes_run_id_heat_idx
  on notes (run_id, heat_score desc);
