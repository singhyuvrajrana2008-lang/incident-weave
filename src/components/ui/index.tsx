import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/cn";
import type { Confidence, EvidenceType } from "../../lib/types";
import { Image as ImageIcon, FileText, File, Mic, Type, Loader2 } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" | "outline"; size?: "sm" | "md" | "lg"; loading?: boolean; icon?: ReactNode };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant="secondary", size="md", loading, icon, className, children, disabled, ...rest }, ref) {
  const base = "inline-flex items-center justify-center gap-2 rounded-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap";
  const sizes = { sm:"h-8 px-3 text-xs", md:"h-10 px-4 text-sm", lg:"h-11.5 px-5 text-[14px]" };
  const variants = {
    primary:"border border-accent/30 bg-accent text-void shadow-[0_8px_24px_-12px_rgba(104,181,255,.75)] hover:-translate-y-px hover:bg-accent-2 hover:border-accent-2",
    secondary:"border border-line-2 bg-surface-2 text-fg shadow-panel hover:-translate-y-px hover:border-line-strong hover:bg-surface-3",
    outline:"border border-line-2 bg-transparent text-fg hover:border-line-strong hover:bg-surface",
    ghost:"border border-transparent bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg",
    danger:"border border-crimson/30 bg-crimson/10 text-crimson hover:bg-crimson/20"
  };
  return <button ref={ref} disabled={disabled || loading} className={cn(base, sizes[size], variants[variant], className)} {...rest}>{loading ? <Loader2 className="size-4 animate-spin"/> : icon}{children}</button>;
});

export function IconButton({ className, children, label, active, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label?: string; active?: boolean }) {
  return <button title={label} aria-label={label} className={cn("inline-flex size-9 items-center justify-center rounded-sm border border-transparent text-fg-muted transition-all hover:border-line-2 hover:bg-surface-2 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60", active && "border-line-2 bg-surface-2 text-accent", className)} {...rest}>{children}</button>;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cn("h-10 w-full rounded-sm border border-line-2 bg-surface px-3 text-sm text-fg shadow-[0_1px_0_rgba(255,255,255,.02)_inset] placeholder:text-fg-faint transition-all focus:border-accent/60 focus:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/15", className)} {...rest}/>;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn("min-h-28 w-full resize-y rounded-sm border border-line-2 bg-surface px-3 py-2.5 text-sm text-fg shadow-[0_1px_0_rgba(255,255,255,.02)_inset] placeholder:text-fg-faint transition-all focus:border-accent/60 focus:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-accent/15 scroll-thin", className)} {...rest}/>;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...rest }, ref) {
  return <select ref={ref} className={cn("h-10 cursor-pointer rounded-sm border border-line-2 bg-surface px-3 text-sm text-fg transition-all focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/15", className)} {...rest}>{children}</select>;
});

export function Field({ label, hint, error, children }: { label:string; hint?:string; error?:string; children:ReactNode }) {
  return <label className="block"><span className="mb-1.5 flex items-center justify-between text-xs font-semibold text-fg-muted">{label}{hint && <span className="font-normal text-fg-faint">{hint}</span>}</span>{children}{error && <span className="mt-1.5 block text-xs text-crimson">{error}</span>}</label>;
}

export function Panel({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-line bg-surface shadow-panel", className)} {...rest}>{children}</div>;
}

export function PanelHeader({ title, subtitle, actions, icon }: { title:ReactNode; subtitle?:ReactNode; actions?:ReactNode; icon?:ReactNode }) {
  return <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4"><div className="flex min-w-0 items-center gap-2.5">{icon && <span className="text-fg-dim">{icon}</span>}<div className="min-w-0"><h3 className="truncate font-display text-sm font-semibold tracking-tight text-fg">{title}</h3>{subtitle && <p className="truncate text-xs text-fg-dim">{subtitle}</p>}</div></div>{actions}</div>;
}

export function Badge({ children, tone="neutral", className }: { children:ReactNode; tone?:"neutral"|"accent"|"crimson"|"amber"|"verified"; className?:string }) {
  const tones = { neutral:"border-line-2 bg-surface-2 text-fg-muted", accent:"border-accent/25 bg-accent/10 text-accent", crimson:"border-crimson/25 bg-crimson/10 text-crimson", amber:"border-amber/25 bg-amber/10 text-amber", verified:"border-verified/25 bg-verified/10 text-verified" };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[.11em]", tones[tone], className)}>{children}</span>;
}

export function StatusDot({ tone }: { tone:"accent"|"crimson"|"amber"|"verified"|"neutral" }) {
  const colors = { accent:"bg-accent", crimson:"bg-crimson", amber:"bg-amber", verified:"bg-verified", neutral:"bg-fg-dim" };
  return <span className={cn("inline-block size-1.5 rounded-full", colors[tone])}/>;
}

export function StatusBadge({ status }: { status:string }) {
  const map:Record<string,{tone:"accent"|"crimson"|"amber"|"verified"|"neutral";label:string}> = { complete:{tone:"verified",label:"Completed"}, analyzing:{tone:"accent",label:"Analyzing"}, ready:{tone:"amber",label:"Ready"}, draft:{tone:"neutral",label:"Draft"}, archived:{tone:"neutral",label:"Archived"}, verified:{tone:"verified",label:"Verified"}, processing:{tone:"accent",label:"Processing"}, uncertain:{tone:"amber",label:"Uncertain"}, error:{tone:"crimson",label:"Error"}, open:{tone:"crimson",label:"Open"}, reviewing:{tone:"amber",label:"Reviewing"}, resolved:{tone:"verified",label:"Resolved"}, dismissed:{tone:"neutral",label:"Dismissed"}, investigating:{tone:"accent",label:"Investigating"} };
  const conf = map[status] ?? {tone:"neutral" as const,label:status};
  return <Badge tone={conf.tone}><StatusDot tone={conf.tone}/>{conf.label}</Badge>;
}

export function ConfidenceTag({ confidence }: { confidence:Confidence }) {
  const map = { high:{tone:"verified" as const,label:"High"}, medium:{tone:"amber" as const,label:"Medium"}, low:{tone:"crimson" as const,label:"Low"} };
  const c = map[confidence];
  return <Badge tone={c.tone}>{c.label} confidence</Badge>;
}

export function EvidenceIcon({ type, className }: { type:EvidenceType; className?:string }) {
  const Icon = { image:ImageIcon, pdf:FileText, document:File, audio:Mic, text:Type }[type];
  const color = { image:"text-accent-3", pdf:"text-crimson", document:"text-fg-muted", audio:"text-verified", text:"text-amber" }[type];
  return <Icon className={cn("size-4", color, className)}/>;
}

export function Progress({ value, tone="accent", className }: { value:number; tone?:"accent"|"verified"|"amber"; className?:string }) {
  const colors = { accent:"bg-accent", verified:"bg-verified", amber:"bg-amber" };
  return <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-3", className)}><motion.div className={cn("h-full rounded-full", colors[tone])} initial={{width:0}} animate={{width:`${value}%`}} transition={{duration:.8,ease:[.16,1,.3,1]}}/></div>;
}

export function Skeleton({ className }: { className?:string }) { return <div className={cn("animate-pulse rounded-md bg-surface-2", className)}/>; }
export function EmptyState({ icon, title, description, action }: { icon:ReactNode; title:string; description:string; action?:ReactNode }) { return <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"><div className="grid size-14 place-items-center rounded-xl border border-line-2 bg-surface-2 text-fg-dim">{icon}</div><div className="max-w-sm"><h3 className="font-display text-base font-semibold text-fg">{title}</h3><p className="mt-1 text-sm leading-6 text-fg-dim">{description}</p></div>{action}</div>; }
export function ErrorState({ title, description, onRetry, retryLabel="Try again" }: { title:string; description:string; onRetry?:()=>void; retryLabel?:string }) { return <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"><div className="grid size-14 place-items-center rounded-xl border border-crimson/30 bg-crimson/10 text-xl font-bold text-crimson">!</div><div className="max-w-sm"><h3 className="font-display text-base font-semibold text-fg">{title}</h3><p className="mt-1 text-sm leading-6 text-fg-dim">{description}</p></div>{onRetry&&<Button variant="secondary" size="sm" onClick={onRetry}>{retryLabel}</Button>}</div>; }

export function Tabs({ tabs, active, onChange }: { tabs:{id:string;label:string;count?:number}[]; active:string; onChange:(id:string)=>void }) {
  return <div className="flex items-center gap-1 overflow-x-auto border-b border-line">{tabs.map(t=><button key={t.id} onClick={()=>onChange(t.id)} className={cn("relative -mb-px shrink-0 px-3 py-3 text-sm font-semibold transition-colors",active===t.id?"text-fg":"text-fg-dim hover:text-fg-muted")}><span className="flex items-center gap-2">{t.label}{t.count!=null&&<span className={cn("rounded-full px-1.5 py-0.5 text-[10px] tabular",active===t.id?"bg-accent/15 text-accent":"bg-surface-2 text-fg-dim")}>{t.count}</span>}</span>{active===t.id&&<motion.span layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"/>}</button>)}</div>;
}

export function ConfidenceRing({ value, size=132, label="Confidence" }: { value:number; size?:number; label?:string }) {
  const r = size/2-10; const circ = 2*Math.PI*r; const tone = value>=80?"var(--color-verified)":value>=60?"var(--color-amber)":"var(--color-crimson)";
  return <div className="relative grid place-items-center" style={{width:size,height:size}}><svg width={size} height={size} className="-rotate-90"><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-surface-3)" strokeWidth={8}/><motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={tone} strokeWidth={8} strokeLinecap="round" strokeDasharray={circ} initial={{strokeDashoffset:circ}} animate={{strokeDashoffset:circ-(value/100)*circ}} transition={{duration:1.1,ease:[.16,1,.3,1]}}/></svg><div className="absolute inset-0 grid place-content-center text-center"><span className="font-display text-3xl font-bold tabular text-fg">{value}%</span><span className="text-[11px] uppercase tracking-wide text-fg-dim">{label}</span></div></div>;
}
