import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  PlusCircle,
  ArrowUpRight,
  FileSearch,
  Clock,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import {
  Button,
  Panel,
  PanelHeader,
  StatusBadge,
  Progress,
  ConfidenceRing,
  Skeleton,
  Badge,
} from "../../components/ui";
import { cn } from "../../lib/cn";
import { investigationService } from "../../lib/services";
import type { Investigation } from "../../lib/types";
import { useApp } from "../../store/AppContext";

const activityTone = { info: "accent", warn: "amber", success: "verified", danger: "crimson" } as const;

export default function Dashboard() {
  const { session } = useApp();
  const nav = useNavigate();
  const [data, setData] = useState<Investigation[] | null>(null);

  useEffect(() => {
    investigationService.list().then(setData);
  }, []);

  const primary = data?.[0];

  return (
    <Page>
      <PageHeader
        eyebrow="Investigation Command Center"
        title={`Welcome back, ${session?.name?.split(" ")[0] ?? "Investigator"}`}
        subtitle="Monitor active investigations and unresolved evidence."
        actions={
          <Link to="/app/investigations/new">
            <Button variant="primary" icon={<PlusCircle className="size-4" />}>New Investigation</Button>
          </Link>
        }
      />

      {!data ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-5">
          {/* Primary active investigation */}
          {primary && (
            <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
              <Panel className="overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-fg-faint">Active investigation</span>
                      <StatusBadge status={primary.status} />
                    </div>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-fg">{primary.name}</h2>
                    <p className="mt-1 text-sm text-fg-dim">Updated {primary.updatedAt}</p>
                  </div>
                  <Link to={`/app/investigations/${primary.id}`}>
                    <Button variant="secondary" icon={<ArrowUpRight className="size-4" />}>Open workspace</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
                  {[
                    { label: "Evidence", value: primary.evidenceCount, icon: FileSearch, tone: "text-accent-3" },
                    { label: "Timeline events", value: primary.eventCount, icon: Clock, tone: "text-accent" },
                    { label: "Contradictions", value: primary.contradictionCount, icon: AlertTriangle, tone: "text-crimson" },
                    { label: "Unknowns", value: primary.unknownCount, icon: HelpCircle, tone: "text-amber" },
                  ].map((m) => (
                    <div key={m.label} className="border-t border-line p-5 sm:border-t-0">
                      <m.icon className={cn("size-4", m.tone)} />
                      <div className="mt-2.5 font-display text-3xl font-bold tabular text-fg">{String(m.value).padStart(2, "0")}</div>
                      <div className="mt-0.5 text-xs text-fg-dim">{m.label}</div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Evidence summary */}
              <Panel>
                <PanelHeader title="Evidence coverage" subtitle="Live investigation signals" />
                <div className="p-5">
                  <div className="flex items-center gap-5">
                    <ConfidenceRing value={primary.confidence} label="Confidence" />
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div className="flex items-center justify-between rounded-sm border border-line bg-surface-2/60 px-3 py-2.5">
                        <span className="text-xs text-fg-dim">Sources</span>
                        <span className="font-mono text-sm font-semibold tabular text-fg">{primary.evidenceCount}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-sm border border-line bg-surface-2/60 px-3 py-2.5">
                        <span className="text-xs text-fg-dim">Timeline events</span>
                        <span className="font-mono text-sm font-semibold tabular text-fg">{primary.eventCount}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-sm border border-line bg-surface-2/60 px-3 py-2.5">
                        <span className="text-xs text-fg-dim">Needs review</span>
                        <span className={cn(
                          "font-mono text-sm font-semibold tabular",
                          primary.requiresReview > 0 ? "text-amber" : "text-verified",
                        )}>
                          {primary.requiresReview}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-full bg-surface-3">
                    <motion.div
                      className="h-1.5 rounded-full bg-verified"
                      initial={{ width: 0 }}
                      animate={{ width: `${primary.confidence}%` }}
                      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-fg-faint">Analysis confidence</span>
                    <span className="font-mono tabular text-verified">{primary.confidence}%</span>
                  </div>
                </div>
              </Panel>            </div>
          )}

          {/* Recent investigations + activity */}
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <Panel className="overflow-hidden">
              <PanelHeader
                title="Recent investigations"
                actions={<Link to="/app/investigations" className="text-xs text-accent hover:underline">View all</Link>}
              />
              <div className="overflow-x-auto scroll-thin">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                      <th className="px-5 py-2.5 font-normal">Case</th>
                      <th className="px-3 py-2.5 font-normal">Status</th>
                      <th className="px-3 py-2.5 text-right font-normal">Evidence</th>
                      <th className="px-3 py-2.5 text-right font-normal">Conflicts</th>
                      <th className="px-3 py-2.5 text-right font-normal">Unknowns</th>
                      <th className="px-3 py-2.5 text-right font-normal">Confidence</th>
                      <th className="px-5 py-2.5 text-right font-normal">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => nav(`/app/investigations/${inv.id}`)}
                        className="group cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-surface-2"
                      >
                        <td className="px-5 py-3">
                          <div className="font-medium text-fg group-hover:text-accent">{inv.name}</div>
                        </td>
                        <td className="px-3 py-3"><StatusBadge status={inv.status} /></td>
                        <td className="px-3 py-3 text-right font-mono tabular text-fg-muted">{inv.evidenceCount}</td>
                        <td className="px-3 py-3 text-right font-mono tabular">
                          <span className={inv.contradictionCount ? "text-crimson" : "text-fg-dim"}>{inv.contradictionCount}</span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono tabular">
                          <span className={inv.unknownCount ? "text-amber" : "text-fg-dim"}>{inv.unknownCount}</span>
                        </td>
                        <td className="px-3 py-3 text-right font-mono tabular text-fg">{inv.confidence ? `${inv.confidence}%` : "—"}</td>
                        <td className="px-5 py-3 text-right text-xs text-fg-dim">{inv.updatedLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel>
              <PanelHeader title="Activity" subtitle="Latest across your workspace" />
              <div className="p-5">
                {primary?.activity?.length ? (
                  <div className="relative space-y-4 pl-5">
                    <div className="absolute bottom-1.5 left-[5px] top-1.5 w-px bg-line" />
                    {primary.activity.map((a, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="relative"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -left-5 top-1 size-2.5 rounded-full ring-4 ring-surface",
                            activityTone[a.kind] === "accent" && "bg-accent",
                            activityTone[a.kind] === "amber" && "bg-amber",
                            activityTone[a.kind] === "verified" && "bg-verified",
                            activityTone[a.kind] === "crimson" && "bg-crimson",
                          )}
                        />
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-xs tabular text-fg-dim">{a.time}</span>
                        </div>
                        <p className="text-sm text-fg-muted">{a.text}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-32 flex-col items-center justify-center rounded-md border border-dashed border-line-2 bg-surface-2/40 px-4 text-center">
                    <div className="mb-2 grid size-9 place-items-center rounded-sm border border-line-2 bg-surface text-fg-dim">
                      <Clock className="size-4" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium text-fg-muted">No recent activity</p>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-fg-faint">
                      Activity will appear here as investigations are created, analyzed, and reviewed.
                    </p>
                  </div>
                )}
              </div>
            </Panel>
          </div>

          {/* quick links */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { to: "/app/contradictions", label: "Review contradictions", desc: "Resolve conflicting evidence", icon: AlertTriangle, tone: "text-crimson", badge: "3 open" },
              { to: "/app/unknowns", label: "Investigate unknowns", desc: "Close evidence gaps", icon: HelpCircle, tone: "text-amber", badge: "5 open" },
              { to: "/app/evidence", label: "Browse evidence", desc: "Explore all sources", icon: FileSearch, tone: "text-accent" },
            ].map((q) => (
              <Link key={q.to} to={q.to} className="group flex items-center gap-4 rounded-md border border-line bg-surface p-4 transition-colors hover:border-line-strong">
                <div className="grid size-10 place-items-center rounded-md border border-line-2 bg-surface-2">
                  <q.icon className={cn("size-5", q.tone)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-fg">{q.label}</span>
                    {q.badge && <Badge tone="neutral">{q.badge}</Badge>}
                  </div>
                  <p className="text-xs text-fg-dim">{q.desc}</p>
                </div>
                <ArrowRight className="size-4 text-fg-dim transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </Page>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}
