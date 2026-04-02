import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MapPinOff } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <div className="mesh-hero pointer-events-none absolute inset-0 opacity-80" />
      <div className="relative mx-auto max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card/80 shadow-lg shadow-foreground/[0.04] backdrop-blur-sm">
          <MapPinOff className="h-8 w-8 text-muted-foreground" aria-hidden />
        </div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="h-11">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
