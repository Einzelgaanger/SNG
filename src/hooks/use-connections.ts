import { useEffect, useState, useCallback } from "react";
import {
  isConnected,
  listConnections,
  subscribeConnections,
  toggleConnection,
} from "@/lib/connections-store";

export function useConnections() {
  const [ids, setIds] = useState<string[]>(() => listConnections());

  useEffect(() => {
    const unsub = subscribeConnections(() => setIds(listConnections()));
    return unsub;
  }, []);

  const toggle = useCallback((id: string) => toggleConnection(id), []);
  const has = useCallback((id: string) => isConnected(id), [ids]);

  return { ids, count: ids.length, has, toggle };
}
