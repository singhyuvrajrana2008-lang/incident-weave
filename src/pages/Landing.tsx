import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import type { ReactNode, MouseEvent as ReactMouseEvent } from "react";
import {
  ArrowRight,
  Layers,
  GitBranch,
  Clock,
  AlertTriangle,
  HelpCircle,
  UserCheck,
  ShieldCheck,
  Menu,
  X,
  Sun,
  Moon,
  Download,
} from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/cn";
import { Logo } from "../components/Logo";
import { Button } from "../components/ui";
import { HeroWeave } from "../components/landing/HeroWeave";
import { useApp } from "../store/AppContext";

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** A box that lifts on hover and reveals a spotlight that tracks the cursor. */
function InteractiveBox({ children, className }: { children: ReactNode; className?: string }) {
  function onMove(e: ReactMouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--bx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--by", `${e.clientY - r.top}px`);
  }
  return (
    <div onMouseMove={onMove} className={cn("box-interactive", className)}>
      {children}
    </div>
  );
}

function Section({ eyebrow, title, children, id }: { eyebrow: string; title: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight text-fg md:text-4xl">{title}</h2>
      </Reveal>
      <div className="mt-10">{children}</div>
    </section>
  );
}

const publicNav = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how" },
  { label: "Investigation", href: "#workspace" },
  { label: "About", href: "#about" },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useApp();

  // Scroll-driven typography + color shift on the hero heading
  const { scrollYProgress } = useScroll();
  const headingColor = useTransform(scrollYProgress, [0, 0.18], ["#eef2f7", "#56a8f5"]);
  const headingSpacing = useTransform(scrollYProgress, [0, 0.18], ["-0.02em", "0.05em"]);
  const heroLift = useTransform(scrollYProgress, [0, 0.25], [0, -40]);
  const heroFade = useTransform(scrollYProgress, [0, 0.25], [1, 0.55]);

  function onHeroMove(e: ReactMouseEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/"><Logo /></Link>
          <nav className="hidden items-center gap-7 md:flex">
            {publicNav.map((n) => (
              <a key={n.label} href={n.href} className="text-sm text-fg-muted transition-colors hover:text-fg">{n.label}</a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="grid size-9 place-items-center rounded-sm border border-line-2 bg-surface/60 text-fg-muted transition-colors hover:border-line-strong hover:bg-surface-2 hover:text-fg"
            >
              {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
            </button>
            <Link to="/sign-in"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/sign-up"><Button variant="primary" size="sm">Start Investigation</Button></Link>
          </div>
          <button className="md:hidden text-fg" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-line bg-bg-2 px-6 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {publicNav.map((n) => (
                <a key={n.label} href={n.href} onClick={() => setMenuOpen(false)} className="text-sm text-fg-muted">{n.label}</a>
              ))}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="grid size-8 shrink-0 place-items-center rounded-sm border border-line-2 text-fg-muted"
                  title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                </button>
                <Link to="/sign-in" className="flex-1"><Button variant="secondary" size="sm" className="w-full">Sign In</Button></Link>
                <Link to="/sign-up" className="flex-1"><Button variant="primary" size="sm" className="w-full">Start</Button></Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden cursor-glow" onMouseMove={onHeroMove}>
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-40" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1.05fr_1fr] md:py-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-2 bg-surface/60 px-3 py-1"
            >
              <span className="size-1.5 rounded-full bg-accent pulse-ring" />
              <span className="text-xs text-fg-muted">Multimodal evidence correlation</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
              style={{ color: headingColor, letterSpacing: headingSpacing }}
              className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl"
            >
              Weave the evidence.
              <br />
              <span className="text-accent">Reconstruct</span> the incident.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-fg-muted"
            >
              IncidentWeave connects fragmented evidence across screenshots, call records, documents,
              recordings and other sources to reconstruct what happened, surface contradictions, and
              reveal what remains unknown.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/sign-up"><Button variant="primary" size="lg" icon={<ArrowRight className="size-4" />}>Start an investigation</Button></Link>
              <a href="#how"><Button variant="outline" size="lg">Explore how it works</Button></a>
            </motion.div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6">
              {[
                ["Evidence types", "6+"],
                ["Correlation layers", "Cross-source"],
                ["Human-in-the-loop", "Always"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="font-display text-lg font-bold text-fg">{v}</div>
                  <div className="text-xs text-fg-dim">{k}</div>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ y: heroLift, opacity: heroFade }}
          >
            <HeroWeave />
          </motion.div>
        </div>
      </section>

      {/* Fragmentation problem */}
      <div className="border-y border-line bg-bg-2">
        <Section id="product" eyebrow="The problem" title="Evidence arrives fragmented, out of order, and across incompatible formats.">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Layers, t: "Scattered sources", d: "Screenshots, call logs, PDFs, recordings and notes each live in isolation with no shared structure." },
              { icon: Clock, t: "Conflicting timestamps", d: "Every device keeps its own clock. Sequencing events by hand is slow and error-prone." },
              { icon: AlertTriangle, t: "Hidden contradictions", d: "The most important detail is often the one place two sources quietly disagree." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.08}>
                <InteractiveBox className="h-full rounded-md border border-line bg-surface p-5">
                  <c.icon className="size-5 text-fg-dim" />
                  <h3 className="mt-4 font-display text-base font-semibold text-fg">{c.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-dim">{c.d}</p>
                </InteractiveBox>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      {/* The approach / how it works */}
      <Section id="how" eyebrow="How it works" title="Six steps from a pile of files to a timeline you can defend.">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { n: "01", t: "Line up the clocks", d: "Drop in every file. We read the timestamps and pull them onto one shared clock, so a 10:14 on a phone and a 10:14 on a call log finally mean the same thing." },
            { n: "02", t: "Find what connects", d: "The same name, place, or moment showing up in two sources becomes a link — each one weighted by how sure we are it's really a match." },
            { n: "03", t: "Rebuild the sequence", d: "Those links snap into order and the incident replays itself, event by event, with the evidence behind each one attached." },
            { n: "04", t: "Catch the conflicts", d: "When two sources tell different stories about the same moment, we flag it in crimson instead of quietly picking one." },
            { n: "05", t: "Name the gaps", d: "Where the evidence goes quiet, we say so — in amber — and point to what would fill the hole." },
            { n: "06", t: "Hand it to you", d: "Nothing is a verdict. Every finding is traceable to its source, and the last call is always yours." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <InteractiveBox className="flex gap-4 rounded-md border border-line bg-surface p-5">
                <span className="font-mono text-sm text-accent">{s.n}</span>
                <div>
                  <h3 className="font-display text-base font-semibold text-fg">{s.t}</h3>
                  <p className="mt-1 text-sm text-fg-dim">{s.d}</p>
                </div>
              </InteractiveBox>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Feature highlights */}
      <div className="border-y border-line bg-bg-2">
        <Section id="workspace" eyebrow="The workspace" title="A professional investigation environment built around relationships, not files.">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: GitBranch, t: "Evidence correlation", d: "Select any piece of evidence and watch every related timeline event and contradiction light up across the workspace.", tone: "text-accent" },
              { icon: Clock, t: "Timeline reconstruction", d: "A structured chronology with per-event confidence and full source attribution.", tone: "text-accent-3" },
              { icon: AlertTriangle, t: "Contradiction detection", d: "Conflicting sources are paired, explained, and routed into a review workflow.", tone: "text-crimson" },
              { icon: HelpCircle, t: "Evidence gaps & unknowns", d: "What the evidence can't yet establish is made explicit, with paths to resolve it.", tone: "text-amber" },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 0.06}>
                <InteractiveBox className="flex gap-4 rounded-md border border-line bg-surface p-6">
                  <div className="grid size-11 shrink-0 place-items-center rounded-md border border-line-2 bg-surface-2">
                    <f.icon className={`size-5 ${f.tone}`} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-fg">{f.t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-dim">{f.d}</p>
                  </div>
                </InteractiveBox>
              </Reveal>
            ))}
          </div>
        </Section>
      </div>

      {/* Tester / demo */}
      <div className="border-y border-line bg-bg-2">
        <Section id="demo" eyebrow="Safe demo" title="Test the workflow with synthetic evidence.">
          <Reveal>
            <InteractiveBox className="grid gap-5 rounded-lg border border-line bg-surface p-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-[15px] leading-relaxed text-fg-muted">
                  Use these fictional, non-sensitive samples to test the full flow: upload evidence, run analysis,
                  inspect conflicts, and add more evidence to trigger a fresh reconstruction.
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-fg-dim">
                  <span className="rounded-full border border-line-2 bg-surface-2 px-2.5 py-1">Synthetic</span>
                  <span className="rounded-full border border-line-2 bg-surface-2 px-2.5 py-1">Non-sensitive</span>
                  <span className="rounded-full border border-line-2 bg-surface-2 px-2.5 py-1">Text evidence</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                <a href="/demo/incident-log.txt" download className="inline-flex">
                  <Button variant="secondary" size="sm" icon={<Download className="size-3.5" />}>Incident log</Button>
                </a>
                <a href="/demo/witness-note.txt" download className="inline-flex">
                  <Button variant="secondary" size="sm" icon={<Download className="size-3.5" />}>Witness note</Button>
                </a>
              </div>
            </InteractiveBox>
          </Reveal>
        </Section>
      </div>

      {/* Human review */}
      <Section id="about" eyebrow="Human-in-the-loop" title="The system surfaces evidence. Investigators reach conclusions.">
        <Reveal>
          <InteractiveBox className="grid gap-6 rounded-lg border border-line bg-surface p-8 md:grid-cols-[auto_1fr] md:items-center">
            <div className="grid size-16 place-items-center rounded-lg border border-line-2 bg-surface-2">
              <UserCheck className="size-7 text-verified" />
            </div>
            <div>
              <p className="max-w-2xl text-[15px] leading-relaxed text-fg-muted">
                Every finding carries an explicit label — <span className="text-verified">evidence-backed</span>,{" "}
                <span className="text-accent">inferred</span>, <span className="text-amber">uncertain</span>, or{" "}
                <span className="text-fg">investigator review</span>. IncidentWeave never renders a verdict; it
                organizes what is known, what conflicts, and what remains open — and leaves judgment to you.
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-fg-dim">
                <ShieldCheck className="size-4 text-verified" /> Explainable, source-attributed findings only.
              </div>
            </div>
          </InteractiveBox>
        </Reveal>
      </Section>

      {/* Final CTA */}
      <div className="border-t border-line bg-bg-2">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-fg md:text-5xl">
              Turn scattered evidence into a<br className="hidden sm:block" /> reconstructed incident.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-fg-muted">
              Start a new investigation and see the correlation layer at work in minutes.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/sign-up"><Button variant="primary" size="lg" icon={<ArrowRight className="size-4" />}>Start an investigation</Button></Link>
              <Link to="/sign-in"><Button variant="outline" size="lg">Sign in</Button></Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo />
          <p className="text-xs text-fg-dim">© 2026 IncidentWeave — demonstration platform. Fictional data only.</p>
        </div>
      </footer>
    </div>
  );
}
