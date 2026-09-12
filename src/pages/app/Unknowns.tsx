import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Badge, EmptyState, Panel, Skeleton } from "../../components/ui";
import { UnknownCard } from "../../components/investigation/panels";
import { investigationService } from "../../lib/services";
import type { Investigation } from "../../lib/types";
import { useApp } from "../../store/AppContext";

export default function Unknowns() {
  const { toast } = useApp();
  const [inv, setInv] = useState<Investigation | null>(null);
  useEffect(() => { investigationService.get("northbridge").then((r) => setInv(r ?? null)); }, []);

  return (
    <Page>
      <PageHeader
        eyebrow={inv?.name}
        title={<span className="flex items-center gap-3">Unknown / evidence gaps {inv && <Badge tone="amber">{String(inv.unknownCount).padStart(2, "0")}</Badge>}</span>}
        subtitle="What the evidence cannot yet establish — and how to close each gap."
      />

      {!inv ? (
        <div className="grid gap-3 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44" />)}</div>
      ) : inv.unknowns.length === 0 ? (
        <Panel><EmptyState icon={<HelpCircle className="size-6" />} title="No open unknowns" description="Every evidence gap has been resolved for this investigation." /></Panel>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {inv.unknowns.map((u) => (
            <UnknownCard
              key={u.id}
              unknown={u}
              onSelect={() => toast({ title: "Marked investigating", kind: "info", desc: u.title })}
              onAddEvidence={() => toast({ title: "Add evidence", kind: "info", desc: "Attach a source to this gap." })}
            />
          ))}
        </div>
      )}
    </Page>
  );
}
