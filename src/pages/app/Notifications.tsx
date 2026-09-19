import { Bell, CheckCircle2, AlertTriangle, HelpCircle, Info, Check } from "lucide-react";
import { Page, PageHeader } from "../../components/shell/Page";
import { Button, EmptyState, Panel, StatusDot } from "../../components/ui";
import { cn } from "../../lib/cn";
import { useApp } from "../../store/AppContext";

const iconFor = { success: CheckCircle2, danger: AlertTriangle, warn: HelpCircle, info: Info };
const toneFor = { success: "text-verified", danger: "text-crimson", warn: "text-amber", info: "text-accent" };

export default function Notifications() {
  const { notifications, markRead, markAllRead, unreadCount } = useApp();

  return (
    <Page className="max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
        actions={unreadCount > 0 && <Button variant="secondary" size="sm" icon={<Check className="size-3.5" />} onClick={markAllRead}>Mark all read</Button>}
      />

      {notifications.length === 0 ? (
        <Panel><EmptyState icon={<Bell className="size-6" />} title="No notifications" description="When analyses complete or contradictions are detected, they'll show up here." /></Panel>
      ) : (
        <Panel className="divide-y divide-line overflow-hidden">
          {notifications.map((n) => {
            const Icon = iconFor[n.kind];
            return (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={cn("floating-tile flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-2", !n.read && "bg-accent/[0.03]")}
              >
                <div className="grid size-9 shrink-0 place-items-center rounded-sm border border-line-2 bg-surface-2">
                  <Icon className={cn("size-4.5", toneFor[n.kind])} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-fg">{n.title}</span>
                    {!n.read && <StatusDot tone="accent" />}
                  </div>
                  <p className="mt-0.5 text-sm text-fg-dim">{n.body}</p>
                </div>
                <span className="shrink-0 text-xs text-fg-faint">{n.time}</span>
              </button>
            );
          })}
        </Panel>
      )}
    </Page>
  );
}
