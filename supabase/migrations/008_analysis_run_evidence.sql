-- Record the immutable evidence set for each analysis run.  This makes the
-- Edge Function's evidence-reference validation auditable and prevents a run
-- from being re-used with a different selection.
create table if not exists public.analysis_run_evidence (
  analysis_run_id uuid not null references public.analysis_runs(id) on delete cascade,
  evidence_id uuid not null references public.evidence(id) on delete restrict,
  primary key (analysis_run_id, evidence_id)
);
alter table public.analysis_run_evidence enable row level security;
create policy "analysis run evidence through investigation" on public.analysis_run_evidence
  for all using (exists (select 1 from public.analysis_runs ar where ar.id = analysis_run_id and public.is_investigation_owner(ar.investigation_id)))
  with check (exists (select 1 from public.analysis_runs ar where ar.id = analysis_run_id and public.is_investigation_owner(ar.investigation_id)));
