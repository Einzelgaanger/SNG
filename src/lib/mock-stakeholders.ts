import type { ArcDatum, FeedPost, InsightCard, ProfileRecord, RegionOption, Stakeholder } from "@/types/sng";

export const regionOptions: RegionOption[] = [
  { value: "North America", label: "North America", city: "New York", lat: 40.7128, lng: -74.006 },
  { value: "Latin America", label: "Latin America", city: "Bogotá", lat: 4.711, lng: -74.0721 },
  { value: "Europe", label: "Europe", city: "Berlin", lat: 52.52, lng: 13.405 },
  { value: "Africa", label: "Africa", city: "Nairobi", lat: -1.2864, lng: 36.8172 },
  { value: "Middle East", label: "Middle East", city: "Dubai", lat: 25.2048, lng: 55.2708 },
  { value: "Asia", label: "Asia", city: "Singapore", lat: 1.3521, lng: 103.8198 },
  { value: "Oceania", label: "Oceania", city: "Sydney", lat: -33.8688, lng: 151.2093 },
];

export const interestCatalog = [
  "Climate",
  "Fintech",
  "Health",
  "Mobility",
  "EdTech",
  "Food Systems",
  "AI",
  "Digital Public Goods",
  "Energy",
  "Trade",
  "Civic Tech",
  "Research",
];

/** Build viewer stakeholder from authenticated profile */
export function buildViewerStakeholder(profile: ProfileRecord): Stakeholder | null {
  if (!profile.onboarding_completed || !profile.region) return null;

  const regionMatch = regionOptions.find((o) => o.value === profile.region) ?? regionOptions[0];
  const metricEntries = Object.entries(profile.impact_metrics ?? {}).filter(([, v]) => v);

  return {
    id: "viewer-profile",
    name: profile.display_name || "You",
    organization: profile.organization_name || "Independent",
    type: profile.stakeholder_type || "other",
    region: profile.region,
    city: profile.city || regionMatch.city,
    country: profile.region,
    lat: regionMatch.lat,
    lng: regionMatch.lng,
    bio: profile.bio || "Your stakeholder profile.",
    interests: profile.interests?.length ? profile.interests : [],
    initiatives: profile.initiatives?.length ? profile.initiatives : [],
    metrics: metricEntries.length
      ? metricEntries.map(([label, value]) => ({ label, value: String(value) }))
      : [{ label: "Status", value: "Active" }],
    score: 95,
    connections: [],
    isViewer: true,
  };
}

/** Returns only the authenticated user's stakeholder (no mock data) */
export function buildStakeholders(profile: ProfileRecord | null): Stakeholder[] {
  const viewer = profile ? buildViewerStakeholder(profile) : null;
  return viewer ? [viewer] : [];
}

/** Build arcs from stakeholder connections */
export function buildArcs(stakeholders: Stakeholder[]): ArcDatum[] {
  const byId = new Map(stakeholders.map((s) => [s.id, s]));
  const seen = new Set<string>();

  return stakeholders.flatMap((s) =>
    s.connections.flatMap((cid) => {
      const target = byId.get(cid);
      if (!target) return [];
      const key = [s.id, cid].sort().join(":");
      if (seen.has(key)) return [];
      seen.add(key);
      return [{
        id: key,
        startLat: s.lat, startLng: s.lng,
        endLat: target.lat, endLng: target.lng,
        color: s.isViewer ? ["#34d399", "#a78bfa"] as [string, string] : ["#34d399", "#60a5fa"] as [string, string],
      }];
    }),
  );
}

/** Generate contextual feed posts for a stakeholder */
export function buildFeedPosts(stakeholder: Stakeholder): FeedPost[] {
  if (!stakeholder) return [];
  return [
    {
      id: `${stakeholder.id}-feed-1`,
      title: `${stakeholder.organization} opened a collaboration window`,
      content: `${stakeholder.name} is seeking aligned partners around ${stakeholder.interests.slice(0, 2).join(" and ") || "innovation"}.`,
      category: "Opportunity",
      timestampLabel: "Recently",
      likes: 0,
      comments: 0,
    },
  ];
}

/** Generate contextual AI insights for a stakeholder */
export function buildInsights(stakeholder: Stakeholder): InsightCard[] {
  if (!stakeholder) return [];
  return [
    {
      id: `${stakeholder.id}-insight-1`,
      kind: "collaboration",
      title: `Potential collaboration around ${stakeholder.interests[0] || "innovation"}`,
      description: `${stakeholder.organization} has geographic and thematic relevance for partnership conversations.`,
      confidence: 94,
    },
    {
      id: `${stakeholder.id}-insight-2`,
      kind: "insight",
      title: "Network position analysis",
      description: `This stakeholder is positioned in a growing corridor with emerging partnership signals.`,
      confidence: 81,
    },
  ];
}
