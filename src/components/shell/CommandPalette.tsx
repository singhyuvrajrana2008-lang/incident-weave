import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Search, CornerDownLeft, FileText, AlertTriangle, HelpCircle, Folder, Clock } from "lucide-react";
import { cn } from "../../lib/cn";
import { useApp } from "../../store/AppContext";
import { investigations } from "../../lib/data";

interface Result {
  id: string;
  group: string;
  label: string;
  sub: string;
  icon: typeof Search;
  to: string;
}

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useApp();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<Result[]>(() => {
    const all: Result[] = [];
    for (const inv of investigations) {
      all.push({ id: inv.id, group: "Investigations", label: inv.name, sub: `${inv.evidenceCount} evidence · ${inv.status}`, icon: Folder, to: `/app/investigations/${inv.id}` });
      for (const ev of inv.evidence)
        all.push({ id: inv.id + ev.id, group: "Evidence", label: ev.filename, sub: `${inv.name} · ${ev.relevantTime}`, icon: FileText, to: `/app/investigations/${inv.id}?tab=evidence` });
      for (const c of inv.contradictions)
        all.push({ id: inv.id + c.id, group: "Contradictions", label: c.title, sub: `${inv.name} · ${c.code}`, icon: AlertTriangle, to: `/app/investigations/${inv.id}?tab=contradictions` });
      for (const u of inv.unknowns)
        all.push({ id: inv.id + u.id, group: "Unknowns", label: u.title, sub: `${inv.name} · ${u.window}`, icon: HelpCircle, to: `/app/investigations/${inv.id}?tab=unknowns` });
      for (const e of inv.events)
        all.push({ id: inv.id + e.id, group: "Timeline Events", label: e.title, sub: `${inv.name} · ${e.time}`, icon: Clock, to: `/app/investigations/${inv.id}?tab=timeline` });
    }
    if (!q.trim()) return all.slice(0, 8);
    const lc = q.toLowerCase();
    return all.filter((r) => r.label.toLowerCase().includes(lc) || r.sub.toLowerCase().includes(lc)).slice(0, 12);
  }, [q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Result[]>();
    results.forEach((r) => map.set(r.group, [...(map.get(r.group) ?? []), r]));
    return [...map.entries()];
  }, [results]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [paletteOpen]);

  useEffect(() => setActive(0), [q]);

  function go(r: Result) {
    setPaletteOpen(false);
    nav(r.to);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
    if (e.key === "Escape") setPaletteOpen(false);
  }

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {paletteOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[12vh]">
          <motion.div className="absolute inset-0 bg-void/70 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPaletteOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-xl overflow-hidden rounded-lg border border-line-2 bg-bg-2 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 text-fg-dim" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search investigations, evidence, events, contradictions…"
                className="h-13 flex-1 bg-transparent py-4 text-sm text-fg placeholder:text-fg-faint focus:outline-none"
              />
              <kbd className="rounded-xs border border-line-2 bg-surface px-1.5 py-0.5 font-mono text-[10px] text-fg-dim">ESC</kbd>
            </div>
            <div className="max-h-[52vh] overflow-y-auto scroll-thin p-2">
              {results.length === 0 ? (
                <div className="px-3 py-10 text-center text-sm text-fg-dim">No results for "{q}"</div>
              ) : (
                grouped.map(([group, items]) => (
                  <div key={group} className="mb-1">
                    <div className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-fg-faint">{group}</div>
                    {items.map((r) => {
                      flatIndex++;
                      const idx = flatIndex;
                      return (
                        <button
                          key={r.id}
                          onMouseEnter={() => setActive(idx)}
                          onClick={() => go(r)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-sm px-2.5 py-2 text-left",
                            active === idx ? "bg-accent/10" : "hover:bg-surface-2",
                          )}
                        >
                          <r.icon className={cn("size-4 shrink-0", active === idx ? "text-accent" : "text-fg-dim")} />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm text-fg">{r.label}</div>
                            <div className="truncate text-xs text-fg-dim">{r.sub}</div>
                          </div>
                          {active === idx && <CornerDownLeft className="size-3.5 text-fg-dim" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
