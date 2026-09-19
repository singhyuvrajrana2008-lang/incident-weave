import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  FileSearch,
  Clock,
  AlertTriangle,
  HelpCircle,
  Search,
  Bell,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  LogOut,
  User,
  ChevronsUpDown,
  Command,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { Logo, LogoMark } from "../Logo";
import { useApp } from "../../store/AppContext";
import { CommandPalette } from "./CommandPalette";
import { Toaster, Tooltip } from "../ui/overlays";
import { StatusDot } from "../ui";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/app/investigations/new", label: "New Investigation", icon: PlusCircle },
      { to: "/app/investigations", label: "Investigations", icon: FolderOpen },
    ],
  },
  {
    label: "Analysis",
    items: [
      { to: "/app/evidence", label: "Evidence", icon: FileSearch },
      { to: "/app/timeline", label: "Timeline", icon: Clock },
      { to: "/app/contradictions", label: "Contradictions", icon: AlertTriangle },
      { to: "/app/unknowns", label: "Unknowns", icon: HelpCircle },
    ],
  },
  {
    label: "Find",
    items: [{ to: "/app/search", label: "Search", icon: Search }],
  },
];

function Sidebar({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const { sidebarCollapsed, session, signOut, setPaletteOpen, toggleSidebar } = useApp();
  const nav = useNavigate();
  const collapsed = mobile ? false : sidebarCollapsed;
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    nav("/");
  }

  return (
    <div className={cn("flex h-full flex-col border-r border-line bg-bg-2", collapsed ? "w-[68px]" : "w-[248px]")}>
      <div className={cn("flex h-16 items-center border-b border-line", collapsed ? "justify-center px-2" : "justify-between px-4")}>
        <Link to="/app/dashboard" onClick={onClose}>{collapsed ? <LogoMark /> : <Logo />}</Link>
        <div className="flex items-center gap-1.5">
          {!mobile && (
            <button
              type="button"
              onClick={toggleSidebar}
              title={collapsed ? "Show sidebar" : "Hide sidebar"}
              aria-label={collapsed ? "Show sidebar" : "Hide sidebar"}
              className={cn(
                "grid size-8 place-items-center rounded-sm text-fg-dim transition-colors hover:bg-surface-2 hover:text-fg",
                collapsed && "absolute right-1 top-4",
              )}
            >
              {collapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
            </button>
          )}
          {mobile && (
            <button type="button" onClick={onClose} aria-label="Close menu" className="grid size-8 place-items-center rounded-sm text-fg-dim hover:bg-surface-2 hover:text-fg">
              <X className="size-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scroll-thin px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            {!collapsed && <div className={cn("px-2.5 pb-2 font-display text-[10px] font-semibold uppercase tracking-[0.16em]", group.label === "Workspace" || group.label === "Analysis" ? "text-fg" : "text-fg-faint")}>{group.label}</div>}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const link = (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/app/investigations"}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        "sidebar-tile group relative flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors",
                        collapsed && "justify-center",
                        isActive ? "bg-accent/10 text-accent" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && <motion.span layoutId="nav-active" className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent" />}
                        <item.icon className="size-4.5 shrink-0" />
                        {!collapsed && item.label}
                      </>
                    )}
                  </NavLink>
                );
                return collapsed ? <Tooltip key={item.to} label={item.label}>{link}</Tooltip> : link;
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        {!collapsed && (
          <button onClick={() => setPaletteOpen(true)} className="mb-3 flex w-full items-center justify-between rounded-sm border border-line-2 bg-surface px-2.5 py-2 text-xs text-fg-dim transition-colors hover:border-line-strong">
            <span className="flex items-center gap-2"><Search className="size-3.5" /> Quick search</span>
            <kbd className="flex items-center gap-0.5 rounded-xs border border-line-2 px-1 py-0.5 font-mono text-[10px]"><Command className="size-2.5" />K</kbd>
          </button>
        )}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={cn("flex w-full items-center gap-2.5 rounded-sm px-1.5 py-1.5 transition-colors hover:bg-surface-2", collapsed && "justify-center")}
          >
            <div className="grid size-8 shrink-0 place-items-center rounded-sm bg-accent/15 font-display text-sm font-semibold text-accent">
              {session?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-sm font-medium text-fg">{session?.name}</div>
                  <div className="truncate text-xs text-fg-dim">{session?.role}</div>
                </div>
                <ChevronsUpDown className="size-4 text-fg-dim" />
              </>
            )}
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-0 z-20 mb-2 w-52 overflow-hidden rounded-md border border-line-2 bg-raised shadow-xl"
                >
                  {[
                    { label: "Profile", icon: User, to: "/app/profile" },
                    { label: "Settings", icon: Settings, to: "/app/settings" },
                  ].map((m) => (
                    <button key={m.label} onClick={() => { setMenuOpen(false); nav(m.to); onClose?.(); }} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-fg-muted hover:bg-surface-2 hover:text-fg">
                      <m.icon className="size-4" /> {m.label}
                    </button>
                  ))}
                  <div className="border-t border-line" />
                  <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-crimson hover:bg-crimson/10">
                    <LogOut className="size-4" /> Log out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const { toggleSidebar, setPaletteOpen, unreadCount, sidebarCollapsed, theme, toggleTheme } = useApp();
  const loc = useLocation();
  const crumbs = loc.pathname.split("/").filter(Boolean).slice(1);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="text-fg-muted hover:text-fg lg:hidden"><Menu className="size-5" /></button>
        <button
          type="button"
          onClick={toggleSidebar}
          title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          aria-label={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          className="hidden rounded-sm p-1.5 text-fg-dim transition-colors hover:bg-surface-2 hover:text-fg lg:block"
        >
          {sidebarCollapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
        </button>
        <nav className="hidden items-center gap-1.5 text-sm sm:flex">
          {crumbs.length === 0 && <span className="text-fg">Dashboard</span>}
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-fg-faint">/</span>}
              <span className={cn("capitalize", i === crumbs.length - 1 ? "text-fg" : "text-fg-dim")}>{c.replace(/-/g, " ")}</span>
            </span>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setPaletteOpen(true)} className="flex items-center gap-2 rounded-sm border border-line-2 bg-surface px-2.5 py-1.5 text-xs text-fg-dim transition-colors hover:border-line-strong">
          <Search className="size-3.5" /> <span className="hidden sm:inline">Search</span>
          <kbd className="hidden items-center gap-0.5 rounded-xs border border-line-2 px-1 font-mono text-[10px] sm:flex"><Command className="size-2.5" />K</kbd>
        </button>
        <Link to="/app/notifications" className="relative grid size-9 place-items-center rounded-sm text-fg-muted hover:bg-surface-2 hover:text-fg">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex items-center justify-center">
              <StatusDot tone="accent" />
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="grid size-9 place-items-center rounded-sm text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          {theme === "dark" ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
        </button>
        <Link to="/app/settings" className="grid size-9 place-items-center rounded-sm text-fg-muted hover:bg-surface-2 hover:text-fg"><Settings className="size-5" /></Link>
      </div>
    </header>
  );
}

export function AppLayout() {
  const { authReady, session, sidebarCollapsed, toggleSidebar } = useApp();
  const nav = useNavigate();
  const loc = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (authReady && !session) nav("/sign-in", { replace: true });
  }, [authReady, session, nav]);

  useEffect(() => setMobileOpen(false), [loc.pathname]);

  if (!authReady) return <div className="grid min-h-screen place-items-center text-fg-dim">Loading…</div>;
  if (!session) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* desktop sidebar */}
      <motion.div
        className="hidden lg:block"
        animate={{ width: sidebarCollapsed ? 68 : 248 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <Sidebar />
      </motion.div>
      {/* the width toggle icon lives in the sidebar collapse control */}
      <button onClick={toggleSidebar} className="hidden" aria-hidden><PanelLeftClose /></button>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 bg-void/70 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} />
            <motion.div className="fixed inset-y-0 left-0 z-50 lg:hidden" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.25 }}>
              <Sidebar mobile onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto scroll-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={loc.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette />
      <Toaster />
    </div>
  );
}
