import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, FileText, Image, Mic2 } from "lucide-react";

const sources = [
  { icon: FileText, label: "Witness statement", color: "#39a6ff", position: "top-[9%] left-[5%]" },
  { icon: Image, label: "CCTV frame", color: "#6f8cff", position: "top-[43%] left-[0%]" },
  { icon: Mic2, label: "Call transcript", color: "#31d3cf", position: "bottom-[10%] left-[8%]" },
];

const outcomes = [
  { label: "Timeline", color: "#39a6ff", position: "top-[8%] right-[1%]" },
  { label: "Contradictions", color: "#ff6379", position: "top-[44%] right-[0%]" },
  { label: "Unknowns", color: "#f7b84b", position: "bottom-[10%] right-[4%]" },
];

export function HeroWeave() {
  const [active, setActive] = useState<string | null>(null);
  const lines = useMemo(() => sources.map((_, i) => i), []);

  return (
    <div className="relative mx-auto h-full min-h-[390px] w-full max-w-[630px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_50%_45%,rgba(57,166,255,.13),transparent_30%),linear-gradient(180deg,#0c1726,#08111c)] shadow-[0_30px_100px_rgba(0,0,0,.3)]">
      <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute left-5 top-5 z-10 rounded-full border border-white/8 bg-black/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-[#667b94]">Evidence weave</div>

      <div className="absolute left-[42%] top-[39%] z-20 -translate-x-1/2 -translate-y-1/2 sm:left-1/2">
        <div className="grid size-24 place-items-center rounded-full border border-[#39a6ff]/40 bg-[#0b1b2e] shadow-[0_0_0_10px_rgba(57,166,255,.05),0_0_55px_rgba(57,166,255,.18)]">
          <div className="grid size-14 place-items-center rounded-2xl border border-[#39a6ff]/30 bg-[#39a6ff]/10 text-[#55b6ff]">
            <ArrowRight className="size-6" />
          </div>
        </div>
        <div className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-[#70839a]">Correlation engine</div>
      </div>

      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 630 500" fill="none" preserveAspectRatio="none" aria-hidden="true">
        {lines.map((i) => (
          <path key={i} d={i === 0 ? "M92 88 C185 86 220 142 315 205" : i === 1 ? "M58 250 C178 250 219 236 315 235" : "M115 414 C190 393 228 325 315 270"} stroke={sources[i].color} strokeOpacity=".34" strokeWidth="2" strokeDasharray="5 7" />
        ))}
        {outcomes.map((_, i) => (
          <path key={i} d={i === 0 ? "M315 205 C410 150 448 103 556 85" : i === 1 ? "M315 235 C408 232 475 242 568 249" : "M315 270 C415 307 449 365 548 405"} stroke={outcomes[i].color} strokeOpacity=".28" strokeWidth="2" strokeDasharray="5 7" />
        ))}
      </svg>

      {sources.map(({ icon: Icon, label, color, position }) => (
        <button key={label} onClick={() => setActive(active === label ? null : label)} className={`absolute ${position} z-20 flex max-w-[170px] items-center gap-2 rounded-2xl border px-3 py-2.5 text-left transition ${active === label ? "border-white/25 bg-white/10" : "border-white/8 bg-[#0b1624]/90 hover:border-white/16"}`} style={{ boxShadow: active === label ? `0 0 24px ${color}25` : undefined }}>
          <span className="grid size-8 shrink-0 place-items-center rounded-xl" style={{ background: `${color}17`, color }}><Icon className="size-4" /></span>
          <span className="min-w-0"><span className="block truncate text-[11px] font-medium text-white">{label}</span><span className="mt-0.5 block font-mono text-[9px] text-[#61758d]">source evidence</span></span>
        </button>
      ))}

      {outcomes.map(({ label, color, position }) => (
        <button key={label} onClick={() => setActive(active === label ? null : label)} className={`absolute ${position} z-20 flex items-center gap-2 rounded-2xl border px-3 py-2.5 transition ${active === label ? "border-white/25 bg-white/10" : "border-white/8 bg-[#0b1624]/90 hover:border-white/16"}`}>
          <span className="size-2 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}` }} />
          <span className="text-[11px] font-medium text-white">{label}</span>
        </button>
      ))}

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/8 bg-black/25 px-3 py-2 text-[10px] text-[#768aa1] backdrop-blur">
        <span className="size-1.5 rounded-full bg-[#35d49a]" />
        AI-assisted · Human reviewed
        <ArrowDown className="size-3" />
      </div>
    </div>
  );
}
