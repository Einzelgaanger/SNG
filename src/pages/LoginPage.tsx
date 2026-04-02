import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Globe2, Shield, Sparkles, Users, Zap } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { forgotPasswordSchema, signInSchema, signUpSchema } from "@/lib/auth-schemas";
import vggLogo from "@/assets/vgg-logo.webp";
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
      {/* Left — brand */}
      <div className="relative hidden flex-1 overflow-hidden lg:flex">
        <div className="mesh-panel absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg className="absolute -right-16 top-24 h-[480px] w-[480px] text-primary/[0.07]" viewBox="0 0 500 500" fill="none" aria-hidden>
            <circle cx="250" cy="250" r="180" stroke="currentColor" strokeWidth="1" />
            <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <svg className="absolute -bottom-12 -left-12 h-[320px] w-[320px] text-accent/[0.07]" viewBox="0 0 350 350" fill="none" aria-hidden>
            <circle cx="175" cy="175" r="130" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-1 flex-col justify-between p-12 xl:p-16">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <a href="/" className="mt-10 block w-fit">
              <img src={vggLogo} alt="Venture Garden Group" className="h-9 w-auto" />
            </a>
          </div>

          <div className="fade-in-slow max-w-lg flex-1 space-y-8 py-12">
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground xl:text-5xl">
              Map your global{" "}
              <span className="bg-gradient-to-r from-primary to-primary/85 bg-clip-text text-transparent">innovation network.</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Discover stakeholders, visualize partnerships on an interactive globe, and unlock collaboration signals.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Globe2, label: "Globe", sub: "3D network" },
                { icon: Users, label: "People", sub: "Profiles" },
                { icon: Sparkles, label: "AI", sub: "Signals" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="rounded-2xl border border-border/50 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-primary/25"
                >
                  <f.icon className="mb-2.5 h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold text-foreground">{f.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-primary/70" /> Enterprise-grade security
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary/70" /> Real-time intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Right — auth */}
      <div className="relative flex w-full flex-col bg-muted/15 lg:w-[min(100%,520px)] lg:shrink-0 xl:w-[560px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.06),transparent)]" />
        <div className="relative flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
          <Link to="/" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <a href="/" className="mb-6 lg:hidden">
            <img src={vggLogo} alt="Venture Garden Group" className="h-8 w-auto" />
          </a>

          <div className="fade-in w-full max-w-[400px] space-y-6 sm:space-y-8">
            <div className="auth-form-shell space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {mode === "signin" && "Sign in to access your stakeholder network."}
                  {mode === "signup" && "Join the network and start mapping collaborations."}
                  {mode === "forgot" && "We’ll email you a secure link to choose a new password."}
                </p>
              </div>

              {mode !== "forgot" && (
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-border/60 bg-muted/30 p-1">
                  {(["signin", "signup"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={cn(
                        "rounded-lg py-2.5 text-sm font-medium transition-all",
                        mode === m
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {m === "signin" ? "Sign in" : "Sign up"}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="h-11 bg-background/80" disabled={submitting} onClick={() => handleOAuth("google")}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-11 bg-background/80" disabled={submitting} onClick={() => handleOAuth("apple")}>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Apple
                </Button>
              </div>

              <div className="relative">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                  or email
                </span>
              </div>

              <form className="space-y-3" onSubmit={handleEmailAuth}>
                {mode === "signup" && (
                  <Input
                    placeholder="Full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-11 border-border/50 bg-background/60"
                    autoComplete="name"
                  />
                )}
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-border/50 bg-background/60"
                  autoComplete="email"
                />
                {mode !== "forgot" && (
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-border/50 bg-background/60"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                )}
                <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={submitting}>
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

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                {mode === "forgot" ? (
                  <button type="button" className="text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline" onClick={() => setMode("signin")}>
                    Back to sign in
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
                      onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                    >
                      {mode === "signin" ? "Need an account?" : "Already have an account?"}
                    </button>
                    <span className="hidden text-border sm:inline">·</span>
                    <button
                      type="button"
                      className="text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
                      onClick={() => setMode("forgot")}
                    >
                      Forgot password?
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground/70">
              By continuing you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
