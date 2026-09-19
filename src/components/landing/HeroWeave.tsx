import { motion } from "motion/react";
import { FileText, Image, MessageSquare, Mic, Phone } from "lucide-react";

const fragments = [
  { icon: Image, label: "Screenshot", color: "#f2f2ee", y: 34 },
  { icon: Phone, label: "Call log", color: "#aaa9a3", y: 82 },
  { icon: FileText, label: "PDF", color: "#777872", y: 130 },
  { icon: MessageSquare, label: "Message", color: "#f2f2ee", y: 178 },
  { icon: Mic, label: "Recording", color: "#c9c9c3", y: 226 },
];

const timelineNodes = [
  { t: "10:12", tone: "#d7d7d1", y: 42 },
  { t: "10:14", tone: "#9d9d97", y: 94 },
  { t: "10:16", tone: "#d7d7d1", y: 146 },
  { t: "10:18", tone: "#f05a61", y: 198, label: "conflict" },
  { t: "10:21", tone: "#f4c451", y: 250, label: "unknown" },
];

export function HeroWeave() {
  return (
    <div className="relative aspect-[5/3] w-full min-w-0 overflow-hidden rounded-lg border border-line-2 bg-bg-2 grid-texture">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_260px_at_50%_50%,rgba(255,255,255,0.055),transparent_72%)]" />

      <svg
        viewBox="0 0 460 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {fragments.map((f, i) => (
          <motion.path
            key={f.label}
            d={`M 108 ${f.y} C 145 ${f.y}, 165 150, 210 150`}
            fill="none"
            stroke={f.color}
            strokeWidth={1.2}
            strokeLinecap="round"
            strokeOpacity={0.48}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.48 }}
            transition={{ duration: 0.7, delay: 0.18 + i * 0.08, ease: "easeOut" }}
          />
        ))}

        {timelineNodes.map((n, i) => (
          <motion.path
            key={n.t}
            d={`M 250 150 C 292 150, 308 ${n.y}, 345 ${n.y}`}
            fill="none"
            stroke={n.tone}
            strokeWidth={n.label === "conflict" ? 1.6 : 1.2}
            strokeLinecap="round"
            strokeOpacity={0.5}
            className={n.label === "conflict" ? "weave-line animate-dash" : ""}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 0.7, delay: 0.95 + i * 0.12, ease: "easeOut" }}
          />
        ))}

        <motion.circle
          cx="230"
          cy="150"
          r="22"
          fill="var(--color-void)"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.45 }}
          style={{ transformOrigin: "230px 150px" }}
        />
        <motion.circle
          cx="230"
          cy="150"
          r="7"
          fill="var(--color-accent)"
          animate={{ opacity: [0.45, 1, 0.45], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "230px 150px" }}
        />
      </svg>

      <div className="absolute left-3 top-0 h-full w-[30%] min-w-[104px] sm:left-5 sm:w-[28%]">
        {fragments.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.09, duration: 0.35 }}
              style={{ top: `${(f.y / 300) * 100}%` }}
              className="absolute left-0 flex w-full -translate-y-1/2 items-center gap-2 rounded-sm border border-line-2 bg-surface/90 px-2.5 py-1.5 backdrop-blur-sm"
            >
              <Icon className="size-3.5 shrink-0" style={{ color: f.color }} />
              <span className="truncate font-mono text-[10px] text-fg-muted">{f.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.35 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-[30px] whitespace-nowrap text-center"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Correlation</div>
        <div className="mt-1 text-[9px] text-fg-faint">cross-source links</div>
      </motion.div>

      <div className="absolute right-3 top-0 h-full w-[28%] min-w-[102px] sm:right-5">
        {timelineNodes.map((n, i) => (
          <motion.div
            key={n.t}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.11, duration: 0.35 }}
            className="absolute right-0 flex -translate-y-1/2 items-center gap-2 rounded-sm border px-2.5 py-1.5"
            style={{ borderColor: `${n.tone}44`, background: `${n.tone}12`, top: `${(n.y / 300) * 100}%` }}
          >
            <span className="size-1.5 shrink-0 rounded-full" style={{ background: n.tone }} />
            <span className="font-mono text-[10px]" style={{ color: n.tone }}>{n.t}</span>
            {n.label && <span className="hidden font-mono text-[9px] uppercase tracking-wide sm:inline" style={{ color: n.tone }}>{n.label}</span>}
          </motion.div>
        ))}
      </div>

      <div className="absolute bottom-3 left-3 rounded-sm border border-line bg-bg/80 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-fg-faint backdrop-blur-sm sm:left-5">
        Evidence → Timeline
      </div>
    </div>
  );
}
