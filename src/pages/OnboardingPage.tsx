import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Briefcase, Check, Globe2, Linkedin, Link2, MapPin, Phone, User,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { onboardingSchema, type OnboardingValues } from "@/lib/auth-schemas";
import { interestCatalog, regionOptions } from "@/lib/mock-stakeholders";
import type { StakeholderType } from "@/types/sng";
import vggLogo from "@/assets/vgg-logo.webp";

const stakeholderTypes: { value: StakeholderType; label: string; desc: string }[] = [
  { value: "entrepreneur", label: "Entrepreneur", desc: "Building new ventures" },
  { value: "university", label: "University", desc: "Research & academia" },
  { value: "investor", label: "Investor", desc: "Allocating capital" },
  { value: "government", label: "Government", desc: "Public institutions" },
  { value: "corporate", label: "Corporate", desc: "Enterprise scale" },
  { value: "nonprofit", label: "Nonprofit", desc: "Mission-driven" },
  { value: "other", label: "Other", desc: "Broader ecosystem" },
];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: profile, isLoading, updateProfile, isSaving } = useProfile(user?.id);
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const [form, setForm] = useState<OnboardingValues>({
    stakeholderType: "entrepreneur",
    displayName: "",
    organizationName: "",
    region: regionOptions[0].value,
    city: "",
    country: "",
    bio: "",
    linkedinUrl: "",
    websiteUrl: "",
    phone: "",
    fundingUsd: "",
    peopleReached: "",
    annualBudget: "",
    interests: [],
    initiatives: [],
  });

  useEffect(() => {
    if (profile) {
      const im = profile.impact_metrics as Record<string, string | number | undefined> | undefined;
      setForm({
        stakeholderType: profile.stakeholder_type || "entrepreneur",
        displayName: profile.display_name || "",
        organizationName: profile.organization_name || "",
        region: profile.region || regionOptions[0].value,
        city: profile.city || "",
        country: profile.country || "",
        bio: profile.bio || "",
        linkedinUrl: profile.linkedin_url || "",
        websiteUrl: profile.website_url || "",
        phone: profile.phone || "",
        fundingUsd: String(im?.fundingUsd || ""),
        peopleReached: String(im?.peopleReached || ""),
        annualBudget: String(im?.annualBudget || ""),
        interests: profile.interests || [],
        initiatives: profile.initiatives || [],
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
    if (!loading && !isLoading && profile?.onboarding_completed) navigate("/app");
  }, [loading, user, isLoading, profile, navigate]);

  if (loading || isLoading) return <LoadingScreen />;
  if (!user) return null;

  const next = () => {
    if (step === 1 && !form.stakeholderType) return toast.error("Select your role");
    if (step === 2 && (!form.displayName.trim() || !form.organizationName.trim())) return toast.error("Name and organization are required");
    if (step === 3 && !form.region) return toast.error("Choose a region");
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const complete = async () => {
    const parsed = onboardingSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Check your details");
      return;
    }
    try {
      await updateProfile({
        display_name: parsed.data.displayName,
        stakeholder_type: parsed.data.stakeholderType,
        organization_name: parsed.data.organizationName,
        region: parsed.data.region,
        city: parsed.data.city || null,
        country: parsed.data.country || null,
        bio: parsed.data.bio || null,
        linkedin_url: parsed.data.linkedinUrl || null,
        website_url: parsed.data.websiteUrl || null,
        phone: parsed.data.phone || null,
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
      navigate("/app");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    }
  };

  const stepLabels = ["Role", "Identity", "Contact", "Location", "Impact", "Interests"];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — progress sidebar */}
      <div className="relative hidden w-[360px] flex-col justify-between overflow-hidden border-r border-border/50 lg:flex">
        <div className="absolute inset-0 bg-muted/30" />
        <div className="relative z-10 flex flex-1 flex-col justify-between p-10">
          <div className="space-y-8">
            <img src={vggLogo} alt="VGG" className="h-8 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Set up your profile</h1>
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
            <div className="flex-1 rounded-full bg-border h-1.5">
              <div className="h-1.5 rounded-full bg-primary transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{step}/{totalSteps}</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="fade-in w-full max-w-lg space-y-8">
          <div className="flex items-center gap-2 lg:hidden">
            {stepLabels.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i + 1 <= step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">{stepLabels[step - 1]}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === 1 && "What best describes your role in the ecosystem?"}
              {step === 2 && "Tell us who you are."}
              {step === 3 && "How can people reach you? (Optional but recommended)"}
              {step === 4 && "Where are you based?"}
              {step === 5 && "Optional impact metrics for your profile."}
              {step === 6 && "Select your focus areas."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              {step === 1 && (
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {stakeholderTypes.map((t) => (
                    <button key={t.value} type="button" className={`rounded-xl border p-4 text-left transition-all ${form.stakeholderType === t.value ? "border-primary bg-primary/5 glow-ring" : "border-border hover:border-primary/30"}`} onClick={() => setForm((f) => ({ ...f, stakeholderType: t.value }))}>
                      <p className="text-sm font-medium text-foreground">{t.label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                    </button>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Your full name" value={form.displayName} onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))} className="h-11 pl-10" />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Organization" value={form.organizationName} onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))} className="h-11 pl-10" />
                  </div>
                  <Textarea placeholder="Short bio — tell others about your work (optional)" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
                </div>
              )}
              {step === 3 && (
                <div className="space-y-3">
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="LinkedIn profile URL" value={form.linkedinUrl} onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))} className="h-11 pl-10" />
                  </div>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Website URL" value={form.websiteUrl} onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))} className="h-11 pl-10" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Phone number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="h-11 pl-10" />
                  </div>
                  <p className="text-xs text-muted-foreground/60">Contact info helps others connect with you. It's visible only to authenticated members.</p>
                </div>
              )}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {regionOptions.map((r) => (
                      <button key={r.value} type="button" className={`rounded-xl border p-4 text-left transition-all ${form.region === r.value ? "border-primary bg-primary/5 glow-ring" : "border-border hover:border-primary/30"}`} onClick={() => setForm((f) => ({ ...f, region: r.value, city: r.city }))}>
                        <p className="text-sm font-medium text-foreground">{r.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{r.city}</p>
                      </button>
                    ))}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="City" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} className="h-11 pl-10" />
                    </div>
                    <Input placeholder="Country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} className="h-11" />
                  </div>
                </div>
              )}
              {step === 5 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  <Input placeholder="Funding (USD)" value={form.fundingUsd} onChange={(e) => setForm((f) => ({ ...f, fundingUsd: e.target.value }))} className="h-11" />
                  <Input placeholder="People reached" value={form.peopleReached} onChange={(e) => setForm((f) => ({ ...f, peopleReached: e.target.value }))} className="h-11" />
                  <Input placeholder="Annual budget" value={form.annualBudget} onChange={(e) => setForm((f) => ({ ...f, annualBudget: e.target.value }))} className="h-11" />
                </div>
              )}
              {step === 6 && (
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-sm font-medium text-foreground">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {interestCatalog.map((interest) => {
                        const sel = form.interests.includes(interest);
                        return (
                          <button key={interest} type="button" className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${sel ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:border-primary/30"}`} onClick={() => setForm((f) => ({ ...f, interests: sel ? f.interests.filter((i) => i !== interest) : [...f.interests.slice(0, 5), interest] }))}>
                            {interest}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[0, 1].map((idx) => (
                      <Input key={idx} placeholder={`Initiative ${idx + 1}`} value={form.initiatives[idx] || ""} className="h-11" onChange={(e) => { const initiatives = [...form.initiatives]; initiatives[idx] = e.target.value; setForm((f) => ({ ...f, initiatives: initiatives.filter(Boolean) })); }} />
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
