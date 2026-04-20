import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Globe2,
  Handshake,
  MapPin,
  Sparkles,
  UserPlus,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/use-notifications";
import {
  AppNotification,
  relativeTime,
} from "@/lib/notifications-store";

function iconFor(kind: AppNotification["kind"]) {
  switch (kind) {
    case "new_match":
      return Sparkles;
    case "location_overlap":
      return MapPin;
    case "profile_strength":
      return Wand2;
    case "connection":
      return Handshake;
    case "cross_region":
      return Globe2;
    default:
      return Bell;
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, readIds, unreadCount } = useNotifications();

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-header">
          <div>
            <h1 className="app-header-title flex items-center gap-2">
              <Bell className="h-6 w-6 text-primary" /> Notifications
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="app-header-description">
              Autonomous alerts surface the right collaborator at the right moment.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllRead(notifications.map((n) => n.id))}
            >
              <CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read
            </Button>
          )}
        </div>

        <div className="surface-card p-0">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Bell className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                You're all caught up. New matches and overlaps will appear here.
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-260px)]">
              <ul className="divide-y divide-border/40">
                {notifications.map((n) => {
                  const Icon = iconFor(n.kind);
                  const unread = !readIds.has(n.id);
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => {
                          markRead(n.id);
                          if (n.link) navigate(n.link);
                        }}
                        className={`flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-muted/40 sm:px-5 ${
                          unread ? "bg-primary/[0.04]" : ""
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            unread
                              ? "bg-primary/15 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="truncate text-sm font-medium text-foreground">
                              {n.title}
                            </p>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {relativeTime(n.ts)}
                            </span>
                          </div>
                          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {n.body}
                          </p>
                        </div>
                        {unread && (
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
