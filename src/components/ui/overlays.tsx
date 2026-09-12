import { useEffect } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";
import { cn } from "../../lib/cn";
import { useApp } from "../../store/AppContext";
import { IconButton } from "./index";

/* ------------------------------ Drawer ------------------------------ */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 460,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-void/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-line-2 bg-bg-2 shadow-2xl sm:w-[var(--dw)]"
            style={{ ["--dw" as string]: `${width}px` }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold tracking-tight text-fg">{title}</h2>
                {subtitle && <div className="mt-0.5 text-sm text-fg-dim">{subtitle}</div>}
              </div>
              <IconButton label="Close" onClick={onClose}><X className="size-5" /></IconButton>
            </header>
            <div className="flex-1 overflow-y-auto scroll-thin px-5 py-5">{children}</div>
            {footer && <footer className="border-t border-line px-5 py-4">{footer}</footer>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Dialog ------------------------------ */
export function Dialog({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <motion.div className="absolute inset-0 bg-void/70 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-lg border border-line-2 bg-bg-2 shadow-2xl"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-base font-semibold text-fg">{title}</h2>
              <IconButton label="Close" onClick={onClose}><X className="size-5" /></IconButton>
            </header>
            <div className="px-5 py-4">{children}</div>
            {footer && <footer className="flex justify-end gap-2 border-t border-line px-5 py-4">{footer}</footer>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Toaster ------------------------------ */
const toastIcons = {
  success: CheckCircle2,
  info: Info,
  warn: AlertTriangle,
  danger: XCircle,
};
const toastColors = {
  success: "text-verified",
  info: "text-accent",
  warn: "text-amber",
  danger: "text-crimson",
};

export function Toaster() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = toastIcons[t.kind];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-start gap-3 rounded-md border border-line-2 bg-raised px-4 py-3 shadow-xl"
            >
              <Icon className={cn("mt-0.5 size-4.5 shrink-0", toastColors[t.kind])} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg">{t.title}</p>
                {t.desc && <p className="mt-0.5 text-xs text-fg-dim">{t.desc}</p>}
              </div>
              <button onClick={() => dismissToast(t.id)} className="text-fg-faint hover:text-fg"><X className="size-4" /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------ Tooltip ------------------------------ */
export function Tooltip({ label, children, side = "right" }: { label: string; children: ReactNode; side?: "right" | "top" }) {
  return (
    <span className="group/tt relative inline-flex">
      {children}
      <span
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-sm border border-line-2 bg-raised-2 px-2 py-1 text-xs text-fg opacity-0 shadow-lg transition-opacity group-hover/tt:opacity-100",
          side === "right" && "left-full top-1/2 ml-2 -translate-y-1/2",
          side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2",
        )}
      >
        {label}
      </span>
    </span>
  );
}
