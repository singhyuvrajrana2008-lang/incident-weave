import { useState } from "react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Button, Field, Input, Panel, PanelHeader, Badge } from "../../components/ui";
import { useApp } from "../../store/AppContext";

export default function Profile() {
  const { session, updateProfile, toast } = useApp();
  const [name, setName] = useState(session?.name ?? "");
  const [role, setRole] = useState(session?.role ?? "");

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({ name, role });
    toast({ title: "Profile updated", kind: "success" });
  }

  return (
    <Page className="max-w-4xl">
      <PageHeader title="Profile" subtitle="Manage your investigator identity and workspace details." />

      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <Panel className="p-6 text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-lg bg-accent/15 font-display text-3xl font-bold text-accent">
            {session?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <h2 className="mt-3 font-display text-lg font-bold text-fg">{session?.name}</h2>
          <p className="text-sm text-fg-dim">{session?.email}</p>
          <div className="mt-3 flex justify-center"><Badge tone="accent">{session?.role}</Badge></div>
          <div className="mt-5 space-y-2 border-t border-line pt-5 text-left text-sm">
            <div className="flex justify-between"><span className="text-fg-dim">Workspace</span><span className="text-fg">{session?.workspace}</span></div>
            <div className="flex justify-between"><span className="text-fg-dim">Member since</span><span className="text-fg">{session?.createdAt}</span></div>
            <div className="flex justify-between"><span className="text-fg-dim">Investigations</span><span className="font-mono text-fg">4</span></div>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel>
            <PanelHeader title="Account details" />
            <form onSubmit={save} className="space-y-4 p-5">
              <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
              <Field label="Email"><Input value={session?.email} disabled /></Field>
              <Field label="Role"><Input value={role} onChange={(e) => setRole(e.target.value)} /></Field>
              <Field label="Workspace"><Input value={session?.workspace} disabled /></Field>
              <div className="flex justify-end"><Button type="submit" variant="primary">Save changes</Button></div>
            </form>
          </Panel>

          <Panel>
            <PanelHeader title="Recent activity" />
            <div className="space-y-3 p-5">
              {[
                ["Completed", "Northbridge Incident reconstruction", "4m ago"],
                ["Reviewed", "Contradiction C-02", "1h ago"],
                ["Created", "Airport Concourse Incident", "Yesterday"],
              ].map(([verb, what, when]) => (
                <div key={what} className="flex items-center justify-between text-sm">
                  <span><span className="text-accent">{verb}</span> <span className="text-fg-muted">{what}</span></span>
                  <span className="text-xs text-fg-dim">{when}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}
