import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const stages = [
  "01 Ingesting evidence",
  "02 Extracting content",
  "03 Normalizing timestamps",
  "04 Correlating sources",
  "05 Reconstructing events",
  "06 Searching contradictions",
  "07 Identifying unknown evidence",
  "08 Finalizing investigation",
] as const;

type Confidence = "high" | "medium" | "low";
type Basis = "observed" | "inferred" | "ai-observation" | "uncertain";
type Finding = {
  id: string;
  timestamp?: string;
  title: string;
  description: string;
  confidence: Confidence;
  basis?: Basis;
  evidenceIds?: string[];
  severity?: "low" | "medium" | "high";
  resolutionNeeded?: string;
  recommendedEvidence?: string[];
};
type Result = {
  overallAssessment: { summary: string; confidence: Confidence };
  timeline: Finding[];
  contradictions: Finding[];
  unknowns: Finding[];
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: unknown): value is string {
  return typeof value === "string" && uuidPattern.test(value);
}

function safeEvidenceIds(values: unknown, allowed: Set<string>) {
  if (!Array.isArray(values)) return [];
  return values.filter((value): value is string => isUuid(value) && allowed.has(value));
}

function safeTimestamp(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
}

function assertResult(value: unknown): asserts value is Result {
  const v = value as Result;
  if (!v || typeof v !== "object" || !v.overallAssessment || !Array.isArray(v.timeline) || !Array.isArray(v.contradictions) || !Array.isArray(v.unknowns)) {
    throw new Error("Gemini response did not match the required schema.");
  }
  if (!["high", "medium", "low"].includes(v.overallAssessment.confidence)) {
    throw new Error("Gemini returned an invalid confidence value.");
  }
  for (const group of [v.timeline, v.contradictions, v.unknowns]) {
    for (const item of group) {
      if (!item.id || !item.title || !item.description || !["high", "medium", "low"].includes(item.confidence)) {
        throw new Error("Gemini returned an invalid finding.");
      }
    }
  }
}

function b64(bytes: Uint8Array) {
  let out = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    out += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)));
  }
  return btoa(out);
}

async function geminiRequest(key: string, models: string[], parts: Array<Record<string, unknown>>) {
  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: { responseMimeType: "application/json" },
  };
  let lastStatus = 503;
  const uniqueModels = models.filter((value, index, all) => value && all.indexOf(value) === index);

  for (const model of uniqueModels) {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 90000);
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
          },
        );
        lastStatus = response.status;
        if (response.ok) return response.json();
        const detail = await response.text().catch(() => "");
        if (![429, 500, 502, 503, 504].includes(response.status)) {
          throw new Error(`Gemini request failed (${response.status}) for ${model}: ${detail.slice(0, 500)}`);
        }
      } catch (error) {
        if (attempt === 3 && error instanceof Error && !error.name.includes("Abort")) throw error;
      } finally {
        clearTimeout(timeout);
      }
      if (attempt < 3) await sleep(Math.min(30000, 1500 * (2 ** attempt)) + Math.floor(Math.random() * 750));
    }
  }

  throw new Error(`Gemini request failed (${lastStatus}) after retrying configured models.`);
}

async function main(req: Request) {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const { investigationId, analysisRunId, evidenceIds } = await req.json();
  if (typeof investigationId !== "string" || typeof analysisRunId !== "string" || !Array.isArray(evidenceIds)) {
    return json({ error: "Invalid analysis request." }, 400);
  }

  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json({ error: "Authentication required." }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceRoleKey || !anonKey) return json({ error: "Server Supabase configuration is incomplete." }, 500);

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const caller = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: identity, error: identityError } = await caller.auth.getUser();
  if (identityError || !identity.user) return json({ error: "Authentication required." }, 401);

  const ownership = await supabase.from("investigations").select("owner_id").eq("id", investigationId).maybeSingle();
  if (ownership.error) return json({ error: ownership.error.message }, 500);
  if (ownership.data?.owner_id !== identity.user.id) return json({ error: "Investigation access denied." }, 403);

  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) return json({ error: "Server analysis is not configured." }, 500);

  const updateRun = async (patch: Record<string, unknown>) => {
    const { error } = await supabase.from("analysis_runs").update(patch).eq("id", analysisRunId);
    if (error) throw error;
  };

  try {
    await updateRun({ status: "processing", stage: stages[0], progress: 5, started_at: new Date().toISOString(), error_message: null });

    const { data: rows, error } = await supabase
      .from("evidence")
      .select("id,filename,mime_type,storage_path,size_bytes")
      .eq("investigation_id", investigationId)
      .in("id", evidenceIds)
      .limit(100);
    if (error) throw error;

    if (!rows?.length) throw new Error("No selected evidence was found for this investigation.");

    const metadata: Array<Record<string, unknown>> = [];
    const evidenceParts: Array<Record<string, unknown>> = [];
    const allowedEvidenceIds = new Set((rows ?? []).map((row) => row.id));

    for (const row of rows ?? []) {
      metadata.push({ evidenceId: row.id, filename: row.filename, mimeType: row.mime_type });
      const signed = await supabase.storage.from("evidence").createSignedUrl(row.storage_path, 600);
      if (signed.error || !signed.data?.signedUrl) throw new Error(`Could not read evidence ${row.filename}.`);

      const content = await fetch(signed.data.signedUrl);
      if (!content.ok) throw new Error(`Could not download evidence ${row.filename}.`);
      const bytes = new Uint8Array(await content.arrayBuffer());
      if (bytes.byteLength > 15 * 1024 * 1024) throw new Error(`${row.filename} is too large for inline Gemini analysis.`);

      if (row.mime_type.startsWith("text/")) {
        evidenceParts.push({ text: `EVIDENCE ${row.id} (${row.filename}):\n${new TextDecoder().decode(bytes).slice(0, 200000)}` });
      } else {
        evidenceParts.push({ inlineData: { mimeType: row.mime_type, data: b64(bytes) } });
      }
    }

    await updateRun({ stage: stages[1], progress: 20 });

    const instruction = `You are IncidentWeave, an AI-assisted evidence-correlation system. Analyze all attached evidence together. Never invent facts or make legal/criminal judgments. Every finding must be evidence-linked. Use observed when directly supported, inferred when derived across sources, and uncertain when evidence is insufficient or conflicting. Return JSON only in this exact shape: {"overallAssessment":{"summary":"","confidence":"high|medium|low"},"timeline":[{"id":"event-1","timestamp":"","title":"","description":"","confidence":"high|medium|low","basis":"observed|inferred|ai-observation|uncertain","evidenceIds":[]}],"contradictions":[{"id":"contradiction-1","title":"","description":"","confidence":"high|medium|low","severity":"low|medium|high","evidenceIds":[],"resolutionNeeded":""}],"unknowns":[{"id":"unknown-1","title":"","description":"","confidence":"high|medium|low","recommendedEvidence":[],"evidenceIds":[]}]}. Only use evidence IDs from this metadata list: ${JSON.stringify(metadata)}. Preserve approximate timestamps instead of inventing precision. Sort timeline chronologically where possible.`;

    await updateRun({ stage: stages[3], progress: 42 });
    const primaryModel = Deno.env.get("GEMINI_MODEL") || "gemini-3.8-flash";
    const fallbackModel = Deno.env.get("GEMINI_FALLBACK_MODEL") || "gemini-2.5-flash";
    const payload = await geminiRequest(key, [primaryModel, fallbackModel], [{ text: instruction }, ...evidenceParts]);
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") throw new Error("Gemini returned no analysis content.");

    let result: unknown;
    try {
      result = JSON.parse(text);
    } catch {
      throw new Error("Gemini returned malformed JSON.");
    }
    assertResult(result);

    await updateRun({ stage: stages[4], progress: 64 });

    const events = result.timeline.map((event) => ({
      investigation_id: investigationId,
      event_time: safeTimestamp(event.timestamp),
      title: event.title,
      description: event.description,
      confidence: event.confidence,
      basis: event.basis || "uncertain",
      evidence_ids: safeEvidenceIds(event.evidenceIds, allowedEvidenceIds),
    }));

    const contradictions = result.contradictions.map((item) => ({
      investigation_id: investigationId,
      title: item.title,
      description: item.description,
      severity: item.severity || "medium",
      confidence: item.confidence,
      evidence_ids: safeEvidenceIds(item.evidenceIds, allowedEvidenceIds),
      resolution_needed: item.resolutionNeeded || "Requires investigator review.",
    }));

    const unknowns = result.unknowns.map((item) => ({
      investigation_id: investigationId,
      title: item.title,
      description: item.description,
      severity: item.severity || "medium",
      recommended_evidence: item.recommendedEvidence || [],
      review_status: "open",
    }));

    for (const table of ["timeline_events", "contradictions", "unknowns"] as const) {
      const cleared = await supabase.from(table).delete().eq("investigation_id", investigationId);
      if (cleared.error) throw cleared.error;
    }

    if (events.length) {
      const timelineInsert = await supabase.from("timeline_events").insert(events);
      if (timelineInsert.error) throw new Error(`Could not save timeline: ${timelineInsert.error.message} (${timelineInsert.error.code})`);
    }

    if (contradictions.length) {
      const insert = await supabase.from("contradictions").insert(contradictions);
      if (insert.error) throw new Error(`Could not save contradictions: ${insert.error.message} (${insert.error.code})`);
    }

    if (unknowns.length) {
      const insert = await supabase.from("unknowns").insert(unknowns);
      if (insert.error) throw new Error(`Could not save unknowns: ${insert.error.message} (${insert.error.code})`);
    }

    const evidenceUpdate = await supabase.from("evidence").update({ status: "ready" }).in("id", evidenceIds);
    if (evidenceUpdate.error) throw evidenceUpdate.error;

    const owner = await supabase.from("investigations").select("owner_id").eq("id", investigationId).single();
    if (owner.error) throw owner.error;

    const needsReview = contradictions.length + unknowns.length;
    const investigationUpdate = await supabase
      .from("investigations")
      .update({
        status: "complete",
        confidence: result.overallAssessment.confidence === "high" ? 85 : result.overallAssessment.confidence === "low" ? 45 : 68,
        timeline_confidence: events.length ? 70 : 0,
        requires_review: needsReview,
        updated_at: new Date().toISOString(),
      })
      .eq("id", investigationId);
    if (investigationUpdate.error) throw investigationUpdate.error;

    await supabase.from("notifications").insert({
      user_id: owner.data.owner_id,
      investigation_id: investigationId,
      title: "Analysis completed",
      body: needsReview ? "Review the detected contradictions and unknown evidence." : "The reconstruction is ready for review.",
      kind: needsReview ? "warn" : "success",
    });

    await supabase.from("audit_log").insert({
      user_id: owner.data.owner_id,
      investigation_id: investigationId,
      action: "analysis_completed",
      metadata: { analysisRunId, eventCount: events.length, contradictionCount: contradictions.length, unknownCount: unknowns.length },
    });

    await updateRun({ status: "complete", stage: stages[7], progress: 100, completed_at: new Date().toISOString() });
    return json({ ok: true, status: "complete" });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Analysis failed.";

    try {
      await updateRun({ status: "failed", error_message: detail, completed_at: new Date().toISOString() });
    } catch {
      // Preserve the original failure when the status update itself cannot be written.
    }

    const owner = await supabase.from("investigations").select("owner_id").eq("id", investigationId).maybeSingle();
    if (owner.data?.owner_id) {
      await supabase.from("investigations").update({ status: "ready", updated_at: new Date().toISOString() }).eq("id", investigationId);
      await supabase.from("notifications").insert({
        user_id: owner.data.owner_id,
        investigation_id: investigationId,
        title: "Analysis failed",
        body: detail,
        kind: "danger",
      });
      await supabase.from("audit_log").insert({
        user_id: owner.data.owner_id,
        investigation_id: investigationId,
        action: "analysis_failed",
        metadata: { analysisRunId, error: detail },
      });
    }

    // Analysis failures are represented by analysis_runs.status/error_message.
    // Return HTTP 200 so the client does not lose the real diagnostic behind a
    // generic "Edge Function returned a non-2xx status code" error.
    return json({ ok: false, status: "failed", error: detail });
  }
}

Deno.serve((req) =>
  main(req).catch((error) =>
    json({ ok: false, status: "failed", error: error instanceof Error ? error.message : "Request failed." }),
  ),
);
