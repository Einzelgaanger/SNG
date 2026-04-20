// Demo notifications store — persists "read" state in localStorage.
// Notifications are *derived* from matches + connections + profile, so the feed
// always reflects the live database without needing a notifications table.

const READ_KEY = "sng:notifications:read:v1";

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

function readSet(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function writeSet(s: Set<string>) {
  localStorage.setItem(READ_KEY, JSON.stringify(Array.from(s)));
  window.dispatchEvent(new CustomEvent("sng:notifications-read-changed"));
}

export function getReadIds(): Set<string> {
  return readSet();
}

export function markRead(id: string) {
  const s = readSet();
  s.add(id);
  writeSet(s);
}

export function markAllRead(ids: string[]) {
  const s = readSet();
  ids.forEach((id) => s.add(id));
  writeSet(s);
}

export function subscribeRead(cb: () => void) {
  window.addEventListener("sng:notifications-read-changed", cb);
  return () => window.removeEventListener("sng:notifications-read-changed", cb);
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
