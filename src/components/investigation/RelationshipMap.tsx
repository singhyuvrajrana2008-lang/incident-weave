import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import type { Investigation } from "../../lib/types";
import { EvidenceIcon } from "../ui";

/**
 * Compact evidence-relationship view. Evidence sits on the left, timeline
 * events in the center, contradictions on the right. Connectors light up when
 * an item is selected — the signature "weaving" interaction.
 */
export function RelationshipMap({
  investigation,
  selectedEvidence,
  selectedEvent,
  selectedContradiction,
  onSelectEvidence,
  onSelectEvent,
}: {
  investigation: Investigation;
  selectedEvidence: string | null;
  selectedEvent: string | null;
  selectedContradiction: string | null;
  onSelectEvidence: (id: string) => void;
  onSelectEvent: (id: string) => void;
}) {
  const W = 720;
  const evidence = investigation.evidence;
  const events = investigation.events;
  const contradictions = investigation.contradictions;

  const layout = useMemo(() => {
    const col = (items: { id: string }[], x: number) => {
      const gap = 380 / (items.length + 1);
      return new Map(items.map((it, i) => [it.id, { x, y: gap * (i + 1) }]));
    };
    return {
      ev: col(evidence, 90),
      evt: col(events, W / 2),
      con: col(contradictions, W - 90),
    };
  }, [evidence, events, contradictions]);

  const links = useMemo(() => {
    const out: { from: { x: number; y: number }; to: { x: number; y: number }; active: boolean; danger?: boolean }[] = [];
    for (const e of events) {
      const evtPt = layout.evt.get(e.id)!;
      for (const sid of e.sources) {
        const evPt = layout.ev.get(sid);
        if (!evPt) continue;
        const active =
          selectedEvidence === sid || selectedEvent === e.id || (selectedContradiction != null && e.contradiction === selectedContradiction);
        out.push({ from: evPt, to: evtPt, active });
      }
      if (e.contradiction) {
        const conPt = layout.con.get(e.contradiction);
        if (conPt) {
          const active = selectedContradiction === e.contradiction || selectedEvent === e.id;
          out.push({ from: evtPt, to: conPt, active, danger: true });
        }
      }
    }
    return out;
  }, [events, layout, selectedEvidence, selectedEvent, selectedContradiction]);

  const anySel = selectedEvidence || selectedEvent || selectedContradiction;

  return (
    <div className="overflow-x-auto scroll-thin">
      <div className="relative mx-auto" style={{ width: W, height: 400 }}>
        <svg viewBox={`0 0 ${W} 400`} className="absolute inset-0 h-full w-full">
          {links.map((l, i) => {
            const mx = (l.from.x + l.to.x) / 2;
            return (
              <motion.path
                key={i}
                d={`M ${l.from.x} ${l.from.y} C ${mx} ${l.from.y}, ${mx} ${l.to.y}, ${l.to.x} ${l.to.y}`}
                fill="none"
                stroke={l.danger ? "var(--color-crimson)" : "var(--color-accent)"}
                strokeWidth={l.active ? 2 : 1}
                strokeOpacity={l.active ? 0.9 : anySel ? 0.08 : 0.22}
                className={l.active && l.danger ? "weave-line animate-dash" : ""}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: i * 0.02 }}
              />
            );
          })}
        </svg>

        {/* column labels */}
        <div className="absolute left-[90px] top-1 -translate-x-1/2 font-mono text-[10px] uppercase tracking-wider text-fg-faint">Evidence</div>
        <div className="absolute left-1/2 top-1 -translate-x-1/2 font-mono text-[10px] uppercase tracking-wider text-fg-faint">Events</div>
        <div className="absolute top-1 font-mono text-[10px] uppercase tracking-wider text-fg-faint" style={{ left: W - 90, transform: "translateX(-50%)" }}>Conflicts</div>

        {evidence.map((e) => {
          const pt = layout.ev.get(e.id)!;
          const active = selectedEvidence === e.id;
          return (
            <MapNode key={e.id} x={pt.x} y={pt.y} active={active} dim={!!anySel && !active} onClick={() => onSelectEvidence(e.id)}>
              <EvidenceIcon type={e.type} className="size-3.5" />
              <span className="max-w-[90px] truncate font-mono text-[10px]">{e.filename}</span>
            </MapNode>
          );
        })}
        {events.map((e) => {
          const pt = layout.evt.get(e.id)!;
          const active = selectedEvent === e.id;
          return (
            <MapNode key={e.id} x={pt.x} y={pt.y} active={active} danger={!!e.contradiction} dim={!!anySel && !active} onClick={() => onSelectEvent(e.id)}>
              <span className="font-mono text-[10px] tabular text-accent">{e.time}</span>
            </MapNode>
          );
        })}
        {contradictions.map((c) => {
          const pt = layout.con.get(c.id)!;
          const active = selectedContradiction === c.id;
          return (
            <MapNode key={c.id} x={pt.x} y={pt.y} active={active} danger dim={!!anySel && !active}>
              <span className="font-mono text-[10px] text-crimson">{c.code}</span>
            </MapNode>
          );
        })}
      </div>
    </div>
  );
}

function MapNode({
  x, y, children, active, danger, dim, onClick,
}: {
  x: number; y: number; children: React.ReactNode; active?: boolean; danger?: boolean; dim?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ left: x, top: y }}
      className={cn(
        "absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-sm border px-2 py-1.5 transition-all",
        active
          ? danger ? "border-crimson bg-crimson/15 scale-105" : "border-accent bg-accent/15 scale-105"
          : danger ? "border-crimson/30 bg-surface hover:border-crimson/50" : "border-line-2 bg-surface hover:border-line-strong",
        dim && "opacity-40",
        !onClick && "cursor-default",
      )}
    >
      {children}
    </button>
  );
}
