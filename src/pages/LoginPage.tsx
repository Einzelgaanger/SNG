import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Globe2, Sparkles, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { forgotPasswordSchema, signInSchema, signUpSchema } from "@/lib/auth-schemas";
import vggLogo from "@/assets/vgg-logo.webp";
import authRiver from "@/assets/auth-river-delta.jpg";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode as "signin" | "signup");
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
        const { error } = await supabase.auth.resetPasswordForEmail(p.data.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
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
      {/* Left — editorial brand panel */}
      <div className="relative hidden flex-1 overflow-hidden border-r border-foreground/85 lg:flex">
        <img
          src={authRiver}
          alt="Aerial view of a turquoise river delta winding through deep green forest"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/85 via-foreground/40 to-foreground/85" />
        <div className="absolute inset-0 dot-grid opacity-15 mix-blend-overlay" />

        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 text-background xl:p-16">
          <div>
            <Link
              to="/"
              className="font-mono-display inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-background/80 transition-colors hover:text-primary-glow"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
            <a href="/" className="mt-10 block w-fit">
              <img src={vggLogo} alt="Venture Garden Group" className="h-9 w-auto brightness-0 invert" />
            </a>
          </div>

          <div className="fade-in-slow max-w-lg flex-1 space-y-8 py-12">
            <span className="font-mono-display inline-flex items-center gap-2 border-l-2 border-primary-glow px-2.5 text-[10.5px] uppercase tracking-[0.24em] text-primary-glow">
              ◉ Stakeholder Network Globe
            </span>
            <h1 className="font-display text-[clamp(2.75rem,4vw,4rem)] font-medium leading-[0.95] tracking-[-0.04em] text-background">
              The atlas of <em className="font-light text-primary-glow">what's possible.</em>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-background/80">
              Discover stakeholders, visualize partnerships on an interactive globe, and unlock collaboration signals
              across emerging economies.
            </p>

            <div className="grid grid-cols-3 gap-px border border-background/20 bg-background/15">
              {[
                { icon: Globe2, label: "Globe", sub: "3D network" },
                { icon: Users, label: "People", sub: "Profiles" },
                { icon: Sparkles, label: "AI", sub: "Signals" },
              ].map((f) => (
                <div key={f.label} className="bg-foreground/40 p-4 backdrop-blur-md">
                  <f.icon className="mb-2.5 h-5 w-5 text-primary-glow" strokeWidth={1.5} />
                  <p className="font-mono-display text-[11px] uppercase tracking-[0.18em] text-background">{f.label}</p>
                  <p className="mt-0.5 text-xs text-background/65">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="font-mono-display flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10.5px] uppercase tracking-[0.22em] text-background/60">
            <span>Index 001 / 2026</span>
            <span>Fig. 03 — River delta, dawn</span>
          </div>
        </div>
      </div>

      {/* Right — auth */}
      <div className="relative flex w-full flex-col bg-paper-deep/30 lg:w-[min(100%,560px)] lg:shrink-0 xl:w-[600px]">
        <div className="pointer-events-none absolute inset-0 topo opacity-50" />
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-10 sm:py-14">
          <Link to="/" className="font-mono-display mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground lg:hidden">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <a href="/" className="mb-6 lg:hidden">
            <img src={vggLogo} alt="Venture Garden Group" className="h-8 w-auto" />
          </a>

          <div className="fade-in w-full max-w-[440px] space-y-6">
            <div className="auth-form-shell space-y-7">
              <div className="space-y-3">
                <span className="font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-primary">
                  {mode === "signin" ? "01 · Return" : mode === "signup" ? "01 · Begin" : "01 · Recover"}
                </span>
                <h2 className="font-display text-4xl leading-[0.95] tracking-tight text-foreground">
                  {mode === "signin" ? "Welcome back." : mode === "signup" ? <>Create your<br /><em className="font-light text-primary">account.</em></> : "Reset password."}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {mode === "signin" && "Sign in to access your stakeholder network."}
                  {mode === "signup" && "Join the network and start mapping collaborations."}
                  {mode === "forgot" && "We'll email you a secure link to choose a new password."}
                </p>
              </div>

              {mode !== "forgot" && (
                <div className="grid grid-cols-2 border border-border bg-paper-deep/30 p-1">
                  {(["signin", "signup"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        "font-mono-display py-2.5 text-[11px] uppercase tracking-[0.18em] transition-all",
                        mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {m === "signin" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="h-11 rounded-sm border-foreground/15 bg-background" disabled={submitting} onClick={() => handleOAuth("google")}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-11 rounded-sm border-foreground/15 bg-background" disabled={submitting} onClick={() => handleOAuth("apple")}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Apple
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <span className="font-mono-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  or email
                </span>
              </div>

              <form className="space-y-3" onSubmit={handleEmailAuth}>
                {mode === "signup" && (
                  <Input
                    placeholder="Full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-11 rounded-sm border-border bg-background"
                    autoComplete="name"
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-sm border-border bg-background"
                  autoComplete="email"
                />
                {mode !== "forgot" && (
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 rounded-sm border-border bg-background"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                )}
                <Button type="submit" className="h-12 w-full rounded-sm text-sm font-semibold" disabled={submitting}>
                  {submitting
                    ? "Working…"
                    : mode === "signin"
                      ? "Sign in"
                      : mode === "signup"
                        ? "Create account"
                        : "Send recovery link"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="font-mono-display flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.18em]">
                {mode === "forgot" ? (
                  <button type="button" className="text-muted-foreground transition hover:text-primary" onClick={() => setMode("signin")}>
                    ← Back to sign in
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="text-muted-foreground transition hover:text-primary"
                      onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                    >
                      {mode === "signin" ? "Need an account?" : "Have an account?"}
                    </button>
                    <span className="text-border">·</span>
                    <button
                      type="button"
                      className="text-muted-foreground transition hover:text-primary"
                      onClick={() => setMode("forgot")}
                    >
                      Forgot password?
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="font-mono-display text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              By continuing you agree to Terms · Privacy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
