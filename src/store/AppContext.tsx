import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { authService, notificationService } from "../lib/services";
import type { Session } from "../lib/services";
import type { AppNotification } from "../lib/types";

export interface Toast { id: string; title: string; kind: "success" | "info" | "warn" | "danger"; desc?: string; }
interface AppState { session: Session | null; authReady: boolean; signIn: (email: string, password: string) => Promise<void>; signUp: (name: string, email: string, password: string) => Promise<void>; signOut: () => Promise<void>; updateProfile: (patch: Partial<Session>) => void; toasts: Toast[]; toast: (t: Omit<Toast, "id">) => void; dismissToast: (id: string) => void; notifications: AppNotification[]; unreadCount: number; markRead: (id: string) => void; markAllRead: () => void; paletteOpen: boolean; setPaletteOpen: (v: boolean) => void; sidebarCollapsed: boolean; toggleSidebar: () => void; }
const Ctx = createContext<AppState | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null); const [authReady, setAuthReady] = useState(false); const [toasts, setToasts] = useState<Toast[]>([]); const [notifications, setNotifications] = useState<AppNotification[]>([]); const [paletteOpen, setPaletteOpen] = useState(false); const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useEffect(() => { setSession(authService.current()); setAuthReady(true); notificationService.list().then(setNotifications); }, []);
  const toast = useCallback((t: Omit<Toast, "id">) => { const id = Math.random().toString(36).slice(2); setToasts((cur) => [...cur, { ...t, id }]); setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== id)), 4200); }, []);
  const dismissToast = useCallback((id: string) => setToasts((c) => c.filter((x) => x.id !== id)), []);
  const signIn = useCallback(async (email: string, password: string) => { setSession(await authService.signIn(email, password)); }, []);
  const signUp = useCallback(async (name: string, email: string, password: string) => { setSession(await authService.signUp(name, email, password)); }, []);
  const signOut = useCallback(async () => { await authService.signOut(); setSession(null); }, []);
  const updateProfile = useCallback((patch: Partial<Session>) => { authService.updateProfile(patch); setSession(authService.current()); }, []);
  const markRead = useCallback((id: string) => setNotifications((c) => c.map((n) => n.id === id ? { ...n, read: true } : n)), []);
  const markAllRead = useCallback(() => setNotifications((c) => c.map((n) => ({ ...n, read: true }))), []);
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen((v) => !v); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  return <Ctx.Provider value={{ session, authReady, signIn, signUp, signOut, updateProfile, toasts, toast, dismissToast, notifications, unreadCount: notifications.filter((n) => !n.read).length, markRead, markAllRead, paletteOpen, setPaletteOpen, sidebarCollapsed, toggleSidebar: () => setSidebarCollapsed((v) => !v) }}>{children}</Ctx.Provider>;
}
export function useApp() { const ctx = useContext(Ctx); if (!ctx) throw new Error("useApp must be used within AppProvider"); return ctx; }
