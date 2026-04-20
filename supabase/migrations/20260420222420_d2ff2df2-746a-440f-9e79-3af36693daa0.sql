-- Connections (mutual stakeholder ties) — replaces localStorage demo store
CREATE TABLE public.connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  member_id UUID NOT NULL REFERENCES public.network_members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, member_id)
);

CREATE INDEX idx_connections_user ON public.connections(user_id);
CREATE INDEX idx_connections_member ON public.connections(member_id);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connections"
ON public.connections FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connections"
ON public.connections FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connections"
ON public.connections FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Activity feed posts
CREATE TYPE public.post_kind AS ENUM ('update', 'ask', 'initiative', 'win');

CREATE TABLE public.feed_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  kind public.post_kind NOT NULL DEFAULT 'update',
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  like_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feed_posts_created_at ON public.feed_posts(created_at DESC);
CREATE INDEX idx_feed_posts_user ON public.feed_posts(user_id);

ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all posts"
ON public.feed_posts FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create their own posts"
ON public.feed_posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
ON public.feed_posts FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
ON public.feed_posts FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_feed_posts_updated_at
BEFORE UPDATE ON public.feed_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Post likes
CREATE TABLE public.feed_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

CREATE INDEX idx_feed_post_likes_post ON public.feed_post_likes(post_id);

ALTER TABLE public.feed_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all likes"
ON public.feed_post_likes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can like posts"
ON public.feed_post_likes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
ON public.feed_post_likes FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Trigger to maintain like_count
CREATE OR REPLACE FUNCTION public.sync_post_like_count()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feed_posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feed_posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER feed_post_likes_count_trigger
AFTER INSERT OR DELETE ON public.feed_post_likes
FOR EACH ROW EXECUTE FUNCTION public.sync_post_like_count();

-- Persisted notifications (read-state in DB instead of localStorage)
CREATE TABLE public.notification_reads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_id TEXT NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, notification_id)
);

CREATE INDEX idx_notification_reads_user ON public.notification_reads(user_id);

ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notification reads"
ON public.notification_reads FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their own notifications read"
ON public.notification_reads FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notification reads"
ON public.notification_reads FOR DELETE TO authenticated
USING (auth.uid() = user_id);