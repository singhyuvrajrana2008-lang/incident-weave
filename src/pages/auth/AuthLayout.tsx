import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Logo } from "../../components/Logo";
import { HeroWeave } from "../../components/landing/HeroWeave";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col px-6 py-8 sm:px-10">
        <Link to="/" className="inline-flex"><Logo /></Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm"
          >
            <h1 className="font-display text-2xl font-bold tracking-tight text-fg">{title}</h1>
            <p className="mt-1.5 text-sm text-fg-dim">{subtitle}</p>
            <div className="floating-tile mt-7 rounded-lg border border-line p-5 sm:p-6">{children}</div>
          </motion.div>
        </div>
        <p className="text-xs text-fg-faint">Demonstration platform · Backend-ready for Supabase authentication.</p>
      </div>

      {/* visual side */}
      <div className="relative hidden overflow-hidden border-l border-line bg-bg-2 lg:block">
        <div className="pointer-events-none absolute inset-0 grid-texture opacity-40" />
        <div className="flex h-full flex-col justify-center px-14">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">IncidentWeave</p>
          <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-tight tracking-tight text-fg">
            Fragmented evidence, woven into one reconstructed incident.
          </h2>
          <div className="mt-8 max-w-md">
            <HeroWeave />
          </div>
        </div>
      </div>
    </div>
  );
}
