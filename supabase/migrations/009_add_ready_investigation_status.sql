-- Some early production deployments were created without the intended ready
-- lifecycle state.  `ready` is the retryable pre-analysis state used by the
-- browser, Edge Function recovery path, and investigation UI.
alter type public.investigation_status add value if not exists 'ready';

-- Make the enum addition visible to PostgREST without a manual dashboard edit.
notify pgrst, 'reload schema';
