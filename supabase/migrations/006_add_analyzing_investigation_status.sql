-- Repair deployments created before the analyzing lifecycle state was introduced.
-- ALTER TYPE is idempotent on supported PostgreSQL/Supabase versions.
alter type public.investigation_status add value if not exists 'analyzing';

-- Refresh PostgREST's schema cache so the updated enum is accepted immediately.
notify pgrst, 'reload schema';
