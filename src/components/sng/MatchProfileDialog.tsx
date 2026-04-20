import { Building2, Globe2, MapPin, Sparkles, UserCheck, UserPlus } from "lucide-react";
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
import { useConnections } from "@/hooks/use-connections";
import type { MatchRow } from "@/hooks/use-matches";

interface MatchProfileDialogProps {
  match: MatchRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MatchProfileDialog({ match, open, onOpenChange }: MatchProfileDialogProps) {
  const { has, toggle } = useConnections();

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="space-y-1 border-b border-border/40 px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <DialogTitle className="truncate text-lg">{match.display_name}</DialogTitle>
              <p className="truncate text-sm text-muted-foreground">
                {match.organization_name}
              </p>
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

        <ScrollArea className="max-h-[50vh] px-6 py-4">
          <div className="space-y-4">
            {match.bio && (
              <p className="text-sm leading-relaxed text-muted-foreground">{match.bio}</p>
            )}

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
