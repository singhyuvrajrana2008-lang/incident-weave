-- Align unknowns.recommended_evidence with the application contract.
-- Some deployments have this column as jsonb while others are text[].
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'unknowns'
      and column_name = 'recommended_evidence'
      and data_type = 'jsonb'
  ) then
    alter table public.unknowns
      alter column recommended_evidence drop default,
      alter column recommended_evidence type text[]
      using coalesce(array(select jsonb_array_elements_text(recommended_evidence)), '{}'::text[]),
      alter column recommended_evidence set default '{}'::text[];
  end if;
end $$;

notify pgrst, 'reload schema';
