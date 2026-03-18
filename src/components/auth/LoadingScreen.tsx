import { LoaderCircle } from "lucide-react";

export function LoadingScreen({ label = "Loading network" }: { label?: string }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsla(var(--primary),0.18),transparent_32%),radial-gradient(circle_at_bottom_right,hsla(var(--accent),0.18),transparent_30%)]" />
      <div className="command-panel relative z-10 flex min-w-[280px] max-w-md flex-col items-center gap-4 px-8 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
          <LoaderCircle className="h-7 w-7 animate-spin" />
        </div>
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.28em] text-primary">SNG</p>
          <h1 className="text-2xl font-semibold text-foreground">{label}</h1>
          <p className="text-sm text-muted-foreground">Preparing your stakeholder network command center.</p>
        </div>
      </div>
    </div>
  );
}
