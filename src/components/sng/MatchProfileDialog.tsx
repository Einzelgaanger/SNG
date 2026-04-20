import { useEffect, useState } from "react";
import { Building2, Globe2, Loader2, MapPin, Sparkles, UserCheck, UserPlus, Wand2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useConnections } from "@/hooks/use-connections";
import { useProfile } from "@/hooks/use-profile";
import type { MatchRow } from "@/hooks/use-matches";

interface MatchProfileDialogProps {
  match: MatchRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MatchProfileDialog({ match, open, onOpenChange }: MatchProfileDialogProps) {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { has, toggle } = useConnections();
  const [insight, setInsight] = useState<string>("");
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string>("");

  // Reset insight whenever a different match is opened.
  useEffect(() => {
    setInsight("");
    setInsightError("");
  }, [match?.member_id]);

  if (!match) return null;

  const connected = has(match.member_id);
  const handleConnect = () => {
    const nowOn = toggle(match.member_id);
    toast.success(
      nowOn
        ? `Connected with ${match.display_name}`
        : `Removed connection with ${match.display_name}`,
    );
  };

  const generateInsight = async () => {
    if (!profile) {
      toast.error("Complete your profile first to generate AI insights.");
      return;
    }
    setInsightLoading(true);
    setInsightError("");
    try {
      const { data, error } = await supabase.functions.invoke("collaboration-insight", {
        body: {
          viewer: {
            name: profile.display_name || "Anonymous",
            role: profile.stakeholder_type || "other",
            bio: profile.bio || "",
            interests: profile.interests || [],
            initiatives: profile.initiatives || [],
            region: profile.region || "",
          },
          match: {
            name: match.display_name,
            role: match.stakeholder_type,
            organization: match.organization_name,
            bio: match.bio || "",
            interests: match.interests,
            region: match.region,
            sharedInterests: match.shared_interests,
            score: match.match_score,
          },
        },
      });
      if (error) {
        // supabase.functions.invoke surfaces non-2xx as error.context.status
        const status = (error as { context?: { status?: number } }).context?.status;
        if (status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
        if (status === 402) throw new Error("AI credits exhausted. Add credits in your Lovable workspace.");
        throw new Error(error.message || "AI request failed");
      }
      const text = (data as { insight?: string })?.insight || "";
      if (!text) throw new Error("No insight returned");
      setInsight(text);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to generate insight";
      setInsightError(msg);
      toast.error(msg);
    } finally {
      setInsightLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="space-y-1 border-b border-border/40 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="truncate text-lg">{match.display_name}</DialogTitle>
              <p className="truncate text-sm text-muted-foreground">{match.organization_name}</p>
            </div>
            <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
              {match.match_score}%
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-[10px] uppercase">
              {match.stakeholder_type}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {match.city}, {match.country}
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe2 className="h-3 w-3" /> {match.region}
            </span>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[55vh] px-6 py-4">
          <div className="space-y-4">
            {match.bio && (
              <p className="text-sm leading-relaxed text-muted-foreground">{match.bio}</p>
            )}

            {/* AI collaboration insight */}
            <section className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Wand2 className="h-3 w-3" /> AI Insight
                </p>
                {!insight && !insightLoading && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={generateInsight}>
                    Generate
                  </Button>
                )}
              </div>
              {insightLoading && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Analysing collaboration potential…
                </div>
              )}
              {insight && (
                <p className="mt-2 text-sm leading-relaxed text-foreground/90">{insight}</p>
              )}
              {!insight && !insightLoading && !insightError && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Get a 2-sentence rationale tailored to your profile.
                </p>
              )}
              {insightError && (
                <p className="mt-2 text-xs text-destructive">{insightError}</p>
              )}
            </section>

            {match.match_reasons.length > 0 && (
              <section>
                <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" /> Why you match
                </p>
                <ul className="space-y-1.5">
                  {match.match_reasons.map((r) => (
                    <li
                      key={r}
                      className="flex items-start gap-2 rounded-lg bg-muted/40 px-3 py-2 text-xs text-foreground/90"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {match.shared_interests.length > 0 && (
              <section>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Shared interests
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.shared_interests.map((i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {i}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {match.interests.length > 0 && (
              <section>
                <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Building2 className="h-3 w-3" /> All interests
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {match.interests.map((i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {i}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border/40 px-6 py-4">
          <Button
            className="w-full"
            variant={connected ? "secondary" : "default"}
            onClick={handleConnect}
          >
            {connected ? (
              <>
                <UserCheck className="mr-1.5 h-4 w-4" /> Connected
              </>
            ) : (
              <>
                <UserPlus className="mr-1.5 h-4 w-4" /> Connect
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
