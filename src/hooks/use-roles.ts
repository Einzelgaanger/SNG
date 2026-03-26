import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/types/sng";

export function useRoles(userId?: string) {
  const query = useQuery({
    queryKey: ["user-roles", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId!);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as AppRole);
    },
  });

  return {
    roles: query.data ?? [],
    isAdmin: query.data?.includes("admin") ?? false,
    isModerator: query.data?.includes("moderator") ?? false,
    isLoading: query.isLoading,
  };
}
