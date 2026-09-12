import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Badge, EmptyState, Panel, Select, Skeleton } from "../../components/ui";
import { ContradictionCard } from "../../components/investigation/panels";
import { ContradictionDrawer } from "../../components/investigation/drawers";
import { investigationService } from "../../lib/services";
import type { Investigation } from "../../lib/types";
import { useApp } from "../../store/AppContext";

export default function Contradictions() {
  const { toast } = useApp();
  const [inv, setInv] = useState<Investigation | null>(null);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => { investigationService.list().then((rows) => rows[0] && investigationService.get(rows[0].id).then((r) => setInv(r ?? null))); }, []);

  const rows = useMemo(() => {
    if (!inv) return [];
    return inv.contradictions.filter((c) => filter === "all" || c.status === filter);
  }, [inv, filter]);

  const drawerCon = inv?.contradictions.find((c) => c.id === open) ?? null;

  return (
    <Page>
      <PageHeader
        eyebrow={inv?.name}
        title={<span className="flex items-center gap-3">Contradictions {inv && <Badge tone="crimson">{String(inv.contradictionCount).padStart(2, "0")}</Badge>}</span>}
        subtitle="Conflicting evidence and inconsistent chronology, routed for investigator review."
        actions={
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
          </Select>
        }
      />

      {!inv ? (
        <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}</div>
      ) : rows.length === 0 ? (
        <Panel><EmptyState icon={<AlertTriangle className="size-6" />} title="No contradictions" description="No conflicting evidence matches this filter. Sources are consistent." /></Panel>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((c) => (
            <ContradictionCard key={c.id} contradiction={c} investigation={inv} selected={open === c.id} onSelect={() => setOpen(c.id)} />
          ))}
        </div>
      )}

      {inv && (
        <ContradictionDrawer
          contradiction={drawerCon}
          investigation={inv}
          open={!!open}
          onClose={() => setOpen(null)}
          onUpdate={(status) => { toast({ title: `Contradiction ${status}`, kind: status === "resolved" ? "success" : "info" }); setOpen(null); }}
        />
      )}
    </Page>
  );
}
