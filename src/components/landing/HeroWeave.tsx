import { motion } from "motion/react";
import { FileText, Image as ImageIcon, MessageSquare, Phone, Mic, ArrowUpRight, AlertTriangle, HelpCircle } from "lucide-react";

const sources = [
  { icon:ImageIcon, label:"CCTV frame", meta:"10:18:47", tone:"text-accent-3" },
  { icon:Phone, label:"Call log", meta:"10:14:21", tone:"text-accent" },
  { icon:FileText, label:"Witness statement", meta:"10:20:00", tone:"text-amber" },
  { icon:MessageSquare, label:"Message capture", meta:"10:16:03", tone:"text-verified" },
];

const events = [
  { time:"10:14", label:"Call recorded", tone:"verified" },
  { time:"10:16", label:"Message captured", tone:"verified" },
  { time:"10:18", label:"Lobby appearance", tone:"verified" },
  { time:"10:20", label:"Location conflict", tone:"crimson" },
  { time:"10:21", label:"Evidence gap", tone:"amber" },
];

export function HeroWeave() {
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-line bg-[#0d151d] shadow-glow">
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-70" />
      <div className="relative border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[.22em] text-fg-faint">Investigation view</div>
            <div className="mt-1 font-display text-sm font-semibold text-fg">Evidence correlation</div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-verified/20 bg-verified/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.12em] text-verified"><span className="size-1.5 rounded-full bg-verified pulse-ring"/> Live reconstruction</div>
        </div>
      </div>

      <div className="relative grid min-h-[430px] gap-4 p-5 sm:p-6 lg:grid-cols-[.78fr_1.44fr_.78fr] lg:items-center">
        <div className="space-y-2">
          <div className="mb-3 font-mono text-[9px] uppercase tracking-[.18em] text-fg-faint">Source fragments</div>
          {sources.map(({icon:Icon,label,meta,tone},i)=><motion.div key={label} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*.08}} className="group rounded-lg border border-line bg-surface/80 p-3 transition-colors hover:border-line-strong hover:bg-surface-2">
            <div className="flex items-center gap-3"><div className="grid size-8 place-items-center rounded-md border border-line-2 bg-bg-2"><Icon className={`size-3.5 ${tone}`}/></div><div className="min-w-0"><div className="truncate text-xs font-semibold text-fg">{label}</div><div className="mt-0.5 font-mono text-[9px] text-fg-faint">{meta}</div></div><ArrowUpRight className="ml-auto size-3.5 text-fg-faint transition-colors group-hover:text-accent"/></div>
          </motion.div>)}
        </div>

        <div className="relative min-h-[250px]">
          <svg viewBox="0 0 520 280" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs><linearGradient id="weave-blue" x1="0" x2="1"><stop offset="0" stopColor="#68b5ff" stopOpacity=".1"/><stop offset=".5" stopColor="#68b5ff" stopOpacity=".7"/><stop offset="1" stopColor="#55e2d7" stopOpacity=".15"/></linearGradient></defs>
            {[44,92,140,188].map((y,i)=><motion.path key={y} d={`M38 ${y} C150 ${y}, 168 140, 260 140 S360 ${y}, 482 ${y}`} fill="none" stroke="url(#weave-blue)" strokeWidth="1.5" strokeDasharray="5 7" initial={{pathLength:0,opacity:0}} animate={{pathLength:1,opacity:.7}} transition={{duration:1.1,delay:i*.12}}/>)}
            <motion.circle cx="260" cy="140" r="56" fill="#101b25" stroke="#34506a" strokeWidth="1.5" initial={{scale:.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:.6}}/>
            <circle cx="260" cy="140" r="38" fill="none" stroke="#68b5ff" strokeOpacity=".18" strokeDasharray="3 6"/>
            <motion.circle cx="260" cy="140" r="9" fill="#68b5ff" animate={{r:[8,11,8],opacity:[.65,1,.65]}} transition={{duration:2.2,repeat:Infinity}}/>
            <text x="260" y="136" textAnchor="middle" fill="#f4f7fb" fontSize="11" fontWeight="700">Correlation</text>
            <text x="260" y="153" textAnchor="middle" fill="#7d8b99" fontSize="8">12 linked signals</text>
          </svg>
          <div className="absolute left-1/2 top-[calc(50%+86px)] -translate-x-1/2 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.16em] text-accent">Normalized event graph</div>
        </div>

        <div>
          <div className="mb-3 font-mono text-[9px] uppercase tracking-[.18em] text-fg-faint">Reconstructed sequence</div>
          <div className="space-y-2">
            {events.map((event,i)=><motion.div key={event.time} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:.35+i*.08}} className="flex items-center gap-3 rounded-lg border border-line bg-surface/70 px-3 py-2.5">
              <div className={`grid size-7 shrink-0 place-items-center rounded-full border ${event.tone==='crimson'?'border-crimson/25 bg-crimson/10':'border-line-2 bg-bg-2'}`}><span className={`font-mono text-[9px] ${event.tone==='crimson'?'text-crimson':event.tone==='amber'?'text-amber':'text-accent'}`}>{i+1}</span></div>
              <div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold text-fg">{event.label}</div><div className="font-mono text-[9px] text-fg-faint">{event.time}</div></div>
              {event.tone==='crimson'?<AlertTriangle className="size-3.5 text-crimson"/>:event.tone==='amber'?<HelpCircle className="size-3.5 text-amber"/>:<span className="size-1.5 rounded-full bg-verified"/>}
            </motion.div>)}
          </div>
        </div>
      </div>

      <div className="grid border-t border-line sm:grid-cols-3">
        {[['06','evidence sources','linked'],['05','timeline events','normalized'],['02','review flags','require attention']].map(([value,label,note])=><div key={label} className="border-b border-line p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"><div className="font-mono text-lg font-medium tabular text-fg">{value}</div><div className="mt-1 text-[10px] uppercase tracking-[.12em] text-fg-faint">{label}</div><div className="mt-1 text-[10px] text-fg-dim">{note}</div></div>)}
      </div>
    </div>
  );
}
