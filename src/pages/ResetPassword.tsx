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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="fade-in w-full max-w-md">
        <Card className="glass-panel-solid border-border/40">
          <CardHeader className="space-y-4 pb-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl">New password</CardTitle>
              <CardDescription className="text-muted-foreground">Choose a strong password to secure your account.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {!canReset ? (
              <p className="text-sm text-muted-foreground">Open this page from the recovery email to continue.</p>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button type="submit" className="w-full" disabled={submitting}>
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
