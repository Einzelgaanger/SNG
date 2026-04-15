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
  const timeLabels = ["Just now", "2h ago", "Yesterday", "3 days ago", "Last week"];
  const categories = ["Opportunity", "Update", "Milestone", "Partnership", "Research"];

  const posts: FeedPost[] = [
    {
      id: `${stakeholder.id}-feed-1`,
      title: `${stakeholder.organization} opened a collaboration window`,
      content: `${stakeholder.name} is seeking aligned partners around ${stakeholder.interests.slice(0, 2).join(" and ") || "innovation"}.`,
      category: categories[0],
      timestampLabel: timeLabels[0],
      likes: Math.floor(Math.random() * 24) + 3,
      comments: Math.floor(Math.random() * 8),
    },
    {
      id: `${stakeholder.id}-feed-2`,
      title: `New impact milestone reached`,
      content: `${stakeholder.organization} has reported significant progress in their ${stakeholder.initiatives[0] || "primary initiative"}.`,
      category: categories[2],
      timestampLabel: timeLabels[1],
      likes: Math.floor(Math.random() * 40) + 10,
      comments: Math.floor(Math.random() * 12) + 2,
    },
    {
      id: `${stakeholder.id}-feed-3`,
      title: `${stakeholder.name} shared a regional update`,
      content: `Insights from the ${stakeholder.region} ecosystem on trends in ${stakeholder.interests[0] || "innovation"} and cross-sector collaboration.`,
      category: categories[1],
      timestampLabel: timeLabels[2],
      likes: Math.floor(Math.random() * 18) + 5,
      comments: Math.floor(Math.random() * 6) + 1,
    },
  ];

  return posts;
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
      description: `This stakeholder is positioned in a growing corridor with ${stakeholder.connections.length} active connections and emerging partnership signals.`,
      confidence: 81,
    },
    {
      id: `${stakeholder.id}-insight-3`,
      kind: "funding",
      title: `Funding landscape in ${stakeholder.region}`,
      description: `${stakeholder.region} shows increasing deal flow in ${stakeholder.interests.slice(0, 2).join(" and ") || "key sectors"} with growing institutional interest.`,
      confidence: 76,
    },
    {
      id: `${stakeholder.id}-insight-4`,
      kind: "introduction",
      title: `Warm introduction pathway identified`,
      description: `Based on shared interests in ${stakeholder.interests[0] || "innovation"}, there are mutual connections that could facilitate an introduction.`,
      confidence: 88,
    },
  ];
}
