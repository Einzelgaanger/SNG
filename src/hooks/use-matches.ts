import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { StakeholderType } from "@/types/sng";

export interface MatchRow {
  member_id: string;
  display_name: string;
  organization_name: string;
  stakeholder_type: StakeholderType;
  region: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  bio: string | null;
  interests: string[];
  score: number;
  match_score: number;
  shared_interests: string[];
  match_reasons: string[];
}

export function useMatches(userId?: string, limit = 24) {
  return useQuery({
    queryKey: ["matches", userId, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("find_matches", {
        _user_id: userId!,
        _limit: limit,
      });
      if (error) throw error;
      return (data ?? []) as unknown as MatchRow[];
    },
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}
