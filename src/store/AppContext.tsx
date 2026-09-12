import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authService, notificationService, type Session, serviceError } from "../lib/services";
import { supabase } from "../lib/supabase";
import type { AppNotification } from "../lib/types";

export interface Toast { id: string; title: string; kind: "success" | "info" | "warn" | "danger"; desc?: string; }
interface AppState { session: Session | null; authReady: boolean; signIn: (email: string, password: string) => Promise<void>; signUp: (name: string, email: string, password: string) => Promise<void>; signOut: () => Promise<void>; updateProfile: (patch: Partial<Session>) => Promise<void>; toasts: Toast[]; toast: (t: Omit<Toast, "id">) => void; dismissToast: (id: string) => void; notifications: AppNotification[]; unreadCount: number; markRead: (id: string) => void; markAllRead: () => void; paletteOpen: boolean; setPaletteOpen: (v: boolean) => void; sidebarCollapsed: boolean; toggleSidebar: () => void; }
const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null); const [authReady, setAuthReady] = useState(false); const [toasts, setToasts] = useState<Toast[]>([]); const [notifications, setNotifications] = useState<AppNotification[]>([]); const [paletteOpen, setPaletteOpen] = useState(false); const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const refreshNotifications = useCallback(async () => { if (!supabase) return; try { setNotifications(await notificationService.list()); } catch { setNotifications([]); } }, []);
  useEffect(() => { let active = true; authService.current().then((s) => { if (active) { setSession(s); setAuthReady(true); if (s) refreshNotifications(); } }).catch(() => setAuthReady(true)); const listener = supabase?.auth.onAuthStateChange((_event, s) => { if (!s) setSession(null); else authService.current().then(setSession); }); return () => { active = false; listener?.data.subscription.unsubscribe(); }; }, [refreshNotifications]);
  const toast = useCallback((t: Omit<Toast, "id">) => { const id = crypto.randomUUID(); setToasts((cur) => [...cur, { ...t, id }]); window.setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== id)), 4200); }, []);
  const dismissToast = useCallback((id: string) => setToasts((c) => c.filter((x) => x.id !== id)), []);
  const signIn = useCallback(async (email: string, password: string) => setSession(await authService.signIn(email, password)), []);
  const signUp = useCallback(async (name: string, email: string, password: string) => setSession(await authService.signUp(name, email, password)), []);
  const signOut = useCallback(async () => { await authService.signOut(); setSession(null); }, []);
  const updateProfile = useCallback(async (patch: Partial<Session>) => { await authService.updateProfile(patch); setSession(await authService.current()); }, []);
  const markRead = useCallback((id: string) => { setNotifications((c) => c.map((n) => n.id === id ? { ...n, read: true } : n)); void notificationService.markRead(id); }, []);
  const markAllRead = useCallback(() => { setNotifications((c) => c.map((n) => ({ ...n, read: true }))); }, []);
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen((v) => !v); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  return <Ctx.Provider value={{ session, authReady, signIn, signUp, signOut, updateProfile, toasts, toast, dismissToast, notifications, unreadCount: notifications.filter((n) => !n.read).length, markRead, markAllRead, paletteOpen, setPaletteOpen, sidebarCollapsed, toggleSidebar: () => setSidebarCollapsed((v) => !v) }}>{children}</Ctx.Provider>;
}
export function useApp() { const ctx = useContext(Ctx); if (!ctx) throw new Error("useApp must be used within AppProvider"); return ctx; }
export { serviceError };
