import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Filter,
  Globe2,
  LayoutPanelLeft,
  LogOut,
  MapPin,
  Orbit,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { GlobeScene } from "@/components/sng/GlobeScene";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import {
  forgotPasswordSchema,
  onboardingSchema,
  signInSchema,
  signUpSchema,
  type OnboardingValues,
} from "@/lib/auth-schemas";
import { buildArcs, buildFeedPosts, buildInsights, buildStakeholders, interestCatalog, regionOptions } from "@/lib/mock-stakeholders";
import type { StakeholderType, VisualMode } from "@/types/sng";

const stakeholderTypeOptions: { value: StakeholderType; label: string; blurb: string }[] = [
  { value: "entrepreneur", label: "Entrepreneur", blurb: "Operators building new ventures and pilots." },
  { value: "university", label: "University", blurb: "Research institutions translating ideas into deployment." },
  { value: "investor", label: "Investor", blurb: "Capital allocators seeking high-fit partnerships." },
  { value: "government", label: "Government", blurb: "Public institutions shaping market conditions." },
  { value: "corporate", label: "Corporate", blurb: "Enterprises connecting scale with strategic execution." },
  { value: "nonprofit", label: "Nonprofit", blurb: "Mission-led ecosystem builders and conveners." },
  { value: "other", label: "Other", blurb: "A broader network participant with a unique role." },
];

const visualModes: { value: VisualMode; label: string }[] = [
  { value: "enhanced", label: "Enhanced" },
  { value: "heatmap", label: "Heat map" },
  { value: "simple", label: "Simple points" },
  { value: "satellite", label: "Satellite" },
];

function AuthExperience() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      if (mode === "signin") {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Invalid credentials");
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast.success("Signed in successfully.");
      }

      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ email, password, displayName });
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Check your details");
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: parsed.data.displayName },
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      }

      if (mode === "forgot") {
        const parsed = forgotPasswordSchema.safeParse({ email });
        if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "Enter a valid email");
        const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Password recovery email sent.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      setSubmitting(true);
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if ((result as { error?: Error }).error) throw (result as { error: Error }).error;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Could not continue with ${provider}`);
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(var(--primary),0.22),transparent_30%),radial-gradient(circle_at_bottom_right,hsla(var(--accent),0.18),transparent_30%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)))]" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-8">
          <Badge className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.28em]">Stakeholder Network Globe</Badge>
          <div className="space-y-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl">
              A production-ready stakeholder command center built around a living globe.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Onboard users, authenticate securely, map global relationships, and drill into profiles, feed activity, and collaboration signals from one unified experience.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Globe2, title: "Geographic network", text: "Interactive world view with relationship arcs and exploration modes." },
              { icon: ShieldCheck, title: "Verified auth", text: "Email verification, password recovery, and Google/Apple sign-in are ready." },
              { icon: Sparkles, title: "Command-center UX", text: "Navigator, overlays, onboarding, and profile intelligence in one route." },
            ].map((item) => (
              <div key={item.title} className="command-panel space-y-3 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Card className="border-border/70 bg-card/88 shadow-[0_28px_90px_hsl(var(--foreground)/0.16)] backdrop-blur-xl">
          <CardHeader className="space-y-4">
            <div className="inline-flex rounded-full border border-border bg-muted p-1">
              {[
                { key: "signin", label: "Sign in" },
                { key: "signup", label: "Create account" },
                { key: "forgot", label: "Reset" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`rounded-full px-4 py-2 text-sm transition ${mode === tab.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                  onClick={() => setMode(tab.key as typeof mode)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div>
              <CardTitle>{mode === "signin" ? "Access your network" : mode === "signup" ? "Create your stakeholder account" : "Recover your password"}</CardTitle>
              <CardDescription>
                {mode === "signin"
                  ? "Use email/password or continue with a managed provider."
                  : mode === "signup"
                    ? "Email verification is enabled for production-ready onboarding."
                    : "We’ll email you a secure password reset link."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-4" onSubmit={handleEmailAuth}>
              {mode === "signup" && <Input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />}
              <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              {mode !== "forgot" && <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Working..." : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="relative py-2 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <span className="relative z-10 bg-card px-3">or continue with</span>
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button type="button" variant="secondary" className="w-full" disabled={submitting} onClick={() => handleOAuth("google")}>
                Google
              </Button>
              <Button type="button" variant="secondary" className="w-full" disabled={submitting} onClick={() => handleOAuth("apple")}>
                Apple
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function OnboardingExperience() {
  const { user } = useAuth();
  const { data: profile, updateProfile, isSaving } = useProfile(user?.id);
  const [step, setStep] = useState(1);
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
    interests: profile?.interests || ["Climate", "AI"],
    initiatives: profile?.initiatives || ["Partnership discovery"],
  });

  const next = () => {
    if (step === 1 && !form.stakeholderType) return toast.error("Select your stakeholder type");
    if (step === 2 && (!form.displayName.trim() || !form.organizationName.trim())) return toast.error("Add your name and organization");
    if (step === 3 && !form.region) return toast.error("Choose your region");
    setStep((current) => Math.min(current + 1, 5));
  };

  const complete = async () => {
    const parsed = onboardingSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Check your onboarding details");
      return;
    }

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
      toast.success("Onboarding complete.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save onboarding");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsla(var(--primary),0.2),transparent_24%),radial-gradient(circle_at_bottom_right,hsla(var(--accent),0.18),transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)))]" />
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="command-panel flex flex-col justify-between p-6 sm:p-8">
          <div className="space-y-4">
            <Badge className="rounded-full px-4 py-1 text-xs uppercase tracking-[0.28em]">Onboarding</Badge>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-foreground">Join the network as a first-class node.</h1>
            <p className="text-muted-foreground">Your profile becomes the authenticated foundation for discovery, personalization, and future collaboration workflows.</p>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${item <= step ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>
                  {item}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Step {item}</p>
                  <p className="text-xs text-muted-foreground">
                    {[
                      "Stakeholder type",
                      "Identity & organization",
                      "Geographic anchor",
                      "Impact signals",
                      "Interests & initiatives",
                    ][item - 1]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-border/70 bg-card/92 shadow-[0_28px_90px_hsl(var(--foreground)/0.14)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Step {step} of 5</CardTitle>
            <CardDescription>We keep this to the minimum needed for a strong production profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {stakeholderTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-3xl border p-4 text-left transition ${form.stakeholderType === option.value ? "border-primary bg-primary/10" : "border-border bg-background/60"}`}
                    onClick={() => setForm((current) => ({ ...current, stakeholderType: option.value }))}
                  >
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{option.blurb}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4">
                <Input placeholder="Your name" value={form.displayName} onChange={(e) => setForm((current) => ({ ...current, displayName: e.target.value }))} />
                <Input
                  placeholder="Organization"
                  value={form.organizationName}
                  onChange={(e) => setForm((current) => ({ ...current, organizationName: e.target.value }))}
                />
                <Textarea placeholder="Short bio (optional)" value={form.bio} onChange={(e) => setForm((current) => ({ ...current, bio: e.target.value }))} />
              </div>
            )}

            {step === 3 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {regionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-3xl border p-4 text-left transition ${form.region === option.value ? "border-primary bg-primary/10" : "border-border bg-background/60"}`}
                    onClick={() => setForm((current) => ({ ...current, region: option.value, city: option.city }))}
                  >
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">Anchor city: {option.city}</p>
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="grid gap-4 sm:grid-cols-3">
                <Input placeholder="Funding (USD)" value={form.fundingUsd} onChange={(e) => setForm((current) => ({ ...current, fundingUsd: e.target.value }))} />
                <Input placeholder="People reached" value={form.peopleReached} onChange={(e) => setForm((current) => ({ ...current, peopleReached: e.target.value }))} />
                <Input placeholder="Annual budget" value={form.annualBudget} onChange={(e) => setForm((current) => ({ ...current, annualBudget: e.target.value }))} />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <p className="mb-3 text-sm font-medium text-foreground">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {interestCatalog.map((interest) => {
                      const selected = form.interests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          className={`rounded-full border px-4 py-2 text-sm transition ${selected ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              interests: selected
                                ? current.interests.filter((item) => item !== interest)
                                : [...current.interests.slice(0, 5), interest],
                            }))
                          }
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[0, 1].map((index) => (
                    <Input
                      key={index}
                      placeholder={`Initiative ${index + 1}`}
                      value={form.initiatives[index] || ""}
                      onChange={(e) => {
                        const initiatives = [...form.initiatives];
                        initiatives[index] = e.target.value;
                        setForm((current) => ({ ...current, initiatives: initiatives.filter(Boolean) }));
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || isSaving}>
                Back
              </Button>
              {step < 5 ? (
                <Button type="button" onClick={next}>Continue</Button>
              ) : (
                <Button type="button" onClick={complete} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Enter SNG"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function NetworkExperience() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [visualMode, setVisualMode] = useState<VisualMode>("enhanced");
  const [showConnections, setShowConnections] = useState(true);
  const [showCountries, setShowCountries] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [nightLights, setNightLights] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 1280 : true));
  const [activeTab, setActiveTab] = useState<"profile" | "feed" | "ai">("profile");
  const [selectedId, setSelectedId] = useState<string | null>("viewer-profile");

  const stakeholders = useMemo(() => buildStakeholders(profile ?? null), [profile]);
  const arcs = useMemo(() => buildArcs(stakeholders), [stakeholders]);
  const filteredStakeholders = useMemo(
    () =>
      stakeholders.filter((stakeholder) => {
        const matchesType = typeFilter === "all" || stakeholder.type === typeFilter;
        const haystack = `${stakeholder.name} ${stakeholder.organization} ${stakeholder.region}`.toLowerCase();
        const matchesSearch = haystack.includes(search.toLowerCase());
        return matchesType && matchesSearch;
      }),
    [search, stakeholders, typeFilter],
  );

  const selectedStakeholder = stakeholders.find((stakeholder) => stakeholder.id === selectedId) || filteredStakeholders[0] || stakeholders[0];
  const feed = buildFeedPosts(selectedStakeholder);
  const insights = buildInsights(selectedStakeholder);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-3 py-3 sm:px-4 sm:py-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(var(--primary),0.16),transparent_24%),radial-gradient(circle_at_bottom_right,hsla(var(--accent),0.14),transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)))]" />
      <div className="relative z-10 grid min-h-[calc(100vh-1.5rem)] gap-3 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
        <motion.aside
          layout
          className={`${navigatorOpen ? "block" : "hidden"} order-3 overflow-hidden p-0 xl:order-none xl:block`}
        >
          <div className="command-panel h-full overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-primary">Navigator</p>
                <h2 className="text-lg font-semibold text-foreground">Stakeholders</h2>
              </div>
              <Badge>{filteredStakeholders.length}</Badge>
            </div>
            <div className="space-y-4 p-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search people, orgs, regions" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex flex-wrap gap-2">
                {["all", ...stakeholderTypeOptions.map((item) => item.value)].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.2em] ${typeFilter === option ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
                    onClick={() => setTypeFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <ScrollArea className="max-h-[24rem] xl:h-[calc(100vh-17rem)] xl:max-h-none px-3 pb-4">
              <div className="space-y-2 px-2">
                {filteredStakeholders.map((stakeholder) => (
                  <button
                    key={stakeholder.id}
                    type="button"
                    className={`w-full rounded-3xl border p-4 text-left transition ${selectedStakeholder.id === stakeholder.id ? "border-primary bg-primary/10" : "border-border bg-background/55 hover:bg-background"}`}
                    onClick={() => {
                      setSelectedId(stakeholder.id);
                      setNavigatorOpen(false);
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">{stakeholder.name}</p>
                        <p className="text-sm text-muted-foreground">{stakeholder.organization}</p>
                      </div>
                      <Badge variant="secondary">{stakeholder.type}</Badge>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {stakeholder.city}, {stakeholder.country}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </motion.aside>

        <section className="order-1 flex min-h-[70vh] flex-col gap-3 overflow-hidden xl:order-none">
          <div className="command-panel flex flex-col gap-3 p-3">
            <header className="grid gap-3 xl:grid-cols-[1fr_auto]">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/60 px-4 py-3 backdrop-blur-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="rounded-full px-3 py-1 uppercase tracking-[0.22em]">SNG</Badge>
                  <span className="text-sm text-muted-foreground">{stakeholders.length} global nodes</span>
                  <span className="text-sm text-muted-foreground">{arcs.length} active relationships</span>
                  <span className="text-sm text-muted-foreground">Mode: {visualMode}</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => setNavigatorOpen((current) => !current)}>
                  <LayoutPanelLeft className="h-4 w-4" />
                  Navigator
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </header>

            <div className="relative flex-1 min-h-[32rem]">
              <div className="mb-3 flex flex-wrap gap-2 xl:absolute xl:left-4 xl:top-4 xl:z-10 xl:mb-0 xl:max-w-[420px]">
                {visualModes.map((mode) => (
                  <button
                    key={mode.value}
                    type="button"
                    className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] backdrop-blur-sm ${visualMode === mode.value ? "border-primary bg-background/95 text-foreground" : "border-border bg-background/60 text-muted-foreground"}`}
                    onClick={() => setVisualMode(mode.value)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <GlobeScene
                arcs={arcs}
                autoRotate={autoRotate}
                mode={visualMode}
                nightLights={nightLights}
                selectedId={selectedStakeholder.id}
                showConnections={showConnections}
                showCountries={showCountries}
                stakeholders={filteredStakeholders}
                onSelect={(stakeholder) => setSelectedId(stakeholder.id)}
              />

              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:absolute xl:bottom-4 xl:left-4 xl:right-4 xl:mt-0 xl:grid-cols-5">
                {[
                  { label: "Auto rotate", value: autoRotate, setValue: setAutoRotate, icon: Orbit },
                  { label: "Connections", value: showConnections, setValue: setShowConnections, icon: Sparkles },
                  { label: "Country grid", value: showCountries, setValue: setShowCountries, icon: Globe2 },
                  { label: "Night lights", value: nightLights, setValue: setNightLights, icon: ShieldCheck },
                  { label: "Clear filter", value: typeFilter !== "all", setValue: () => setTypeFilter("all"), icon: Filter },
                ].map((toggle) => (
                  <button
                    key={toggle.label}
                    type="button"
                    className={`rounded-[1.25rem] border px-4 py-3 text-left backdrop-blur-md ${toggle.value ? "border-primary bg-background/92" : "border-border bg-background/58"}`}
                    onClick={() => toggle.setValue(typeof toggle.value === "boolean" ? !toggle.value : false)}
                  >
                    <div className="flex items-center gap-3">
                      <toggle.icon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{toggle.label}</p>
                        <p className="text-xs text-muted-foreground">{toggle.value ? "Enabled" : "Disabled"}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="order-2 xl:order-none">
          <div className="command-panel h-full overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-primary">Selected node</p>
                <h2 className="text-lg font-semibold text-foreground">{selectedStakeholder.name}</h2>
              </div>
              <Badge variant="secondary">{selectedStakeholder.type}</Badge>
            </div>

            <div className="space-y-4 px-5 py-4">
              <div className="rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
                <p className="text-sm font-medium text-foreground">{selectedStakeholder.organization}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selectedStakeholder.city}, {selectedStakeholder.country}</span>
                  <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{selectedStakeholder.region}</span>
                  <span className="inline-flex items-center gap-1"><UserRound className="h-3.5 w-3.5" />Score {selectedStakeholder.score}</span>
                </div>
              </div>

              <div className="inline-flex rounded-full border border-border bg-muted p-1">
                {[
                  { key: "profile", label: "Profile" },
                  { key: "feed", label: "Feed" },
                  { key: "ai", label: "AI" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    className={`rounded-full px-4 py-2 text-sm ${activeTab === tab.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
                    onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <ScrollArea className="max-h-[30rem] xl:h-[calc(100vh-14rem)] xl:max-h-none px-5 pb-5">
              {activeTab === "profile" && (
                <div className="space-y-5 pb-2">
                  <p className="text-sm leading-6 text-muted-foreground">{selectedStakeholder.bio}</p>
                  <div className="grid gap-3">
                    {selectedStakeholder.metrics.map((metric) => (
                      <div key={metric.label} className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{metric.label}</p>
                        <p className="mt-1 text-xl font-semibold text-foreground">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-foreground">Interests</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedStakeholder.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">{interest}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Initiatives</p>
                    <div className="mt-3 space-y-2">
                      {selectedStakeholder.initiatives.map((initiative) => (
                        <div key={initiative} className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                          {initiative}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "feed" && (
                <div className="space-y-3 pb-2">
                  {feed.map((post) => (
                    <div key={post.id} className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <Badge>{post.category}</Badge>
                        <p className="text-xs text-muted-foreground">{post.timestampLabel}</p>
                      </div>
                      <p className="mt-3 font-medium text-foreground">{post.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.content}</p>
                      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                        <span>{post.likes} likes</span>
                        <span>{post.comments} comments</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "ai" && (
                <div className="space-y-3 pb-2">
                  {insights.map((insight) => (
                    <div key={insight.id} className="rounded-[1.25rem] border border-border/70 bg-background/60 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="secondary">{insight.kind}</Badge>
                        <p className="text-xs text-primary">{insight.confidence}% confidence</p>
                      </div>
                      <p className="mt-3 font-medium text-foreground">{insight.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{insight.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </aside>
      </div>
    </main>
  );
}

const Index = () => {
  const { user, loading } = useAuth();
  const { data: profile, isLoading } = useProfile(user?.id);

  if (loading || (user && isLoading)) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthExperience />;
  }

  if (!profile?.onboarding_completed) {
    return <OnboardingExperience />;
  }

  return <NetworkExperience />;
};

export default Index;
