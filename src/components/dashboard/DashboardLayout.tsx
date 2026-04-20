import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Globe2, LogOut, Menu, Settings, Sparkles, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useRoles } from "@/hooks/use-roles";
import vggLogo from "@/assets/vgg-logo.webp";

const navItems = [
  { path: "/app", label: "Globe", icon: Globe2, roles: ["user", "moderator", "admin"] },
  { path: "/app/matches", label: "Matches", icon: Sparkles, roles: ["user", "moderator", "admin"] },
  { path: "/app/settings", label: "Settings", icon: Settings, roles: ["user", "moderator", "admin"] },
];

const adminItems = [
  { path: "/app/admin/users", label: "User Management", icon: Users, roles: ["admin"] },
];

export default function DashboardLayout() {
  const { user, loading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { isAdmin, isModerator, isLoading: rolesLoading } = useRoles(user?.id);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!loading && !profileLoading && user && profile && !profile.onboarding_completed) {
      navigate("/onboarding");
    }
  }, [loading, profileLoading, user, profile, navigate]);

  if (loading || profileLoading || rolesLoading) return <LoadingScreen />;
  if (!user) return null;
  if (!profile?.onboarding_completed) return null;

  const allNav = [...navItems, ...(isAdmin ? adminItems : [])];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] flex-col border-r border-border/50 bg-card/90 backdrop-blur lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border/40 px-5">
          <img src={vggLogo} alt="VGG" className="h-6 w-auto" />
          {isAdmin && (
            <span className="ml-auto rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">Admin</span>
          )}
          {isModerator && !isAdmin && (
            <span className="ml-auto rounded-md bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">Mod</span>
          )}
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {allNav.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
          {isAdmin && (
            <>
              <Separator className="my-2" />
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Administration</p>
              {adminItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </>
          )}
        </nav>
        <div className="border-t border-border/40 p-3">
          <div className="mb-2 rounded-lg border border-border/40 bg-muted/60 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-foreground">{profile?.display_name || "User"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border/50 bg-card/90 px-4 backdrop-blur lg:hidden">
          <img src={vggLogo} alt="VGG" className="h-6 w-auto" />
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </header>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 26, stiffness: 260 }}
                className="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-border/50 bg-card/95 backdrop-blur lg:hidden"
              >
                <div className="flex h-16 items-center justify-between border-b border-border/40 px-5">
                  <img src={vggLogo} alt="VGG" className="h-6 w-auto" />
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <nav className="flex-1 space-y-1 p-3">
                  {allNav.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
                <div className="border-t border-border/40 p-3">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
