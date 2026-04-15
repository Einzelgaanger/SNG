import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Stakeholder, StakeholderType } from "@/types/sng";

interface NetworkMemberRow {
  id: string;
  profile_user_id: string | null;
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
  initiatives: string[];
  impact_metrics: Record<string, string | number | null>;
  score: number;
  connections: string[];
}

function rowToStakeholder(row: NetworkMemberRow, viewerUserId?: string): Stakeholder {
  const metricEntries = Object.entries(row.impact_metrics ?? {}).filter(([, v]) => v);

  return {
    id: row.id,
    name: row.display_name,
    organization: row.organization_name,
    type: row.stakeholder_type,
    region: row.region,
    city: row.city,
    country: row.country,
    lat: row.lat,
    lng: row.lng,
    bio: row.bio || "",
    interests: row.interests ?? [],
    initiatives: row.initiatives ?? [],
    metrics: metricEntries.length
      ? metricEntries.map(([label, value]) => ({ label, value: String(value) }))
      : [{ label: "Status", value: "Active" }],
    score: row.score,
    connections: row.connections ?? [],
    isViewer: Boolean(viewerUserId && row.profile_user_id === viewerUserId),
  };
}

export function useNetworkMembers(viewerUserId?: string) {
  return useQuery({
    queryKey: ["network-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("network_members")
        .select("*")
        .eq("is_active", true)
        .order("score", { ascending: false });

      if (error) throw error;

      return (data as unknown as NetworkMemberRow[]).map((row) =>
        rowToStakeholder(row, viewerUserId)
      );
    },
    enabled: Boolean(viewerUserId),
  });
}
