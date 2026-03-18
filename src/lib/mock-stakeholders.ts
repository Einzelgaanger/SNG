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

const baseStakeholders: Stakeholder[] = [
  {
    id: "stk-1",
    name: "Amina Okoye",
    organization: "Civic Future Lab",
    type: "nonprofit",
    region: "Africa",
    city: "Lagos",
    country: "Nigeria",
    lat: 6.5244,
    lng: 3.3792,
    bio: "Builds public-interest partnerships across climate resilience, youth employment, and digital inclusion.",
    interests: ["Climate", "Civic Tech", "Digital Public Goods"],
    initiatives: ["Urban resilience accelerator", "Public data fellowship"],
    metrics: [
      { label: "Programs", value: "14 active" },
      { label: "Partners", value: "38 orgs" },
      { label: "Communities", value: "210k reached" },
    ],
    score: 92,
    connections: ["stk-4", "stk-8", "stk-10"],
  },
  {
    id: "stk-2",
    name: "Lucas Meyer",
    organization: "Helix Ventures",
    type: "investor",
    region: "Europe",
    city: "Zurich",
    country: "Switzerland",
    lat: 47.3769,
    lng: 8.5417,
    bio: "Backs frontier partnerships at the intersection of climate, industry, and university spinouts.",
    interests: ["Climate", "Energy", "AI"],
    initiatives: ["Industrial decarbonization fund", "University venture bridge"],
    metrics: [
      { label: "AUM", value: "$420M" },
      { label: "Portfolio", value: "32 companies" },
      { label: "Co-investors", value: "19 networks" },
    ],
    score: 88,
    connections: ["stk-3", "stk-5", "stk-9"],
  },
  {
    id: "stk-3",
    name: "Dr. Hana Sato",
    organization: "Pacific Systems University",
    type: "university",
    region: "Asia",
    city: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lng: 139.6503,
    bio: "Leads translational research programs that connect academic labs with investors and civic institutions.",
    interests: ["Research", "Health", "AI"],
    initiatives: ["Cross-border lab consortium", "Health diagnostics pilot"],
    metrics: [
      { label: "Labs", value: "11 linked" },
      { label: "Students", value: "3.4k" },
      { label: "Patents", value: "57 pending" },
    ],
    score: 90,
    connections: ["stk-2", "stk-6", "stk-12"],
  },
  {
    id: "stk-4",
    name: "Maya Chen",
    organization: "Open Mobility Grid",
    type: "entrepreneur",
    region: "North America",
    city: "San Francisco",
    country: "United States",
    lat: 37.7749,
    lng: -122.4194,
    bio: "Builds interoperable mobility systems with public agencies and climate infrastructure partners.",
    interests: ["Mobility", "Climate", "AI"],
    initiatives: ["EV corridor intelligence", "Transit demand pilot"],
    metrics: [
      { label: "Pilots", value: "8 live" },
      { label: "Cities", value: "12 connected" },
      { label: "Capital", value: "$24M raised" },
    ],
    score: 85,
    connections: ["stk-1", "stk-7", "stk-11"],
  },
  {
    id: "stk-5",
    name: "Sofia Alvarez",
    organization: "Andes Trade Ministry",
    type: "government",
    region: "Latin America",
    city: "Santiago",
    country: "Chile",
    lat: -33.4489,
    lng: -70.6693,
    bio: "Coordinates innovation procurement and market access programs for regional growth sectors.",
    interests: ["Trade", "Food Systems", "Energy"],
    initiatives: ["Green export corridor", "SME procurement lab"],
    metrics: [
      { label: "Programs", value: "6 national" },
      { label: "Budget", value: "$76M" },
      { label: "SMEs", value: "1.1k engaged" },
    ],
    score: 83,
    connections: ["stk-2", "stk-8", "stk-13"],
  },
  {
    id: "stk-6",
    name: "Owen Walsh",
    organization: "Northern BioSystems",
    type: "corporate",
    region: "Europe",
    city: "Dublin",
    country: "Ireland",
    lat: 53.3498,
    lng: -6.2603,
    bio: "Operates global R&D partnerships focused on health diagnostics and advanced manufacturing.",
    interests: ["Health", "Research", "Energy"],
    initiatives: ["Diagnostics scale-up", "Biomanufacturing coalition"],
    metrics: [
      { label: "Employees", value: "5.2k" },
      { label: "Sites", value: "17 globally" },
      { label: "Active MOUs", value: "26" },
    ],
    score: 86,
    connections: ["stk-3", "stk-9", "stk-14"],
  },
  {
    id: "stk-7",
    name: "Talia Ben-David",
    organization: "Desert Spark Fund",
    type: "investor",
    region: "Middle East",
    city: "Tel Aviv",
    country: "Israel",
    lat: 32.0853,
    lng: 34.7818,
    bio: "Invests in frontier deep-tech and regional innovation corridors with strategic corporate partners.",
    interests: ["AI", "Energy", "Mobility"],
    initiatives: ["Deep-tech access program", "Cross-border commercialization"],
    metrics: [
      { label: "Deployments", value: "21 deals" },
      { label: "Fund size", value: "$190M" },
      { label: "Accelerators", value: "5 partners" },
    ],
    score: 84,
    connections: ["stk-4", "stk-10", "stk-15"],
  },
  {
    id: "stk-8",
    name: "Kwame Mensah",
    organization: "Pan-African Innovation Forum",
    type: "nonprofit",
    region: "Africa",
    city: "Accra",
    country: "Ghana",
    lat: 5.6037,
    lng: -0.187,
    bio: "Connects funders, ministries, and ecosystem builders around investment-ready civic innovation.",
    interests: ["Civic Tech", "Trade", "EdTech"],
    initiatives: ["Founder mobility passport", "Regional investor salon"],
    metrics: [
      { label: "Countries", value: "23 active" },
      { label: "Events", value: "41 hosted" },
      { label: "Intros", value: "870 made" },
    ],
    score: 81,
    connections: ["stk-1", "stk-5", "stk-16"],
  },
  {
    id: "stk-9",
    name: "Priya Raman",
    organization: "South Asia Health Grid",
    type: "government",
    region: "Asia",
    city: "Bengaluru",
    country: "India",
    lat: 12.9716,
    lng: 77.5946,
    bio: "Runs public-private health innovation programs spanning diagnostics, procurement, and implementation.",
    interests: ["Health", "Digital Public Goods", "AI"],
    initiatives: ["Rural diagnostics rollout", "Public procurement sandbox"],
    metrics: [
      { label: "Hospitals", value: "290 connected" },
      { label: "Pilots", value: "13" },
      { label: "Patients", value: "1.8M served" },
    ],
    score: 89,
    connections: ["stk-2", "stk-6", "stk-11"],
  },
  {
    id: "stk-10",
    name: "Noah Fraser",
    organization: "Southern Cross University",
    type: "university",
    region: "Oceania",
    city: "Melbourne",
    country: "Australia",
    lat: -37.8136,
    lng: 144.9631,
    bio: "Leads commercialization programs linking startups, public agencies, and climate researchers.",
    interests: ["Research", "Climate", "Food Systems"],
    initiatives: ["Blue economy lab", "Circular agriculture network"],
    metrics: [
      { label: "Researchers", value: "640" },
      { label: "Partnerships", value: "52" },
      { label: "Spinouts", value: "18" },
    ],
    score: 82,
    connections: ["stk-1", "stk-7", "stk-12"],
  },
  {
    id: "stk-11",
    name: "Elena Petrova",
    organization: "Aurora Systems",
    type: "corporate",
    region: "Europe",
    city: "Tallinn",
    country: "Estonia",
    lat: 59.437,
    lng: 24.7536,
    bio: "Designs secure digital infrastructure for governments and multinational innovation networks.",
    interests: ["Digital Public Goods", "AI", "Civic Tech"],
    initiatives: ["Digital identity exchange", "Cross-border data trust"],
    metrics: [
      { label: "Deployments", value: "44 regions" },
      { label: "Engineers", value: "780" },
      { label: "Governments", value: "9 clients" },
    ],
    score: 87,
    connections: ["stk-4", "stk-9", "stk-13"],
  },
  {
    id: "stk-12",
    name: "Mateo Cruz",
    organization: "Blue Pacific Ventures",
    type: "entrepreneur",
    region: "Oceania",
    city: "Auckland",
    country: "New Zealand",
    lat: -36.8509,
    lng: 174.7645,
    bio: "Builds ocean-climate ventures with university R&D and regional policy alliances.",
    interests: ["Climate", "Food Systems", "Research"],
    initiatives: ["Coastal data stack", "Regenerative fisheries finance"],
    metrics: [
      { label: "Revenue", value: "$4.2M ARR" },
      { label: "Projects", value: "10 live" },
      { label: "Countries", value: "7 covered" },
    ],
    score: 80,
    connections: ["stk-3", "stk-10", "stk-14"],
  },
  {
    id: "stk-13",
    name: "Leila Haddad",
    organization: "Maghreb Exchange",
    type: "nonprofit",
    region: "Africa",
    city: "Casablanca",
    country: "Morocco",
    lat: 33.5731,
    lng: -7.5898,
    bio: "Runs a collaboration exchange for founders, investors, and ministries across emerging corridors.",
    interests: ["Trade", "EdTech", "Civic Tech"],
    initiatives: ["Cross-border founder desk", "Women in export networks"],
    metrics: [
      { label: "Members", value: "2.1k" },
      { label: "Partnerships", value: "88" },
      { label: "Cities", value: "31" },
    ],
    score: 79,
    connections: ["stk-5", "stk-11", "stk-15"],
  },
  {
    id: "stk-14",
    name: "Camila Duarte",
    organization: "Amazonia Resilience Office",
    type: "government",
    region: "Latin America",
    city: "Manaus",
    country: "Brazil",
    lat: -3.119,
    lng: -60.0217,
    bio: "Coordinates forest resilience, supply chain transparency, and climate-linked investment pipelines.",
    interests: ["Climate", "Food Systems", "Trade"],
    initiatives: ["Forest traceability stack", "Nature-tech investment table"],
    metrics: [
      { label: "Projects", value: "22 active" },
      { label: "Regions", value: "9 covered" },
      { label: "Capital unlocked", value: "$58M" },
    ],
    score: 91,
    connections: ["stk-6", "stk-12", "stk-16"],
  },
  {
    id: "stk-15",
    name: "Jules Martin",
    organization: "Atlas Mobility Group",
    type: "corporate",
    region: "Europe",
    city: "Paris",
    country: "France",
    lat: 48.8566,
    lng: 2.3522,
    bio: "Builds strategic ventures with cities, funds, and infrastructure operators across mobility ecosystems.",
    interests: ["Mobility", "Energy", "Trade"],
    initiatives: ["Urban logistics alliance", "Charging network partnerships"],
    metrics: [
      { label: "Cities", value: "27 deployed" },
      { label: "Fleet partners", value: "63" },
      { label: "Investment", value: "$130M" },
    ],
    score: 86,
    connections: ["stk-7", "stk-13", "stk-16"],
  },
  {
    id: "stk-16",
    name: "Grace Ndlovu",
    organization: "Ubuntu Capital",
    type: "investor",
    region: "Africa",
    city: "Johannesburg",
    country: "South Africa",
    lat: -26.2041,
    lng: 28.0473,
    bio: "Invests in growth-stage ventures that align enterprise expansion with measurable social impact.",
    interests: ["Fintech", "Health", "Climate"],
    initiatives: ["Impact due diligence network", "Growth-stage founder exchange"],
    metrics: [
      { label: "Fund size", value: "$260M" },
      { label: "Portfolio", value: "29 companies" },
      { label: "LPs", value: "16 institutions" },
    ],
    score: 84,
    connections: ["stk-8", "stk-14", "stk-15"],
  },
];

export function buildViewerStakeholder(profile: ProfileRecord): Stakeholder | null {
  if (!profile.onboarding_completed || !profile.region) return null;

  const regionMatch = regionOptions.find((option) => option.value === profile.region) ?? regionOptions[0];
  const metricEntries = Object.entries(profile.impact_metrics ?? {}).filter(([, value]) => value);

  return {
    id: "viewer-profile",
    name: profile.display_name || "You",
    organization: profile.organization_name || "Independent stakeholder",
    type: profile.stakeholder_type || "other",
    region: profile.region,
    city: profile.city || regionMatch.city,
    country: profile.region,
    lat: regionMatch.lat,
    lng: regionMatch.lng,
    bio: profile.bio || "Your production-ready stakeholder profile is now part of the network.",
    interests: profile.interests?.length ? profile.interests : ["Climate", "AI"],
    initiatives: profile.initiatives?.length ? profile.initiatives : ["Partnership discovery"],
    metrics: metricEntries.length
      ? metricEntries.map(([label, value]) => ({ label, value: String(value) }))
      : [{ label: "Status", value: "Onboarded" }],
    score: 95,
    connections: ["stk-1", "stk-2", "stk-9"],
    isViewer: true,
  };
}

export function buildStakeholders(profile: ProfileRecord | null) {
  const viewer = profile ? buildViewerStakeholder(profile) : null;
  return viewer ? [viewer, ...baseStakeholders] : baseStakeholders;
}

export function buildArcs(stakeholders: Stakeholder[]): ArcDatum[] {
  const byId = new Map(stakeholders.map((stakeholder) => [stakeholder.id, stakeholder]));
  const seen = new Set<string>();

  return stakeholders.flatMap((stakeholder) =>
    stakeholder.connections.flatMap((connectionId) => {
      const target = byId.get(connectionId);
      if (!target) return [];

      const key = [stakeholder.id, connectionId].sort().join(":");
      if (seen.has(key)) return [];
      seen.add(key);

      return [
        {
          id: key,
          startLat: stakeholder.lat,
          startLng: stakeholder.lng,
          endLat: target.lat,
          endLng: target.lng,
          color: stakeholder.isViewer ? ["#F7B731", "#FDE68A"] : ["#14B8A6", "#60A5FA"],
        },
      ];
    }),
  );
}

export function buildFeedPosts(stakeholder: Stakeholder): FeedPost[] {
  return [
    {
      id: `${stakeholder.id}-feed-1`,
      title: `${stakeholder.organization} opened a new collaboration window`,
      content: `${stakeholder.name} is actively looking for aligned partners around ${stakeholder.interests.slice(0, 2).join(" and ")} this quarter.`,
      category: "Opportunity",
      timestampLabel: "2h ago",
      likes: 18,
      comments: 4,
    },
    {
      id: `${stakeholder.id}-feed-2`,
      title: `Initiative update: ${stakeholder.initiatives[0] ?? "Network activation"}`,
      content: `The latest milestone highlights strong momentum in ${stakeholder.region}, with multiple counterparties ready for structured follow-up.`,
      category: "Update",
      timestampLabel: "Yesterday",
      likes: 26,
      comments: 9,
    },
    {
      id: `${stakeholder.id}-feed-3`,
      title: `Signal detected across ${stakeholder.region}`,
      content: `New partnership signals match ${stakeholder.organization}'s focus areas and could unlock faster introductions.`,
      category: "Signal",
      timestampLabel: "3 days ago",
      likes: 11,
      comments: 2,
    },
  ];
}

export function buildInsights(stakeholder: Stakeholder): InsightCard[] {
  const primaryInterest = stakeholder.interests[0] ?? "innovation";
  const secondaryInterest = stakeholder.interests[1] ?? stakeholder.interests[0] ?? "partnerships";

  return [
    {
      id: `${stakeholder.id}-insight-1`,
      kind: "collaboration",
      title: `High-fit collaboration around ${primaryInterest}`,
      description: `${stakeholder.organization} has both geographic relevance and initiative overlap for a fast pilot conversation.`,
      confidence: 94,
    },
    {
      id: `${stakeholder.id}-insight-2`,
      kind: "funding",
      title: `Potential capital alignment in ${stakeholder.region}`,
      description: `The current metrics and relationship density suggest a strong case for investor or grant introductions.`,
      confidence: 86,
    },
    {
      id: `${stakeholder.id}-insight-3`,
      kind: "introduction",
      title: `Warm introduction path through adjacent nodes`,
      description: `Mutual network overlap indicates an efficient route to introductions focused on ${secondaryInterest}.`,
      confidence: 89,
    },
    {
      id: `${stakeholder.id}-insight-4`,
      kind: "insight",
      title: `Regional momentum is increasing`,
      description: `This stakeholder sits in a dense corridor with multiple partnership-ready actors and visible execution signals.`,
      confidence: 81,
    },
  ];
}
