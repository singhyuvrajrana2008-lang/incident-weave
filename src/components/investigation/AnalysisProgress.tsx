import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { ANALYSIS_STAGES, investigationService } from "../../lib/services";
import { cn } from "../../lib/cn";

export function AnalysisProgress({ analysisRunId, onComplete, onRetry }: { analysisRunId: string; onComplete: () => void; onRetry?: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const timer = useRef<number | null>(null);
  useEffect(() => {
    let active = true;
    let attempts = 0; let readFailures = 0;
    const poll = async () => {
      if (++attempts > 100) { if (active) setError("Analysis status timed out. You can retry safely."); return; }
      try {
        const run = await investigationService.analysisStatus(analysisRunId);
        if (!active) return;
        if (!run) { setError("Analysis run was not found. You can retry safely."); return; }
        readFailures = 0;
        setProgress(run.progress);
        const serverStage = ANALYSIS_STAGES.indexOf(run.stage as (typeof ANALYSIS_STAGES)[number]);
        setStage(serverStage >= 0 ? serverStage : Math.min(ANALYSIS_STAGES.length - 1, Math.max(0, Math.floor(run.progress / 13))));
        if (run.status === "complete") { onComplete(); return; }
        if (run.status === "failed") { setError(run.errorMessage || "Analysis failed. Review the evidence and try again."); return; }
        timer.current = window.setTimeout(poll, 1800);
      } catch (e) { if (!active) return; if (++readFailures >= 3) { setError(e instanceof Error ? `Unable to read analysis status: ${e.message}` : "Unable to read analysis status."); return; } timer.current = window.setTimeout(poll, 1800); }
    };
    void poll();
    return () => { active = false; if (timer.current !== null) window.clearTimeout(timer.current); };
  }, [analysisRunId, onComplete]);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 text-center"><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Reconstructing incident</p><h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-fg">Correlating evidence across sources</h2><p className="mt-1 text-sm text-fg-dim">IncidentWeave is weaving the uploaded evidence into a reconstructed timeline.</p></div>
      {error ? <div className="flex items-start justify-between gap-3 rounded-md border border-crimson/30 bg-crimson/10 p-4 text-sm text-crimson"><span className="flex items-start gap-2"><AlertCircle className="size-4 shrink-0" />{error}</span>{onRetry && <button className="shrink-0 underline" onClick={onRetry}>Retry</button>}</div> : <>
        <div className="mb-6"><div className="mb-1.5 flex justify-between text-xs"><span className="text-fg-muted">Overall progress</span><span className="font-mono tabular text-accent">{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-surface-3"><motion.div className="h-full rounded-full bg-accent" animate={{ width: `${progress}%` }} /></div></div>
        <div className="grid gap-1.5 sm:grid-cols-2">{ANALYSIS_STAGES.map((s, i) => { const done = i < stage; const active = i === stage; return <div key={s} className={cn("flex items-center gap-3 rounded-sm border px-3 py-2.5", active ? "border-accent/40 bg-accent/5" : done ? "border-line bg-surface" : "border-line/60 bg-surface/50")}><span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-[11px]", done ? "bg-verified/15 text-verified" : active ? "bg-accent/15 text-accent" : "bg-surface-3 text-fg-dim")}>{done ? <Check className="size-3.5" /> : active ? <Loader2 className="size-3.5 animate-spin" /> : String(i + 1).padStart(2, "0")}</span><span className="text-sm text-fg-muted">{s}</span></div>; })}</div>
      </>}
    </div>
  );
}
