import { forwardRef } from "react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import type { Confidence, EvidenceType } from "../../lib/types";
import {
  Image as ImageIcon,
  FileText,
  File,
  Mic,
  Type,
  Loader2,
} from "lucide-react";

/* ------------------------------ Button ------------------------------ */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", loading, icon, className, children, disabled, ...rest },
  ref,
) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium rounded-sm transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";
  const sizes = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-9.5 px-4 text-sm",
    lg: "h-11 px-6 text-[15px]",
  };
  const variants = {
    primary: "bg-fg text-bg hover:bg-white/90 shadow-[0_1px_0_rgba(255,255,255,0.14)_inset] hover:-translate-y-px",
    secondary: "bg-raised text-fg border border-line-2 hover:border-line-strong hover:bg-raised-2",
    outline: "bg-transparent text-fg border border-line-2 hover:border-line-strong hover:bg-surface",
    ghost: "bg-transparent text-fg-muted hover:text-fg hover:bg-surface-2",
    danger: "bg-crimson/15 text-crimson border border-crimson/30 hover:bg-crimson/25",
  };
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : icon}
      {children}
    </button>
  );
});

export function IconButton({
  className,
  children,
  label,
  active,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label?: string; active?: boolean }) {
  return (
    <button
      title={label}
      aria-label={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        active && "bg-surface-2 text-accent",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ------------------------------ Inputs ------------------------------ */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-sm border border-line-2 bg-surface px-3 text-sm text-fg placeholder:text-fg-faint transition-colors focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20",
          className,
        )}
        {...rest}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-sm border border-line-2 bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-fg-faint transition-colors focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20 resize-y min-h-24 scroll-thin",
          className,
        )}
        {...rest}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "h-9.5 rounded-sm border border-line-2 bg-surface px-3 text-sm text-fg transition-colors focus:border-accent/70 focus:outline-none focus:ring-2 focus:ring-accent/20 cursor-pointer",
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    );
  },
);

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-[13px] font-medium text-fg-muted">
        {label}
        {hint && <span className="text-fg-faint font-normal">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-crimson">{error}</span>}
    </label>
  );
}

/* ------------------------------ Surfaces ------------------------------ */
export function Panel({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("floating-tile rounded-md border border-line", className)} {...rest}>
      {children}
    </div>
  );
}

export function PanelHeader({ title, subtitle, actions, icon }: { title: ReactNode; subtitle?: ReactNode; actions?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="text-fg-dim">{icon}</span>}
        <div className="min-w-0">
          <h3 className="font-display text-sm font-semibold tracking-tight text-fg truncate">{title}</h3>
          {subtitle && <p className="text-xs text-fg-dim truncate">{subtitle}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
}

/* ------------------------------ Badges ------------------------------ */
export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "crimson" | "amber" | "verified";
  className?: string;
}) {
  const tones = {
    neutral: "bg-surface-2 text-fg-muted border-line-2",
    accent: "bg-accent/10 text-accent border-accent/25",
    crimson: "bg-crimson/10 text-crimson border-crimson/25",
    amber: "bg-amber/10 text-amber border-amber/25",
    verified: "bg-verified/10 text-verified border-verified/25",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xs border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ tone }: { tone: "accent" | "crimson" | "amber" | "verified" | "neutral" }) {
  const colors = {
    accent: "bg-accent",
    crimson: "bg-crimson",
    amber: "bg-amber",
    verified: "bg-verified",
    neutral: "bg-fg-dim",
  };
  return <span className={cn("inline-block size-1.5 rounded-full", colors[tone])} />;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { tone: "accent" | "crimson" | "amber" | "verified" | "neutral"; label: string }> = {
    complete: { tone: "verified", label: "Completed" },
    analyzing: { tone: "accent", label: "Analyzing" },
    uploading: { tone: "amber", label: "Uploading" },
    ready: { tone: "verified", label: "Ready" },
    draft: { tone: "neutral", label: "Draft" },
    archived: { tone: "neutral", label: "Archived" },
    verified: { tone: "verified", label: "Verified" },
    processing: { tone: "accent", label: "Processing" },
    uncertain: { tone: "amber", label: "Uncertain" },
    error: { tone: "crimson", label: "Error" },
    open: { tone: "crimson", label: "Open" },
    reviewing: { tone: "amber", label: "Reviewing" },
    resolved: { tone: "verified", label: "Resolved" },
    dismissed: { tone: "neutral", label: "Dismissed" },
    investigating: { tone: "accent", label: "Investigating" },
  };
  const conf = map[status] ?? { tone: "neutral" as const, label: status };
  return (
    <Badge tone={conf.tone}>
      <StatusDot tone={conf.tone} />
      {conf.label}
    </Badge>
  );
}

export function ConfidenceTag({ confidence }: { confidence: Confidence }) {
  const map = {
    high: { tone: "verified" as const, label: "High" },
    medium: { tone: "amber" as const, label: "Medium" },
    low: { tone: "crimson" as const, label: "Low" },
  };
  const c = map[confidence];
  return <Badge tone={c.tone}>{c.label} confidence</Badge>;
}

/* ------------------------------ Evidence icon ------------------------------ */
export function EvidenceIcon({ type, className }: { type: EvidenceType; className?: string }) {
  const Icon = { image: ImageIcon, pdf: FileText, document: File, audio: Mic, text: Type }[type];
  const color = { image: "text-accent-3", pdf: "text-crimson", document: "text-fg-muted", audio: "text-verified", text: "text-amber" }[type];
  return <Icon className={cn("size-4", color, className)} />;
}

/* ------------------------------ Progress ------------------------------ */
export function Progress({ value, tone = "accent", className }: { value: number; tone?: "accent" | "verified" | "amber"; className?: string }) {
  const colors = { accent: "bg-accent", verified: "bg-verified", amber: "bg-amber" };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-3", className)}>
      <motion.div
        className={cn("h-full rounded-full", colors[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

/* ------------------------------ Skeleton ------------------------------ */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-sm bg-surface-2", className)} />;
}

/* ------------------------------ Empty / Error states ------------------------------ */
export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-lg border border-line-2 bg-surface-2 text-fg-dim">{icon}</div>
      <div className="max-w-sm">
        <h3 className="font-display text-base font-semibold text-fg">{title}</h3>
        <p className="mt-1 text-sm text-fg-dim">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ title, description, onRetry, retryLabel = "Try again" }: { title: string; description: string; onRetry?: () => void; retryLabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-lg border border-crimson/30 bg-crimson/10 text-crimson">!</div>
      <div className="max-w-sm">
        <h3 className="font-display text-base font-semibold text-fg">{title}</h3>
        <p className="mt-1 text-sm text-fg-dim">{description}</p>
      </div>
      {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>{retryLabel}</Button>}
    </div>
  );
}

/* ------------------------------ Tabs ------------------------------ */
export function Tabs({ tabs, active, onChange }: { tabs: { id: string; label: string; count?: number }[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="px-1 pb-1 pt-1.5">
      <div role="tablist" aria-label="Investigation sections" className="flex w-full items-center gap-1 overflow-x-auto rounded-md border border-line bg-bg-2 p-1 scroll-thin">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active === t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "relative flex min-w-max items-center gap-2 rounded-sm px-3 py-2 text-xs font-medium transition-all duration-200",
              active === t.id ? "bg-surface text-fg shadow-sm" : "text-fg-dim hover:bg-surface/70 hover:text-fg-muted",
            )}
          >
            {active === t.id && (
              <motion.span
                layoutId="tab-active"
                className="absolute inset-0 rounded-sm border border-line-2 bg-surface"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{t.label}</span>
            {t.count != null && (
              <span className={cn(
                "relative z-10 rounded-xs px-1.5 py-0.5 text-[10px] tabular",
                active === t.id ? "bg-accent/12 text-accent" : "bg-surface-2 text-fg-faint",
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Confidence ring ------------------------------ */
export function ConfidenceRing({ value, size = 132, label = "Confidence" }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const tone = value >= 80 ? "var(--color-verified)" : value >= 60 ? "var(--color-amber)" : "var(--color-crimson)";
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={8} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (value / 100) * circ }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <span className="font-display text-3xl font-bold tabular text-fg">{value}%</span>
        <span className="text-[11px] uppercase tracking-wide text-fg-dim">{label}</span>
      </div>
    </div>
  );
}
