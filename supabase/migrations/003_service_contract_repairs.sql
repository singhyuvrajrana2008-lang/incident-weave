-- Keep the database contract aligned with the current frontend service layer.
alter table public.investigations add column if not exists slug text;
update public.investigations set slug = coalesce(slug, regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g') || '-' || substr(id::text, 1, 8));
alter table public.investigations alter column slug set not null;
create unique index if not exists investigations_slug_unique on public.investigations(slug);
alter table public.analysis_runs add column if not exists requested_by uuid references public.profiles(id);
