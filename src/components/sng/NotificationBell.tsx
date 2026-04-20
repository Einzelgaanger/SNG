import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import { markRead, relativeTime } from "@/lib/notifications-store";

export function NotificationBell() {
  const navigate = useNavigate();
  const { notifications, readIds, unreadCount } = useNotifications();
  const recent = notifications.slice(0, 5);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[340px] p-0">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button
            type="button"
            onClick={() => navigate("/app/notifications")}
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {recent.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              You're all caught up.
            </p>
          ) : (
            <ul className="divide-y divide-border/40">
              {recent.map((n) => {
                const unread = !readIds.has(n.id);
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        markRead(n.id);
                        if (n.link) navigate(n.link);
                      }}
                      className={`flex w-full items-start gap-2 px-4 py-3 text-left transition hover:bg-muted/40 ${
                        unread ? "bg-primary/[0.04]" : ""
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">
                          {n.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                          {n.body}
                        </p>
                        <p className="mt-1 text-[10px] text-muted-foreground/70">
                          {relativeTime(n.ts)}
                        </p>
                      </div>
                      {unread && (
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
