import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import type { Investigation, TimelineEvent } from "../../lib/types";
import { EvidenceIcon, Badge } from "../ui";

const confTone = {
  high: { dot: "bg-verified", ring: "ring-verified/30", text: "text-verified" },
  medium: { dot: "bg-amber", ring: "ring-amber/30", text: "text-amber" },
  low: { dot: "bg-crimson", ring: "ring-crimson/30", text: "text-crimson" },
};

const labelTone: Record<TimelineEvent["label"], "verified" | "accent" | "amber" | "neutral"> = {
  "evidence-backed": "verified",
  inferred: "accent",
  "ai-observation": "accent",
  uncertain: "amber",
};

export function Timeline({
  investigation,
  selectedEvent,
  highlightedEvents,
  onSelectEvent,
}: {
  investigation: Investigation;
  selectedEvent: string | null;
  highlightedEvents: Set<string>;
  onSelectEvent: (id: string) => void;
}) {
  const events = investigation.events;
  if (events.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-fg-dim">
        Timeline will appear here once the investigation is reconstructed.
      </div>
    );
  }
  return (
    <div className="relative py-2 pl-2">
      {/* central line */}
      <div className="absolute bottom-4 left-[26px] top-4 w-px bg-line" />
      <div className="space-y-1">
        {events.map((ev, i) => {
          const tone = confTone[ev.confidence];
          const selected = selectedEvent === ev.id;
          const highlighted = highlightedEvents.has(ev.id);
          const dimmed = highlightedEvents.size > 0 && !highlighted && !selected;
          return (
            <motion.button
              key={ev.id}
              onClick={() => onSelectEvent(ev.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: dimmed ? 0.4 : 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="group relative flex w-full gap-4 rounded-md px-3 py-3 text-left transition-colors hover:bg-surface-2/60"
            >
              {/* node */}
              <div className="relative z-10 flex flex-col items-center pt-1">
                <span
                  className={cn(
                    "size-3 rounded-full ring-4 ring-surface transition-all",
                    ev.contradiction ? "bg-crimson" : tone.dot,
                    (selected || highlighted) && "scale-125 ring-accent/30",
                  )}
                />
              </div>
              {/* content */}
              <div
                className={cn(
                  "floating-tile min-w-0 flex-1 rounded-md border p-3 transition-all",
                  selected
                    ? "border-accent/50 bg-accent/5 shadow-[0_0_0_1px_rgba(56,189,248,0.2)]"
                    : highlighted
                    ? "border-accent/30 bg-surface-2"
                    : ev.contradiction
                    ? "border-crimson/20 bg-surface"
                    : "border-line bg-surface",
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn("font-mono text-sm tabular", selected ? "text-accent" : "text-fg")}>{ev.time}</span>
                  <Badge tone={labelTone[ev.label]}>{ev.label.replace("-", " ")}</Badge>
                  {ev.contradiction && <Badge tone="crimson">conflict</Badge>}
                  <span className={cn("ml-auto text-xs", tone.text)}>{ev.confidence} confidence</span>
                </div>
                <h4 className="mt-1.5 font-medium text-fg">{ev.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-fg-dim">{ev.description}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">Sources</span>
                  {ev.sources.map((sid) => {
                    const src = investigation.evidence.find((e) => e.id === sid);
                    if (!src) return null;
                    return (
                      <span key={sid} className="inline-flex items-center gap-1.5 rounded-xs border border-line-2 bg-surface-2 px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
                        <EvidenceIcon type={src.type} className="size-3" /> {src.filename}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
