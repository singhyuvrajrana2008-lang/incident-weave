import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { UploadCloud, Check, X, FileUp, Sparkles, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Button, Field, Input, Textarea, Panel, EvidenceIcon, StatusBadge, EmptyState, Progress } from "../../components/ui";
import { cn } from "../../lib/cn";
import type { EvidenceType } from "../../lib/types";
import { investigationService } from "../../lib/services";
import { createFallbackAnalysis } from "../../lib/fallbackAnalysis";
import { useApp } from "../../store/AppContext";

interface QueuedFile { id: string; file: File; name: string; type: EvidenceType; size: string; status: "ready" | "processing" | "error"; }
const STEPS = ["Create", "Evidence intake", "Review", "Reconstruct"];
const ANALYSIS_STAGES = ["Ingesting evidence", "Extracting content", "Normalizing timestamps", "Correlating sources", "Reconstructing timeline", "Checking contradictions", "Identifying unknown evidence", "Finalizing investigation"];

function inferType(name: string): EvidenceType {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext ?? "")) return "image";
  if (ext === "pdf") return "pdf";
  if (["mp3", "wav", "m4a", "webm"].includes(ext ?? "")) return "audio";
  if (["txt", "md"].includes(ext ?? "")) return "text";
  return "document";
}

export default function NewInvestigation() {
  const nav = useNavigate();
  const { toast } = useApp();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [investigationId, setInvestigationId] = useState<string | null>(null);
  const [analysisStage, setAnalysisStage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((list: FileList | File[]) => {
    const incoming = Array.from(list);
    const valid = incoming.filter((f) => f.size <= 50 * 1024 * 1024);
    if (valid.length !== incoming.length) toast({ title: "Some files were skipped", desc: "Evidence files must be 50 MB or smaller.", kind: "warn" });
    const queued = valid.map((file) => ({ id: crypto.randomUUID(), file, name: file.name, type: inferType(file.name), size: `${(file.size / 1e6).toFixed(1)} MB`, status: "ready" as const }));
    setRawFiles((cur) => [...cur, ...valid]);
    setFiles((cur) => [...queued, ...cur]);
    if (queued.length) toast({ title: `${queued.length} file${queued.length > 1 ? "s" : ""} added`, kind: "success" });
  }, [toast]);

  function removeFile(id: string) {
    const target = files.find((f) => f.id === id);
    setFiles((cur) => cur.filter((f) => f.id !== id));
    if (target) setRawFiles((cur) => cur.filter((f) => f !== target.file));
  }

  async function createAndContinue() {
    if (!title.trim()) return;
    setBusy(true); setError("");
    try {
      const id = await investigationService.create({ name: title.trim(), description: desc.trim(), incidentDate: date });
      setInvestigationId(id);
      toast({ title: "Investigation created", kind: "success", desc: title });
      setStep(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to create investigation.");
    } finally { setBusy(false); }
  }

  async function beginAnalysis() {
    if (!investigationId || !rawFiles.length) return;
    setBusy(true); setError(""); setFiles((cur) => cur.map((f) => ({ ...f, status: "processing" })));
    try {
      const ids = await investigationService.uploadEvidence(investigationId, rawFiles);
      setStep(3);
      setAnalysisStage(0);
      const startedAt = Date.now();
      const interval = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const next = Math.min(ANALYSIS_STAGES.length - 1, Math.floor(elapsed / 380));
        setAnalysisStage(next);
        if (next >= ANALYSIS_STAGES.length - 1) window.clearInterval(interval);
      }, 120);

      await new Promise((resolve) => window.setTimeout(resolve, 3300));
      await createFallbackAnalysis(investigationId, date || new Date().toISOString().slice(0, 10), ids);
      setFiles((cur) => cur.map((f) => ({ ...f, status: "ready" })));
      toast({ title: "Analysis complete", kind: "success", desc: "Investigation report is ready." });
      nav(`/app/investigations/${investigationId}`);
    } catch (e) {
      setStep(2);
      setFiles((cur) => cur.map((f) => ({ ...f, status: "error" })));
      setError(e instanceof Error ? e.message : "Analysis could not be completed.");
    } finally { setBusy(false); }
  }

  useEffect(() => () => undefined, []);

  return (
    <Page>
      <PageHeader eyebrow="Guided workflow" title="New investigation" subtitle="Create a case, add evidence, and reconstruct the incident." />
      {error && <div className="mb-4 rounded-sm border border-crimson/30 bg-crimson/10 px-3 py-2.5 text-sm text-crimson">{error}</div>}
      {step !== 3 && <div className="mb-6 flex items-center gap-2 overflow-x-auto scroll-thin pb-1">{STEPS.map((s, i) => <div key={s} className="flex items-center gap-2"><div className={cn("flex items-center gap-2 rounded-sm border px-3 py-1.5 text-sm whitespace-nowrap", i === step ? "border-accent/40 bg-accent/5 text-fg" : i < step ? "border-line bg-surface text-fg-muted" : "border-line/60 text-fg-dim")}><span className={cn("grid size-5 place-items-center rounded-full text-[11px]", i < step ? "bg-verified/15 text-verified" : i === step ? "bg-accent/15 text-accent" : "bg-surface-3 text-fg-dim")}>{i < step ? <Check className="size-3" /> : i + 1}</span>{s}</div>{i < STEPS.length - 1 && <div className="h-px w-6 bg-line" />}</div>)}</div>}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {step === 0 && (
            <Panel className="max-w-2xl p-6">
              <div className="space-y-4">
                <Field label="Investigation title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Warehouse Package Disappearance" autoFocus /></Field>
                <Field label="Description"><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Summarize what you're investigating…" /></Field>
                <Field label="Incident date"><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
              </div>
              <div className="mt-6 flex justify-end gap-2"><Button variant="ghost" onClick={() => nav("/app/dashboard")}>Cancel</Button><Button variant="primary" loading={busy} icon={<ArrowRight className="size-4" />} onClick={createAndContinue} disabled={!title.trim()}>Create & continue</Button></div>
            </Panel>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }} onClick={() => inputRef.current?.click()} className={cn("grid cursor-pointer place-items-center rounded-lg border-2 border-dashed px-6 py-14 text-center transition-colors", dragging ? "border-accent bg-accent/5" : "border-line-2 bg-surface hover:border-line-strong")}>
                <input ref={inputRef} type="file" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
                <div className="grid size-14 place-items-center rounded-lg border border-line-2 bg-surface-2"><UploadCloud className={cn("size-7", dragging ? "text-accent" : "text-fg-dim")} /></div>
                <h3 className="mt-4 font-display text-lg font-semibold text-fg">Upload evidence</h3><p className="mt-1 max-w-md text-sm text-fg-dim">Drop screenshots, call logs, PDFs, documents, recordings or text files here.</p><Button variant="secondary" size="sm" icon={<FileUp className="size-3.5" />} onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>Browse files</Button>
              </div>
              <Panel className="overflow-hidden"><div className="flex items-center justify-between border-b border-line px-5 py-3"><h3 className="font-display text-sm font-semibold text-fg">Upload queue <span className="font-mono text-fg-dim">({files.length})</span></h3></div>{files.length === 0 ? <EmptyState icon={<UploadCloud className="size-6" />} title="No evidence yet" description="Add files above to begin building this investigation." /> : <div className="divide-y divide-line">{files.map((f) => <div key={f.id} className="flex items-center gap-3 px-5 py-3"><div className="grid size-9 place-items-center rounded-sm border border-line-2 bg-surface-2"><EvidenceIcon type={f.type} /></div><div className="min-w-0 flex-1"><div className="truncate font-mono text-sm text-fg">{f.name}</div><div className="text-xs text-fg-dim uppercase">{f.type} · {f.size}</div></div>{f.status === "processing" ? <span className="flex items-center gap-1.5 text-xs text-accent"><Loader2 className="size-3.5 animate-spin" /> Uploading</span> : <StatusBadge status={f.status === "ready" ? "ready" : "error"} />}<button onClick={() => removeFile(f.id)} className="text-fg-faint hover:text-crimson"><X className="size-4" /></button></div>)}</div>}</Panel>
              <div className="flex justify-between"><Button variant="ghost" icon={<ArrowLeft className="size-4" />} onClick={() => setStep(0)}>Back</Button><Button variant="primary" icon={<ArrowRight className="size-4" />} onClick={() => setStep(2)} disabled={!files.length}>Review evidence</Button></div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Panel className="overflow-hidden"><div className="border-b border-line px-5 py-3"><h3 className="font-display text-sm font-semibold text-fg">Evidence review</h3><p className="text-xs text-fg-dim">Confirm the evidence before reconstruction. {files.length} items ready.</p></div><div className="divide-y divide-line">{files.map((f) => <div key={f.id} className="flex items-center gap-3 px-5 py-3"><EvidenceIcon type={f.type} /><span className="min-w-0 flex-1 truncate font-mono text-sm text-fg">{f.name}</span><StatusBadge status="ready" /></div>)}</div></Panel>
              <Panel className="p-6 text-center"><Sparkles className="mx-auto size-7 text-accent" /><h3 className="mt-3 font-display text-xl font-bold tracking-tight text-fg">Reconstruct incident</h3><p className="mx-auto mt-1.5 max-w-lg text-sm text-fg-dim">Correlate the uploaded evidence, reconstruct the timeline, identify contradictions, and surface unresolved questions.</p><div className="mt-5 flex justify-center gap-2"><Button variant="ghost" icon={<ArrowLeft className="size-4" />} onClick={() => setStep(1)}>Back</Button><Button variant="primary" loading={busy} size="lg" icon={<Sparkles className="size-4" />} onClick={beginAnalysis}>Reconstruct incident</Button></div></Panel>
            </div>
          )}

          {step === 3 && (
            <Page className="py-12">
              <Panel className="mx-auto max-w-3xl p-7">
                <div className="mb-5 flex items-center justify-between"><div><div className="font-display text-xl font-semibold text-fg">Analysis in progress</div><div className="mt-1 text-sm text-fg-dim">Correlating evidence and preparing the investigation report.</div></div><Loader2 className="size-5 animate-spin text-accent" /></div>
                <Progress value={((analysisStage + 1) / ANALYSIS_STAGES.length) * 100} />
                <div className="mt-5 grid gap-2 sm:grid-cols-2">{ANALYSIS_STAGES.map((stageName, index) => <div key={stageName} className={cn("rounded-md border px-3 py-2 text-sm", index < analysisStage ? "border-verified/25 bg-verified/5 text-verified" : index === analysisStage ? "border-accent/30 bg-accent/5 text-fg" : "border-line text-fg-faint")}>{index < analysisStage ? "✓ " : index === analysisStage ? "→ " : "· "}{stageName}</div>)}</div>
              </Panel>
            </Page>
          )}
        </motion.div>
      </AnimatePresence>
    </Page>
  );
}
