import { useMemo, useState } from "react";
import { Globe2, Loader2, MapPin, Search, Sparkles, UserPlus, UserCheck } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { useMatches } from "@/hooks/use-matches";
import { useConnections } from "@/hooks/use-connections";

const typeColor: Record<string, string> = {
  entrepreneur: "bg-primary/10 text-primary",
  investor: "bg-accent/10 text-accent",
  university: "bg-muted text-foreground",
  government: "bg-muted text-foreground",
  corporate: "bg-muted text-foreground",
  nonprofit: "bg-muted text-foreground",
  other: "bg-muted text-foreground",
};

export default function MatchesPage() {
  const { user } = useAuth();
  const { data: matches = [], isLoading } = useMatches(user?.id, 30);
  const { has, toggle } = useConnections();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return matches;
    const q = search.toLowerCase();
    return matches.filter(
      (m) =>
        m.display_name.toLowerCase().includes(q) ||
        m.organization_name.toLowerCase().includes(q) ||
        m.region.toLowerCase().includes(q) ||
        m.interests.some((i) => i.toLowerCase().includes(q)),
    );
  }, [matches, search]);

  const handleConnect = (id: string, name: string) => {
    const nowConnected = toggle(id);
    toast.success(nowConnected ? `Connected with ${name}` : `Removed connection with ${name}`);
  };

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-header">
          <div>
            <h1 className="app-header-title flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" /> Matches
            </h1>
            <p className="app-header-description">
              AI-powered partners based on shared interests, complementary roles, and cross-region opportunities.
            </p>
          </div>
        </div>

        <div className="surface-card space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search matches by name, organization, region, or interest…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 border-border/50 bg-card/50 pl-10"
            />
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Finding your matches…
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Globe2 className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {matches.length === 0
                  ? "Complete your profile interests to unlock matches."
                  : "No matches for that search."}
              </p>
            </div>
          )}

          <ScrollArea className="max-h-[calc(100vh-300px)]">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((m) => {
                const connected = has(m.member_id);
                return (
                  <article
                    key={m.member_id}
                    className="rounded-2xl border border-border/40 bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm"
                  >
                    <header className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{m.display_name}</p>
                        <p className="truncate text-xs text-muted-foreground">{m.organization_name}</p>
                      </div>
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                        {m.match_score}%
                      </span>
                    </header>

                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Badge variant="secondary" className={`text-[10px] uppercase ${typeColor[m.stakeholder_type] || ""}`}>
                        {m.stakeholder_type}
                      </Badge>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {m.city}, {m.region}
                      </span>
                    </div>

                    {m.bio && <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{m.bio}</p>}

                    {m.match_reasons.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {m.match_reasons.slice(0, 3).map((r) => (
                          <li key={r} className="flex items-start gap-1.5 text-[11px] text-foreground/80">
                            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}

                    {m.shared_interests.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {m.shared_interests.slice(0, 4).map((i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            {i}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant={connected ? "secondary" : "default"}
                      className="mt-3 w-full"
                      onClick={() => handleConnect(m.member_id, m.display_name)}
                    >
                      {connected ? (
                        <>
                          <UserCheck className="mr-1.5 h-3.5 w-3.5" /> Connected
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Connect
                        </>
                      )}
                    </Button>
                  </article>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
