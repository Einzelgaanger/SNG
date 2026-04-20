import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useMatches } from "@/hooks/use-matches";
import { useProfile } from "@/hooks/use-profile";
import { useConnections } from "@/hooks/use-connections";
import {
  AppNotification,
  getReadIds,
  subscribeRead,
} from "@/lib/notifications-store";

const HOUR = 60 * 60 * 1000;

/**
 * Derives a live notification feed from the user's matches, profile completeness,
 * and connections. Demo-grade: no DB writes, but reflects real data.
 */
export function useNotifications() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: matches = [] } = useMatches(user?.id, 60);
  const { ids: connectedIds } = useConnections();

  const [readIds, setReadIds] = useState<Set<string>>(() => getReadIds());
  useEffect(() => subscribeRead(() => setReadIds(getReadIds())), []);

  const notifications = useMemo<AppNotification[]>(() => {
    const list: AppNotification[] = [];
    const now = Date.now();

    // 1) Welcome
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

    // 2) Top matches → "new match" alerts
    matches.slice(0, 5).forEach((m, idx) => {
      list.push({
        id: `match:${m.member_id}`,
        kind: m.match_score >= 70 ? "new_match" : "cross_region",
        title:
          m.match_score >= 70
            ? `${m.display_name} is a strong match (${m.match_score}%)`
            : `Cross-region opportunity: ${m.display_name}`,
        body:
          m.match_reasons[0] ||
          `${m.organization_name} · ${m.city}, ${m.region}`,
        ts: now - (2 + idx * 7) * HOUR,
        link: "/app/matches",
        meta: { score: m.match_score },
      });
    });

    // 3) Location overlap — anyone in your region with high match
    if (profile?.region) {
      const local = matches.find(
        (m) => m.region === profile.region && m.match_score >= 60,
      );
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

    // 4) Connection confirmations
    connectedIds.slice(0, 3).forEach((id, idx) => {
      const m = matches.find((x) => x.member_id === id);
      list.push({
        id: `conn:${id}`,
        kind: "connection",
        title: m ? `You connected with ${m.display_name}` : "New connection added",
        body: m
          ? `${m.organization_name} · ${m.city}`
          : "View your network on the globe.",
        ts: now - (1 + idx * 4) * HOUR,
        link: "/app",
      });
    });

    // 5) Profile strength alert
    if (profile) {
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
          body:
            "Add your bio, top interests, and current initiatives so the network can find you.",
          ts: now - 18 * HOUR,
          link: "/app/settings",
        });
      }
    }

    return list.sort((a, b) => b.ts - a.ts);
  }, [profile, matches, connectedIds]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds],
  );

  return { notifications, readIds, unreadCount };
}
