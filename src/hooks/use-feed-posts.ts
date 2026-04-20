import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type FeedPostKind = "update" | "ask" | "initiative" | "win";

export interface FeedPost {
  id: string;
  user_id: string;
  kind: FeedPostKind;
  title: string;
  body: string;
  tags: string[];
  like_count: number;
  comment_count: number;
  created_at: string;
  author_name: string;
  author_org: string;
  author_role: string;
  liked_by_me: boolean;
}

interface RawPost {
  id: string;
  user_id: string;
  kind: FeedPostKind;
  title: string;
  body: string;
  tags: string[];
  like_count: number;
  comment_count: number;
  created_at: string;
  profiles: {
    display_name: string | null;
    organization_name: string | null;
    stakeholder_type: string | null;
  } | null;
}

export function useFeedPosts() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ["feed-posts"],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      // Fetch posts. Author info comes from a parallel profile lookup since
      // there is no DB FK from feed_posts → profiles.
      const { data: postRows, error } = await (supabase as any)
        .from("feed_posts")
        .select("id, user_id, kind, title, body, tags, like_count, comment_count, created_at")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;

      const userIds = Array.from(new Set((postRows ?? []).map((p: RawPost) => p.user_id)));
      const { data: profiles } = userIds.length
        ? await (supabase as any)
            .from("profiles")
            .select("user_id, display_name, organization_name, stakeholder_type")
            .in("user_id", userIds)
        : { data: [] };

      const profileMap = new Map<string, { name: string; org: string; role: string }>();
      (profiles ?? []).forEach((p: any) => {
        profileMap.set(p.user_id, {
          name: p.display_name || "Anonymous",
          org: p.organization_name || "Independent",
          role: p.stakeholder_type || "other",
        });
      });

      // Likes for current user
      const postIds = (postRows ?? []).map((p: RawPost) => p.id);
      const { data: myLikes } = postIds.length
        ? await (supabase as any)
            .from("feed_post_likes")
            .select("post_id")
            .eq("user_id", user!.id)
            .in("post_id", postIds)
        : { data: [] };
      const likedSet = new Set<string>((myLikes ?? []).map((l: { post_id: string }) => l.post_id));

      return (postRows ?? []).map((p: RawPost): FeedPost => {
        const author = profileMap.get(p.user_id);
        return {
          ...p,
          author_name: author?.name || "Anonymous",
          author_org: author?.org || "Independent",
          author_role: author?.role || "other",
          liked_by_me: likedSet.has(p.id),
        };
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { kind: FeedPostKind; title: string; body: string; tags: string[] }) => {
      if (!user?.id) throw new Error("Not signed in");
      const { error } = await (supabase as any).from("feed_posts").insert({
        user_id: user.id,
        kind: payload.kind,
        title: payload.title,
        body: payload.body,
        tags: payload.tags,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed-posts"] });
      toast.success("Posted to your network");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to post"),
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async (post: FeedPost) => {
      if (!user?.id) throw new Error("Not signed in");
      if (post.liked_by_me) {
        const { error } = await (supabase as any)
          .from("feed_post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("feed_post_likes")
          .insert({ post_id: post.id, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed-posts"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await (supabase as any).from("feed_posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed-posts"] });
      toast.success("Post deleted");
    },
  });

  return {
    posts: postsQuery.data ?? [],
    isLoading: postsQuery.isLoading,
    createPost: createMutation.mutateAsync,
    isPosting: createMutation.isPending,
    toggleLike: (post: FeedPost) => toggleLikeMutation.mutate(post),
    deletePost: (id: string) => deleteMutation.mutate(id),
  };
}
