import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { PlusCircle, Search, FolderOpen, RefreshCw } from "lucide-react"
import { Page, PageHeader } from "../../components/shell/Page"
import {
  Button,
  EmptyState,
  Input,
  Panel,
  Select,
  Skeleton,
  StatusBadge,
} from "../../components/ui"
import { investigationService } from "../../lib/services"
import type { Investigation } from "../../lib/types"

export default function Investigations() {
  const nav = useNavigate()
  const [data, setData] = useState<Investigation[] | null>(null)
  const [error, setError] = useState("")
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("updated")
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true)
    setError("")
    try {
      setData(await investigationService.list())
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to load investigations.",
      )
      setData([])
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void load()
    const onFocus = () => void load()
    const onVisible = () => {
      if (document.visibilityState === "visible") void load()
    }
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [load])

  const rows = useMemo(() => {
    let r = (data ?? []).filter(
      (i) =>
        (status === "all" || i.status === status) &&
        i.name.toLowerCase().includes(q.toLowerCase()),
    )
    r = [...r].sort((a, b) =>
      sort === "confidence"
        ? b.confidence - a.confidence
        : sort === "evidence"
          ? b.evidenceCount - a.evidenceCount
          : 0,
    )
    return r
  }, [data, q, status, sort])

  return (
    <Page>
      <PageHeader
        title="Investigations"
        subtitle="All cases across your workspace."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              loading={refreshing}
              disabled={refreshing}
              icon={<RefreshCw className="size-3.5" />}
              onClick={() => void load(true)}
            >
              Refresh
            </Button>
            <Link to="/app/investigations/new">
              <Button variant="primary" icon={<PlusCircle className="size-4" />}>
                New Investigation
              </Button>
            </Link>
          </div>
        }
      />
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-dim" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search cases…"
            className="pl-9"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All status</option>
          <option value="complete">Completed</option>
          <option value="analyzing">Analyzing</option>
          <option value="ready">Ready</option>
          <option value="error">Error</option>
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="updated">Sort: Recent</option>
          <option value="confidence">Sort: Confidence</option>
          <option value="evidence">Sort: Evidence</option>
        </Select>
      </div>
      {error && (
        <div
          role="alert"
          className="mb-4 flex flex-col gap-2 rounded-md border border-crimson/30 bg-crimson/10 p-3 text-sm text-crimson sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <Button variant="secondary" size="sm" onClick={() => void load(true)}>Try again</Button>
        </div>
      )}
      {!data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<FolderOpen className="size-6" />}
            title="No matching investigations"
            description="Create an investigation or adjust the current filters."
            action={
              <Link to="/app/investigations/new">
                <Button
                  variant="primary"
                  icon={<PlusCircle className="size-4" />}
                >
                  New Investigation
                </Button>
              </Link>
            }
          />
        </Panel>
      ) : (
        <Panel className="overflow-hidden">
          <div className="hidden overflow-x-auto scroll-thin md:block">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                  {["Case", "Created", "Updated", "Evidence", "Events", "Conflicts", "Unknowns", "Status"].map((h, i) => (
                    <th key={h} className={`px-4 py-2.5 font-normal ${i >= 3 && i <= 6 ? "text-right" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => nav(`/app/investigations/${inv.id}`)}
                    className="group cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-surface-2"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-fg group-hover:text-accent">{inv.name}</div>
                      <div className="max-w-xs truncate text-xs text-fg-dim">{inv.description}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-fg-dim">{inv.createdAt}</td>
                    <td className="px-4 py-3 text-xs text-fg-dim">{inv.updatedLabel}</td>
                    <td className="px-4 py-3 text-right font-mono tabular text-fg-muted">{inv.evidenceCount}</td>
                    <td className="px-4 py-3 text-right font-mono tabular text-fg-muted">{inv.eventCount}</td>
                    <td className="px-4 py-3 text-right font-mono tabular text-crimson">{inv.contradictionCount}</td>
                    <td className="px-4 py-3 text-right font-mono tabular text-amber">{inv.unknownCount}</td>
                    <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-line md:hidden">
            {rows.map((inv) => (
              <button
                key={inv.id}
                type="button"
                onClick={() => nav(`/app/investigations/${inv.id}`)}
                className="w-full px-4 py-4 text-left transition-colors hover:bg-surface-2 focus:outline-none focus-visible:bg-surface-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-fg">{inv.name}</div>
                    <div className="mt-0.5 truncate text-xs text-fg-dim">{inv.description}</div>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                  <div><span className="block font-mono tabular text-fg">{inv.evidenceCount}</span><span className="text-fg-faint">Evidence</span></div>
                  <div><span className="block font-mono tabular text-fg">{inv.eventCount}</span><span className="text-fg-faint">Events</span></div>
                  <div><span className="block font-mono tabular text-crimson">{inv.contradictionCount}</span><span className="text-fg-faint">Conflicts</span></div>
                  <div><span className="block font-mono tabular text-amber">{inv.unknownCount}</span><span className="text-fg-faint">Unknowns</span></div>
                </div>
                <div className="mt-2 text-[11px] text-fg-faint">Updated {inv.updatedLabel}</div>
              </button>
            ))}
          </div>
        </Panel>
      )}
    </Page>
  )
}
