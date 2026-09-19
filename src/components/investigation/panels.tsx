import { motion } from "motion/react";
import { AlertTriangle, HelpCircle, ArrowRight, Plus } from "lucide-react";
import { cn } from "../../lib/cn";
import type { Contradiction, Investigation, Unknown } from "../../lib/types";
import { Badge, Button, ConfidenceTag, EvidenceIcon, StatusBadge } from "../ui";

/* ------------------------------ Contradiction card ------------------------------ */
export function ContradictionCard({
  contradiction: c,
  investigation,
  selected,
  dimmed,
  onSelect,
}: {
  contradiction: Contradiction;
  investigation: Investigation;
  selected?: boolean;
  dimmed?: boolean;
  onSelect: () => void;
}) {
  const a = investigation.evidence.find((e) => e.id === c.sourceA.evidenceId);
  const b = investigation.evidence.find((e) => e.id === c.sourceB.evidenceId);
  return (
    <motion.button
      layout
      onClick={onSelect}
      animate={{ opacity: dimmed ? 0.45 : 1 }}
      className={cn(
        "group block w-full rounded-md border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg",
        selected ? "border-crimson/50 bg-crimson/5" : "border-line bg-surface hover:border-crimson/30",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-crimson" />
          <span className="font-mono text-xs text-crimson">{c.code}</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">Potential contradiction</span>
        </div>
        <StatusBadge status={c.status} />
      </div>
      <h4 className="mt-2 font-medium text-fg transition-transform duration-200 group-hover:-translate-y-0.5">{c.title}</h4>
      <p className="mt-1 text-sm text-fg-dim">{c.issue}</p>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-sm border border-line bg-bg-2 p-2.5">
        <div className="flex items-center gap-2 min-w-0">
          {a && <EvidenceIcon type={a.type} className="size-3.5 shrink-0" />}
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-fg">{c.sourceA.label}</div>
            <div className="font-mono text-[11px] text-fg-dim">{c.sourceA.time}</div>
          </div>
        </div>
        <span className="grid size-6 place-items-center rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
          <AlertTriangle className="size-3" />
        </span>
        <div className="flex items-center justify-end gap-2 min-w-0 text-right">
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-fg">{c.sourceB.label}</div>
            <div className="font-mono text-[11px] text-fg-dim">{c.sourceB.time}</div>
          </div>
          {b && <EvidenceIcon type={b.type} className="size-3.5 shrink-0" />}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <ConfidenceTag confidence={c.confidence} />
        <span className="flex items-center gap-1 text-xs font-medium text-crimson">Review <ArrowRight className="size-3.5" /></span>
      </div>
    </motion.button>
  );
}

/* ------------------------------ Unknown card ------------------------------ */
export function UnknownCard({
  unknown: u,
  selected,
  onSelect,
  onAddEvidence,
}: {
  unknown: Unknown;
  selected?: boolean;
  onSelect: () => void;
  onAddEvidence?: () => void;
}) {
  return (
    <motion.div
      layout
      className={cn(
        "rounded-md border p-4 transition-all",
        selected ? "border-amber/50 bg-amber/5" : "border-line bg-surface",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 text-amber" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-amber">Unknown · {u.window}</span>
        </div>
        <StatusBadge status={u.status} />
      </div>
      <h4 className="mt-2 font-medium uppercase tracking-tight text-fg">{u.title}</h4>
      <p className="mt-1 text-sm text-fg-dim">{u.description}</p>
      <div className="mt-3">
        <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-fg-faint">Potential evidence</div>
        <div className="flex flex-wrap gap-1.5">
          {u.potentialEvidence.map((p) => (
            <Badge key={p} tone="neutral">{p}</Badge>
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="secondary" icon={<Plus className="size-3.5" />} onClick={onAddEvidence}>Add evidence</Button>
        <Button size="sm" variant="ghost" onClick={onSelect}>Mark investigating</Button>
      </div>
    </motion.div>
  );
}
