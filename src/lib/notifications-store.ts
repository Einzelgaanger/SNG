// Notification helpers — read state is now persisted in the database
// via `useNotificationReads`. This module just exposes the type and the
// relative-time formatter (still used everywhere).

export type NotificationKind =
  | "new_match"
  | "location_overlap"
  | "profile_strength"
  | "connection"
  | "cross_region"
  | "welcome";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  ts: number; // ms epoch (used for sort + relative time)
  link?: string;
  meta?: Record<string, string | number>;
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}
