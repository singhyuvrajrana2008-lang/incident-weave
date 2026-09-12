create extension if not exists pgcrypto;

create type public.investigation_status as enum ('draft','uploading','processing','complete','error','archived');
create type public.evidence_status as enum ('ready','processing','verified','uncertain','error');
create type public.analysis_status as enum ('queued','processing','complete','failed');
create type public.review_status as enum ('open','reviewing','resolved','dismissed','investigating');

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role text not null default 'Investigator',
  workspace text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.investigations (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null, slug text not null, description text not null default '', incident_date date,
  status public.investigation_status not null default 'draft', confidence integer not null default 0 check (confidence between 0 and 100),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(owner_id, slug)
);
create table if not exists public.evidence (
  id uuid primary key default gen_random_uuid(), investigation_id uuid not null references public.investigations(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete restrict, filename text not null, mime_type text not null default 'application/octet-stream',
  size_bytes bigint not null default 0, storage_path text not null unique, status public.evidence_status not null default 'ready',
  relevant_time timestamptz, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.evidence_extractions (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references public.evidence(id) on delete cascade,
  extracted_text text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(), investigation_id uuid not null references public.investigations(id) on delete cascade,
  title text not null, description text not null default '', event_time timestamptz, confidence text not null default 'low', basis text not null default 'uncertain',
  evidence_ids uuid[] not null default '{}', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.contradictions (
  id uuid primary key default gen_random_uuid(), investigation_id uuid not null references public.investigations(id) on delete cascade,
  title text not null, description text not null default '', severity text not null default 'medium', confidence text not null default 'low',
  evidence_ids uuid[] not null default '{}', resolution_needed text not null default '', status public.review_status not null default 'open',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.unknowns (
  id uuid primary key default gen_random_uuid(), investigation_id uuid not null references public.investigations(id) on delete cascade,
  title text not null, description text not null default '', severity text not null default 'medium', recommended_evidence text[] not null default '{}',
  status public.review_status not null default 'open', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.analysis_runs (
  id uuid primary key default gen_random_uuid(), investigation_id uuid not null references public.investigations(id) on delete cascade,
  requested_by uuid not null references auth.users(id) on delete restrict, status public.analysis_status not null default 'queued', stage text not null default 'queued',
  progress integer not null default 0 check (progress between 0 and 100), error_message text, started_at timestamptz, completed_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.analysis_results (
  id uuid primary key default gen_random_uuid(), analysis_run_id uuid not null unique references public.analysis_runs(id) on delete cascade,
  result jsonb not null, model text not null default 'gemini-2.5-flash', created_at timestamptz not null default now()
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  investigation_id uuid references public.investigations(id) on delete cascade, title text not null, body text not null default '', kind text not null default 'info', read boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  investigation_id uuid references public.investigations(id) on delete cascade, action text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create index if not exists investigations_owner_idx on public.investigations(owner_id, updated_at desc);
create index if not exists evidence_investigation_idx on public.evidence(investigation_id, created_at desc);
create index if not exists analysis_runs_investigation_idx on public.analysis_runs(investigation_id, created_at desc);

create or replace function public.is_investigation_owner(target_id uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from public.investigations where id = target_id and owner_id = auth.uid()) $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles(id, display_name) values(new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1))) on conflict (id) do nothing; return new; end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

do $$ declare t text; begin foreach t in array array['profiles','investigations','evidence','evidence_extractions','timeline_events','contradictions','unknowns','analysis_runs','analysis_results','notifications','audit_log'] loop execute format('alter table public.%I enable row level security', t); end loop; end $$;

create policy profiles_self on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy investigations_owner on public.investigations for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy evidence_owner on public.evidence for all using (public.is_investigation_owner(investigation_id)) with check (uploaded_by = auth.uid() and public.is_investigation_owner(investigation_id));
create policy extractions_owner on public.evidence_extractions for all using (exists(select 1 from public.evidence e where e.id=evidence_id and public.is_investigation_owner(e.investigation_id))) with check (exists(select 1 from public.evidence e where e.id=evidence_id and public.is_investigation_owner(e.investigation_id)));
create policy events_owner on public.timeline_events for all using (public.is_investigation_owner(investigation_id)) with check (public.is_investigation_owner(investigation_id));
create policy contradictions_owner on public.contradictions for all using (public.is_investigation_owner(investigation_id)) with check (public.is_investigation_owner(investigation_id));
create policy unknowns_owner on public.unknowns for all using (public.is_investigation_owner(investigation_id)) with check (public.is_investigation_owner(investigation_id));
create policy runs_owner on public.analysis_runs for all using (public.is_investigation_owner(investigation_id)) with check (requested_by = auth.uid() and public.is_investigation_owner(investigation_id));
create policy results_owner on public.analysis_results for all using (exists(select 1 from public.analysis_runs r where r.id=analysis_run_id and public.is_investigation_owner(r.investigation_id))) with check (exists(select 1 from public.analysis_runs r where r.id=analysis_run_id and public.is_investigation_owner(r.investigation_id)));
create policy notifications_self on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy audit_self on public.audit_log for select using (user_id = auth.uid());
create policy audit_insert on public.audit_log for insert with check (user_id = auth.uid());

insert into storage.buckets(id, name, public) values ('evidence','evidence',false) on conflict (id) do update set public=false;
create policy evidence_storage_select on storage.objects for select to authenticated using (bucket_id='evidence' and (storage.foldername(name))[1] = auth.uid()::text);
create policy evidence_storage_insert on storage.objects for insert to authenticated with check (bucket_id='evidence' and (storage.foldername(name))[1] = auth.uid()::text);
create policy evidence_storage_delete on storage.objects for delete to authenticated using (bucket_id='evidence' and (storage.foldername(name))[1] = auth.uid()::text);

create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger investigations_updated_at before update on public.investigations for each row execute procedure public.set_updated_at();
create trigger evidence_updated_at before update on public.evidence for each row execute procedure public.set_updated_at();
create trigger events_updated_at before update on public.timeline_events for each row execute procedure public.set_updated_at();
create trigger contradictions_updated_at before update on public.contradictions for each row execute procedure public.set_updated_at();
create trigger unknowns_updated_at before update on public.unknowns for each row execute procedure public.set_updated_at();

alter publication supabase_realtime add table public.investigations, public.evidence, public.analysis_runs;
