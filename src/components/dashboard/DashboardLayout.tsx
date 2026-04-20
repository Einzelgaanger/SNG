import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bell, Globe2, LogOut, Menu, MessageSquare, Settings, Sparkles, Users, Users2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { LoadingScreen } from "@/components/auth/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useRoles } from "@/hooks/use-roles";
import vggLogo from "@/assets/vgg-logo.webp";
import { NotificationBell } from "@/components/sng/NotificationBell";

const navItems = [
  { path: "/app", label: "Globe", icon: Globe2, roles: ["user", "moderator", "admin"] },
  { path: "/app/matches", label: "Matches", icon: Sparkles, roles: ["user", "moderator", "admin"] },
  { path: "/app/feed", label: "Activity Feed", icon: MessageSquare, roles: ["user", "moderator", "admin"] },
  { path: "/app/network", label: "My Network", icon: Users2, roles: ["user", "moderator", "admin"] },
  { path: "/app/notifications", label: "Notifications", icon: Bell, roles: ["user", "moderator", "admin"] },
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
    <div className="flex h-screen bg-paper-deep/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <img src={vggLogo} alt="VGG" className="h-6 w-auto" />
          <div className="ml-auto flex items-center gap-2">
            {isAdmin && (
              <span className="font-mono-display rounded-none border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-primary">
                Admin
              </span>
            )}
            {isModerator && !isAdmin && (
              <span className="font-mono-display rounded-none border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-accent">
                Mod
              </span>
            )}
            <NotificationBell />
          </div>
        </div>
        <p className="font-mono-display px-5 pb-2 pt-5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
          ◉ Workspace
        </p>
        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`group relative flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-foreground text-background"
                    : "text-foreground/70 hover:bg-paper-deep/60 hover:text-foreground"
                }`}
              >
                {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 bg-primary" />}
                <item.icon className="h-4 w-4" strokeWidth={1.75} />
                {item.label}
              </button>
            );
          })}
          {isAdmin && (
            <>
              <div className="my-3 h-px bg-border" />
              <p className="font-mono-display px-3 pb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                ◉ Administration
              </p>
              {adminItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`relative flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground/70 hover:bg-paper-deep/60 hover:text-foreground"
                    }`}
                  >
                    {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 bg-primary" />}
                    <item.icon className="h-4 w-4" strokeWidth={1.75} />
                    {item.label}
                  </button>
                );
              })}
            </>
          )}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-2 rounded-sm border border-border bg-paper-deep/40 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-foreground">{profile?.display_name || "User"}</p>
            <p className="font-mono-display truncate text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {user.email}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start rounded-sm text-muted-foreground" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <img src={vggLogo} alt="VGG" className="h-6 w-auto" />
          <div className="flex items-center gap-1">
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
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
