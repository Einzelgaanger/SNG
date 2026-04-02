import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Globe2, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { resetPasswordSchema } from "@/lib/auth-schemas";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canReset = useMemo(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    return hash.includes("type=recovery") || hash.includes("access_token=");
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Please check your password");
      return;
    }
    try {
      setSubmitting(true);
      const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
      if (error) throw error;
      toast.success("Password updated. You can now sign in.");
      window.location.href = "/";
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="mesh-hero pointer-events-none absolute inset-0 opacity-90" />
      <div className="relative w-full max-w-md">
        <Link
          to="/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 shadow-sm">
            <Globe2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">SNG</span>
        </div>
        <Card className="auth-form-shell border-border/40 bg-card/90">
          <CardHeader className="space-y-4 pb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">New password</CardTitle>
              <CardDescription className="text-muted-foreground">Choose a strong password to secure your account.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {!canReset ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                Open this page from the recovery email link to continue.
              </p>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-border/50 bg-background/60"
                  autoComplete="new-password"
                />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 border-border/50 bg-background/60"
                  autoComplete="new-password"
                />
                <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={submitting}>
                  {submitting ? "Updating…" : "Update password"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
