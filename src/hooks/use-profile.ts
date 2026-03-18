import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { ProfileRecord } from "@/types/sng";

export function useProfile(userId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return (data ?? null) as ProfileRecord | null;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: Partial<ProfileRecord>) => {
      if (!userId) {
        throw new Error("Missing authenticated user");
      }

      const { data, error } = await (supabase as any)
        .from("profiles")
        .upsert(
          {
            user_id: userId,
            ...payload,
          },
          { onConflict: "user_id" },
        )
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data as ProfileRecord;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", userId], profile);
    },
  });

  return {
    ...query,
    updateProfile: updateMutation.mutateAsync,
    isSaving: updateMutation.isPending,
  };
}
