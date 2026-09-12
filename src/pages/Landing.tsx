import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, AlertTriangle, Clock3, FileSearch, GitBranch, HelpCircle, Menu, ShieldCheck, UserCheck, X, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Logo } from "../components/Logo";
import { Badge, Button } from "../components/ui";
import { HeroWeave } from "../components/landing/HeroWeave";

const capabilities = [
  { icon:GitBranch, step:"01", title:"Correlate fragments", text:"Bring screenshots, documents, calls, messages, transcripts and CCTV into one evidence graph." },
  { icon:Clock3, step:"02", title:"Reconstruct sequence", text:"Normalize the time signals and assemble an attributable chronology instead of a black-box summary." },
  { icon:AlertTriangle, step:"03", title:"Expose conflicts", text:"Keep competing claims visible. Contradictions become reviewable objects, not hidden model decisions." },
  { icon:HelpCircle, step:"04", title:"Surface unknowns", text:"Show exactly where the evidence runs out and what additional material could close the gap." },
];

const evidence = ["Images", "PDFs", "Call logs", "Messages", "Witness statements", "Audio / transcripts"];

export default function Landing() {
  const [open,setOpen] = useState(false);
  return <div className="min-h-screen overflow-x-hidden bg-bg text-fg">
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/82 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="shrink-0"><Logo/></Link>
        <nav className="hidden items-center gap-7 md:flex">
          {[['#capabilities','Capabilities'],['#workflow','Workflow'],['#trust','Trust model']].map(([href,label])=><a key={href} href={href} className="text-xs font-semibold text-fg-dim transition-colors hover:text-fg">{label}</a>)}
        </nav>
        <div className="hidden items-center gap-2 md:flex"><Link to="/sign-in"><Button variant="ghost" size="sm">Sign in</Button></Link><Link to="/sign-up"><Button size="sm" icon={<ArrowRight className="size-3.5"/>}>Start investigation</Button></Link></div>
        <button onClick={()=>setOpen(v=>!v)} className="grid size-9 place-items-center rounded-sm border border-line text-fg-muted md:hidden" aria-label="Open navigation">{open?<X className="size-5"/>:<Menu className="size-5"/>}</button>
      </div>
      {open&&<div className="border-t border-line bg-bg-2 px-5 py-4 md:hidden"><div className="flex flex-col gap-3">{[['#capabilities','Capabilities'],['#workflow','Workflow'],['#trust','Trust model']].map(([href,label])=><a key={href} href={href} onClick={()=>setOpen(false)} className="py-1 text-sm text-fg-muted">{label}</a>)}<Link to="/sign-up" onClick={()=>setOpen(false)}><Button className="mt-1 w-full">Start investigation</Button></Link></div></div>}
    </header>

    <main>
      <section className="relative border-b border-line px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:pb-24 lg:pt-24">
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-45"/>
        <div className="pointer-events-none absolute -right-48 top-10 size-[500px] rounded-full bg-accent/8 blur-3xl"/>
        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[.83fr_1.17fr] lg:gap-14">
            <div>
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:.45}}><Badge tone="verified"><span className="size-1.5 rounded-full bg-verified"/> Multimodal investigation workspace</Badge></motion.div>
              <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:.05,duration:.55}} className="mt-6 max-w-3xl font-display text-[clamp(3rem,6vw,5.8rem)] font-semibold leading-[.96] tracking-[-.055em]">Make fragmented evidence<br/><span className="text-accent">tell a coherent story.</span></motion.h1>
              <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.1,duration:.55}} className="mt-7 max-w-xl text-[15px] leading-7 text-fg-muted">IncidentWeave correlates multimodal case evidence into a source-attributed timeline, highlights contradictions, and identifies the evidence you still need — without replacing investigator judgment.</motion.p>
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.16,duration:.55}} className="mt-8 flex flex-wrap gap-3"><Link to="/sign-up"><Button size="lg" icon={<ArrowRight className="size-4"/>}>Start an investigation</Button></Link><a href="#workflow"><Button size="lg" variant="outline">See the workflow</Button></a></motion.div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-[11px] uppercase tracking-[.12em] text-fg-faint"><span>Source attributed</span><span>Human reviewed</span><span>No autonomous verdicts</span></div>
            </div>
            <motion.div initial={{opacity:0,scale:.97,y:12}} animate={{opacity:1,scale:1,y:0}} transition={{delay:.12,duration:.7,ease:[.16,1,.3,1]}}><HeroWeave/></motion.div>
          </div>
        </div>
      </section>

      <section id="capabilities" className="border-b border-line px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.24em] text-accent">Capabilities</p><h2 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-tight sm:text-4xl">Investigation structure without hiding the messy parts.</h2></div><p className="max-w-2xl text-sm leading-7 text-fg-dim">The product is intentionally built around evidence provenance, uncertainty and review. It organizes complexity instead of flattening it into one confident paragraph.</p></div>
          <div className="mt-12 grid overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-2">
            {capabilities.map(({icon:Icon,step,title,text},i)=><motion.div key={title} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.25}} transition={{delay:i*.05}} className="box-interactive border-b border-line p-6 last:border-b-0 md:border-r md:p-7 md:[&:nth-child(2n)]:border-r-0 md:[&:nth-child(n+3)]:border-b-0">
              <div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-lg border border-line-2 bg-bg-2"><Icon className="size-4 text-accent"/></div><span className="font-mono text-[10px] text-fg-faint">{step}</span></div><h3 className="mt-7 font-display text-lg font-semibold">{title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-fg-dim">{text}</p>
            </motion.div>)}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b border-line bg-bg-2 px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[.24em] text-accent">Workflow</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">One evidence graph. One review surface.</h2></div><p className="max-w-lg text-sm leading-6 text-fg-dim">Every event stays connected to the material that supports it, so investigators can move from a finding back to the original source.</p></div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface shadow-panel"><div className="grid lg:grid-cols-3"><div className="border-b border-line p-6 lg:border-b-0 lg:border-r"><div className="font-mono text-[10px] uppercase tracking-[.18em] text-fg-faint">Evidence in</div><div className="mt-5 flex flex-wrap gap-2">{evidence.map(x=><span key={x} className="rounded-full border border-line-2 bg-bg-2 px-3 py-1.5 text-[11px] font-medium text-fg-muted">{x}</span>)}</div></div><div className="relative flex items-center border-b border-line p-6 lg:border-b-0 lg:border-r"><div className="w-full"><div className="flex items-center justify-between text-[10px] uppercase tracking-[.18em] text-fg-faint"><span>AI-assisted correlation</span><Sparkles className="size-4 text-accent"/></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-bg"><motion.div initial={{width:0}} whileInView={{width:'72%'}} viewport={{once:true}} transition={{duration:1.1}} className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"/></div><p className="mt-3 text-sm leading-6 text-fg-dim">Normalize time signals · link sources · identify conflict · surface missing evidence.</p></div></div><div className="p-6"><div className="font-mono text-[10px] uppercase tracking-[.18em] text-fg-faint">Investigator out</div><div className="mt-5 space-y-2">{[['Timeline','verified'],['Contradictions','2 to review'],['Unknowns','1 evidence gap']].map(([a,b],i)=><div key={a} className="flex items-center justify-between rounded-lg border border-line bg-bg-2 px-3 py-2.5"><span className="text-xs font-semibold text-fg">{a}</span><span className={`text-[10px] font-mono ${i===1?'text-crimson':i===2?'text-amber':'text-verified'}`}>{b}</span></div>)}</div></div></div></div>
        </div>
      </section>

      <section id="trust" className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center"><div><p className="font-mono text-[10px] uppercase tracking-[.24em] text-accent">Trust model</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">AI organizes the evidence.<br/><span className="text-fg-muted">Investigators make the call.</span></h2><p className="mt-5 max-w-xl text-sm leading-7 text-fg-dim">Findings are separated into evidence-backed observations, inferences and uncertain gaps. Source links remain visible so every reconstruction can be challenged.</p><div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-fg-muted"><span className="flex items-center gap-2"><Check className="size-3.5 text-verified"/> Source attribution</span><span className="flex items-center gap-2"><Check className="size-3.5 text-verified"/> Reviewable conflicts</span><span className="flex items-center gap-2"><Check className="size-3.5 text-verified"/> Explicit unknowns</span></div></div><div className="rounded-2xl border border-line bg-surface p-6 shadow-panel sm:p-7"><div className="flex items-start gap-4"><div className="grid size-12 shrink-0 place-items-center rounded-xl border border-verified/20 bg-verified/10"><UserCheck className="size-6 text-verified"/></div><div><div className="font-display font-semibold">Human-in-the-loop by design</div><p className="mt-2 text-sm leading-6 text-fg-dim">IncidentWeave is an investigation assistant, not an autonomous verdict engine.</p></div></div><div className="mt-6 border-t border-line pt-5 text-xs leading-6 text-fg-faint"><ShieldCheck className="mr-2 inline size-3.5 text-verified"/> Demo environment uses synthetic case material. Production access should be governed by your organization's own policy and controls.</div></div></div></div>
      </section>
    </main>

    <footer className="border-t border-line px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><Logo/><span className="text-[11px] text-fg-faint">IncidentWeave · Multimodal incident reconstruction · 2026</span></div></footer>
  </div>;
}
