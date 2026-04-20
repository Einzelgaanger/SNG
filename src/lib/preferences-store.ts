// User notification & matching preferences — demo persistence in localStorage.
// Mirrors blueprint spec 4.6: min match score + proximity radius + channel toggles.

const KEY = "sng:preferences:v1";

export type ProximityRadius = "city" | "country" | "region" | "continent" | "global";

export interface Preferences {
  minMatchScore: number;       // 0–100
  proximity: ProximityRadius;  // how local notifications/matches should be
  notifyNewMatches: boolean;
  notifyLocationOverlap: boolean;
  notifyProfileTips: boolean;
}

export const defaultPreferences: Preferences = {
  minMatchScore: 50,
  proximity: "region",
  notifyNewMatches: true,
  notifyLocationOverlap: true,
  notifyProfileTips: true,
};

export const proximityOptions: { value: ProximityRadius; label: string; description: string }[] = [
  { value: "city", label: "City", description: "Same city only" },
  { value: "country", label: "Country", description: "Same country" },
  { value: "region", label: "Region", description: "Same continental region" },
  { value: "continent", label: "Continent", description: "Same broad continent" },
  { value: "global", label: "Global", description: "Anywhere in the world" },
];

export function getPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultPreferences;
    return { ...defaultPreferences, ...JSON.parse(raw) };
  } catch {
    return defaultPreferences;
  }
}

export function setPreferences(prefs: Preferences) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent("sng:preferences-changed"));
}

export function subscribePreferences(cb: () => void) {
  window.addEventListener("sng:preferences-changed", cb);
  return () => window.removeEventListener("sng:preferences-changed", cb);
}
