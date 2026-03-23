import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  Filter,
  Globe2,
  Layers,
  LayoutPanelLeft,
  LogOut,
  MapPin,
  Moon,
  Network,
  Orbit,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { GlobeScene } from "@/components/sng/GlobeScene";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";
import {
  onboardingSchema,
  type OnboardingValues,
} from "@/lib/auth-schemas";
import { buildArcs, buildFeedPosts, buildInsights, buildStakeholders, interestCatalog, regionOptions } from "@/lib/mock-stakeholders";
import type { StakeholderType, VisualMode } from "@/types/sng";

import globeNetworkBg from "@/assets/globe-network.jpg";

/* ─── Constants ───────────────────────────────────────────── */

const stakeholderTypes: { value: StakeholderType; label: string; desc: string }[] = [
  { value: "entrepreneur", label: "Entrepreneur", desc: "Building new ventures" },
  { value: "university", label: "University", desc: "Research & academia" },
  { value: "investor", label: "Investor", desc: "Allocating capital" },
  { value: "government", label: "Government", desc: "Public institutions" },
  { value: "corporate", label: "Corporate", desc: "Enterprise scale" },
  { value: "nonprofit", label: "Nonprofit", desc: "Mission-driven" },
  { value: "other", label: "Other", desc: "Broader ecosystem" },
];

const visualModes: { value: VisualMode; label: string }[] = [
  { value: "enhanced", label: "Enhanced" },
  { value: "heatmap", label: "Heatmap" },
  { value: "simple", label: "Simple" },
  { value: "satellite", label: "Satellite" },
];

/* ─── Onboarding ──────────────────────────────────────────── */

function OnboardingExperience() {
  const { user } = useAuth();
  const { data: profile, updateProfile, isSaving } = useProfile(user?.id);
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [form, setForm] = useState<OnboardingValues>({
    stakeholderType: profile?.stakeholder_type || "entrepreneur",
    displayName: profile?.display_name || "",
    organizationName: profile?.organization_name || "",
    region: profile?.region || regionOptions[0].value,
    city: profile?.city || "",
    bio: profile?.bio || "",
    fundingUsd: String((profile?.impact_metrics as Record<string, string | number | undefined> | undefined)?.fundingUsd || ""),
    peopleReached: String((profile?.impact_metrics as Record<string, string | number | undefined> | undefined)?.peopleReached || ""),
    annualBudget: String((profile?.impact_metrics as Record<string, string | number | undefined> | undefined)?.annualBudget || ""),
    interests: profile?.interests || [],
    initiatives: profile?.initiatives || [],
  });

  const next = () => {
    if (step === 1 && !form.stakeholderType) return toast.error("Select your role");
    if (step === 2 && (!form.displayName.trim() || !form.organizationName.trim())) return toast.error("Name and organization are required");
    if (step === 3 && !form.region) return toast.error("Choose a region");
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const complete = async () => {
    const parsed = onboardingSchema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message || "Check your details"); return; }
    try {
      await updateProfile({
        display_name: parsed.data.displayName,
        stakeholder_type: parsed.data.stakeholderType,
        organization_name: parsed.data.organizationName,
        region: parsed.data.region,
        city: parsed.data.city || null,
        bio: parsed.data.bio || null,
        interests: parsed.data.interests,
        initiatives: parsed.data.initiatives,
        impact_metrics: {
          fundingUsd: parsed.data.fundingUsd || null,
          peopleReached: parsed.data.peopleReached || null,
          annualBudget: parsed.data.annualBudget || null,
        },
        onboarding_completed: true,
      });
      toast.success("Welcome to SNG.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    }
  };

  const stepLabels = ["Role", "Identity", "Location", "Impact", "Interests"];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — progress sidebar */}
      <div className="relative hidden w-[360px] flex-col justify-between overflow-hidden border-r border-border/40 lg:flex">
        <img src={globeNetworkBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/70" />
        <div className="relative z-10 flex flex-1 flex-col justify-between p-10">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                <Globe2 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-foreground">SNG</span>
            </div>
            <div>
              <h1 className="text-3xl text-foreground">Set up your profile</h1>
              <p className="mt-2 text-sm text-muted-foreground">Complete these steps to join the stakeholder network.</p>
            </div>
            <div className="space-y-1">
              {stepLabels.map((label, i) => {
                const n = i + 1;
                const active = n === step;
                const done = n < step;
                return (
                  <div key={label} className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${active ? "bg-primary/10" : ""}`}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-all ${done ? "bg-primary text-primary-foreground" : active ? "border-2 border-primary text-primary" : "border border-border text-muted-foreground"}`}>
                      {done ? <Check className="h-3.5 w-3.5" /> : n}
                    </div>
                    <span className={`text-sm ${active ? "font-medium text-foreground" : done ? "text-foreground/70" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-full bg-border/40 h-1.5">
              <div className="h-1.5 rounded-full bg-primary transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{step}/{totalSteps}</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="fade-in w-full max-w-lg space-y-8">
          <div className="flex items-center gap-2 lg:hidden">
            {stepLabels.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i + 1 <= step ? "bg-primary" : "bg-border/60"}`} />
            ))}
          </div>

          <div>
            <h2 className="text-2xl text-foreground">{stepLabels[step - 1]}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === 1 && "What best describes your role in the ecosystem?"}
              {step === 2 && "Tell us who you are."}
              {step === 3 && "Where are you based?"}
              {step === 4 && "Optional impact metrics for your profile."}
              {step === 5 && "Select your focus areas."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {step === 1 && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {stakeholderTypes.map((t) => (
                    <button key={t.value} type="button" className={`rounded-xl border p-4 text-left transition-all ${form.stakeholderType === t.value ? "border-primary bg-primary/5 glow-ring" : "border-border/50 hover:border-primary/30"}`} onClick={() => setForm((f) => ({ ...f, stakeholderType: t.value }))}>
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="space-y-3">
                  <Input placeholder="Your name" value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} className="h-11 border-border/50 bg-card/50" />
                  <Input placeholder="Organization" value={form.organizationName} onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))} className="h-11 border-border/50 bg-card/50" />
                  <Textarea placeholder="Short bio (optional)" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} className="border-border/50 bg-card/50" />
                </div>
              )}
              {step === 3 && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {regionOptions.map((r) => (
                    <button key={r.value} type="button" className={`rounded-xl border p-4 text-left transition-all ${form.region === r.value ? "border-primary bg-primary/5 glow-ring" : "border-border/50 hover:border-primary/30"}`} onClick={() => setForm((f) => ({ ...f, region: r.value, city: r.city }))}>
                      <p className="text-sm font-medium text-foreground">{r.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.city}</p>
                    </button>
                  ))}
                </div>
              )}
              {step === 4 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input placeholder="Funding (USD)" value={form.fundingUsd} onChange={(e) => setForm((f) => ({ ...f, fundingUsd: e.target.value }))} className="h-11 border-border/50 bg-card/50" />
                  <Input placeholder="People reached" value={form.peopleReached} onChange={(e) => setForm((f) => ({ ...f, peopleReached: e.target.value }))} className="h-11 border-border/50 bg-card/50" />
                  <Input placeholder="Annual budget" value={form.annualBudget} onChange={(e) => setForm((f) => ({ ...f, annualBudget: e.target.value }))} className="h-11 border-border/50 bg-card/50" />
                </div>
              )}
              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-sm font-medium text-foreground">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {interestCatalog.map((interest) => {
                        const sel = form.interests.includes(interest);
                        return (
                          <button key={interest} type="button" className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${sel ? "border-primary bg-primary/10 text-foreground" : "border-border/50 text-muted-foreground hover:border-primary/30"}`} onClick={() => setForm((f) => ({ ...f, interests: sel ? f.interests.filter((i) => i !== interest) : [...f.interests.slice(0, 5), interest] }))}>
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[0, 1].map((idx) => (
                      <Input key={idx} placeholder={`Initiative ${idx + 1}`} value={form.initiatives[idx] || ""} className="h-11 border-border/50 bg-card/50" onChange={(e) => { const initiatives = [...form.initiatives]; initiatives[idx] = e.target.value; setForm((f) => ({ ...f, initiatives: initiatives.filter(Boolean) })); }} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1 || isSaving}>Back</Button>
            {step < totalSteps ? (
              <Button type="button" size="sm" onClick={next}>Continue <ArrowRight className="ml-1 h-4 w-4" /></Button>
            ) : (
              <Button type="button" size="sm" onClick={complete} disabled={isSaving}>{isSaving ? "Saving…" : "Enter SNG"} <ArrowRight className="ml-1 h-4 w-4" /></Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Network (Globe) ─────────────────────────────────────── */

function NetworkExperience() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile(user?.id);
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

  const stakeholders = useMemo(() => buildStakeholders(profile ?? null), [profile]);
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <header className="relative z-20 flex items-center justify-between border-b border-border/40 bg-card/50 px-4 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <Globe2 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-semibold tracking-wide text-foreground">SNG</span>
          </div>
          <Separator orientation="vertical" className="h-5" />
          <div className="hidden items-center gap-3 text-xs text-muted-foreground sm:flex">
            <span>{stakeholders.length} node{stakeholders.length !== 1 ? "s" : ""}</span>
            <span className="text-border">·</span>
            <span>{arcs.length} connection{arcs.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {visualModes.map((m) => (
            <button key={m.value} type="button" className={`hidden rounded-lg px-2.5 py-1.5 text-xs font-medium transition sm:block ${visualMode === m.value ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setVisualMode(m.value)}>
              {m.label}
            </button>
          ))}
          <Separator orientation="vertical" className="mx-1 h-5 hidden sm:block" />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setNavigatorOpen((v) => !v)}><LayoutPanelLeft className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { if (selected) setProfileOpen((v) => !v); }}><UserRound className="h-4 w-4" /></Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleSignOut}><LogOut className="h-4 w-4" /></Button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        <AnimatePresence>
          {navigatorOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 260 }} className="relative z-10 shrink-0 overflow-hidden border-r border-border/40">
              <div className="flex h-full w-[320px] flex-col bg-card/80 backdrop-blur-lg">
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <p className="text-sm font-semibold text-foreground">Navigator</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-medium">{filteredStakeholders.length}</Badge>
                    <button type="button" onClick={() => setNavigatorOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input className="h-9 border-border/40 bg-muted/40 pl-9 text-sm" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["all", ...stakeholderTypes.map((t) => t.value)].map((v) => (
                      <button key={v} type="button" className={`rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition ${typeFilter === v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setTypeFilter(v)}>{v}</button>
                    ))}
                  </div>
                </div>
                <ScrollArea className="flex-1 px-3 pb-4">
                  {filteredStakeholders.length === 0 && <p className="px-2 py-8 text-center text-sm text-muted-foreground">No stakeholders yet.</p>}
                  {filteredStakeholders.map((s) => (
                    <button key={s.id} type="button" className={`mb-1.5 w-full rounded-xl border p-3.5 text-left transition-all ${selected?.id === s.id ? "border-primary/30 bg-primary/5 glow-ring" : "border-transparent hover:bg-muted/40"}`} onClick={() => { setSelectedId(s.id); setProfileOpen(true); setNavigatorOpen(false); }}>
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
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 380, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 260 }} className="relative z-10 shrink-0 overflow-hidden border-l border-border/40">
              <div className="flex h-full w-[380px] flex-col bg-card/80 backdrop-blur-lg">
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                    <p className="text-xs text-muted-foreground">{selected.organization}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold uppercase">{selected.type}</Badge>
                    <button type="button" onClick={() => setProfileOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
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

/* ─── Root ────────────────────────────────────────────────── */

const Index = () => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);
  const navigate = useNavigate();

  if (loading || (user && isLoading)) return <LoadingScreen />;
  if (!user) { navigate("/login"); return null; }
  if (!profile?.onboarding_completed) return <OnboardingExperience />;
  return <NetworkExperience />;
};

export default Index;
