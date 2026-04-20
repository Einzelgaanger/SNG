import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Globe2, Loader2, MapPin, Search, UserMinus, Users2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { useConnections } from "@/hooks/use-connections";
import { useNetworkMembers } from "@/hooks/use-network-members";
import type { Stakeholder, StakeholderType } from "@/types/sng";

const typeLabels: Record<StakeholderType, string> = {
  entrepreneur: "Entrepreneurs",
  investor: "Investors",
  university: "Universities",
  government: "Government",
  corporate: "Corporates",
  nonprofit: "Nonprofits",
  other: "Other",
};

const typeAccent: Record<StakeholderType, string> = {
  entrepreneur: "bg-primary/10 text-primary",
  investor: "bg-accent/10 text-accent",
  university: "bg-muted text-foreground",
  government: "bg-muted text-foreground",
  corporate: "bg-muted text-foreground",
  nonprofit: "bg-muted text-foreground",
  other: "bg-muted text-foreground",
};

export default function MyNetworkPage() {
  const { user } = useAuth();
  const { data: members = [], isLoading } = useNetworkMembers(user?.id, 600);
  const { ids, has, toggle } = useConnections();
  const [search, setSearch] = useState("");

  const connected = useMemo(() => {
    const set = new Set(ids);
    return members.filter((m) => set.has(m.id));
  }, [members, ids]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return connected;
    return connected.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.organization.toLowerCase().includes(q) ||
        m.region.toLowerCase().includes(q) ||
        m.interests.some((i) => i.toLowerCase().includes(q)),
    );
  }, [connected, search]);

  const grouped = useMemo(() => {
    const map = new Map<StakeholderType, Stakeholder[]>();
    filtered.forEach((m) => {
      const list = map.get(m.type) || [];
      list.push(m);
      map.set(m.type, list);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const handleDisconnect = (m: Stakeholder) => {
    toggle(m.id);
    toast.success(`Removed connection with ${m.name}`);
  };

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-header">
          <div>
            <h1 className="app-header-title flex items-center gap-2">
              <Users2 className="h-6 w-6 text-primary" /> My Network
            </h1>
            <p className="app-header-description">
              {ids.length === 0
                ? "You haven't connected with anyone yet — explore matches to start building your network."
                : `${ids.length} ${ids.length === 1 ? "connection" : "connections"} across the global stakeholder network.`}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="surface-card flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading your network…
          </div>
        )}

        {!isLoading && ids.length === 0 && (
          <div className="surface-card flex flex-col items-center justify-center py-20 text-center">
            <Globe2 className="mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="mb-4 text-sm text-muted-foreground">
              No connections yet. Find your first stakeholder match.
            </p>
            <Link to="/app/matches">
              <Button>Browse Matches</Button>
            </Link>
          </div>
        )}

        {!isLoading && ids.length > 0 && (
          <div className="surface-card space-y-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search your connections…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 border-border/50 bg-card/50 pl-10"
              />
            </div>

            <ScrollArea className="max-h-[calc(100vh-320px)]">
              <div className="space-y-6">
                {grouped.map(([type, list]) => (
                  <section key={type}>
                    <header className="mb-2.5 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-foreground">
                        {typeLabels[type]}
                      </h2>
                      <span className="text-xs text-muted-foreground">{list.length}</span>
                    </header>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {list.map((m) => (
                        <article
                          key={m.id}
                          className="rounded-2xl border border-border/40 bg-card p-4 transition-all hover:border-primary/30"
                        >
                          <header className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-foreground">
                                {m.name}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {m.organization}
                              </p>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] uppercase ${typeAccent[m.type]}`}
                            >
                              {m.type}
                            </Badge>
                          </header>
                          <p className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {m.city}, {m.region}
                          </p>
                          {m.interests.length > 0 && (
                            <div className="mt-2.5 flex flex-wrap gap-1">
                              {m.interests.slice(0, 3).map((i) => (
                                <Badge key={i} variant="secondary" className="text-[10px]">
                                  {i}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-3 w-full text-muted-foreground hover:text-destructive"
                            onClick={() => handleDisconnect(m)}
                            disabled={!has(m.id)}
                          >
                            <UserMinus className="mr-1.5 h-3.5 w-3.5" /> Disconnect
                          </Button>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-sm text-muted-foreground">
                    No connections match that search.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
}
