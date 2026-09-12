import { AlertTriangle, Clock, Sparkles, FileText } from "lucide-react";
import { Drawer } from "../ui/overlays";
import { Badge, Button, ConfidenceTag, EvidenceIcon, StatusBadge, Textarea } from "../ui";
import type { Contradiction, Evidence, Investigation } from "../../lib/types";
import { cn } from "../../lib/cn";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line py-2 last:border-0">
      <span className="text-sm text-fg-dim">{label}</span>
      <span className="text-right text-sm text-fg">{value}</span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-2 mt-5 font-mono text-[10px] uppercase tracking-wider text-fg-faint first:mt-0">{children}</h4>;
}

/* ------------------------------ Evidence inspector ------------------------------ */
export function EvidenceInspector({
  evidence,
  investigation,
  open,
  onClose,
  onSelectEvent,
  onSaveNote,
}: {
  evidence: Evidence | null;
  investigation: Investigation;
  open: boolean;
  onClose: () => void;
  onSelectEvent?: (id: string) => void;
  onSaveNote?: (note: string) => void;
}) {
  if (!evidence) return null;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={evidence.filename}
      subtitle={<span className="font-mono text-xs">{evidence.sourceId}</span>}
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => onSaveNote?.("saved")}>Save notes</Button>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      }
    >
      {/* preview */}
      <div className="grid aspect-video place-items-center rounded-md border border-line-2 bg-bg-2 grid-texture">
        <div className="text-center">
          <EvidenceIcon type={evidence.type} className="mx-auto size-10" />
          <p className="mt-2 font-mono text-xs text-fg-dim">{evidence.type.toUpperCase()} preview</p>
        </div>
      </div>

      <SectionLabel>File information</SectionLabel>
      <div className="rounded-md border border-line bg-surface px-3">
        <Row label="Type" value={<Badge tone="neutral">{evidence.type}</Badge>} />
        <Row label="Size" value={<span className="font-mono">{evidence.size}</span>} />
        <Row label="Uploaded" value={evidence.uploadedAt} />
        <Row label="Relevant time" value={<span className="font-mono">{evidence.relevantTime}</span>} />
        <Row label="Status" value={<StatusBadge status={evidence.status} />} />
        <Row label="Confidence" value={<ConfidenceTag confidence={evidence.confidence} />} />
      </div>

      <SectionLabel>AI observations</SectionLabel>
      <div className="space-y-2">
        {evidence.observations.map((o, i) => (
          <div key={i} className="flex gap-2 rounded-sm border border-line bg-surface p-3 text-sm text-fg-muted">
            <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" /> {o}
          </div>
        ))}
        <p className="text-xs text-fg-faint">AI observation · requires investigator review.</p>
      </div>

      <SectionLabel>Related timeline events</SectionLabel>
      {evidence.relatedEvents.length === 0 ? (
        <p className="text-sm text-fg-dim">No related events yet.</p>
      ) : (
        <div className="space-y-1.5">
          {evidence.relatedEvents.map((eid) => {
            const ev = investigation.events.find((e) => e.id === eid);
            if (!ev) return null;
            return (
              <button key={eid} onClick={() => onSelectEvent?.(eid)} className="flex w-full items-center gap-2.5 rounded-sm border border-line bg-surface p-2.5 text-left hover:border-accent/40">
                <Clock className="size-3.5 text-accent" />
                <span className="font-mono text-xs text-fg-muted">{ev.time}</span>
                <span className="truncate text-sm text-fg">{ev.title}</span>
              </button>
            );
          })}
        </div>
      )}

      <SectionLabel>Related contradictions</SectionLabel>
      {evidence.relatedContradictions.length === 0 ? (
        <p className="text-sm text-fg-dim">None involving this evidence.</p>
      ) : (
        evidence.relatedContradictions.map((cid) => {
          const c = investigation.contradictions.find((x) => x.id === cid);
          if (!c) return null;
          return (
            <div key={cid} className="flex items-center gap-2.5 rounded-sm border border-crimson/20 bg-crimson/5 p-2.5">
              <AlertTriangle className="size-3.5 text-crimson" />
              <span className="font-mono text-xs text-crimson">{c.code}</span>
              <span className="truncate text-sm text-fg">{c.title}</span>
            </div>
          );
        })
      )}

      <SectionLabel>Investigator notes</SectionLabel>
      <Textarea placeholder="Add a note about this evidence…" defaultValue={evidence.notes} />
    </Drawer>
  );
}

/* ------------------------------ Contradiction detail ------------------------------ */
export function ContradictionDrawer({
  contradiction,
  investigation,
  open,
  onClose,
  onUpdate,
}: {
  contradiction: Contradiction | null;
  investigation: Investigation;
  open: boolean;
  onClose: () => void;
  onUpdate?: (status: string) => void;
}) {
  if (!contradiction) return null;
  const c = contradiction;
  const a = investigation.evidence.find((e) => e.id === c.sourceA.evidenceId);
  const b = investigation.evidence.find((e) => e.id === c.sourceB.evidenceId);
  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={500}
      title={<span className="flex items-center gap-2"><span className="font-mono text-crimson">{c.code}</span> {c.title}</span>}
      subtitle="Potential contradiction"
      footer={
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => onUpdate?.("reviewing")}>Mark reviewing</Button>
          <Button variant="primary" size="sm" onClick={() => onUpdate?.("resolved")}>Resolve</Button>
          <Button variant="ghost" size="sm" onClick={() => onUpdate?.("dismissed")}>Dismiss</Button>
        </div>
      }
    >
      <div className="flex items-center justify-between">
        <StatusBadge status={c.status} />
        <ConfidenceTag confidence={c.confidence} />
      </div>

      <SectionLabel>Why it was detected</SectionLabel>
      <p className="rounded-md border border-line bg-surface p-3 text-sm leading-relaxed text-fg-muted">{c.detail}</p>

      <SectionLabel>Conflicting sources</SectionLabel>
      <div className="space-y-2">
        {[{ s: c.sourceA, e: a }, { s: c.sourceB, e: b }].map(({ s, e }, i) => (
          <div key={i} className={cn("rounded-md border p-3", i === 0 ? "border-crimson/20 bg-crimson/5" : "border-line bg-surface")}>
            <div className="flex items-center gap-2">
              {e && <EvidenceIcon type={e.type} className="size-4" />}
              <span className="text-sm font-medium text-fg">{s.label}</span>
              <span className="ml-auto font-mono text-xs text-fg-dim">{s.time}</span>
            </div>
            {e && <p className="mt-1.5 font-mono text-xs text-fg-dim">{e.filename} · {e.relevantTime}</p>}
          </div>
        ))}
      </div>

      <SectionLabel>Timeline positions</SectionLabel>
      <div className="space-y-1.5">
        {c.eventIds.map((eid) => {
          const ev = investigation.events.find((e) => e.id === eid);
          if (!ev) return null;
          return (
            <div key={eid} className="flex items-center gap-2.5 rounded-sm border border-line bg-surface p-2.5">
              <Clock className="size-3.5 text-fg-dim" />
              <span className="font-mono text-xs text-fg-muted">{ev.time}</span>
              <span className="truncate text-sm text-fg">{ev.title}</span>
            </div>
          );
        })}
      </div>

      <SectionLabel>Investigator notes</SectionLabel>
      <Textarea placeholder="Document your review reasoning…" />
      <p className="mt-2 flex items-center gap-1.5 text-xs text-fg-faint"><FileText className="size-3" /> Findings are evidence-backed. Final judgment rests with the investigator.</p>
    </Drawer>
  );
}
