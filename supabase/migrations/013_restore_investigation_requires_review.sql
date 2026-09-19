-- Restore the investigation field required by persist_analysis_results().
-- The original schema includes this column, but the live database is missing it.
alter table public.investigations
  add column if not exists requires_review integer not null default 0;
