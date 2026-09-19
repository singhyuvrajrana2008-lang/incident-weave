import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as Cog, Bell, Palette, SlidersHorizontal, Database, LogOut } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Button, Field, Input, Panel, Select } from "../../components/ui";
import { cn } from "../../lib/cn";
import { useApp } from "../../store/AppContext";

const tabs = [
  { id: "general", label: "General", icon: Cog },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "investigation", label: "Investigation", icon: SlidersHorizontal },
  { id: "data", label: "Data", icon: Database },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60",
        checked ? "border-accent/50 bg-accent" : "border-line-2 bg-surface-3",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
          checked ? "translate-x-[20px]" : "translate-x-0",
        )}
      />
    </button>
  );
}

function SettingRow({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-4 last:border-0">
      <div>
        <div className="text-sm font-medium text-fg">{title}</div>
        <div className="text-xs text-fg-dim">{desc}</div>
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const { toast, signOut } = useApp();
  const nav = useNavigate();
  const [tab, setTab] = useState("general");
  const [toggles, setToggles] = useState({
    emailAnalysis: true,
    emailContradiction: true,
    pushUnknown: false,
    reducedMotion: false,
    density: true,
    autoReconstruct: true,
    highConfidenceOnly: false,
    retainEvidence: true,
  });
  const set = (k: keyof typeof toggles) => (v: boolean) => setToggles((t) => ({ ...t, [k]: v }));

  async function logout() {
    await signOut();
    nav("/");
  }

  return (
    <Page className="max-w-5xl">
      <PageHeader title="Settings" subtitle="Configure your workspace, notifications, and investigation preferences." />

      <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
        {/* nav */}
        <nav className="flex gap-1 overflow-x-auto scroll-thin lg:flex-col">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn("flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                tab === t.id ? "bg-accent/10 text-accent" : "text-fg-muted hover:bg-surface-2 hover:text-fg")}
            >
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === "general" && (
            <Panel className="p-5">
              <Field label="Workspace name"><Input defaultValue="Northbridge Field Office" /></Field>
              <div className="mt-4"><Field label="Time zone">
                <Select defaultValue="utc"><option value="utc">UTC (Coordinated Universal Time)</option><option value="est">Eastern Time</option><option value="pst">Pacific Time</option></Select>
              </Field></div>
              <div className="mt-4"><Field label="Default timestamp format">
                <Select defaultValue="24"><option value="24">24-hour · 10:14:21</option><option value="12">12-hour · 10:14:21 AM</option></Select>
              </Field></div>
              <div className="mt-5 flex justify-end"><Button variant="primary" onClick={() => toast({ title: "Settings saved", kind: "success" })}>Save</Button></div>
            </Panel>
          )}

          {tab === "notifications" && (
            <Panel className="px-5 py-2">
              <SettingRow title="Analysis completed" desc="Email me when a reconstruction finishes."><Toggle checked={toggles.emailAnalysis} onChange={set("emailAnalysis")} /></SettingRow>
              <SettingRow title="Contradiction detected" desc="Email me when conflicting evidence is found."><Toggle checked={toggles.emailContradiction} onChange={set("emailContradiction")} /></SettingRow>
              <SettingRow title="Unknown identified" desc="Push notification for new evidence gaps."><Toggle checked={toggles.pushUnknown} onChange={set("pushUnknown")} /></SettingRow>
              <div className="flex justify-end py-4"><Button variant="primary" onClick={() => toast({ title: "Notification preferences saved", kind: "success" })}>Save</Button></div>
            </Panel>
          )}

          {tab === "appearance" && (
            <Panel className="px-5 py-2">
              <SettingRow title="Theme" desc="IncidentWeave is optimized for a dark analytical environment.">
                <Select defaultValue="dark"><option value="dark">Dark</option><option value="dark" disabled>Light (coming soon)</option></Select>
              </SettingRow>
              <SettingRow title="Compact density" desc="Tighter spacing for information-dense views."><Toggle checked={toggles.density} onChange={set("density")} /></SettingRow>
              <SettingRow title="Reduced motion" desc="Minimize animations across the interface."><Toggle checked={toggles.reducedMotion} onChange={set("reducedMotion")} /></SettingRow>
              <div className="flex justify-end py-4"><Button variant="primary" onClick={() => toast({ title: "Appearance saved", kind: "success" })}>Save</Button></div>
            </Panel>
          )}

          {tab === "investigation" && (
            <Panel className="px-5 py-2">
              <SettingRow title="Auto-reconstruct on intake" desc="Start reconstruction automatically once evidence finishes processing."><Toggle checked={toggles.autoReconstruct} onChange={set("autoReconstruct")} /></SettingRow>
              <SettingRow title="Show only high-confidence events" desc="Hide inferred and uncertain events by default."><Toggle checked={toggles.highConfidenceOnly} onChange={set("highConfidenceOnly")} /></SettingRow>
              <div className="border-b border-line py-4">
                <Field label="Default correlation sensitivity">
                  <Select defaultValue="balanced"><option value="strict">Strict — fewer, stronger links</option><option value="balanced">Balanced</option><option value="broad">Broad — surface more relationships</option></Select>
                </Field>
              </div>
              <div className="flex justify-end py-4"><Button variant="primary" onClick={() => toast({ title: "Investigation preferences saved", kind: "success" })}>Save</Button></div>
            </Panel>
          )}

          {tab === "data" && (
            <>
              <Panel className="px-5 py-2">
                <SettingRow title="Retain evidence after export" desc="Keep original files in the workspace after generating a report."><Toggle checked={toggles.retainEvidence} onChange={set("retainEvidence")} /></SettingRow>
                <div className="border-b border-line py-4">
                  <Field label="Evidence retention period">
                    <Select defaultValue="90"><option value="30">30 days</option><option value="90">90 days</option><option value="365">1 year</option></Select>
                  </Field>
                </div>
                <div className="flex justify-end py-4"><Button variant="primary" onClick={() => toast({ title: "Data preferences saved", kind: "success" })}>Save</Button></div>
              </Panel>
              <Panel className="mt-5 border-crimson/20 p-5">
                <h3 className="font-display text-sm font-semibold text-crimson">Danger zone</h3>
                <div className="mt-3 flex items-center justify-between">
                  <div><div className="text-sm text-fg">Sign out of IncidentWeave</div><div className="text-xs text-fg-dim">End your current session on this device.</div></div>
                  <Button variant="danger" size="sm" icon={<LogOut className="size-3.5" />} onClick={logout}>Log out</Button>
                </div>
              </Panel>
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
