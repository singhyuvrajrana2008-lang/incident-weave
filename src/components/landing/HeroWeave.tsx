import { motion } from "motion/react";
import { FileText, Image, MessageSquare, Phone, Mic } from "lucide-react";

const fragments = [
  { Icon: Image, label: "Screenshot", tone: "#60a5fa" },
  { Icon: Phone, label: "Call Log", tone: "#38bdf8" },
  { Icon: FileText, label: "PDF", tone: "#f05252" },
  { Icon: MessageSquare, label: "Message", tone: "#22d3ee" },
  { Icon: Mic, label: "Recording", tone: "#34d399" },
];

const events = ["10:12", "10:14", "10:16", "10:18", "10:21"];

export function HeroWeave() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line-2 bg-bg-2 grid-texture">
      <svg viewBox="0 0 600 420" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {fragments.map((f, i) => (
          <motion.path
            key={f.label}
            d={`M90 ${65 + i * 66} C210 ${65 + i * 66}, 245 210, 300 210`}
            fill="none" stroke={f.tone} strokeWidth="1.5" strokeOpacity=".5"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: .55 }}
            transition={{ duration: .9, delay: i * .12 }}
          />
        ))}
        {events.map((_, i) => (
          <motion.path key={i} d={`M300 210 C380 210, 420 ${55 + i * 72}, 505 ${55 + i * 72}`}
            fill="none" stroke={i === 3 ? "#f05252" : i === 4 ? "#fbbf24" : "#38bdf8"}
            strokeWidth={i === 3 ? 2 : 1.5} strokeOpacity=".55" strokeDasharray={i === 3 ? "5 5" : undefined}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8, delay: .8 + i * .18 }} />
        ))}
        <circle cx="300" cy="210" r="24" fill="#0b0f14" stroke="#38bdf8" strokeWidth="2" />
        <motion.circle cx="300" cy="210" r="8" fill="#38bdf8" animate={{ opacity: [.35,1,.35], r:[7,10,7] }} transition={{ duration:2.2, repeat:Infinity }} />
      </svg>
      <div className="absolute left-5 top-5 flex flex-col gap-2">
        {fragments.map(({ Icon, label, tone }, i) => (
          <motion.div key={label} className="flex items-center gap-2 rounded-md border border-line-2 bg-surface/90 px-3 py-2 backdrop-blur"
            initial={{ opacity:0,x:-12 }} animate={{ opacity:1,x:0 }} transition={{ delay:i*.1 }}>
            <Icon className="size-3.5" style={{ color:tone }} />
            <span className="font-mono text-[10px] text-fg-muted">{label}</span>
          </motion.div>
        ))}
      </div>
      <div className="absolute right-5 top-8 flex flex-col gap-3">
        {events.map((time, i) => (
          <motion.div key={time} className="flex items-center gap-2 rounded-md border px-3 py-2 bg-surface/80"
            style={{ borderColor: i===3 ? "#f0525244" : i===4 ? "#fbbf2444" : "#38bdf844" }}
            initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} transition={{ delay:.9+i*.18 }}>
            <span className="size-1.5 rounded-full" style={{ background: i===3 ? "#f05252" : i===4 ? "#fbbf24" : "#38bdf8" }} />
            <span className="font-mono text-[10px]" style={{ color: i===3 ? "#f05252" : i===4 ? "#fbbf24" : "#38bdf8" }}>{time}</span>
            {i===3 && <span className="font-mono text-[9px] text-crimson">conflict</span>}
            {i===4 && <span className="font-mono text-[9px] text-amber">unknown</span>}
          </motion.div>
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-8 font-mono text-[10px] uppercase tracking-[.25em] text-accent">Correlation</div>
    </div>
  );
}
