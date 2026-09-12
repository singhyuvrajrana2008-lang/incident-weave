-- Defensive repair for partially initialized deployments.
-- Ensure the unknowns review status contract exists, then refresh PostgREST.
alter table public.unknowns
  add column if not exists review_status public.review_status not null default 'open';

notify pgrst, 'reload schema';
