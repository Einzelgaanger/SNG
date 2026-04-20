import { useMemo, useState } from "react";
import {
  Heart,
  Loader2,
  Megaphone,
  Plus,
  Rocket,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useFeedPosts, type FeedPost, type FeedPostKind } from "@/hooks/use-feed-posts";
import { relativeTime } from "@/lib/notifications-store";

const kindMeta: Record<FeedPostKind, { label: string; icon: typeof Rocket; color: string }> = {
  update: { label: "Update", icon: Megaphone, color: "bg-muted text-foreground" },
  ask: { label: "Ask", icon: Target, color: "bg-accent/10 text-accent" },
  initiative: { label: "Initiative", icon: Rocket, color: "bg-primary/10 text-primary" },
  win: { label: "Win", icon: Trophy, color: "bg-amber-500/10 text-amber-600" },
};

const kindFilters: { value: FeedPostKind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "update", label: "Updates" },
  { value: "ask", label: "Asks" },
  { value: "initiative", label: "Initiatives" },
  { value: "win", label: "Wins" },
];

export default function ActivityFeedPage() {
  const { user } = useAuth();
  const { posts, isLoading, createPost, isPosting, toggleLike, deletePost } = useFeedPosts();
  const [filter, setFilter] = useState<FeedPostKind | "all">("all");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => (filter === "all" ? posts : posts.filter((p) => p.kind === filter)),
    [posts, filter],
  );

  return (
    <div className="app-page">
      <div className="app-container">
        <div className="app-header">
          <div>
            <h1 className="app-header-title flex items-center gap-2">
              <Users2 className="h-6 w-6 text-primary" /> Activity Feed
            </h1>
            <p className="app-header-description">
              Share updates, asks, and wins with the global stakeholder network.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" /> New Post
              </Button>
            </DialogTrigger>
            <NewPostDialog
              onSubmit={async (payload) => {
                await createPost(payload);
                setOpen(false);
              }}
              isPosting={isPosting}
            />
          </Dialog>
        </div>

        <div className="surface-card space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {kindFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  filter === f.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading the feed…
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Sparkles className="mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {posts.length === 0
                  ? "Be the first to share with the network."
                  : "No posts in this category yet."}
              </p>
            </div>
          )}

          <ScrollArea className="max-h-[calc(100vh-300px)]">
            <div className="space-y-3">
              {filtered.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  isOwn={p.user_id === user?.id}
                  onLike={() => toggleLike(p)}
                  onDelete={() => deletePost(p.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

function PostCard({
  post,
  isOwn,
  onLike,
  onDelete,
}: {
  post: FeedPost;
  isOwn: boolean;
  onLike: () => void;
  onDelete: () => void;
}) {
  const meta = kindMeta[post.kind];
  const Icon = meta.icon;
  return (
    <article className="rounded-2xl border border-border/40 bg-card p-4 transition-all hover:border-primary/30">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="text-xs font-semibold">
              {post.author_name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{post.author_name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {post.author_org} · {relativeTime(new Date(post.created_at).getTime())}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className={`shrink-0 text-[10px] uppercase ${meta.color}`}>
          <Icon className="mr-1 h-3 w-3" /> {meta.label}
        </Badge>
      </header>

      <h3 className="mt-3 text-base font-semibold leading-snug text-foreground">{post.title}</h3>
      <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{post.body}</p>

      {post.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {post.tags.map((t) => (
            <Badge key={t} variant="secondary" className="text-[10px]">
              #{t}
            </Badge>
          ))}
        </div>
      )}

      <footer className="mt-3 flex items-center gap-1 border-t border-border/40 pt-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLike}
          className={`gap-1.5 text-xs ${post.liked_by_me ? "text-primary" : "text-muted-foreground"}`}
        >
          <Heart className={`h-3.5 w-3.5 ${post.liked_by_me ? "fill-current" : ""}`} />
          {post.like_count}
        </Button>
        {isOwn && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="ml-auto text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
          </Button>
        )}
      </footer>
    </article>
  );
}

function NewPostDialog({
  onSubmit,
  isPosting,
}: {
  onSubmit: (p: { kind: FeedPostKind; title: string; body: string; tags: string[] }) => Promise<void>;
  isPosting: boolean;
}) {
  const [kind, setKind] = useState<FeedPostKind>("update");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const submit = async () => {
    if (!title.trim() || !body.trim()) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)
      .slice(0, 6);
    await onSubmit({ kind, title: title.trim(), body: body.trim(), tags });
    setTitle("");
    setBody("");
    setTagsInput("");
    setKind("update");
  };

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Share with your network</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(kindMeta) as FeedPostKind[]).map((k) => {
            const m = kindMeta[k];
            const Icon = m.icon;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  kind === k
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 text-muted-foreground hover:border-primary/30"
                }`}
              >
                <Icon className="h-3 w-3" /> {m.label}
              </button>
            );
          })}
        </div>
        <Input
          placeholder="Headline"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="h-11 border-border/50 bg-card/50"
          maxLength={120}
        />
        <Textarea
          placeholder="Share details, the ask, or the win…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="border-border/50 bg-card/50"
          maxLength={1200}
        />
        <Input
          placeholder="Tags (comma-separated, e.g. climate, fintech)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="h-10 border-border/50 bg-card/50"
        />
      </div>
      <DialogFooter>
        <Button onClick={submit} disabled={isPosting || !title.trim() || !body.trim()}>
          {isPosting ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Posting…
            </>
          ) : (
            "Post"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
