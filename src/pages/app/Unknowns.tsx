import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Badge, EmptyState, Panel } from "../../components/ui";
import { UnknownCard } from "../../components/investigation/panels";
import { DEMO_INVESTIGATION } from "../../lib/demoInvestigation";
import { useApp } from "../../store/AppContext";

export default function Unknowns() {
  const { toast } = useApp();
  const [inv] = useState(DEMO_INVESTIGATION);

  return (
    <Page>
      <PageHeader eyebrow={inv.name} title={<span className="flex items-center gap-3">Unknown / evidence gaps <Badge tone="amber">{String(inv.unknownCount).padStart(2, "0")}</Badge></span>} subtitle="What the evidence cannot yet establish — and how to close each gap." />
      {inv.unknowns.length === 0 ? <Panel><EmptyState icon={<HelpCircle className="size-6" />} title="No open unknowns" description="Every evidence gap has been resolved for this investigation." /></Panel> : <div className="grid gap-3 md:grid-cols-2">{inv.unknowns.map((u) => <UnknownCard key={u.id} unknown={u} onSelect={() => toast({ title: "Marked investigating", kind: "info", desc: u.title })} onAddEvidence={() => toast({ title: "Add evidence", kind: "info", desc: "Attach a source to this gap." })} />)}</div>}
    </Page>
  );
}
