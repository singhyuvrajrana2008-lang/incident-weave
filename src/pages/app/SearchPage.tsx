import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search as SearchIcon,
  Folder,
  FileText,
  AlertTriangle,
  HelpCircle,
  Clock,
  Command,
} from "lucide-react"
import { Page, PageHeader } from "../../components/shell/Page"
import { EmptyState, Input, Panel } from "../../components/ui"
import { investigationService } from "../../lib/services"
import type { Investigation } from "../../lib/types"
import { useApp } from "../../store/AppContext"

interface Row {
  id: string
  group: string
  label: string
  sub: string
  icon: typeof Folder
  to: string
}

export default function SearchPage() {
  const nav = useNavigate()
  const { setPaletteOpen } = useApp()
  const [q, setQ] = useState("")
  const [investigations, setInvestigations] = useState<Investigation[]>([])

  useEffect(() => {
    let mounted = true
    investigationService
      .list()
      .then(async (rows) => {
        const full = await Promise.all(
          rows.map((row) => investigationService.get(row.id)),
        )
        if (mounted)
          setInvestigations(
            full.filter((row): row is Investigation => Boolean(row)),
          )
      })
      .catch(() => {
        if (mounted) setInvestigations([])
      })
    return () => {
      mounted = false
    }
  }, [])

  const all = useMemo<Row[]>(() => {
    const out: Row[] = []
    for (const inv of investigations) {
      out.push({
        id: inv.id,
        group: "Investigations",
        label: inv.name,
        sub: `${inv.evidenceCount} evidence · ${inv.status}`,
        icon: Folder,
        to: `/app/investigations/${inv.id}`,
      })
      inv.evidence.forEach((e) =>
        out.push({
          id: inv.id + e.id,
          group: "Evidence",
          label: e.filename,
          sub: `${inv.name} · ${e.relevantTime}`,
          icon: FileText,
          to: `/app/investigations/${inv.id}?tab=evidence`,
        }),
      )
      inv.events.forEach((e) =>
        out.push({
          id: inv.id + e.id,
          group: "Timeline events",
          label: e.title,
          sub: `${inv.name} · ${e.time}`,
          icon: Clock,
          to: `/app/investigations/${inv.id}?tab=timeline`,
        }),
      )
      inv.contradictions.forEach((c) =>
        out.push({
          id: inv.id + c.id,
          group: "Contradictions",
          label: c.title,
          sub: `${inv.name} · ${c.code}`,
          icon: AlertTriangle,
          to: `/app/investigations/${inv.id}?tab=contradictions`,
        }),
      )
      inv.unknowns.forEach((u) =>
        out.push({
          id: inv.id + u.id,
          group: "Unknowns",
          label: u.title,
          sub: `${inv.name} · ${u.window}`,
          icon: HelpCircle,
          to: `/app/investigations/${inv.id}?tab=unknowns`,
        }),
      )
    }
    return out
  }, [investigations])

  const results = useMemo(() => {
    if (!q.trim()) return []
    const lc = q.toLowerCase()
    return all.filter(
      (r) =>
        r.label.toLowerCase().includes(lc) || r.sub.toLowerCase().includes(lc),
    )
  }, [q, all])

  const grouped = useMemo(() => {
    const m = new Map<string, Row[]>()
    results.forEach((r) => m.set(r.group, [...(m.get(r.group) ?? []), r]))
    return [...m.entries()]
  }, [results])

  return (
    <Page>
      <PageHeader
        title="Search"
        subtitle="Search across investigations, evidence, timeline events, contradictions, and unknowns."
      />

      <div className="relative mb-5">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-fg-dim" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search everything…"
          className="h-12 pl-11 text-base"
        />
        <button
          onClick={() => setPaletteOpen(true)}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-xs border border-line-2 px-1.5 py-1 font-mono text-[10px] text-fg-dim"
        >
          <Command className="size-3" />K
        </button>
      </div>

      {!q.trim() ? (
        <Panel>
          <EmptyState
            icon={<SearchIcon className="size-6" />}
            title="Start typing to search"
            description="Results are grouped by type. Press Enter on a result to open it, or use ⌘/Ctrl + K anywhere for the command palette."
          />
        </Panel>
      ) : results.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<SearchIcon className="size-6" />}
            title={`No results for "${q}"`}
            description="Try a different term, filename, timestamp, or contradiction code."
          />
        </Panel>
      ) : (
        <div className="space-y-5">
          {grouped.map(([group, items]) => (
            <div key={group}>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                  {group}
                </h3>
                <span className="font-mono text-[10px] text-fg-faint">
                  ({items.length})
                </span>
              </div>
              <Panel className="divide-y divide-line overflow-hidden">
                {items.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => nav(r.to)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-2"
                  >
                    <r.icon className="size-4 shrink-0 text-fg-dim" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-fg">{r.label}</div>
                      <div className="truncate text-xs text-fg-dim">
                        {r.sub}
                      </div>
                    </div>
                  </button>
                ))}
              </Panel>
            </div>
          ))}
        </div>
      )}
    </Page>
  )
}
