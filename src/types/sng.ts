export type StakeholderType =
  | "entrepreneur"
  | "university"
  | "investor"
  | "government"
  | "corporate"
  | "nonprofit"
  | "other";

export type VisualMode = "enhanced" | "heatmap" | "simple" | "satellite";
export type ProfileTab = "profile" | "feed" | "ai";

export interface StakeholderMetric {
  label: string;
  value: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  organization: string;
  type: StakeholderType;
  region: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  bio: string;
  interests: string[];
  initiatives: string[];
  metrics: StakeholderMetric[];
  score: number;
  connections: string[];
  isViewer?: boolean;
}

export interface FeedPost {
  id: string;
  title: string;
  content: string;
  category: string;
  timestampLabel: string;
  likes: number;
  comments: number;
}

export interface InsightCard {
  id: string;
  kind: "collaboration" | "funding" | "introduction" | "insight";
  title: string;
  description: string;
  confidence: number;
}

export interface ProfileRecord {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  stakeholder_type: StakeholderType | null;
  organization_name: string | null;
  region: string | null;
  city: string | null;
  bio: string | null;
  interests: string[];
  initiatives: string[];
  impact_metrics: Record<string, string | number | null>;
  preferences: Record<string, unknown>;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ArcDatum {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
}

export interface RegionOption {
  value: string;
  label: string;
  city: string;
  lat: number;
  lng: number;
}
