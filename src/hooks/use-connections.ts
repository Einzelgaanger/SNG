// DB-backed connections — replaces the localStorage demo store.
// Mirrors the previous API: { ids, count, has, toggle } so all callers keep working.
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface ConnectionRow {
  id: string;
  member_id: string;
  created_at: string;
}

export function useConnections() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["connections", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("connections")
        .select("id, member_id, created_at")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []) as ConnectionRow[];
    },
  });

  const ids = (query.data ?? []).map((c) => c.member_id);

  const toggleMutation = useMutation({
    mutationFn: async (memberId: string) => {
      if (!user?.id) throw new Error("Not signed in");
      const existing = (query.data ?? []).find((c) => c.member_id === memberId);
      if (existing) {
        const { error } = await (supabase as any)
          .from("connections")
          .delete()
          .eq("id", existing.id);
        if (error) throw error;
        return false;
      }
      const { error } = await (supabase as any)
        .from("connections")
        .insert({ user_id: user.id, member_id: memberId });
      if (error) throw error;
      return true;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["connections", user?.id] }),
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update connection"),
  });

  const has = useCallback((id: string) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: string): boolean => {
      // Optimistic prediction so UI flips immediately. Real value resolved on settle.
      const willConnect = !ids.includes(id);
      toggleMutation.mutate(id);
      return willConnect;
    },
    [ids, toggleMutation],
  );

  return {
    ids,
    count: ids.length,
    has,
    toggle,
    isLoading: query.isLoading,
  };
}
