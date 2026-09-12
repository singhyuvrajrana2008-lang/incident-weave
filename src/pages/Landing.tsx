import { Link } from "react-router-dom";
import { ArrowRight, FileText, Image as ImageIcon, Mic2, ShieldCheck, Sparkles, GitBranch, AlertTriangle, Search, Clock3 } from "lucide-react";
import { HeroWeave } from "../components/landing/HeroWeave";

const capabilities = [
  { icon: FileText, title: "Ingest documents", text: "Bring witness statements, reports, notes and structured records into one case." },
  { icon: ImageIcon, title: "Correlate visual evidence", text: "Connect screenshots, CCTV frames and image evidence to the same event sequence." },
  { icon: Mic2, title: "Understand audio & text", text: "Use transcripts and voice notes as first-class evidence, not isolated files." },
  { icon: GitBranch, title: "Reconstruct relationships", text: "Link sources to events, conflicts and evidence gaps so the case becomes navigable." },
];

const signals = [
  { icon: Clock3, title: "Timeline", tone: "blue" },
  { icon: AlertTriangle, title: "Contradictions", tone: "red" },
  { icon: Search, title: "Unknown evidence", tone: "amber" },
];

export default function Landing() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#070d16] text-[#e9f1ff]">
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#070d16]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl border border-[#39a6ff]/25 bg-[#39a6ff]/10 text-[#39a6ff]">
              <GitBranch className="size-5" />
            </div>
            <div>
              <div className="font-semibold tracking-tight">IncidentWeave</div>
              <div className="hidden text-[10px] uppercase tracking-[.22em] text-[#62758d] sm:block">Evidence intelligence</div>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-[#93a5bb] md:flex">
            <a href="#workflow" className="transition hover:text-white">How it works</a>
            <a href="#capabilities" className="transition hover:text-white">Capabilities</a>
            <a href="#trust" className="transition hover:text-white">Human review</a>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/sign-in" className="rounded-lg px-3 py-2 text-sm text-[#9cafc4] transition hover:bg-white/5 hover:text-white">Sign in</Link>
            <Link to="/sign-up" className="rounded-lg bg-[#39a6ff] px-3.5 py-2 text-sm font-semibold text-[#06111f] shadow-[0_8px_30px_rgba(57,166,255,.22)] transition hover:-translate-y-px hover:bg-[#5bb5ff]">Get started</Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.03fr_.97fr] lg:pb-24 lg:pt-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#39a6ff]/20 bg-[#39a6ff]/[.06] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[.16em] text-[#67baff]">
            <Sparkles className="size-3.5" /> Multimodal case reconstruction
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-.04em] sm:text-5xl lg:text-[4.15rem]">
            Turn fragmented evidence into a <span className="text-[#39a6ff]">clear incident timeline.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#8ea0b7] sm:text-lg">
            IncidentWeave correlates documents, images, messages, calls and transcripts into an investigator-friendly reconstruction — surfacing conflicts and missing evidence without replacing human judgment.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/sign-up" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#39a6ff] px-5 text-sm font-semibold text-[#06111f] shadow-[0_12px_34px_rgba(57,166,255,.2)] transition hover:-translate-y-0.5 hover:bg-[#5bb5ff]">
              Start an investigation <ArrowRight className="size-4" />
            </Link>
            <Link to="/sign-in" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[.025] px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[.05]">
              Explore workspace
            </Link>
          </div>

          <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
            {signals.map(({ icon: Icon, title, tone }) => (
              <div key={title} className="rounded-xl border border-white/8 bg-white/[.025] p-3.5">
                <Icon className={`size-4 ${tone === "red" ? "text-[#ff6379]" : tone === "amber" ? "text-[#f7b84b]" : "text-[#39a6ff]"}`} />
                <div className="mt-3 text-xs font-medium text-white">{title}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[400px] lg:min-h-[520px]">
          <HeroWeave />
        </div>
      </section>

      <section id="workflow" className="border-y border-white/8 bg-[#09111d]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:py-18">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[.2em] text-[#39a6ff]">Workflow</div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.03em]">From fragments to findings.</h2>
            <p className="mt-4 max-w-md leading-7 text-[#8497ae]">Every finding keeps a traceable relationship back to its source evidence so an investigator can inspect the reasoning instead of accepting a black box.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["01", "Ingest", "Capture files, notes, calls, images and transcripts."],
              ["02", "Normalize", "Align timestamps, metadata and extracted claims."],
              ["03", "Correlate", "Connect sources that describe the same event."],
              ["04", "Review", "Inspect the timeline, contradictions and unknowns."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-2xl border border-white/8 bg-[#0b1523] p-5">
                <div className="font-mono text-[11px] tracking-wider text-[#5e738d]">{n}</div>
                <div className="mt-3 text-lg font-semibold">{t}</div>
                <div className="mt-2 text-sm leading-6 text-[#8295ac]">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="capabilities" className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[.2em] text-[#39a6ff]">Capabilities</div>
          <h2 className="mt-3 text-3xl font-bold tracking-[-.03em] sm:text-4xl">One workspace for every fragment.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-white/8 bg-[#0b1523] p-5 transition hover:-translate-y-1 hover:border-[#39a6ff]/25">
              <div className="grid size-10 place-items-center rounded-xl border border-[#39a6ff]/15 bg-[#39a6ff]/8 text-[#4bb0ff]"><Icon className="size-5" /></div>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#8295ac]">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="trust" className="mx-auto mb-16 w-full max-w-7xl px-5 sm:px-8">
        <div className="overflow-hidden rounded-3xl border border-[#39a6ff]/15 bg-[radial-gradient(circle_at_85%_15%,rgba(57,166,255,.12),transparent_40%),#0b1523] p-7 sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#6ec0ff]"><ShieldCheck className="size-4" /> Human-in-the-loop by design</div>
            <h2 className="mt-3 text-2xl font-bold tracking-[-.025em] sm:text-3xl">AI surfaces patterns. Investigators make decisions.</h2>
            <p className="mt-4 leading-7 text-[#8da0b7]">IncidentWeave separates observed evidence, inference and uncertainty so every important conclusion remains reviewable.</p>
          </div>
          <Link to="/sign-up" className="mt-7 inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#07111e] transition hover:bg-[#dceeff] lg:mt-0">Open workspace <ArrowRight className="size-4" /></Link>
        </div>
      </section>

      <footer className="border-t border-white/8 py-7">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 text-xs text-[#64768d] sm:px-8 md:flex-row md:items-center md:justify-between">
          <span>IncidentWeave · Evidence intelligence for human investigators.</span>
          <span>AI-assisted · Human reviewed.</span>
        </div>
      </footer>
    </main>
  );
}
