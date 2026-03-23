import { useMemo, useState } from "react";
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
  Shield,
  Sparkles,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

import authBg from "@/assets/auth-collaboration.jpg";
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

/* ─── Auth ────────────────────────────────────────────────── */

function AuthExperience() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (mode === "signin") {
        const p = signInSchema.safeParse({ email, password });
        if (!p.success) throw new Error(p.error.issues[0]?.message);
        const { error } = await supabase.auth.signInWithPassword({ email: p.data.email, password: p.data.password });
        if (error) throw error;
        toast.success("Signed in.");
      } else if (mode === "signup") {
        const p = signUpSchema.safeParse({ email, password, displayName });
        if (!p.success) throw new Error(p.error.issues[0]?.message);
        const { error } = await supabase.auth.signUp({
          email: p.data.email,
          password: p.data.password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: p.data.displayName } },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account.");
      } else {
        const p = forgotPasswordSchema.safeParse({ email });
        if (!p.success) throw new Error(p.error.issues[0]?.message);
        const { error } = await supabase.auth.resetPasswordForEmail(p.data.email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success("Recovery email sent.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      setSubmitting(true);
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
      if ((result as { error?: Error }).error) throw (result as { error: Error }).error;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Could not continue with ${provider}`);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — immersive hero with image */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <img
          src={authBg}
          alt="Global collaboration"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 xl:p-16">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                <Globe2 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-semibold tracking-wide text-foreground">SNG</span>
            </div>
          </div>

          <div className="fade-in-slow max-w-lg space-y-8">
            <h1 className="text-5xl leading-[1.08] text-foreground xl:text-6xl">
              Map your global{" "}
              <span className="text-gradient-warm">innovation network.</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Discover stakeholders, visualize partnerships on an interactive globe, and unlock collaboration signals — all from one unified platform.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Globe2, label: "Globe View", sub: "Interactive 3D network" },
                { icon: Users, label: "Stakeholders", sub: "Global profiles" },
                { icon: Sparkles, label: "AI Insights", sub: "Smart signals" },
              ].map((f) => (
                <div key={f.label} className="rounded-xl border border-border/40 bg-card/50 p-4 backdrop-blur-sm">
                  <f.icon className="mb-2.5 h-5 w-5 text-primary" />
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-primary/60" /> Enterprise-grade security</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-primary/60" /> Real-time network intelligence</span>
          </div>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-[480px] lg:shrink-0 xl:w-[520px]">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <Globe2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-foreground">SNG</span>
        </div>

        <div className="fade-in w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl text-foreground">
              {mode === "signin" ? "Welcome back" : mode === "signup" ? "Get started" : "Reset password"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to access your stakeholder network."
                : mode === "signup"
                  ? "Create your account to join the network."
                  : "We'll send you a recovery link."}
            </p>
          </div>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" className="h-11 border-border/60 bg-card/50" disabled={submitting} onClick={() => handleOAuth("google")}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google
            </Button>
            <Button type="button" variant="outline" className="h-11 border-border/60 bg-card/50" disabled={submitting} onClick={() => handleOAuth("apple")}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Apple
            </Button>
          </div>

          <div className="relative">
            <Separator className="bg-border/50" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">or continue with email</span>
          </div>

          <form className="space-y-3" onSubmit={handleEmailAuth}>
            {mode === "signup" && (
              <Input placeholder="Full name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-11 border-border/50 bg-card/50 placeholder:text-muted-foreground/60" />
            )}
            <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 border-border/50 bg-card/50 placeholder:text-muted-foreground/60" />
            {mode !== "forgot" && (
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 border-border/50 bg-card/50 placeholder:text-muted-foreground/60" />
            )}
            <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={submitting}>
              {submitting ? "Working…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send recovery link"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="flex items-center justify-center gap-4 text-sm">
            {mode !== "signin" && (
              <button type="button" className="text-muted-foreground transition hover:text-primary" onClick={() => setMode("signin")}>
                Sign in
              </button>
            )}
            {mode !== "signup" && (
              <button type="button" className="text-muted-foreground transition hover:text-primary" onClick={() => setMode("signup")}>
                Create account
              </button>
            )}
            {mode !== "forgot" && (
              <button type="button" className="text-muted-foreground transition hover:text-primary" onClick={() => setMode("forgot")}>
                Forgot password?
              </button>
            )}
          </div>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground/60">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

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
      {/* Left — progress sidebar with background image */}
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
          {/* Mobile progress */}
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
                    <button
                      key={t.value}
                      type="button"
                      className={`rounded-xl border p-4 text-left transition-all ${form.stakeholderType === t.value ? "border-primary bg-primary/5 glow-ring" : "border-border/50 hover:border-primary/30"}`}
                      onClick={() => setForm((f) => ({ ...f, stakeholderType: t.value }))}
                    >
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
                    <button
                      key={r.value}
                      type="button"
                      className={`rounded-xl border p-4 text-left transition-all ${form.region === r.value ? "border-primary bg-primary/5 glow-ring" : "border-border/50 hover:border-primary/30"}`}
                      onClick={() => setForm((f) => ({ ...f, region: r.value, city: r.city }))}
                    >
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
                          <button
                            key={interest}
                            type="button"
                            className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${sel ? "border-primary bg-primary/10 text-foreground" : "border-border/50 text-muted-foreground hover:border-primary/30"}`}
                            onClick={() => setForm((f) => ({ ...f, interests: sel ? f.interests.filter((i) => i !== interest) : [...f.interests.slice(0, 5), interest] }))}
                          >
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[0, 1].map((idx) => (
                      <Input
                        key={idx}
                        placeholder={`Initiative ${idx + 1}`}
                        value={form.initiatives[idx] || ""}
                        className="h-11 border-border/50 bg-card/50"
                        onChange={(e) => {
                          const initiatives = [...form.initiatives];
                          initiatives[idx] = e.target.value;
                          setForm((f) => ({ ...f, initiatives: initiatives.filter(Boolean) }));
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1 || isSaving}>
              Back
            </Button>
            {step < totalSteps ? (
              <Button type="button" size="sm" onClick={next}>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" size="sm" onClick={complete} disabled={isSaving}>
                {isSaving ? "Saving…" : "Enter SNG"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
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
    () =>
      stakeholders.filter((s) => {
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
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      {/* Top bar */}
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
            <button
              key={m.value}
              type="button"
              className={`hidden rounded-lg px-2.5 py-1.5 text-xs font-medium transition sm:block ${visualMode === m.value ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setVisualMode(m.value)}
            >
              {m.label}
            </button>
          ))}
          <Separator orientation="vertical" className="mx-1 h-5 hidden sm:block" />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setNavigatorOpen((v) => !v)}>
            <LayoutPanelLeft className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => { if (selected) setProfileOpen((v) => !v); }}>
            <UserRound className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => signOut()}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Navigator panel */}
        <AnimatePresence>
          {navigatorOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative z-10 shrink-0 overflow-hidden border-r border-border/40"
            >
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
                      <button key={v} type="button" className={`rounded-md px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition ${typeFilter === v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setTypeFilter(v)}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <ScrollArea className="flex-1 px-3 pb-4">
                  {filteredStakeholders.length === 0 && (
                    <p className="px-2 py-8 text-center text-sm text-muted-foreground">No stakeholders yet. Complete onboarding to appear on the globe.</p>
                  )}
                  {filteredStakeholders.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`mb-1.5 w-full rounded-xl border p-3.5 text-left transition-all ${selected?.id === s.id ? "border-primary/30 bg-primary/5 glow-ring" : "border-transparent hover:bg-muted/40"}`}
                      onClick={() => { setSelectedId(s.id); setProfileOpen(true); setNavigatorOpen(false); }}
                    >
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.organization}</p>
                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {s.city}, {s.country}
                      </div>
                    </button>
                  ))}
                </ScrollArea>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Globe */}
        <div className="relative flex-1">
          <GlobeScene
            arcs={arcs}
            autoRotate={autoRotate}
            mode={visualMode}
            nightLights={nightLights}
            selectedId={selected?.id ?? null}
            showConnections={showConnections}
            showCountries={showCountries}
            stakeholders={filteredStakeholders}
            onSelect={(s) => { setSelectedId(s.id); setProfileOpen(true); }}
          />

          {/* Bottom controls */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Rotate", icon: Orbit, active: autoRotate, toggle: () => setAutoRotate((v) => !v) },
              { label: "Arcs", icon: Network, active: showConnections, toggle: () => setShowConnections((v) => !v) },
              { label: "Grid", icon: Globe2, active: showCountries, toggle: () => setShowCountries((v) => !v) },
              { label: "Night", icon: Moon, active: nightLights, toggle: () => setNightLights((v) => !v) },
              { label: "Reset", icon: Filter, active: typeFilter !== "all", toggle: () => setTypeFilter("all") },
            ].map((c) => (
              <button
                key={c.label}
                type="button"
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium backdrop-blur-lg transition-all ${c.active ? "border-primary/30 bg-card/80 text-primary glow-ring" : "border-border/30 bg-card/60 text-muted-foreground hover:text-foreground"}`}
                onClick={c.toggle}
              >
                <c.icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {stakeholders.length === 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="glass-panel max-w-sm p-8 text-center">
                <Globe2 className="mx-auto mb-4 h-10 w-10 text-primary/50" />
                <h3 className="text-xl text-foreground">Your globe is empty</h3>
                <p className="mt-2 text-sm text-muted-foreground">Complete onboarding to place yourself on the network. Stakeholders will appear here as the network grows.</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile panel */}
        <AnimatePresence>
          {profileOpen && selected && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 380, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="relative z-10 shrink-0 overflow-hidden border-l border-border/40"
            >
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
                    <button
                      key={tab}
                      type="button"
                      className={`border-b-2 px-3 py-2.5 text-sm font-medium capitalize transition ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                      onClick={() => setActiveTab(tab)}
                    >
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
                          <div className="flex flex-wrap gap-1.5">
                            {selected.interests.map((i) => <Badge key={i} variant="secondary" className="text-xs">{i}</Badge>)}
                          </div>
                        </div>
                      )}
                      {selected.initiatives.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Initiatives</p>
                          {selected.initiatives.map((i) => (
                            <div key={i} className="mb-1.5 rounded-xl border border-border/30 px-4 py-3 text-sm text-muted-foreground">{i}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "feed" && (
                    <div className="space-y-3">
                      {feed.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No activity yet.</p>}
                      {feed.map((p) => (
                        <div key={p.id} className="rounded-xl border border-border/30 bg-muted/20 p-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-[10px]">{p.category}</Badge>
                            <span className="text-[11px] text-muted-foreground">{p.timestampLabel}</span>
                          </div>
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
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-[10px] uppercase">{ins.kind}</Badge>
                            <span className="text-xs font-semibold text-primary">{ins.confidence}%</span>
                          </div>
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

  if (loading || (user && isLoading)) return <LoadingScreen />;
  if (!user) return <AuthExperience />;
  if (!profile?.onboarding_completed) return <OnboardingExperience />;
  return <NetworkExperience />;
};

export default Index;
