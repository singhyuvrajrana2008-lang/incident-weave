import { useEffect, useMemo, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Page, PageHeader } from "../../components/shell/Page"
import { Badge, EmptyState, Panel, Select, Skeleton } from "../../components/ui"
import { ContradictionCard } from "../../components/investigation/panels"
import { ContradictionDrawer } from "../../components/investigation/drawers"
import { investigationService } from "../../lib/services"
import type { Investigation } from "../../lib/types"
import { useApp } from "../../store/AppContext"

export default function Contradictions() {
  const { toast } = useApp()
  const [filter, setFilter] = useState("all")
  const [open, setOpen] = useState<string | null>(null)
  const [inv, setInv] = useState<Investigation | null | undefined>(undefined)
  const [error, setError] = useState("")
  useEffect(() => {
    investigationService
      .list()
      .then((rows) => (rows[0] ? investigationService.get(rows[0].id) : null))
      .then(setInv)
      .catch((reason) => {
        setError(
          reason instanceof Error
            ? reason.message
            : "Unable to load contradictions.",
        )
        setInv(null)
      })
  }, [])
  const rows = useMemo(
    () =>
      inv?.contradictions.filter(
        (item) => filter === "all" || item.status === filter,
      ) ?? [],
    [filter, inv],
  )
  const drawerCon = inv?.contradictions.find((item) => item.id === open) ?? null
  return (
    <Page>
      <PageHeader
        eyebrow={inv?.name}
        title={
          <span className="flex items-center gap-3">
            Contradictions{" "}
            <Badge tone="crimson">{String(rows.length).padStart(2, "0")}</Badge>
          </span>
        }
        subtitle="Conflicting evidence from your most recently updated investigation."
        actions={
          <Select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
          </Select>
        }
      />
      {error && (
        <p role="alert" className="mb-4 text-sm text-crimson">
          {error}
        </p>
      )}
      {inv === undefined ? (
        <Skeleton className="h-52" />
      ) : rows.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<AlertTriangle className="size-6" />}
            title="No contradictions"
            description="No real analysis findings match this filter."
          />
        </Panel>
      ) : inv ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((item) => (
            <ContradictionCard
              key={item.id}
              contradiction={item}
              investigation={inv}
              selected={open === item.id}
              onSelect={() => setOpen(item.id)}
            />
          ))}
        </div>
      ) : null}
      {inv && (
        <ContradictionDrawer
          contradiction={drawerCon}
          investigation={inv}
          open={!!open}
          onClose={() => setOpen(null)}
          onUpdate={(status) => {
            toast({
              title: `Contradiction ${status}`,
              kind: status === "resolved" ? "success" : "info",
            })
            setOpen(null)
          }}
        />
      )}
    </Page>
  )
}
