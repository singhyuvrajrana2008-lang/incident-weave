import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Search, FolderOpen } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Button, EmptyState, Input, Panel, Select, Skeleton, StatusBadge } from "../../components/ui";
import { investigationService } from "../../lib/services";
import type { Investigation } from "../../lib/types";
import { DEMO_INVESTIGATION } from "../../lib/demoInvestigation";

export default function Investigations() {
  const nav = useNavigate();
  const [data, setData] = useState<Investigation[]>([DEMO_INVESTIGATION]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated");

  useEffect(() => {
    investigationService.list().then((rows) => {
      setData([DEMO_INVESTIGATION, ...rows.filter((row) => row.id !== DEMO_INVESTIGATION.id)]);
    }).catch(() => {
      setData([DEMO_INVESTIGATION]);
    });
  }, []);

  const rows = useMemo(() => {
    let r = data.filter((i) => (status === "all" || i.status === status) && i.name.toLowerCase().includes(q.toLowerCase()));
    r = [...r].sort((a, b) => (sort === "confidence" ? b.confidence - a.confidence : sort === "evidence" ? b.evidenceCount - a.evidenceCount : 0));
    return r;
  }, [data, q, status, sort]);

  return (
    <Page>
      <PageHeader title="Investigations" subtitle="All cases across your workspace." actions={<Link to="/app/investigations/new"><Button variant="primary" icon={<PlusCircle className="size-4" />}>New Investigation</Button></Link>} />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-dim" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cases…" className="pl-9" /></div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All status</option><option value="complete">Completed</option><option value="analyzing">Analyzing</option><option value="ready">Ready</option></Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}><option value="updated">Sort: Recent</option><option value="confidence">Sort: Confidence</option><option value="evidence">Sort: Evidence</option></Select>
      </div>
      {!data ? <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div> : rows.length === 0 ? <Panel><EmptyState icon={<FolderOpen className="size-6" />} title="No matching investigations" description="Try adjusting your search or filters." action={<Link to="/app/investigations/new"><Button variant="primary" icon={<PlusCircle className="size-4" />}>New Investigation</Button></Link>} /></Panel> : <Panel className="overflow-hidden"><div className="overflow-x-auto scroll-thin"><table className="w-full min-w-[820px] text-sm"><thead><tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fg-faint">{["Case", "Created", "Updated", "Evidence", "Events", "Conflicts", "Unknowns", "Status"].map((h, i) => <th key={h} className={`px-4 py-2.5 font-normal ${i >= 3 && i <= 6 ? "text-right" : ""}`}>{h}</th>)}</tr></thead><tbody>{rows.map((inv) => <tr key={inv.id} onClick={() => nav(inv.id === DEMO_INVESTIGATION.id ? "/app/investigations/demo" : `/app/investigations/${inv.id}`)} className="group cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-surface-2"><td className="px-4 py-3"><div className="font-medium text-fg group-hover:text-accent">{inv.name}</div><div className="max-w-xs truncate text-xs text-fg-dim">{inv.description}</div></td><td className="px-4 py-3 text-xs text-fg-dim">{inv.createdAt}</td><td className="px-4 py-3 text-xs text-fg-dim">{inv.updatedLabel}</td><td className="px-4 py-3 text-right font-mono tabular text-fg-muted">{inv.evidenceCount}</td><td className="px-4 py-3 text-right font-mono tabular text-fg-muted">{inv.eventCount}</td><td className="px-4 py-3 text-right font-mono tabular"><span className="text-crimson">{inv.contradictionCount}</span></td><td className="px-4 py-3 text-right font-mono tabular"><span className="text-amber">{inv.unknownCount}</span></td><td className="px-4 py-3"><StatusBadge status={inv.status} /></td></tr>)}</tbody></table></div></Panel>}
    </Page>
  );
}
