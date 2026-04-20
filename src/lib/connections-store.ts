// Local connections store — demo-grade, persists in localStorage.
// Lets users "connect" with profiles end-to-end without a friend-request table.
const KEY = "sng:connections:v1";

function read(): Record<string, true> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function write(v: Record<string, true>) {
  localStorage.setItem(KEY, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent("sng:connections-changed"));
}

export function isConnected(memberId: string) {
  return Boolean(read()[memberId]);
}

export function listConnections(): string[] {
  return Object.keys(read());
}

export function toggleConnection(memberId: string): boolean {
  const cur = read();
  if (cur[memberId]) {
    delete cur[memberId];
    write(cur);
    return false;
  }
  cur[memberId] = true;
  write(cur);
  return true;
}

export function subscribeConnections(cb: () => void) {
  window.addEventListener("sng:connections-changed", cb);
  return () => window.removeEventListener("sng:connections-changed", cb);
}
