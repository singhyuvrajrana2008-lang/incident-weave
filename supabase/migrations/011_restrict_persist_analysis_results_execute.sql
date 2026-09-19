-- Only the Edge Function service-role client may persist analysis findings.
revoke execute on function public.persist_analysis_results(uuid,uuid,uuid,text,jsonb,jsonb,jsonb) from anon;
revoke execute on function public.persist_analysis_results(uuid,uuid,uuid,text,jsonb,jsonb,jsonb) from authenticated;
revoke execute on function public.persist_analysis_results(uuid,uuid,uuid,text,jsonb,jsonb,jsonb) from public;
grant execute on function public.persist_analysis_results(uuid,uuid,uuid,text,jsonb,jsonb,jsonb) to service_role;
