import { useEffect, useMemo, useState } from "react";
import { Search, FileSearch } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Badge, EmptyState, EvidenceIcon, Input, Panel, Select, Skeleton, StatusBadge } from "../../components/ui";
import { EvidenceInspector } from "../../components/investigation/drawers";
import { investigationService } from "../../lib/services";
import type { Evidence, Investigation, EvidenceType } from "../../lib/types";
import { cn } from "../../lib/cn";
import { useApp } from "../../store/AppContext";

const typeFilters: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "image", label: "Images" },
  { id: "pdf", label: "PDF" },
  { id: "document", label: "Documents" },
  { id: "audio", label: "Audio" },
  { id: "text", label: "Text" },
];

export default function EvidencePage() {
  const { toast } = useApp();
  const [inv, setInv] = useState<Investigation | null>(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [inspect, setInspect] = useState<Evidence | null>(null);

  useEffect(() => { investigationService.get("northbridge").then((r) => setInv(r ?? null)); }, []);

  const rows = useMemo(() => {
    if (!inv) return [];
    return inv.evidence.filter(
      (e) =>
        (type === "all" || e.type === (type as EvidenceType)) &&
        (status === "all" || e.status === status) &&
        e.filename.toLowerCase().includes(q.toLowerCase()),
    );
  }, [inv, q, type, status]);

  return (
    <Page>
      <PageHeader eyebrow={inv?.name} title="Evidence explorer" subtitle="Browse, filter, and inspect every source in the investigation." />

      <div className="mb-3 flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-dim" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search evidence…" className="pl-9" />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All status</option>
          <option value="verified">Verified</option>
          <option value="uncertain">Uncertain</option>
          <option value="processing">Processing</option>
          <option value="ready">Ready</option>
        </Select>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {typeFilters.map((t) => (
          <button
            key={t.id}
            onClick={() => setType(t.id)}
            className={cn("rounded-sm border px-3 py-1.5 text-sm transition-colors",
              type === t.id ? "border-accent/40 bg-accent/10 text-accent" : "border-line-2 bg-surface text-fg-muted hover:border-line-strong")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!inv ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : rows.length === 0 ? (
        <Panel><EmptyState icon={<FileSearch className="size-6" />} title="No evidence found" description="No sources match the current search or filters." /></Panel>
      ) : (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto scroll-thin">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                  <th className="px-4 py-2.5 font-normal">Evidence</th>
                  <th className="px-4 py-2.5 font-normal">Type</th>
                  <th className="px-4 py-2.5 font-normal">Relevant time</th>
                  <th className="px-4 py-2.5 font-normal">Status</th>
                  <th className="px-4 py-2.5 text-right font-normal">Related events</th>
                  <th className="px-4 py-2.5 text-right font-normal">Conflicts</th>
                  <th className="px-4 py-2.5 text-right font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id} onClick={() => setInspect(e)} className="group cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-surface-2">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="grid size-8 place-items-center rounded-sm border border-line-2 bg-surface-2"><EvidenceIcon type={e.type} /></div>
                        <div>
                          <div className="font-mono text-sm text-fg group-hover:text-accent">{e.filename}</div>
                          <div className="font-mono text-xs text-fg-dim">{e.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge tone="neutral">{e.type}</Badge></td>
                    <td className="px-4 py-3 font-mono text-fg-muted">{e.relevantTime}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3 text-right font-mono tabular text-fg-muted">{e.relatedEvents.length}</td>
                    <td className="px-4 py-3 text-right font-mono tabular"><span className={e.relatedContradictions.length ? "text-crimson" : "text-fg-dim"}>{e.relatedContradictions.length}</span></td>
                    <td className="px-4 py-3 text-right"><span className="text-xs text-accent group-hover:underline">Inspect</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {inv && (
        <EvidenceInspector
          evidence={inspect}
          investigation={inv}
          open={!!inspect}
          onClose={() => setInspect(null)}
          onSaveNote={() => toast({ title: "Notes saved", kind: "success" })}
        />
      )}
    </Page>
  );
}
