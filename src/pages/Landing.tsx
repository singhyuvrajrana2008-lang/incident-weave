import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, AlertTriangle, Clock3, GitBranch, HelpCircle, Menu, ShieldCheck, UserCheck, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui";
import { HeroWeave } from "../components/landing/HeroWeave";

const sections = [
  { icon:GitBranch, title:"Evidence correlation", text:"Connect screenshots, documents, calls, messages and recordings without losing source attribution." },
  { icon:Clock3, title:"Timeline reconstruction", text:"Normalize timestamps and rebuild a chronology that shows confidence at event level." },
  { icon:AlertTriangle, title:"Contradictions", text:"Surface competing claims side by side instead of silently choosing one narrative." },
  { icon:HelpCircle, title:"Unknown evidence", text:"Make evidence gaps explicit and show what would strengthen or resolve them." },
];

export default function Landing() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/"><Logo /></Link>
          <nav className="hidden gap-7 md:flex">
            <a href="#product" className="text-sm text-fg-muted hover:text-fg">Product</a>
            <a href="#how" className="text-sm text-fg-muted hover:text-fg">How it works</a>
            <a href="#workspace" className="text-sm text-fg-muted hover:text-fg">Workspace</a>
          </nav>
          <div className="hidden gap-2 md:flex"><Link to="/sign-in"><Button variant="ghost" size="sm">Sign in</Button></Link><Link to="/sign-up"><Button size="sm">Start investigation</Button></Link></div>
          <button className="md:hidden" onClick={()=>setOpen(v=>!v)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
        </div>
        {open && <div className="border-t border-line bg-bg-2 px-6 py-4 md:hidden"><div className="flex flex-col gap-3"><a href="#product">Product</a><a href="#how">How it works</a><a href="#workspace">Workspace</a><Link to="/sign-up"><Button>Start</Button></Link></div></div>}
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-line px-6 py-20 md:py-28" id="product">
          <div className="pointer-events-none absolute inset-0 grid-texture opacity-35" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.05fr_.95fr]">
            <div>
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.2em] text-fg-muted"><span className="size-1.5 rounded-full bg-verified pulse-ring"/> Multimodal incident reconstruction</motion.div>
              <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.06}} className="max-w-3xl font-display text-5xl font-extrabold tracking-[-.04em] md:text-7xl">Weave the evidence.<br/><span className="text-accent">Reconstruct the incident.</span></motion.h1>
              <motion.p initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.12}} className="mt-6 max-w-xl text-[15px] leading-7 text-fg-muted">IncidentWeave correlates fragmented multimodal evidence into a source-attributed timeline, exposes contradictions, and identifies what remains unknown.</motion.p>
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.2}} className="mt-8 flex flex-wrap gap-3"><Link to="/sign-up"><Button size="lg" icon={<ArrowRight className="size-4"/>}>Start an investigation</Button></Link><a href="#how"><Button size="lg" variant="outline">See how it works</Button></a></motion.div>
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-6 text-xs text-fg-dim"><div><div className="font-display text-2xl font-bold text-fg">6+</div><div>evidence modes</div></div><div><div className="font-display text-2xl font-bold text-fg">1</div><div>shared timeline</div></div><div><div className="font-display text-2xl font-bold text-fg">0</div><div>autonomous verdicts</div></div></div>
            </div>
            <motion.div initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{delay:.15}}><HeroWeave/></motion.div>
          </div>
        </section>

        <section id="how" className="border-b border-line bg-bg-2 px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl"><p className="font-mono text-xs uppercase tracking-[.2em] text-accent">The workflow</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold md:text-4xl">From scattered artifacts to an investigation-ready sequence.</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">{sections.map(({icon:Icon,title,text},i)=><motion.div key={title} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.05}} className="box-interactive rounded-md border border-line bg-surface p-6"><Icon className="size-5 text-accent"/><h3 className="mt-5 font-display text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-fg-dim">{text}</p></motion.div>)}</div>
          </div>
        </section>

        <section id="workspace" className="px-6 py-20 md:py-24"><div className="mx-auto max-w-6xl"><div className="grid gap-10 md:grid-cols-[.9fr_1.1fr] md:items-center"><div><p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Human-in-the-loop</p><h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">AI organizes the evidence. Investigators make the call.</h2><p className="mt-4 text-sm leading-7 text-fg-muted">Every result is labeled as evidence-backed, inferred, AI-observation or uncertain. Source links stay visible so a reviewer can challenge the reconstruction.</p></div><div className="rounded-lg border border-line bg-surface p-6"><div className="flex items-start gap-4"><div className="grid size-12 place-items-center rounded-md border border-line-2 bg-surface-2"><UserCheck className="size-6 text-verified"/></div><div><div className="font-display font-semibold">Explainable by design</div><div className="mt-1 text-sm text-fg-dim">Contradictions and evidence gaps are first-class objects, not hidden model output.</div></div></div><div className="mt-6 flex items-center gap-2 text-xs text-fg-dim"><ShieldCheck className="size-4 text-verified"/> Fictional demo data only. Final judgment remains human.</div></div></div></div></section>
      </main>
      <footer className="border-t border-line px-6 py-8"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4"><Logo/><span className="text-xs text-fg-faint">© 2026 IncidentWeave — demonstration platform</span></div></footer>
    </div>
  );
}
