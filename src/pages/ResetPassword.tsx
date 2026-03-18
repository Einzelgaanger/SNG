import { useMemo, useState } from "react";
import { ArrowRight, KeyRound } from "lucide-react";
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(var(--primary),0.2),transparent_28%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)))]" />
      <Card className="relative z-10 w-full max-w-md border-border/70 bg-card/90 shadow-[0_24px_80px_hsl(var(--foreground)/0.14)] backdrop-blur-xl">
        <CardHeader className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Set a new password</CardTitle>
            <CardDescription>Use a strong password to secure your stakeholder account.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {!canReset ? (
            <p className="text-sm text-muted-foreground">Open this page from the password recovery email to continue.</p>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Updating password..." : "Update password"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default ResetPassword;
