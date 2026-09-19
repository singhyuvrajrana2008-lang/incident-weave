import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Plus,
  Download,
  MoreHorizontal,
  AlertTriangle,
  HelpCircle,
  GitBranch,
  ArrowLeft,
} from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import {
  Badge,
  Button,
  ConfidenceRing,
  EmptyState,
  EvidenceIcon,
  Panel,
  PanelHeader,
  Progress,
  Skeleton,
  StatusBadge,
  Tabs,
} from "../../components/ui";
import { Timeline } from "../../components/investigation/Timeline";
import { AnalysisProgress } from "../../components/investigation/AnalysisProgress";
import { ContradictionCard, UnknownCard } from "../../components/investigation/panels";
import { RelationshipMap } from "../../components/investigation/RelationshipMap";
import { EvidenceInspector, ContradictionDrawer } from "../../components/investigation/drawers";
import { investigationService } from "../../lib/services";
import type { Investigation } from "../../lib/types";
import { useApp } from "../../store/AppContext";
import { cn } from "../../lib/cn";

export default function InvestigationWorkspace() {
  const { id } = useParams();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const { toast } = useApp();
  const addEvidenceInputRef = useRef<HTMLInputElement>(null);
  const [inv, setInv] = useState<Investigation | null | undefined>(undefined);
  const [tab, setTab] = useState(params.get("tab") ?? "timeline");

  // selection / cross-highlight state
  const [selEvidence, setSelEvidence] = useState<string | null>(null);
  const [selEvent, setSelEvent] = useState<string | null>(null);
  const [selContradiction, setSelContradiction] = useState<string | null>(null);
  const [inspectEvidence, setInspectEvidence] = useState<string | null>(null);
  const [drawerContradiction, setDrawerContradiction] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rerunRunId, setRerunRunId] = useState<string | null>(null);
  const [rerunStarting, setRerunStarting] = useState(false);
  const [addingEvidence, setAddingEvidence] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setInv(undefined);
    setLoadError("");
    investigationService
      .get(id!)
      .then((r) => setInv(r ?? null))
      .catch((reason) => {
        setLoadError(reason instanceof Error ? reason.message : "Unable to load this investigation.");
        setInv(null);
      });
  }, [id, reloadToken]);

  useEffect(() => {
    if (tab) setParams({ tab }, { replace: true });
  }, [tab]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  // derive highlighted sets from current selection
  const highlight = useMemo(() => {
    const events = new Set<string>();
    const evidence = new Set<string>();
    const contradictions = new Set<string>();
    if (!inv) return { events, evidence, contradictions };

    if (selEvidence) {
      const ev = inv.evidence.find((e) => e.id === selEvidence);
      ev?.relatedEvents.forEach((e) => events.add(e));
      ev?.relatedContradictions.forEach((c) => contradictions.add(c));
      evidence.add(selEvidence);
    }
    if (selEvent) {
      const e = inv.events.find((x) => x.id === selEvent);
      e?.sources.forEach((s) => evidence.add(s));
      if (e?.contradiction) contradictions.add(e.contradiction);
      events.add(selEvent);
    }
    if (selContradiction) {
      const c = inv.contradictions.find((x) => x.id === selContradiction);
      if (c) {
        evidence.add(c.sourceA.evidenceId);
        evidence.add(c.sourceB.evidenceId);
        c.eventIds.forEach((e) => events.add(e));
        contradictions.add(c.id);
      }
    }
    return { events, evidence, contradictions };
  }, [inv, selEvidence, selEvent, selContradiction]);

  function selectEvent(eid: string) {
    setSelEvent((cur) => (cur === eid ? null : eid));
    setSelEvidence(null);
    setSelContradiction(null);
  }
  function selectEvidence(evid: string) {
    setSelEvidence((cur) => (cur === evid ? null : evid));
    setSelEvent(null);
    setSelContradiction(null);
  }
  function selectContradiction(cid: string) {
    setSelContradiction((cur) => (cur === cid ? null : cid));
    setSelEvidence(null);
    setSelEvent(null);
  }
  function clearSelection() {
    setSelEvidence(null);
    setSelEvent(null);
    setSelContradiction(null);
  }

  async function addEvidence(files: File[]) {
    if (!id || !inv || !files.length || addingEvidence || rerunStarting || rerunRunId) return;
    setAddingEvidence(true);
    try {
      await investigationService.uploadEvidence(inv.id, files);
      toast({ title: "Evidence uploaded", kind: "success", desc: "Starting a fresh analysis with the updated evidence set." });
      const runId = await investigationService.rerunAnalysis(inv.id);
      setRerunRunId(runId);
    } catch (reason) {
      toast({
        title: "Could not add evidence",
        kind: "danger",
        desc: reason instanceof Error ? reason.message : "Evidence upload or re-analysis failed.",
      });
    } finally {
      setAddingEvidence(false);
    }
  }

  async function deleteInvestigation() {
    if (!id || !inv || deleting) return;
    if (!window.confirm(`Delete “${inv.name}”? This permanently removes the investigation, its evidence records, analysis results, and private Storage files.`)) return;
    setDeleting(true);
    try {
      await investigationService.delete(id);
      toast({ title: "Investigation deleted", kind: "success", desc: `${inv.name} was permanently removed.` });
      nav("/app/investigations");
    } catch (error) {
      setDeleting(false);
      toast({ title: "Delete failed", kind: "danger", desc: error instanceof Error ? error.message : "Unable to delete this investigation." });
    }
  }

  if (inv === undefined) return <Page>{loadError ? <EmptyState icon={<AlertTriangle className="size-6" />} title="Unable to load investigation" description={loadError} action={<Button variant="secondary" onClick={() => { setInv(undefined); setReloadToken((value) => value + 1); }}>Try again</Button>} /> : <WorkspaceSkeleton />}</Page>;
  if (inv === null)
    return (
      <Page>
        <EmptyState
          icon={<AlertTriangle className="size-6" />}
          title="Investigation not found"
          description="This investigation may have been removed or the link is incorrect."
          action={<Link to="/app/investigations"><Button variant="secondary" icon={<ArrowLeft className="size-4" />}>Back to investigations</Button></Link>}
        />
      </Page>
    );

  if (rerunRunId)
    return (
      <Page>
        <PageHeader eyebrow="Live analysis" title={inv.name} subtitle="Results will appear here after the configured analysis service completes." />
        <AnalysisProgress
          key={rerunRunId}
          analysisRunId={rerunRunId}
          onComplete={() => { setRerunRunId(null); setReloadToken((value) => value + 1); }}
          onRetry={() => setRerunRunId(null)}
        />
      </Page>
    );

  const inspectedEv = inv.evidence.find((e) => e.id === inspectEvidence) ?? null;
  const drawerCon = inv.contradictions.find((c) => c.id === drawerContradiction) ?? null;

  const tabs = [
    { id: "timeline", label: "Timeline", count: inv.events.length },
    { id: "evidence", label: "Evidence", count: inv.evidence.length },
    { id: "contradictions", label: "Contradictions", count: inv.contradictions.length },
    { id: "unknowns", label: "Unknowns", count: inv.unknowns.length },
    { id: "relationships", label: "Relationships" },
  ];

  return (
    <Page>
      {/* Header */}
      <div className="mb-5">
        <Link to="/app/investigations" className="mb-3 inline-flex items-center gap-1.5 text-xs text-fg-dim hover:text-fg">
          <ArrowLeft className="size-3.5" /> Investigations
        </Link>
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-2xl font-bold tracking-tight text-fg">{inv.name}</h1>
              <StatusBadge status={inv.status} />
            </div>
            <p className="mt-1 text-sm text-fg-dim">Last analyzed {inv.updatedAt} · Incident date {inv.incidentDate}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              loading={rerunStarting || !!rerunRunId}
              disabled={rerunStarting || !!rerunRunId}
              icon={<RefreshCw className="size-3.5" />}
              onClick={async () => {
                if (rerunStarting || rerunRunId) return;
                setRerunStarting(true);
                try {
                  const runId = await investigationService.rerunAnalysis(inv.id);
                  setRerunRunId(runId);
                } catch (reason) {
                  toast({ title: "Analysis could not start", kind: "danger", desc: reason instanceof Error ? reason.message : "Unable to start analysis." });
                } finally {
                  setRerunStarting(false);
                }
              }}
            >Re-run analysis</Button>
            <input
              ref={addEvidenceInputRef}
              hidden
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.md,.mp3,.wav,.m4a,.webm"
              onChange={(event) => {
                const selected = Array.from(event.target.files ?? []);
                event.currentTarget.value = "";
                void addEvidence(selected);
              }}
            />
            <Button
              variant="secondary"
              size="sm"
              loading={addingEvidence}
              disabled={addingEvidence || rerunStarting || !!rerunRunId}
              icon={<Plus className="size-3.5" />}
              onClick={() => addEvidenceInputRef.current?.click()}
            >
              Add evidence
            </Button>
            <Button variant="secondary" size="sm" icon={<Download className="size-3.5" />} onClick={() => toast({ title: "Export started", kind: "success", desc: "Preparing investigation report." })}>Export</Button>
            <div className="relative">
              <Button variant="ghost" size="sm" className="px-2" aria-label="Investigation actions" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><MoreHorizontal className="size-4" /></Button>
              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close investigation actions"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    role="menu"
                    className="absolute right-0 top-10 z-20 min-w-48 rounded-md border border-line-2 bg-raised p-1 shadow-xl"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="flex w-full items-center rounded-sm px-3 py-2 text-left text-sm text-fg-muted hover:bg-surface-2 hover:text-fg"
                      onClick={async () => {
                        if (navigator.clipboard) await navigator.clipboard.writeText(window.location.href);
                        setMenuOpen(false);
                        toast({ title: "Link copied", kind: "success", desc: "Investigation link copied to your clipboard." });
                      }}
                    >
                      Copy investigation link
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      disabled={deleting}
                      className="flex w-full items-center rounded-sm px-3 py-2 text-left text-sm text-crimson hover:bg-crimson/10 disabled:opacity-50"
                      onClick={() => {
                        setMenuOpen(false);
                        void deleteInvestigation();
                      }}
                    >
                      {deleting ? "Deleting…" : "Delete investigation"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* summary strip */}
        <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Evidence", value: inv.evidenceCount, tone: "text-fg" },
            { label: "Timeline events", value: inv.eventCount, tone: "text-fg" },
            { label: "Contradictions", value: inv.contradictionCount, tone: "text-crimson" },
            { label: "Unknowns", value: inv.unknownCount, tone: "text-amber" },
            { label: "Timeline confidence", value: `${inv.timelineConfidence}%`, tone: "text-verified" },
            { label: "Requires review", value: inv.requiresReview, tone: "text-accent" },
          ].map((m) => (
            <div key={m.label} className="bg-surface px-4 py-3">
              <div className={cn("font-display text-xl font-bold tabular", m.tone)}>{m.value}</div>
              <div className="mt-0.5 text-xs text-fg-dim">{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* selection banner */}
      {(selEvidence || selEvent || selContradiction) && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-accent/30 bg-accent/5 px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm text-fg">
            <GitBranch className="size-4 text-accent" />
            Showing connections across the workspace.{" "}
            <span className="text-fg-dim">{highlight.evidence.size} evidence · {highlight.events.size} events · {highlight.contradictions.size} conflicts highlighted.</span>
          </span>
          <button onClick={clearSelection} className="text-xs text-accent hover:underline">Clear</button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        {/* main column */}
        <div>
          <Panel className="overflow-hidden">
            <div className="px-2 pt-1"><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>
            <div className="p-3 sm:p-4">
              {tab === "timeline" && (
                <Timeline
                  investigation={inv}
                  selectedEvent={selEvent}
                  highlightedEvents={highlight.events}
                  onSelectEvent={selectEvent}
                />
              )}
              {tab === "evidence" && (
                <div className="space-y-2">
                  {inv.evidence.map((e) => {
                    const hl = highlight.evidence.has(e.id);
                    const dim = highlight.evidence.size > 0 && !hl;
                    return (
                      <button
                        key={e.id}
                        onClick={() => selectEvidence(e.id)}
                        onDoubleClick={() => setInspectEvidence(e.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md border p-3 text-left transition-all",
                          selEvidence === e.id ? "border-accent/50 bg-accent/5" : hl ? "border-accent/30 bg-surface-2" : "border-line bg-surface hover:border-line-strong",
                          dim && "opacity-45",
                        )}
                      >
                        <div className="grid size-9 shrink-0 place-items-center rounded-sm border border-line-2 bg-surface-2"><EvidenceIcon type={e.type} /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-mono text-sm text-fg">{e.filename}</span>
                            <StatusBadge status={e.status} />
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-xs text-fg-dim">
                            <span className="uppercase">{e.type}</span> · <span className="font-mono">{e.size}</span> · <span className="font-mono">{e.relevantTime}</span>
                          </div>
                        </div>
                        <div className="hidden items-center gap-1.5 text-xs text-fg-dim sm:flex">
                          <span>{e.relatedEvents.length} events</span>
                          {e.relatedContradictions.length > 0 && <span className="text-crimson">{e.relatedContradictions.length} conflicts</span>}
                        </div>
                        <Button size="sm" variant="ghost" onClick={(ev) => { ev.stopPropagation(); setInspectEvidence(e.id); }}>Inspect</Button>
                      </button>
                    );
                  })}
                </div>
              )}
              {tab === "contradictions" && (
                inv.contradictions.length === 0 ? (
                  <EmptyState icon={<AlertTriangle className="size-6" />} title="No contradictions" description="No conflicting evidence was detected in this reconstruction." />
                ) : (
                  <div className="space-y-3">
                    {inv.contradictions.map((c) => (
                      <ContradictionCard
                        key={c.id}
                        contradiction={c}
                        investigation={inv}
                        selected={selContradiction === c.id}
                        dimmed={highlight.contradictions.size > 0 && !highlight.contradictions.has(c.id)}
                        onSelect={() => { selectContradiction(c.id); setDrawerContradiction(c.id); }}
                      />
                    ))}
                  </div>
                )
              )}
              {tab === "unknowns" && (
                inv.unknowns.length === 0 ? (
                  <EmptyState icon={<HelpCircle className="size-6" />} title="No open unknowns" description="Every evidence gap in this investigation has been resolved." />
                ) : (
                  <div className="space-y-3">
                    {inv.unknowns.map((u) => (
                      <UnknownCard key={u.id} unknown={u} onSelect={() => toast({ title: "Marked investigating", kind: "info", desc: u.title })} onAddEvidence={() => toast({ title: "Add evidence", kind: "info", desc: "Attach a source to this gap." })} />
                    ))}
                  </div>
                )
              )}
              {tab === "relationships" && (
                <RelationshipMap
                  investigation={inv}
                  selectedEvidence={selEvidence}
                  selectedEvent={selEvent}
                  selectedContradiction={selContradiction}
                  onSelectEvidence={selectEvidence}
                  onSelectEvent={selectEvent}
                />
              )}
            </div>
          </Panel>
        </div>

        {/* right rail */}
        <div className="space-y-5">
          <Panel>
            <PanelHeader title="Investigation summary" subtitle="Analytical overview" />
            <div className="flex items-center gap-5 p-5">
              <ConfidenceRing value={inv.confidence} />
              <div className="flex-1 space-y-2.5 text-sm">
                <SummaryRow label="Evidence coverage" value={`${inv.confidence}%`} tone="verified" />
                <SummaryRow label="Timeline confidence" value={`${inv.timelineConfidence}%`} tone="accent" />
                <SummaryRow label="Contradictions" value={String(inv.contradictionCount).padStart(2, "0")} tone="crimson" />
                <SummaryRow label="Unknowns" value={String(inv.unknownCount).padStart(2, "0")} tone="amber" />
                <SummaryRow label="Requires review" value={String(inv.requiresReview).padStart(2, "0")} tone="accent" />
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader
              title="Contradictions"
              icon={<AlertTriangle className="size-4 text-crimson" />}
              actions={<Badge tone="crimson">{String(inv.contradictionCount).padStart(2, "0")}</Badge>}
            />
            <div className="space-y-2.5 p-4">
              {inv.contradictions.length === 0 && <p className="text-sm text-fg-dim">No contradictions detected.</p>}
              {inv.contradictions.slice(0, 3).map((c) => (
                <ContradictionCard
                  key={c.id}
                  contradiction={c}
                  investigation={inv}
                  selected={selContradiction === c.id}
                  dimmed={highlight.contradictions.size > 0 && !highlight.contradictions.has(c.id)}
                  onSelect={() => { selectContradiction(c.id); setDrawerContradiction(c.id); }}
                />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Unknown / evidence gaps" icon={<HelpCircle className="size-4 text-amber" />} actions={<Badge tone="amber">{String(inv.unknownCount).padStart(2, "0")}</Badge>} />
            <div className="space-y-2.5 p-4">
              {inv.unknowns.length === 0 && <p className="text-sm text-fg-dim">No open unknowns.</p>}
              {inv.unknowns.slice(0, 2).map((u) => (
                <div key={u.id} className="rounded-md border border-amber/20 bg-amber/5 p-3">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-amber"><HelpCircle className="size-3" /> {u.window}</div>
                  <h4 className="mt-1 text-sm font-medium text-fg">{u.title}</h4>
                  <p className="mt-0.5 text-xs text-fg-dim">{u.description}</p>
                </div>
              ))}
              <Link to="/app/unknowns" className="block pt-1 text-xs text-accent hover:underline">View all unknowns →</Link>
            </div>
          </Panel>
        </div>
      </div>

      <EvidenceInspector
        evidence={inspectedEv}
        investigation={inv}
        open={!!inspectEvidence}
        onClose={() => setInspectEvidence(null)}
        onSelectEvent={(e) => { setInspectEvidence(null); setTab("timeline"); selectEvent(e); }}
        onSaveNote={() => { toast({ title: "Notes saved", kind: "success" }); }}
      />
      <ContradictionDrawer
        contradiction={drawerCon}
        investigation={inv}
        open={!!drawerContradiction}
        onClose={() => setDrawerContradiction(null)}
        onUpdate={(status) => { toast({ title: `Contradiction ${status}`, kind: status === "resolved" ? "success" : "info" }); setDrawerContradiction(null); }}
      />
    </Page>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone: "verified" | "accent" | "crimson" | "amber" }) {
  const c = { verified: "text-verified", accent: "text-accent", crimson: "text-crimson", amber: "text-amber" }[tone];
  return (
    <div className="flex items-center justify-between border-b border-line pb-2 last:border-0 last:pb-0">
      <span className="text-fg-dim">{label}</span>
      <span className={cn("font-mono tabular font-semibold", c)}>{value}</span>
    </div>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Skeleton className="h-[500px]" />
        <div className="space-y-5">
          <Skeleton className="h-52" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </div>
  );
}
