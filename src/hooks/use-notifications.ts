import { useEffect, useMemo } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useMatches } from "@/hooks/use-matches";
import { useProfile } from "@/hooks/use-profile";
import { useConnections } from "@/hooks/use-connections";
import { usePreferences } from "@/hooks/use-preferences";
import { useNotificationReads } from "@/hooks/use-notification-reads";
import { AppNotification } from "@/lib/notifications-store";
import type { ProximityRadius } from "@/lib/preferences-store";
import type { MatchRow } from "@/hooks/use-matches";
import type { ProfileRecord } from "@/types/sng";

const HOUR = 60 * 60 * 1000;

function withinProximity(
  m: MatchRow,
  profile: ProfileRecord | null | undefined,
  radius: ProximityRadius,
): boolean {
  if (!profile || radius === "global" || radius === "continent") return true;
  if (radius === "region") return m.region === profile.region;
  if (radius === "country") return m.country === profile.country;
  if (radius === "city") return m.city === profile.city;
  return true;
}

/**
 * Derives a live notification feed from matches, connections, and profile.
 * Read state is persisted in the database via `useNotificationReads`.
 */
export function useNotifications() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: matches = [] } = useMatches(user?.id, 60);
  const { ids: connectedIds } = useConnections();
  const { prefs } = usePreferences();
  const { readIds, markRead, markAllRead } = useNotificationReads();

  const notifications = useMemo<AppNotification[]>(() => {
    const list: AppNotification[] = [];
    const now = Date.now();

    if (profile) {
      list.push({
        id: "welcome",
        kind: "welcome",
        title: `Welcome to SNG, ${profile.display_name?.split(" ")[0] || "there"}`,
        body: "Your stakeholder profile is live on the global network. Explore the globe to find collaborators.",
        ts: now - 36 * HOUR,
        link: "/app",
      });
    }

    if (prefs.notifyNewMatches) {
      const eligible = matches
        .filter((m) => m.match_score >= prefs.minMatchScore)
        .filter((m) => withinProximity(m, profile, prefs.proximity))
        .slice(0, 5);
      eligible.forEach((m, idx) => {
        list.push({
          id: `match:${m.member_id}`,
          kind: m.match_score >= 70 ? "new_match" : "cross_region",
          title:
            m.match_score >= 70
              ? `${m.display_name} is a strong match (${m.match_score}%)`
              : `Cross-region opportunity: ${m.display_name}`,
          body: m.match_reasons[0] || `${m.organization_name} · ${m.city}, ${m.region}`,
          ts: now - (2 + idx * 7) * HOUR,
          link: "/app/matches",
          meta: { score: m.match_score },
        });
      });
    }

    if (prefs.notifyLocationOverlap && profile?.region) {
      const local = matches.find((m) => m.region === profile.region && m.match_score >= 60);
      if (local) {
        list.push({
          id: `local:${local.member_id}`,
          kind: "location_overlap",
          title: `${local.display_name} is in your region`,
          body: `Both based in ${profile.region}. Worth a coffee?`,
          ts: now - 9 * HOUR,
          link: "/app/matches",
        });
      }
    }

    connectedIds.slice(0, 3).forEach((id, idx) => {
      const m = matches.find((x) => x.member_id === id);
      list.push({
        id: `conn:${id}`,
        kind: "connection",
        title: m ? `You connected with ${m.display_name}` : "New connection added",
        body: m ? `${m.organization_name} · ${m.city}` : "View your network on the globe.",
        ts: now - (1 + idx * 4) * HOUR,
        link: "/app/network",
      });
    });

    if (prefs.notifyProfileTips && profile) {
      const fields = [
        profile.bio,
        profile.organization_name,
        profile.city,
        profile.linkedin_url,
        profile.website_url,
      ];
      const interestsCount = profile.interests?.length || 0;
      const initiativesCount = profile.initiatives?.length || 0;
      const score =
        fields.filter(Boolean).length * 12 +
        Math.min(interestsCount, 5) * 6 +
        Math.min(initiativesCount, 3) * 5;
      if (score < 70) {
        list.push({
          id: "profile-strength",
          kind: "profile_strength",
          title: "Strengthen your profile to unlock 3× more matches",
          body: "Add your bio, top interests, and current initiatives so the network can find you.",
          ts: now - 18 * HOUR,
          link: "/app/settings",
        });
      }
    }

    return list.sort((a, b) => b.ts - a.ts);
  }, [profile, matches, connectedIds, prefs]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds],
  );

  // Avoid stale-warnings on unmounted effects.
  useEffect(() => {}, []);

  return { notifications, readIds, unreadCount, markRead, markAllRead };
}
