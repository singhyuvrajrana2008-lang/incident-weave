import { requireSupabase, supabase } from "./supabase";
import type { Investigation, AppNotification, Evidence, EvidenceType, TimelineEvent, Contradiction, Unknown } from "./types";

export interface Session { id: string; name: string; email: string; role: string; workspace: string; createdAt: string; }
export interface AnalysisRun { id: string; status: "queued" | "processing" | "complete" | "failed"; stage: string; progress: number; errorMessage?: string | null; }

const dateLabel = (v: string | null | undefined) => v ? new Date(v).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "—";
const relative = (v: string | null | undefined) => v ? new Date(v).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";
const fileType = (mime: string | null, filename: string): EvidenceType => {
  if (mime?.startsWith("image/")) return "image";
  if (mime === "application/pdf" || filename.toLowerCase().endsWith(".pdf")) return "pdf";
  if (mime?.startsWith("audio/")) return "audio";
  if (mime?.startsWith("text/") || /\.(txt|md)$/i.test(filename)) return "text";
  return "document";
};
const message = (error: unknown) => error instanceof Error ? error.message : "Something went wrong. Please try again.";

export const authService = {
  async current(): Promise<Session | null> {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    const { data: profile } = await supabase.from("profiles").select("id,full_name,role,workspace,created_at").eq("id", session.user.id).maybeSingle();
    return { id: session.user.id, email: session.user.email ?? "", name: profile?.full_name ?? session.user.user_metadata?.full_name ?? "Investigator", role: profile?.role ?? "Investigator", workspace: profile?.workspace ?? "", createdAt: dateLabel(profile?.created_at ?? session.user.created_at) };
  },
  async signIn(email: string, password: string) {
    const client = requireSupabase();
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return (await this.current())!;
  },
  async signUp(name: string, email: string, password: string) {
    const client = requireSupabase();
    const { data, error } = await client.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) throw new Error(error.message);
    if (!data.session) throw new Error("Account created. Check your email to confirm your account before signing in.");
    return (await this.current())!;
  },
  async resetPassword(email: string) {
    const client = requireSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/sign-in` });
    if (error) throw new Error(error.message);
  },
  async signOut() { const { error } = await requireSupabase().auth.signOut(); if (error) throw new Error(error.message); },
  async updateProfile(patch: Partial<Session>) {
    const session = await this.current(); if (!session) return;
    const values: Record<string, string> = { updated_at: new Date().toISOString() };
    if (patch.name !== undefined) values.full_name = patch.name;
    if (patch.role !== undefined) values.role = patch.role;
    if (patch.workspace !== undefined) values.workspace = patch.workspace;
    const { error } = await requireSupabase().from("profiles").update(values).eq("id", session.id);
    if (error) throw new Error(error.message);
  },
};

function toEvidence(row: Record<string, unknown>): Evidence {
  const extraction = (row.evidence_extractions as Record<string, unknown>[] | undefined)?.[0];
  return { id: String(row.id), filename: String(row.filename), type: fileType(row.mime_type as string | null, String(row.filename)), size: `${(Number(row.size_bytes ?? 0) / 1e6).toFixed(1)} MB`, uploadedAt: relative(row.created_at as string), relevantTime: String(extraction?.relevant_time ?? "—"), status: (row.status as Evidence["status"]) ?? "processing", confidence: (extraction?.confidence as Evidence["confidence"]) ?? "medium", sourceId: String(row.id).slice(0, 8), observations: Array.isArray(extraction?.observations) ? extraction!.observations as string[] : [], relatedEvents: [], relatedContradictions: [], notes: extraction?.extracted_text as string | undefined };
}
function toEvent(row: Record<string, unknown>): TimelineEvent { return { id: String(row.id), time: String(row.event_time ?? "—").slice(11, 19), date: dateLabel(row.event_time as string), title: String(row.title), description: String(row.description ?? ""), confidence: (row.confidence as TimelineEvent["confidence"]) ?? "medium", sources: Array.isArray(row.evidence_ids) ? row.evidence_ids as string[] : [], label: (row.basis as TimelineEvent["label"]) ?? "uncertain" }; }
function toContradiction(row: Record<string, unknown>): Contradiction { const ids = Array.isArray(row.evidence_ids) ? row.evidence_ids as string[] : []; return { id: String(row.id), code: `C-${String(row.id).slice(0, 4).toUpperCase()}`, title: String(row.title), sourceA: { evidenceId: ids[0] ?? "", label: "Source A", time: "—" }, sourceB: { evidenceId: ids[1] ?? "", label: "Source B", time: "—" }, issue: String(row.description ?? ""), detail: String(row.resolution_needed ?? "Requires investigator review."), confidence: (row.confidence as Contradiction["confidence"]) ?? "medium", status: (row.review_status as Contradiction["status"]) ?? "open", eventIds: [] }; }
function toUnknown(row: Record<string, unknown>): Unknown { return { id: String(row.id), title: String(row.title), description: String(row.description ?? ""), window: String(row.time_window ?? "—"), potentialEvidence: Array.isArray(row.recommended_evidence) ? row.recommended_evidence as string[] : [], status: (row.review_status as Unknown["status"]) ?? "open", severity: (row.severity as Unknown["severity"]) ?? "medium" }; }

async function audit(action: string, investigationId: string | null, metadata: Record<string, unknown> = {}) {
  const client = requireSupabase();
  const user = (await client.auth.getUser()).data.user;
  if (user) await client.from("audit_log").insert({ user_id: user.id, investigation_id: investigationId, action, metadata });
}

export const investigationService = {
  async list(): Promise<Investigation[]> { const client = requireSupabase(); const { data, error } = await client.from("investigation_summary").select("*").order("updated_at", { ascending: false }); if (error) throw new Error(message(error)); return (data ?? []).map((r) => ({ id: r.id, slug: r.id, name: r.name, status: r.status, createdAt: dateLabel(r.created_at), updatedAt: dateLabel(r.updated_at), updatedLabel: relative(r.updated_at), incidentDate: r.incident_date ?? "—", description: r.description ?? "", evidenceCount: Number(r.evidence_count ?? 0), eventCount: Number(r.event_count ?? 0), contradictionCount: Number(r.contradiction_count ?? 0), unknownCount: Number(r.unknown_count ?? 0), confidence: Number(r.confidence ?? 0), coverage: { verified: 0, uncertain: 0, missing: 0 }, timelineConfidence: Number(r.timeline_confidence ?? 0), requiresReview: Number(r.requires_review ?? 0), evidence: [], events: [], contradictions: [], unknowns: [], activity: [] })); },
  async get(id: string): Promise<Investigation | undefined> { const client = requireSupabase(); const { data: r, error } = await client.from("investigations").select("*").eq("id", id).maybeSingle(); if (error) throw new Error(message(error)); if (!r) return undefined; const [ev, events, cons, uns] = await Promise.all([client.from("evidence").select("*,evidence_extractions(*)").eq("investigation_id", id).order("created_at"), client.from("timeline_events").select("*").eq("investigation_id", id).order("event_time"), client.from("contradictions").select("*").eq("investigation_id", id), client.from("unknowns").select("*").eq("investigation_id", id)]); return { id: r.id, slug: r.id, name: r.name, status: r.status, createdAt: dateLabel(r.created_at), updatedAt: dateLabel(r.updated_at), updatedLabel: relative(r.updated_at), incidentDate: r.incident_date ?? "—", description: r.description ?? "", evidenceCount: ev.data?.length ?? 0, eventCount: events.data?.length ?? 0, contradictionCount: cons.data?.length ?? 0, unknownCount: uns.data?.length ?? 0, confidence: r.confidence ?? 0, coverage: { verified: 0, uncertain: 0, missing: 0 }, timelineConfidence: r.timeline_confidence ?? 0, requiresReview: r.requires_review ?? 0, evidence: (ev.data ?? []).map(toEvidence), events: (events.data ?? []).map(toEvent), contradictions: (cons.data ?? []).map(toContradiction), unknowns: (uns.data ?? []).map(toUnknown), activity: [] }; },
  async create(input: { name: string; description: string; incidentDate: string }) { const client = requireSupabase(); const user = (await client.auth.getUser()).data.user; if (!user) throw new Error("Your session has expired. Please sign in again."); const { data, error } = await client.from("investigations").insert({ owner_id: user.id, name: input.name, description: input.description, incident_date: input.incidentDate || null }).select("id").single(); if (error) throw new Error(message(error)); await audit("investigation_created", data.id); await client.from("notifications").insert({ user_id: user.id, investigation_id: data.id, title: "Investigation created", body: input.name, kind: "info" }); return data.id as string; },
  async uploadEvidence(investigationId: string, files: File[]) { const client = requireSupabase(); const user = (await client.auth.getUser()).data.user; if (!user) throw new Error("Your session has expired. Please sign in again."); const uploaded: string[] = []; for (const file of files) { const id = crypto.randomUUID(); const path = `${user.id}/${investigationId}/${id}/${file.name}`; const stored = await client.storage.from("evidence").upload(path, file, { upsert: false, contentType: file.type || undefined }); if (stored.error) throw new Error(stored.error.message); const { error } = await client.from("evidence").insert({ id, investigation_id: investigationId, filename: file.name, mime_type: file.type || "application/octet-stream", size_bytes: file.size, storage_path: path, status: "processing" }); if (error) { await client.storage.from("evidence").remove([path]); throw new Error(error.message); } uploaded.push(id); } await audit("evidence_uploaded", investigationId, { evidenceIds: uploaded, count: uploaded.length }); return uploaded; },
  async startAnalysis(investigationId: string, evidenceIds: string[]) { const client = requireSupabase(); const active = await client.from("analysis_runs").select("id").eq("investigation_id", investigationId).in("status", ["queued", "processing"]).maybeSingle(); if (active.data) throw new Error("Analysis already in progress."); const { data, error } = await client.from("analysis_runs").insert({ investigation_id: investigationId, status: "queued", stage: "01 Ingesting evidence", progress: 0 }).select("id").single(); if (error) throw new Error(error.code === "23505" ? "Analysis already in progress." : error.message); await client.from("investigations").update({ status: "analyzing", updated_at: new Date().toISOString() }).eq("id", investigationId); await audit("analysis_started", investigationId, { analysisRunId: data.id }); const invoke = await client.functions.invoke("analyze-evidence", { body: { investigationId, analysisRunId: data.id, evidenceIds } }); if (invoke.error) throw new Error(invoke.error.message); return data.id as string; },
  async analysisStatus(analysisRunId: string): Promise<AnalysisRun | null> { const { data, error } = await requireSupabase().from("analysis_runs").select("id,status,stage,progress,error_message").eq("id", analysisRunId).maybeSingle(); if (error) throw new Error(error.message); return data ? { id: data.id, status: data.status, stage: data.stage, progress: data.progress, errorMessage: data.error_message } : null; },
};

export const notificationService = { async list(): Promise<AppNotification[]> { const { data, error } = await requireSupabase().from("notifications").select("*").order("created_at", { ascending: false }).limit(50); if (error) throw new Error(error.message); return (data ?? []).map((n) => ({ id: n.id, title: n.title, body: n.body, time: relative(n.created_at), read: n.read, kind: n.kind })); }, async markRead(id: string) { await requireSupabase().from("notifications").update({ read: true }).eq("id", id); } };

export const ANALYSIS_STAGES = ["01 Ingesting evidence", "02 Extracting content", "03 Normalizing timestamps", "04 Correlating sources", "05 Reconstructing events", "06 Searching contradictions", "07 Identifying unknown evidence", "08 Finalizing investigation"];
export { message as serviceError };

