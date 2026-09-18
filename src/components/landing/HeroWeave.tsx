import { motion } from "motion/react";
import { Image, FileText, Phone, MessageSquare, Mic } from "lucide-react";

/**
 * Interactive evidence-correlation hero visual.
 * Fragments on the left stream into a central correlation node, which emits
 * a reconstructed timeline. One relationship reads crimson (contradiction),
 * one node reads amber (unknown).
 */
const fragments = [
  { icon: Image, label: "Screenshot", color: "#60a5fa", y: 8 },
  { icon: Phone, label: "Call Log", color: "#38bdf8", y: 30 },
  { icon: FileText, label: "PDF", color: "#f05252", y: 52 },
  { icon: MessageSquare, label: "Message", color: "#22d3ee", y: 74 },
  { icon: Mic, label: "Recording", color: "#34d399", y: 96 },
];

const timelineNodes = [
  { t: "10:12", tone: "#34d399", delay: 1.0 },
  { t: "10:14", tone: "#38bdf8", delay: 1.25 },
  { t: "10:16", tone: "#34d399", delay: 1.5 },
  { t: "10:18", tone: "#f05252", delay: 1.75 },
  { t: "10:21", tone: "#fbbf24", delay: 2.0 },
];

export function HeroWeave() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-line-2 bg-bg-2 grid-texture">
      <div className="absolute inset-0 bg-[radial-gradient(500px_300px_at_60%_40%,rgba(56,189,248,0.08),transparent_70%)]" />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* strands from fragments to correlation node */}
        {fragments.map((f, i) => (
          <motion.path
            key={i}
            d={`M 70 ${20 + f.y * 0.7} C 140 ${20 + f.y * 0.7}, 150 150, 200 150`}
            fill="none"
            stroke={f.color}
            strokeWidth={1.2}
            strokeOpacity={0.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: "easeOut" }}
          />
        ))}
        {/* strands from correlation node to timeline */}
        {timelineNodes.map((n, i) => (
          <motion.path
            key={i}
            d={`M 200 150 C 250 150, 260 ${50 + i * 50}, 320 ${50 + i * 50}`}
            fill="none"
            stroke={n.tone}
            strokeWidth={n.tone === "#f05252" ? 1.6 : 1.2}
            strokeOpacity={0.55}
            className={n.tone === "#f05252" ? "weave-line animate-dash" : ""}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.55 }}
            transition={{ duration: 0.8, delay: n.delay, ease: "easeOut" }}
          />
        ))}
        {/* central correlation node */}
        <motion.circle cx="200" cy="150" r="16" fill="#0b0f14" stroke="#38bdf8" strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }} style={{ transformOrigin: "200px 150px" }} />
        <motion.circle cx="200" cy="150" r="6" fill="#38bdf8"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity }} />
      </svg>

      {/* Fragment cards */}
      <div className="absolute left-3 top-4 flex flex-col gap-2 sm:left-5 sm:gap-2.5">
        {fragments.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0, y: [0, -2, 0] }}
            transition={{
              opacity: { delay: i * 0.1, duration: 0.4 },
              x: { delay: i * 0.1, duration: 0.4 },
              y: { delay: 1 + i * 0.2, duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
            }}
            className="flex items-center gap-2 rounded-sm border border-line-2 bg-surface/90 px-2.5 py-1.5 backdrop-blur-sm"
          >
            <f.icon className="size-3.5" style={{ color: f.color }} />
            <span className="font-mono text-[10px] text-fg-muted">{f.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Correlation label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[22px] whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-accent"
      >
        Correlation
      </motion.div>

      {/* Timeline node chips */}
      <div className="absolute right-3 top-6 flex flex-col gap-3 sm:right-5">
        {timelineNodes.map((n, i) => (
          <motion.div
            key={n.t}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: n.delay + 0.2, duration: 0.4 }}
            className="flex items-center gap-2 rounded-sm border px-2.5 py-1.5"
            style={{ borderColor: `${n.tone}44`, background: `${n.tone}12` }}
          >
            <span className="size-1.5 rounded-full" style={{ background: n.tone }} />
            <span className="font-mono text-[10px]" style={{ color: n.tone }}>{n.t}</span>
            {n.tone === "#f05252" && <span className="font-mono text-[9px] text-crimson">conflict</span>}
            {n.tone === "#fbbf24" && <span className="font-mono text-[9px] text-amber">unknown</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
