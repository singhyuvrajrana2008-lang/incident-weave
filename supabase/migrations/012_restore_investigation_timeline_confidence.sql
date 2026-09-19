-- Restore a schema field required by the persisted analysis result contract.
-- The original schema declares this column on public.investigations, but the live
-- project was missing it, causing persist_analysis_results() to fail at finalization.
alter table public.investigations
  add column if not exists timeline_confidence integer not null default 0
  check (timeline_confidence between 0 and 100);
