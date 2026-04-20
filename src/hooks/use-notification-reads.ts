// DB-backed notification read state. Falls back gracefully if offline.
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export function useNotificationReads() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["notification-reads", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("notification_reads")
        .select("notification_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return new Set<string>((data ?? []).map((r: { notification_id: string }) => r.notification_id));
    },
  });

  const readIds = query.data ?? new Set<string>();

  const markReadMutation = useMutation({
    mutationFn: async (notificationIds: string[]) => {
      if (!user?.id || notificationIds.length === 0) return;
      const rows = notificationIds.map((notification_id) => ({
        user_id: user.id,
        notification_id,
      }));
      const { error } = await (supabase as any)
        .from("notification_reads")
        .upsert(rows, { onConflict: "user_id,notification_id", ignoreDuplicates: true });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notification-reads", user?.id] }),
  });

  const markRead = useCallback((id: string) => markReadMutation.mutate([id]), [markReadMutation]);
  const markAllRead = useCallback(
    (ids: string[]) => {
      const fresh = ids.filter((id) => !readIds.has(id));
      if (fresh.length === 0) return;
      markReadMutation.mutate(fresh);
    },
    [markReadMutation, readIds],
  );

  return { readIds, markRead, markAllRead };
}
