-- Store the per-evidence AI summary produced by the real analysis pipeline.
alter table public.evidence_extractions
  add column if not exists summary text;

-- Retire the previous RPC signature so only the summary-aware contract remains.
drop function if exists public.persist_analysis_results(
  uuid,
  uuid,
  uuid,
  text,
  jsonb,
  jsonb,
  jsonb
);

-- Extend the existing atomic persistence function with evidence summaries.
create or replace function public.persist_analysis_results(
  run_id uuid,
  inv uuid,
  owner uuid,
  assessment_confidence text,
  timeline jsonb,
  contradictions jsonb,
  unknowns jsonb,
  evidence_summaries jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  needs_review integer;
begin
  if not exists (
    select 1
    from analysis_runs
    where id = run_id
      and investigation_id = inv
      and requested_by = owner
      and status = 'processing'
  ) then
    raise exception 'Analysis run is not processing' using errcode = 'P0001';
  end if;

  delete from timeline_events where investigation_id = inv;
  delete from contradictions where investigation_id = inv;
  delete from unknowns where investigation_id = inv;

  insert into timeline_events (
    investigation_id,
    event_time,
    title,
    description,
    confidence,
    basis,
    evidence_ids
  )
  select
    inv,
    x.event_time,
    x.title,
    x.description,
    x.confidence,
    x.basis,
    x.evidence_ids
  from jsonb_to_recordset(timeline) as x(
    event_time timestamptz,
    title text,
    description text,
    confidence text,
    basis text,
    evidence_ids uuid[]
  );

  insert into contradictions (
    investigation_id,
    title,
    description,
    severity,
    confidence,
    evidence_ids,
    resolution_needed
  )
  select
    inv,
    x.title,
    x.description,
    x.severity,
    x.confidence,
    x.evidence_ids,
    x.resolution_needed
  from jsonb_to_recordset(contradictions) as x(
    title text,
    description text,
    severity text,
    confidence text,
    evidence_ids uuid[],
    resolution_needed text
  );

  insert into unknowns (
    investigation_id,
    title,
    description,
    severity,
    recommended_evidence,
    review_status
  )
  select
    inv,
    x.title,
    x.description,
    x.severity,
    x.recommended_evidence,
    'open'::public.review_status
  from jsonb_to_recordset(unknowns) as x(
    title text,
    description text,
    severity text,
    recommended_evidence text[]
  );

  -- Update an existing extraction row when present.
  update evidence_extractions ee
  set summary = x.summary
  from jsonb_to_recordset(evidence_summaries) as x(
    evidence_id uuid,
    summary text
  )
  where ee.evidence_id = x.evidence_id
    and exists (
      select 1
      from evidence e
      where e.id = x.evidence_id
        and e.investigation_id = inv
    );

  -- Create the extraction row when this evidence has not been analysed before.
  insert into evidence_extractions (evidence_id, summary)
  select x.evidence_id, x.summary
  from jsonb_to_recordset(evidence_summaries) as x(
    evidence_id uuid,
    summary text
  )
  where exists (
    select 1
    from evidence e
    where e.id = x.evidence_id
      and e.investigation_id = inv
  )
  and not exists (
    select 1
    from evidence_extractions ee
    where ee.evidence_id = x.evidence_id
  );

  needs_review := jsonb_array_length(contradictions) + jsonb_array_length(unknowns);

  update evidence
  set status = 'ready'
  where investigation_id = inv;

  update investigations
  set
    status = 'complete',
    confidence = case assessment_confidence
      when 'high' then 85
      when 'low' then 45
      else 68
    end,
    timeline_confidence = case
      when jsonb_array_length(timeline) > 0 then 70
      else 0
    end,
    requires_review = needs_review,
    updated_at = now()
  where id = inv;

  insert into notifications (
    user_id,
    investigation_id,
    title,
    body,
    kind
  )
  values (
    owner,
    inv,
    'Analysis completed',
    case
      when needs_review > 0
        then 'Review the detected contradictions and unknown evidence.'
      else 'The reconstruction is ready for review.'
    end,
    case when needs_review > 0 then 'warn' else 'success' end
  );

  insert into audit_log (
    user_id,
    investigation_id,
    action,
    metadata
  )
  values (
    owner,
    inv,
    'analysis_completed',
    jsonb_build_object(
      'analysisRunId', run_id,
      'eventCount', jsonb_array_length(timeline),
      'contradictionCount', jsonb_array_length(contradictions),
      'unknownCount', jsonb_array_length(unknowns)
    )
  );

  update analysis_runs
  set
    status = 'complete',
    stage = '08 Finalizing investigation',
    progress = 100,
    completed_at = now(),
    error_message = null
  where id = run_id;
end;
$$;

revoke all on function public.persist_analysis_results(
  uuid,
  uuid,
  uuid,
  text,
  jsonb,
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
  jsonb,
  jsonb
) to service_role;
