import { LoaderCircle } from "lucide-react";

export function LoadingScreen({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="fade-in flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-primary/8 blur-2xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
            <LoaderCircle className="h-7 w-7 animate-spin text-primary" />
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-primary/70">SNG</p>
          <p className="text-lg font-light text-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
