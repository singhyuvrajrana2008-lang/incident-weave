-- Align the database contract with the frontend and Edge Function.
-- Safe for both fresh databases and the partially initialized deployment.

alter table public.investigations
  add column if not exists slug text;

update public.investigations
set slug = coalesce(
  nullif(lower(regexp_replace(trim(name), '[^a-zA-Z0-9]+', '-', 'g')), ''),
  'investigation'
) || '-' || left(id::text, 8)
where slug is null;

alter table public.investigations
  alter column slug set not null;

create unique index if not exists investigations_slug_key
  on public.investigations(slug);

alter table public.analysis_runs
  add column if not exists requested_by uuid;

update public.analysis_runs ar
set requested_by = i.owner_id
from public.investigations i
where ar.investigation_id = i.id
  and ar.requested_by is null;

alter table public.analysis_runs
  add constraint analysis_runs_requested_by_fkey
  foreign key (requested_by) references public.profiles(id)
  not valid;

alter table public.analysis_runs
  validate constraint analysis_runs_requested_by_fkey;

alter table public.analysis_runs
  alter column requested_by set not null;

alter table public.timeline_events
  add column if not exists updated_at timestamptz not null default now();

-- Keep the newer ownership helper name available alongside the original helper.
create or replace function public.is_investigation_owner(inv uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.investigations
    where id = inv
      and owner_id = auth.uid()
  );
$$;
