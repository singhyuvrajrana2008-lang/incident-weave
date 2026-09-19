-- Keep the analysis persistence RPC backward-compatible while Edge Functions
-- roll out independently from database migrations.
--
-- Migration 014 introduced the summary-aware 8-argument signature and removed
-- the legacy 7-argument signature. A deployed Edge Function can lag behind
-- the database migration, so restore the legacy signature as a thin wrapper.
create or replace function public.persist_analysis_results(
  run_id uuid,
  inv uuid,
  owner uuid,
  assessment_confidence text,
  timeline jsonb,
  contradictions jsonb,
  unknowns jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.persist_analysis_results(
    run_id,
    inv,
    owner,
    assessment_confidence,
    timeline,
    contradictions,
    unknowns,
    '[]'::jsonb
  );
end;
$$;

revoke all on function public.persist_analysis_results(
  uuid,
  uuid,
  uuid,
  text,
  jsonb,
  jsonb,
  jsonb
) from public;

grant execute on function public.persist_analysis_results(
  uuid,
  uuid,
  uuid,
  text,
  jsonb,
  jsonb,
  jsonb
) to service_role;
