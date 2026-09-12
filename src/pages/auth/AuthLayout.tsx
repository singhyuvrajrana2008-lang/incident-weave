import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { Logo } from "../../components/Logo";
import { Badge } from "../../components/ui";
import { HeroWeave } from "../../components/landing/HeroWeave";

export function AuthLayout({ title, subtitle, children }: { title:string; subtitle:string; children:ReactNode }) {
  return <div className="min-h-screen bg-bg text-fg lg:grid lg:grid-cols-[minmax(0,.86fr)_minmax(560px,1.14fr)]">
    <div className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:px-12 xl:px-16">
      <Link to="/" className="inline-flex w-fit"><Logo/></Link>
      <div className="mx-auto flex w-full max-w-md flex-1 items-center py-12">
        <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:[.16,1,.3,1]}} className="w-full">
          <Badge tone="accent"><LockKeyhole className="size-3"/> Secure investigation workspace</Badge>
          <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-fg-dim">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
      <p className="text-[11px] text-fg-faint">IncidentWeave · Demonstration platform · Human-reviewed investigation workflow</p>
    </div>

    <aside className="relative hidden overflow-hidden border-l border-line bg-bg-2 lg:flex lg:flex-col lg:justify-center lg:px-10 xl:px-16">
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-45"/>
      <div className="pointer-events-none absolute -right-32 top-20 size-[420px] rounded-full bg-accent/8 blur-3xl"/>
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="flex items-center justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.24em] text-accent">IncidentWeave</p><h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">Fragmented evidence, woven into a reviewable incident.</h2></div><ArrowUpRight className="hidden size-5 text-fg-faint sm:block"/></div>
        <div className="mt-8"><HeroWeave/></div>
      </div>
    </aside>
  </div>;
}
