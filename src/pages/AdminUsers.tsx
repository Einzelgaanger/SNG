import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Linkedin,
  Link2,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { useAllProfiles, useAllRoles, useAssignRole, useRemoveRole } from "@/hooks/use-admin";
import type { AppRole } from "@/types/sng";

const roleConfig: { value: AppRole; label: string; icon: typeof Shield; color: string }[] = [
  { value: "admin", label: "Admin", icon: Crown, color: "text-primary" },
  { value: "moderator", label: "Moderator", icon: ShieldCheck, color: "text-accent" },
  { value: "user", label: "User", icon: UserRound, color: "text-muted-foreground" },
];

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isAdmin, isLoading: rolesLoading } = useRoles(user?.id);
  const { data: profiles, isLoading: profilesLoading } = useAllProfiles();
  const { data: allRoles, isLoading: allRolesLoading } = useAllRoles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!rolesLoading && !isAdmin) {
      toast.error("Access denied");
      navigate("/app");
    }
  }, [rolesLoading, isAdmin, navigate]);

  if (rolesLoading || profilesLoading || allRolesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const getUserRoles = (userId: string): AppRole[] => {
    return (allRoles ?? [])
      .filter((r) => r.user_id === userId)
      .map((r) => r.role as AppRole);
  };

  const filteredProfiles = (profiles ?? []).filter((p) => {
    if (!search) return true;
    return `${p.display_name} ${p.organization_name} ${p.user_id}`.toLowerCase().includes(search.toLowerCase());
  });

  const handleToggleRole = async (userId: string, role: AppRole) => {
    const current = getUserRoles(userId);
    try {
      if (current.includes(role)) {
        if (role === "user") return toast.error("Cannot remove base user role");
        await removeRole.mutateAsync({ userId, role });
        toast.success(`Removed ${role} role`);
      } else {
        await assignRole.mutateAsync({ userId, role });
        toast.success(`Assigned ${role} role`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  return (
    <div className="app-page">
      <div className="app-container max-w-6xl">
        <div className="app-header">
          <div>
            <h1 className="app-header-title">User Management</h1>
            <p className="app-header-description">View all stakeholders and manage their roles.</p>
          </div>
          <Badge variant="secondary" className="w-fit text-xs">{filteredProfiles.length} users</Badge>
        </div>

        <div className="surface-card flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, organization, or ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="h-11 border-border/50 bg-card/50 pl-10" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredProfiles.map((p) => {
            const userRoles = getUserRoles(p.user_id);
            return (
              <div key={p.user_id} className="rounded-xl border border-border/30 bg-card/50 p-5 transition-all hover:border-border/50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{p.display_name || "Unnamed"}</p>
                      {p.onboarding_completed && (
                        <Badge variant="secondary" className="text-[10px]">Onboarded</Badge>
                      )}
                      {!p.onboarding_completed && (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">Pending</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.organization_name || "No organization"} · {p.stakeholder_type || "—"}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/70">
                      {p.region && <span>{p.region}{p.city ? `, ${p.city}` : ""}</span>}
                      {p.linkedin_url && (
                        <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary/70 hover:text-primary">
                          <Linkedin className="h-3 w-3" /> LinkedIn
                        </a>
                      )}
                      {p.website_url && (
                        <a href={p.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary/70 hover:text-primary">
                          <Link2 className="h-3 w-3" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap">
                    {roleConfig.map((rc) => {
                      const has = userRoles.includes(rc.value);
                      return (
                        <button
                          key={rc.value}
                          type="button"
                          onClick={() => handleToggleRole(p.user_id, rc.value)}
                          disabled={assignRole.isPending || removeRole.isPending}
                          className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm border px-3 py-1.5 text-xs font-medium transition-all sm:flex-none ${
                            has
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border/40 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                          }`}
                        >
                          <rc.icon className="h-3.5 w-3.5" />
                          {rc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {p.interests && p.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.interests.map((i) => (
                      <Badge key={i} variant="outline" className="text-[10px] text-muted-foreground">{i}</Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {filteredProfiles.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
