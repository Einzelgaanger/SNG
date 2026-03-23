import { LoaderCircle } from "lucide-react";

export function LoadingScreen({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="fade-in flex flex-col items-center gap-6 text-center">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
            <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary/80">SNG</p>
          <p className="text-lg text-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
