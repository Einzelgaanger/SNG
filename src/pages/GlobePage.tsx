import { useMemo, useState } from "react";
import {
  Building2,
  Eye,
  Filter,
  Globe2,
  LayoutPanelLeft,
  MapPin,
  Moon,
  Network,
  Orbit,
  Search,
  UserCheck,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useConnections } from "@/hooks/use-connections";

import { GlobeScene } from "@/components/sng/GlobeScene";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useNetworkMembers } from "@/hooks/use-network-members";
import { buildArcs, buildFeedPosts, buildInsights } from "@/lib/mock-stakeholders";
import type { StakeholderType, VisualMode } from "@/types/sng";

const stakeholderTypes: { value: StakeholderType; label: string }[] = [
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "university", label: "University" },
  { value: "investor", label: "Investor" },
  { value: "government", label: "Government" },
  { value: "corporate", label: "Corporate" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" },
];

const visualModes: { value: VisualMode; label: string }[] = [
  { value: "enhanced", label: "Enhanced" },
  { value: "heatmap", label: "Heatmap" },
  { value: "simple", label: "Simple" },
  { value: "satellite", label: "Satellite" },
];

export default function GlobePage() {
  const { user } = useAuth();
  const { data: stakeholders = [] } = useNetworkMembers(user?.id);
  const { has: isConn, toggle: toggleConn, count: connCount } = useConnections();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visualMode, setVisualMode] = useState<VisualMode>("enhanced");
  const [showConnections, setShowConnections] = useState(true);
  const [showCountries, setShowCountries] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [nightLights, setNightLights] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "feed" | "ai">("profile");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const arcs = useMemo(() => buildArcs(stakeholders), [stakeholders]);

  const filteredStakeholders = useMemo(
    () => stakeholders.filter((s) => {
      if (typeFilter !== "all" && s.type !== typeFilter) return false;
      if (!search) return true;
      return `${s.name} ${s.organization} ${s.region}`.toLowerCase().includes(search.toLowerCase());
    }),
    [search, stakeholders, typeFilter],
  );

  const selected = stakeholders.find((s) => s.id === selectedId) || stakeholders[0] || null;
  const feed = selected ? buildFeedPosts(selected) : [];
  const insights = selected ? buildInsights(selected) : [];

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      {/* Top toolbar */}
      <div className="relative z-20 flex items-center justify-between border-b border-border/40 bg-card/70 px-2 py-2 backdrop-blur-md sm:px-4">
        <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
          <span>{stakeholders.length} node{stakeholders.length !== 1 ? "s" : ""}</span>
          <span className="text-border">·</span>
          <span>{arcs.length} connection{arcs.length !== 1 ? "s" : ""}</span>
          <span className="text-border">·</span>
          <span className="text-primary">{connCount} in your network</span>
        </div>
        <div className="flex items-center gap-1.5">
          {visualModes.map((m) => (
            <button key={m.value} type="button" className={`hidden rounded-lg px-2.5 py-1.5 text-xs font-medium transition sm:block ${visualMode === m.value ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"}`} onClick={() => setVisualMode(m.value)}>
              {m.label}
            </button>
          ))}
          <Separator orientation="vertical" className="mx-1 h-5 hidden sm:block" />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setNavigatorOpen((v) => !v)}><LayoutPanelLeft className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { if (selected) setProfileOpen((v) => !v); }}><UserRound className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="relative flex flex-1 overflow-hidden">
        <AnimatePresence>
          {navigatorOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 260 }} className="absolute inset-0 z-30 shrink-0 overflow-hidden border-r border-border/40 sm:relative sm:inset-auto sm:z-10 sm:w-auto" style={{ maxWidth: 320 }}>
              <div className="flex h-full w-full flex-col bg-card/95 backdrop-blur-lg sm:w-[320px] sm:bg-card/80">
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">Navigator</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-medium">{filteredStakeholders.length}</Badge>
                    <button type="button" onClick={() => setNavigatorOpen(false)} className="rounded-md p-1 text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input className="h-9 border-border/40 bg-muted/40 pl-9 text-sm" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["all", ...stakeholderTypes.map((t) => t.value)].map((v) => (
                      <button key={v} type="button" className={`rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition ${typeFilter === v ? "bg-primary/15 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"}`} onClick={() => setTypeFilter(v)}>{v}</button>
                    ))}
                  </div>
                </div>
                <ScrollArea className="flex-1 px-3 pb-4">
                  {filteredStakeholders.length === 0 && <p className="px-2 py-8 text-center text-sm text-muted-foreground">No stakeholders yet.</p>}
                  {filteredStakeholders.map((s) => (
                    <button key={s.id} type="button" className={`mb-1.5 w-full rounded-xl border p-3.5 text-left transition-all ${selected?.id === s.id ? "border-primary/30 bg-primary/5 glow-ring" : "border-transparent hover:bg-muted/60"}`} onClick={() => { setSelectedId(s.id); setProfileOpen(true); setNavigatorOpen(false); }}>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.organization}</p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground"><MapPin className="h-3 w-3" /> {s.city}, {s.country}</div>
                    </button>
                  ))}
                </ScrollArea>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="relative flex-1">
          <GlobeScene arcs={arcs} autoRotate={autoRotate} mode={visualMode} nightLights={nightLights} selectedId={selected?.id ?? null} showConnections={showConnections} showCountries={showCountries} stakeholders={filteredStakeholders} onSelect={(s) => { setSelectedId(s.id); setProfileOpen(true); }} />

          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Rotate", icon: Orbit, active: autoRotate, toggle: () => setAutoRotate((v) => !v) },
              { label: "Arcs", icon: Network, active: showConnections, toggle: () => setShowConnections((v) => !v) },
              { label: "Grid", icon: Globe2, active: showCountries, toggle: () => setShowCountries((v) => !v) },
              { label: "Night", icon: Moon, active: nightLights, toggle: () => setNightLights((v) => !v) },
              { label: "Reset", icon: Filter, active: typeFilter !== "all", toggle: () => setTypeFilter("all") },
            ].map((c) => (
              <button key={c.label} type="button" className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium backdrop-blur-lg transition-all ${c.active ? "border-primary/30 bg-card/80 text-primary glow-ring" : "border-border/30 bg-card/60 text-muted-foreground hover:text-foreground"}`} onClick={c.toggle}>
                <c.icon className="h-3.5 w-3.5" />{c.label}
              </button>
            ))}
          </div>

          {stakeholders.length === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="glass-panel max-w-sm p-8 text-center">
                <Globe2 className="mx-auto mb-4 h-10 w-10 text-primary/50" />
                <h3 className="text-xl text-foreground">Your globe is empty</h3>
                <p className="mt-2 text-sm text-muted-foreground">Complete onboarding to place yourself on the network.</p>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {profileOpen && selected && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: "100%", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 260 }} className="absolute inset-0 z-30 shrink-0 overflow-hidden border-l border-border/40 sm:relative sm:inset-auto sm:z-10 sm:w-auto" style={{ maxWidth: 380 }}>
              <div className="flex h-full w-full flex-col bg-card/95 backdrop-blur-lg sm:w-[380px] sm:bg-card/80">
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">{selected.organization}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold uppercase">{selected.type}</Badge>
                    <button type="button" onClick={() => setProfileOpen(false)} className="rounded-md p-1 text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="flex border-b border-border/30 px-4">
                  {(["profile", "feed", "ai"] as const).map((tab) => (
                    <button key={tab} type="button" className={`border-b-2 px-3 py-2.5 text-sm font-medium capitalize transition ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`} onClick={() => setActiveTab(tab)}>
                      {tab === "ai" ? "AI" : tab}
                    </button>
                  ))}
                </div>
                <ScrollArea className="flex-1 p-4">
                  {activeTab === "profile" && (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-border/30 bg-muted/30 p-4">
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-primary/60" />{selected.city}, {selected.country}</span>
                          <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3 text-primary/60" />{selected.region}</span>
                          <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3 text-primary/60" />Score {selected.score}</span>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{selected.bio}</p>
                      {selected.metrics.length > 0 && (
                        <div className="grid gap-2">
                          {selected.metrics.map((m) => (
                            <div key={m.label} className="flex items-center justify-between rounded-xl border border-border/30 px-4 py-3">
                              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{m.label}</span>
                              <span className="text-sm font-semibold text-primary">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {selected.interests.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interests</p>
                          <div className="flex flex-wrap gap-1.5">{selected.interests.map((i) => <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>)}</div>
                        </div>
                      )}
                      {selected.initiatives.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Initiatives</p>
                          {selected.initiatives.map((i) => <div key={i} className="mb-1.5 rounded-xl border border-border/30 px-4 py-3 text-sm text-muted-foreground">{i}</div>)}
                        </div>
                      )}
                    </div>
                  )}
                  {activeTab === "feed" && (
                    <div className="space-y-3">
                      {feed.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>}
                      {feed.map((p) => (
                        <div key={p.id} className="rounded-xl border border-border/30 bg-muted/20 p-4">
                          <div className="flex items-center justify-between"><Badge variant="secondary" className="text-[10px]">{p.category}</Badge><span className="text-[11px] text-muted-foreground">{p.timestampLabel}</span></div>
                          <p className="mt-2.5 text-sm font-medium text-foreground">{p.title}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeTab === "ai" && (
                    <div className="space-y-3">
                      {insights.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No insights yet.</p>}
                      {insights.map((ins) => (
                        <div key={ins.id} className="rounded-xl border border-border/30 bg-muted/20 p-4">
                          <div className="flex items-center justify-between"><Badge variant="secondary" className="text-[10px] uppercase">{ins.kind}</Badge><span className="text-xs font-semibold text-primary">{ins.confidence}%</span></div>
                          <p className="mt-2.5 text-sm font-medium text-foreground">{ins.title}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{ins.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
