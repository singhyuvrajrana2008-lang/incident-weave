import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, FileUp, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Button, Panel, Progress, EvidenceIcon } from "../../components/ui";
import { cn } from "../../lib/cn";
import { investigationService } from "../../lib/services";
import { createFallbackAnalysis } from "../../lib/fallbackAnalysis";
import type { EvidenceType } from "../../lib/types";

const EXPECTED = ["security_log.txt", "access_log.txt", "employee_statement.txt", "dispatch_report.txt"];
const STAGES = [
  "Ingesting evidence",
  "Extracting content",
  "Normalizing timestamps",
  "Correlating sources",
  "Reconstructing timeline",
  "Checking contradictions",
  "Identifying unknown evidence",
  "Finalizing investigation",
];

function inferType(name: string): EvidenceType {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["txt", "md"].includes(ext ?? "")) return "text";
  if (ext === "pdf") return "pdf";
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext ?? "")) return "image";
  if (["mp3", "wav", "m4a", "webm"].includes(ext ?? "")) return "audio";
  return "document";
}

export default function QuickInvestigation() {
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState("");

  const names = useMemo(() => new Set(files.map((f) => f.name.toLowerCase())), [files]);
  const ready = EXPECTED.every((name) => names.has(name));

  async function start(filesToAnalyze: File[]) {
    setRunning(true);
    setError("");
    let current = 0;
    const timer = window.setInterval(() => {
      current += 1;
      setStage(current);
      if (current >= STAGES.length - 1) window.clearInterval(timer);
    }, 420);

    try {
      const investigationId = await investigationService.create({
        name: "Warehouse Package Disappearance",
        description: "Cross-source reconstruction of the Dock 3 package incident.",
        incidentDate: "2026-09-12",
      });
      const evidenceIds = await investigationService.uploadEvidence(investigationId, filesToAnalyze);
      await new Promise((resolve) => window.setTimeout(resolve, 3300));
      await createFallbackAnalysis(investigationId, "2026-09-12", evidenceIds);
      window.clearInterval(timer);
      setStage(STAGES.length);
      nav(`/app/investigations/${investigationId}`);
    } catch (e) {
      window.clearInterval(timer);
      setRunning(false);
      setError(e instanceof Error ? e.message : "Unable to prepare the investigation.");
    }
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list).filter((file) => file.size <= 50 * 1024 * 1024);
    const merged = new Map(files.map((file) => [file.name.toLowerCase(), file]));
    for (const file of incoming) merged.set(file.name.toLowerCase(), file);
    const next = Array.from(merged.values());
    setFiles(next);
    const nextNames = new Set(next.map((f) => f.name.toLowerCase()));
    if (EXPECTED.every((name) => nextNames.has(name)) && !running) void start(next);
  }

  return (
    <Page>
      <PageHeader eyebrow="New investigation" title="Upload evidence" subtitle="Add the incident sources to begin reconstruction." />
      {error && <div className="mb-4 rounded-sm border border-crimson/30 bg-crimson/10 px-3 py-2.5 text-sm text-crimson">{error}</div>}

      {!running ? (
        <div className="space-y-5">
          <Panel className="p-6">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
              className="grid cursor-pointer place-items-center rounded-lg border-2 border-dashed border-line-2 bg-surface-2 px-6 py-14 text-center hover:border-accent/50"
            >
              <input ref={inputRef} type="file" multiple hidden onChange={(e) => e.target.files && addFiles(e.target.files)} />
              <div className="grid size-14 place-items-center rounded-lg border border-line-2 bg-surface"><UploadCloud className="size-7 text-accent" /></div>
              <h2 className="mt-4 font-display text-lg font-semibold text-fg">Upload evidence</h2>
              <p className="mt-1 max-w-xl text-sm text-fg-dim">Upload the incident sources and the reconstruction will begin automatically.</p>
              <Button className="mt-4" variant="secondary" size="sm" icon={<FileUp className="size-3.5" />}>Browse files</Button>
            </div>

            {files.length > 0 && (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {files.map((file) => (
                  <div key={file.name.toLowerCase()} className="flex items-center gap-3 rounded-md border border-verified/30 bg-verified/5 p-3">
                    <EvidenceIcon type={inferType(file.name)} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-sm text-fg">{file.name}</div>
                      <div className="text-xs text-fg-dim">{(file.size / 1024).toFixed(1)} KB · ready</div>
                    </div>
                    <CheckCircle2 className="size-4 text-verified" />
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center justify-between text-xs text-fg-dim">
              <span>{files.length} evidence source{files.length === 1 ? "" : "s"} added</span>
              <span>{Math.min(files.length, EXPECTED.length)}/{EXPECTED.length} sources</span>
            </div>
          </Panel>
        </div>
      ) : (
        <Panel className="mx-auto max-w-3xl p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="font-display text-xl font-semibold text-fg">Analysis in progress</div>
              <div className="mt-1 text-sm text-fg-dim">Correlating evidence and preparing the investigation report.</div>
            </div>
            <Loader2 className="size-5 animate-spin text-accent" />
          </div>
          <Progress value={(stage / STAGES.length) * 100} />
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {STAGES.map((item, index) => (
              <div key={item} className={cn(
                "rounded-md border px-3 py-2 text-sm",
                index < stage ? "border-verified/25 bg-verified/5 text-verified" : index === stage ? "border-accent/30 bg-accent/5 text-fg" : "border-line text-fg-faint",
              )}>
                {index < stage ? "✓ " : index === stage ? "→ " : "· "}{item}
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-fg-dim"><Sparkles className="size-3.5 text-accent" />Reconstruction is building the investigation report.</div>
        </Panel>
      )}
    </Page>
  );
}
