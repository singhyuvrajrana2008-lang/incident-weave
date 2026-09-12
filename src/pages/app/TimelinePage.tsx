import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Button, Panel, Select, Skeleton } from "../../components/ui";
import { Timeline } from "../../components/investigation/Timeline";
import { EvidenceInspector } from "../../components/investigation/drawers";
import { investigationService } from "../../lib/services";
import type { Evidence, Investigation } from "../../lib/types";
import { useApp } from "../../store/AppContext";

export default function TimelinePage() {
  const { toast } = useApp();
  const [inv, setInv] = useState<Investigation | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [inspect, setInspect] = useState<Evidence | null>(null);

  useEffect(() => { investigationService.get("northbridge").then((r) => setInv(r ?? null)); }, []);

  const highlighted = new Set<string>();

  return (
    <Page>
      <PageHeader
        eyebrow={inv?.name}
        title="Timeline"
        subtitle="Chronological reconstruction with per-event confidence and source attribution."
        actions={
          <>
            <Select defaultValue="northbridge"><option value="northbridge">Northbridge Incident</option></Select>
            {inv && <Link to={`/app/investigations/${inv.id}`}><Button variant="secondary" icon={<ArrowUpRight className="size-4" />}>Open workspace</Button></Link>}
          </>
        }
      />

      {!inv ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <Panel className="p-3 sm:p-5">
          <Timeline
            investigation={inv}
            selectedEvent={sel}
            highlightedEvents={highlighted}
            onSelectEvent={(id) => setSel((c) => (c === id ? null : id))}
          />
        </Panel>
      )}

      {inv && <EvidenceInspector evidence={inspect} investigation={inv} open={!!inspect} onClose={() => setInspect(null)} onSaveNote={() => toast({ title: "Notes saved", kind: "success" })} />}
    </Page>
  );
}
