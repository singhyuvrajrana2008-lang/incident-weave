import { cn } from "../lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} fill="none" aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="7" fill="#10151c" stroke="#273340" />
      {/* weaving strands converging into a node */}
      <path d="M7 9 C 13 9, 13 16, 16 16 C 19 16, 19 23, 25 23" stroke="#38bdf8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 23 C 13 23, 13 16, 16 16 C 19 16, 19 9, 25 9" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round" opacity="0.85" />
      <circle cx="16" cy="16" r="2.6" fill="#0b0f14" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="7" cy="9" r="1.5" fill="#60a5fa" />
      <circle cx="7" cy="23" r="1.5" fill="#22d3ee" />
      <circle cx="25" cy="9" r="1.5" fill="#34d399" />
      <circle cx="25" cy="23" r="1.5" fill="#fbbf24" />
    </svg>
  );
}

export function Logo({ className, collapsed }: { className?: string; collapsed?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      {!collapsed && (
        <span className="font-display text-[17px] font-bold tracking-tight text-fg">
          Incident<span className="text-accent">Weave</span>
        </span>
      )}
    </span>
  );
}
