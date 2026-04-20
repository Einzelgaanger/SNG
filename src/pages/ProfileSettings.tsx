import { useEffect, useState } from "react";
import {
  Bell,
  Briefcase,
  Check,
  Globe2,
  Linkedin,
  Link2,
  MapPin,
  Phone,
  Save,
  Sparkles,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useRoles } from "@/hooks/use-roles";
import { usePreferences } from "@/hooks/use-preferences";
import { proximityOptions, type ProximityRadius } from "@/lib/preferences-store";
import { interestCatalog, regionOptions } from "@/lib/mock-stakeholders";
import type { StakeholderType } from "@/types/sng";

const stakeholderTypes: { value: StakeholderType; label: string }[] = [
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "university", label: "University" },
  { value: "investor", label: "Investor" },
  { value: "government", label: "Government" },
  { value: "corporate", label: "Corporate" },
  { value: "nonprofit", label: "Nonprofit" },
  { value: "other", label: "Other" },
];

export default function ProfileSettings() {
  const { user } = useAuth();
  const { data: profile, updateProfile, isSaving } = useProfile(user?.id);
  const { roles } = useRoles(user?.id);
  const { prefs, update: updatePrefs } = usePreferences();

  const [displayName, setDisplayName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [bio, setBio] = useState("");
  const [stakeholderType, setStakeholderType] = useState<StakeholderType>("entrepreneur");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [initiatives, setInitiatives] = useState<string[]>([]);
  const [newInitiative, setNewInitiative] = useState("");
  const [fundingUsd, setFundingUsd] = useState("");
  const [peopleReached, setPeopleReached] = useState("");
  const [annualBudget, setAnnualBudget] = useState("");

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setOrganizationName(profile.organization_name || "");
      setBio(profile.bio || "");
      setStakeholderType(profile.stakeholder_type || "entrepreneur");
      setRegion(profile.region || "");
      setCity(profile.city || "");
      setCountry(profile.country || "");
      setLinkedinUrl(profile.linkedin_url || "");
      setWebsiteUrl(profile.website_url || "");
      setPhone(profile.phone || "");
      setInterests(profile.interests || []);
      setInitiatives(profile.initiatives || []);
      const im = profile.impact_metrics as Record<string, string | number | undefined> | undefined;
      setFundingUsd(String(im?.fundingUsd || ""));
      setPeopleReached(String(im?.peopleReached || ""));
      setAnnualBudget(String(im?.annualBudget || ""));
    }
  }, [profile]);

  const handleSave = async () => {
    if (!displayName.trim()) return toast.error("Name is required");
    try {
      await updateProfile({
        display_name: displayName,
        organization_name: organizationName || null,
        bio: bio || null,
        stakeholder_type: stakeholderType,
        region: region || null,
        city: city || null,
        country: country || null,
        linkedin_url: linkedinUrl || null,
        website_url: websiteUrl || null,
        phone: phone || null,
        interests,
        initiatives,
        impact_metrics: {
          fundingUsd: fundingUsd || null,
          peopleReached: peopleReached || null,
          annualBudget: annualBudget || null,
        },
      });
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    }
  };

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-header">
          <div>
            <h1 className="app-header-title">Profile Settings</h1>
            <p className="app-header-description">Manage your stakeholder profile and preferences.</p>
          </div>
          <div className="flex items-center gap-2">
            {roles.map((r) => (
              <Badge key={r} variant="secondary" className="text-[10px] font-semibold uppercase">{r}</Badge>
            ))}
          </div>
        </div>

        {/* Identity */}
        <section className="surface-card space-y-4">
          <h2 className="text-lg font-medium text-foreground">Identity</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Full name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-11 border-border/50 bg-card/50 pl-10" />
            </div>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Organization" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} className="h-11 border-border/50 bg-card/50 pl-10" />
            </div>
          </div>
          <Textarea placeholder="Bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="border-border/50 bg-card/50" />
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Role</p>
            <div className="flex flex-wrap gap-2">
              {stakeholderTypes.map((t) => (
                <button key={t.value} type="button" className={`rounded-full border px-3 py-1.5 text-sm transition-all ${stakeholderType === t.value ? "border-primary bg-primary/10 text-foreground" : "border-border/50 text-muted-foreground hover:border-primary/30"}`} onClick={() => setStakeholderType(t.value)}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="surface-card space-y-4">
          <h2 className="text-lg font-medium text-foreground">Contact</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="LinkedIn URL" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="h-11 border-border/50 bg-card/50 pl-10" />
            </div>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Website URL" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="h-11 border-border/50 bg-card/50 pl-10" />
            </div>
          </div>
          <div className="relative sm:max-w-xs">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 border-border/50 bg-card/50 pl-10" />
          </div>
        </section>

        {/* Location */}
        <section className="surface-card space-y-4">
          <h2 className="text-lg font-medium text-foreground">Location</h2>
          <div className="flex flex-wrap gap-2">
            {regionOptions.map((r) => (
              <button key={r.value} type="button" className={`rounded-full border px-3 py-1.5 text-sm transition-all ${region === r.value ? "border-primary bg-primary/10 text-foreground" : "border-border/50 text-muted-foreground hover:border-primary/30"}`} onClick={() => setRegion(r.value)}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="h-11 border-border/50 bg-card/50 pl-10" />
            </div>
            <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="h-11 border-border/50 bg-card/50" />
          </div>
        </section>

        {/* Interests */}
        <section className="surface-card space-y-4">
          <h2 className="text-lg font-medium text-foreground">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {interestCatalog.map((interest) => {
              const sel = interests.includes(interest);
              return (
                <button key={interest} type="button" className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${sel ? "border-primary bg-primary/10 text-foreground" : "border-border/50 text-muted-foreground hover:border-primary/30"}`} onClick={() => setInterests(sel ? interests.filter((i) => i !== interest) : [...interests.slice(0, 5), interest])}>
                  {interest}
                </button>
              );
            })}
          </div>
        </section>

        {/* Initiatives */}
        <section className="surface-card space-y-4">
          <h2 className="text-lg font-medium text-foreground">Initiatives</h2>
          <p className="text-xs text-muted-foreground">Programs, projects, or campaigns you're driving.</p>
          <div className="flex gap-2">
            <Input
              placeholder="Add an initiative…"
              value={newInitiative}
              onChange={(e) => setNewInitiative(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newInitiative.trim()) {
                  e.preventDefault();
                  setInitiatives([...initiatives, newInitiative.trim()]);
                  setNewInitiative("");
                }
              }}
              className="h-11 border-border/50 bg-card/50"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (!newInitiative.trim()) return;
                setInitiatives([...initiatives, newInitiative.trim()]);
                setNewInitiative("");
              }}
            >
              Add
            </Button>
          </div>
          {initiatives.length > 0 && (
            <div className="space-y-2">
              {initiatives.map((init, idx) => (
                <div key={`${init}-${idx}`} className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5">
                  <span className="text-sm text-foreground">{init}</span>
                  <button
                    type="button"
                    onClick={() => setInitiatives(initiatives.filter((_, i) => i !== idx))}
                    className="text-xs text-muted-foreground transition hover:text-destructive"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notification Preferences */}
        <section className="surface-card space-y-5">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-foreground">Notification Preferences</h2>
              <p className="text-xs text-muted-foreground">
                Control which alerts surface in your feed and how local they should be.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Minimum match score</p>
                <p className="text-xs text-muted-foreground">
                  Only notify me about matches at or above this score.
                </p>
              </div>
              <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {prefs.minMatchScore}%
              </span>
            </div>
            <Slider
              value={[prefs.minMatchScore]}
              min={0}
              max={100}
              step={5}
              onValueChange={(v) => updatePrefs({ minMatchScore: v[0] })}
              className="pt-2"
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/30 px-3 py-3">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Proximity radius
              </p>
              <p className="text-xs text-muted-foreground">
                {proximityOptions.find((p) => p.value === prefs.proximity)?.description}
              </p>
            </div>
            <Select
              value={prefs.proximity}
              onValueChange={(v) => updatePrefs({ proximity: v as ProximityRadius })}
            >
              <SelectTrigger className="h-9 w-[140px] border-border/50 bg-card text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {proximityOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> New match alerts
                </p>
                <p className="text-xs text-muted-foreground">When stakeholders match your filters.</p>
              </div>
              <Switch
                checked={prefs.notifyNewMatches}
                onCheckedChange={(v) => updatePrefs({ notifyNewMatches: v })}
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Globe2 className="h-3.5 w-3.5 text-primary" /> Location overlap
                </p>
                <p className="text-xs text-muted-foreground">When a strong match is in your region.</p>
              </div>
              <Switch
                checked={prefs.notifyLocationOverlap}
                onCheckedChange={(v) => updatePrefs({ notifyLocationOverlap: v })}
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/30 px-3 py-3">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <User className="h-3.5 w-3.5 text-primary" /> Profile tips
                </p>
                <p className="text-xs text-muted-foreground">Suggestions to strengthen your profile.</p>
              </div>
              <Switch
                checked={prefs.notifyProfileTips}
                onCheckedChange={(v) => updatePrefs({ notifyProfileTips: v })}
              />
            </label>
          </div>
        </section>

        <section className="surface-card space-y-4">
          <h2 className="text-lg font-medium text-foreground">Impact Metrics</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <Input placeholder="Funding (USD)" value={fundingUsd} onChange={(e) => setFundingUsd(e.target.value)} className="h-11 border-border/50 bg-card/50" />
            <Input placeholder="People reached" value={peopleReached} onChange={(e) => setPeopleReached(e.target.value)} className="h-11 border-border/50 bg-card/50" />
            <Input placeholder="Annual budget" value={annualBudget} onChange={(e) => setAnnualBudget(e.target.value)} className="h-11 border-border/50 bg-card/50" />
          </div>
        </section>

        <div className="flex justify-end pb-2">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
