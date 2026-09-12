-- Integrity repairs for analysis lifecycle, audit logging, and storage ownership.
create unique index if not exists one_active_analysis_per_investigation on public.analysis_runs(investigation_id) where status in ('queued','processing');
create policy "own audit insert" on public.audit_log for insert to authenticated with check (user_id=auth.uid());
create index if not exists evidence_investigation_idx on public.evidence(investigation_id);
create index if not exists analysis_runs_investigation_idx on public.analysis_runs(investigation_id, created_at desc);
create index if not exists timeline_events_investigation_time_idx on public.timeline_events(investigation_id, event_time);
