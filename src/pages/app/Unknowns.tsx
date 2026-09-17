import { useEffect, useState } from "react"
import { HelpCircle } from "lucide-react"
import { Page, PageHeader } from "../../components/shell/Page"
import { Badge, EmptyState, Panel, Skeleton } from "../../components/ui"
import { UnknownCard } from "../../components/investigation/panels"
import { investigationService } from "../../lib/services"
import type { Investigation } from "../../lib/types"
import { useApp } from "../../store/AppContext"

export default function Unknowns() {
  const { toast } = useApp()
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
            : "Unable to load evidence gaps.",
        )
        setInv(null)
      })
  }, [])
  return (
    <Page>
      <PageHeader
        eyebrow={inv?.name}
        title={
          <span className="flex items-center gap-3">
            Unknown / evidence gaps{" "}
            <Badge tone="amber">
              {String(inv?.unknowns.length ?? 0).padStart(2, "0")}
            </Badge>
          </span>
        }
        subtitle="What the evidence cannot yet establish in your most recently updated investigation."
      />
      {error && (
        <p role="alert" className="mb-4 text-sm text-crimson">
          {error}
        </p>
      )}
      {inv === undefined ? (
        <Skeleton className="h-52" />
      ) : !inv || inv.unknowns.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<HelpCircle className="size-6" />}
            title="No unknowns"
            description="No real analysis gaps are available to review."
          />
        </Panel>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {inv.unknowns.map((item) => (
            <UnknownCard
              key={item.id}
              unknown={item}
              onSelect={() =>
                toast({
                  title: "Marked investigating",
                  kind: "info",
                  desc: item.title,
                })
              }
              onAddEvidence={() =>
                toast({
                  title: "Add evidence",
                  kind: "info",
                  desc: "Create a new investigation intake to add a source.",
                })
              }
            />
          ))}
        </div>
      )}
    </Page>
  )
}
