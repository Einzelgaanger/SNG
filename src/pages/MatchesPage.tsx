import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  Globe2,
  Loader2,
  MapPin,
  Rocket,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useMatches, type MatchRow } from "@/hooks/use-matches";
import { useConnections } from "@/hooks/use-connections";
import { useProfile } from "@/hooks/use-profile";
import { usePreferences } from "@/hooks/use-preferences";
import { proximityOptions, type ProximityRadius } from "@/lib/preferences-store";
import { MatchProfileDialog } from "@/components/sng/MatchProfileDialog";
import type { ProfileRecord, StakeholderType } from "@/types/sng";

const typeColor: Record<string, string> = {
  entrepreneur: "bg-primary/10 text-primary",
  investor: "bg-accent/10 text-accent",
  university: "bg-muted text-foreground",
  government: "bg-muted text-foreground",
  corporate: "bg-muted text-foreground",
  nonprofit: "bg-muted text-foreground",
  other: "bg-muted text-foreground",
};

const stakeholderFilters: { value: StakeholderType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "investor", label: "Investor" },
  { value: "university", label: "University" },
  { value: "corporate", label: "Corporate" },
  { value: "government", label: "Government" },
  { value: "nonprofit", label: "Nonprofit" },
];

type SortKey = "score" | "name" | "region";

function inRadius(m: MatchRow, profile: ProfileRecord | null | undefined, r: ProximityRadius) {
  if (!profile || r === "global" || r === "continent") return true;
  if (r === "region") return m.region === profile.region;
  if (r === "country") return m.country === profile.country;
  if (r === "city") return m.city === profile.city;
  return true;
}

export default function MatchesPage() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: matches = [], isLoading } = useMatches(user?.id, 60);
  const { has, toggle } = useConnections();
  const { prefs } = usePreferences();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<StakeholderType | "all">("all");
  const [sortBy, setSortBy] = useState<SortKey>("score");
  const [openMatch, setOpenMatch] = useState<MatchRow | null>(null);
  const [nearMe, setNearMe] = useState(false);
  const [nearMeRadius, setNearMeRadius] = useState<ProximityRadius>(prefs.proximity);
  const [activeOnly, setActiveOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const list = matches.filter((m) => {
      if (typeFilter !== "all" && m.stakeholder_type !== typeFilter) return false;
      if (nearMe && !inRadius(m, profile, nearMeRadius)) return false;
      // Active initiative filter — proxy via "shared interests > 0" since the
      // match RPC already returns shared_interests for collaboration overlap.
      if (activeOnly && (m.shared_interests?.length || 0) === 0) return false;
      if (!q) return true;
      return (
        m.display_name.toLowerCase().includes(q) ||
        m.organization_name.toLowerCase().includes(q) ||
        m.region.toLowerCase().includes(q) ||
        m.interests.some((i) => i.toLowerCase().includes(q))
      );
    });
    const sorted = [...list];
    if (sortBy === "score") sorted.sort((a, b) => b.match_score - a.match_score);
    if (sortBy === "name") sorted.sort((a, b) => a.display_name.localeCompare(b.display_name));
    if (sortBy === "region") sorted.sort((a, b) => a.region.localeCompare(b.region));
    return sorted;
  }, [matches, search, typeFilter, sortBy, nearMe, nearMeRadius, activeOnly, profile]);

  const handleConnect = (id: string, name: string) => {
    const nowConnected = toggle(id);
    toast.success(nowConnected ? `Connected with ${name}` : `Removed connection with ${name}`);
  };

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-header">
          <div className="space-y-3">
            <span className="eyebrow-primary">
              <Sparkles className="h-3 w-3" /> Index 02 · Matches
            </span>
            <h1 className="app-header-title">
              Your collaboration <em className="font-light text-primary">signal.</em>
            </h1>
            <p className="app-header-description">
              AI-powered partners based on shared interests, complementary roles, and cross-region opportunities.
            </p>
          </div>
          <div className="font-mono-display text-right text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
            <p className="numeral text-3xl text-foreground">{matches.length}</p>
            <p>candidates surfaced</p>
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {stakeholderFilters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    typeFilter === f.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                  onClick={() => setTypeFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
                <SelectTrigger className="h-9 w-[160px] border-border/50 bg-card/50 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Match score</SelectItem>
                  <SelectItem value="name">Name (A→Z)</SelectItem>
                  <SelectItem value="region">Region</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced filters row */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5">
            <label className="flex items-center gap-2 text-xs text-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span>Near me</span>
              <Switch checked={nearMe} onCheckedChange={setNearMe} />
            </label>
            {nearMe && (
              <Select value={nearMeRadius} onValueChange={(v) => setNearMeRadius(v as ProximityRadius)}>
                <SelectTrigger className="h-8 w-[140px] border-border/50 bg-card text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {proximityOptions
                    .filter((p) => p.value !== "continent" && p.value !== "global")
                    .map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
            <span className="h-4 w-px bg-border/60" />
            <label className="flex items-center gap-2 text-xs text-foreground">
              <Rocket className="h-3.5 w-3.5 text-primary" />
              <span>With overlapping initiatives</span>
              <Switch checked={activeOnly} onCheckedChange={setActiveOnly} />
            </label>
            <span className="ml-auto text-[11px] text-muted-foreground">
              {filtered.length} of {matches.length} matches
            </span>
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
                  : "No matches for the current filters."}
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
                    className="group cursor-pointer rounded-2xl border border-border/40 bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
                    onClick={() => setOpenMatch(m)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setOpenMatch(m);
                      }
                    }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(m.member_id, m.display_name);
                      }}
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

      <MatchProfileDialog
        match={openMatch}
        open={Boolean(openMatch)}
        onOpenChange={(o) => !o && setOpenMatch(null)}
      />
    </div>
  );
}
