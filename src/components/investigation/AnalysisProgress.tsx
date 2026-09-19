import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Check, Clock3, FileSearch, GitBranch, Loader2, Sparkles } from "lucide-react";
import { ANALYSIS_STAGES, investigationService } from "../../lib/services";
import { cn } from "../../lib/cn";
import { LogoMark } from "../Logo";

export function AnalysisProgress({ analysisRunId, onComplete, onRetry }: { analysisRunId: string; onComplete: () => void; onRetry?: () => void }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const timer = useRef<number | null>(null);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    let active = true;
    let attempts = 0;
    let readFailures = 0;

    const finishAfterAnimation = () => {
      const remaining = Math.max(0, 2200 - (Date.now() - startedAt.current));
      timer.current = window.setTimeout(() => {
        if (active) onComplete();
      }, remaining);
    };

    const poll = async () => {
      if (++attempts > 100) {
        if (active) setError("Analysis status timed out. You can retry safely.");
        return;
      }

      try {
        const run = await investigationService.analysisStatus(analysisRunId);
        if (!active) return;
        if (!run) {
          setError("Analysis run was not found. You can retry safely.");
          return;
        }

        readFailures = 0;
        setProgress(run.status === "complete" ? 100 : run.progress);
        const serverStage = ANALYSIS_STAGES.indexOf(run.stage as (typeof ANALYSIS_STAGES)[number]);
        setStage(
          serverStage >= 0
            ? serverStage
            : Math.min(ANALYSIS_STAGES.length - 1, Math.max(0, Math.floor(run.progress / 13))),
        );

        if (run.status === "complete") {
          setProgress(100);
          setStage(ANALYSIS_STAGES.length - 1);
          finishAfterAnimation();
          return;
        }

        if (run.status === "failed") {
          setError(run.errorMessage || "Analysis failed. Review the evidence and try again.");
          return;
        }

        timer.current = window.setTimeout(poll, 1800);
      } catch (e) {
        if (!active) return;
        if (++readFailures >= 3) {
          setError(
            e instanceof Error
              ? `Unable to read analysis status: ${e.message}`
              : "Unable to read analysis status.",
          );
          return;
        }
        timer.current = window.setTimeout(poll, 1800);
      }
    };

    void poll();

    return () => {
      active = false;
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, [analysisRunId, onComplete]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 grid size-12 place-items-center rounded-md border border-line-2 bg-surface"
        >
          <LogoMark className="size-8" />
        </motion.div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Live analysis</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-fg">
          Weaving the evidence
        </h2>
        <p className="mt-1 max-w-xl text-sm text-fg-dim">
          The workspace will appear once the analysis has finished. Your uploaded files are intentionally hidden during this step.
        </p>
      </div>

      {error ? (
        <div className="flex items-start justify-between gap-3 rounded-md border border-crimson/30 bg-crimson/10 p-4 text-sm text-crimson">
          <span className="flex items-start gap-2"><AlertCircle className="size-4 shrink-0" />{error}</span>
          {onRetry && <button className="shrink-0 underline" onClick={onRetry}>Retry</button>}
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-lg border border-line bg-surface p-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-fg-muted">Reconstructing incident</span>
              <span className="font-mono tabular text-accent">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
              <motion.div
                className="h-full rounded-full bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: FileSearch, label: "Evidence", copy: "Reviewing sources" },
              { icon: GitBranch, label: "Relationships", copy: "Finding connections" },
              { icon: Clock3, label: "Timeline", copy: "Reconstructing sequence" },
            ].map((card, i) => {
              const active = i <= Math.min(2, Math.floor((stage / Math.max(1, ANALYSIS_STAGES.length - 1)) * 3));
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.35 }}
                  className={cn(
                    "relative overflow-hidden rounded-lg border p-5",
                    active ? "border-accent/30 bg-accent/5" : "border-line bg-surface",
                  )}
                >
                  <motion.div
                    className="absolute inset-x-0 top-0 h-px bg-accent/60"
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    animate={{ scaleX: active ? 1 : 0.25 }}
                    transition={{ duration: 0.7, repeat: active ? Infinity : 0, repeatType: "reverse" }}
                  />
                  <div className="flex items-center justify-between">
                    <span className={cn("grid size-9 place-items-center rounded-sm", active ? "bg-accent/12 text-accent" : "bg-surface-2 text-fg-dim")}>
                      {active ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
                    </span>
                    <Sparkles className={cn("size-4", active ? "text-accent" : "text-fg-faint")} />
                  </div>
                  <h3 className="mt-4 font-display text-sm font-semibold text-fg">{card.label}</h3>
                  <p className="mt-1 text-xs text-fg-dim">{card.copy}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {ANALYSIS_STAGES.map((s, i) => {
              const done = i < stage;
              const active = i === stage;
              return (
                <div
                  key={s}
                  className={cn(
                    "flex items-center gap-2.5 rounded-sm border px-3 py-2.5",
                    active ? "border-accent/35 bg-accent/5" : done ? "border-line bg-surface" : "border-line/60 bg-surface/50",
                  )}
                >
                  <span className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full text-[11px]",
                    done ? "bg-verified/15 text-verified" : active ? "bg-accent/15 text-accent" : "bg-surface-3 text-fg-dim",
                  )}>
                    {done ? <Check className="size-3.5" /> : active ? <Loader2 className="size-3.5 animate-spin" /> : String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-fg-muted">{s}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
