
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_network_members_region ON public.network_members(region);
CREATE INDEX IF NOT EXISTS idx_network_members_type ON public.network_members(stakeholder_type);
CREATE INDEX IF NOT EXISTS idx_network_members_score ON public.network_members(score DESC);
CREATE INDEX IF NOT EXISTS idx_network_members_active ON public.network_members(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_network_members_interests ON public.network_members USING GIN(interests);
CREATE INDEX IF NOT EXISTS idx_network_members_display_name_trgm ON public.network_members USING GIN(display_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_network_members_org_trgm ON public.network_members USING GIN(organization_name gin_trgm_ops);

CREATE OR REPLACE FUNCTION public.get_globe_sample(_viewer_id uuid DEFAULT NULL, _limit int DEFAULT 500)
RETURNS SETOF public.network_members
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  (SELECT * FROM public.network_members WHERE profile_user_id = _viewer_id AND is_active = true LIMIT 1)
  UNION
  (SELECT * FROM public.network_members WHERE is_active = true ORDER BY score DESC LIMIT GREATEST(_limit / 4, 50))
  UNION
  (SELECT * FROM public.network_members WHERE is_active = true ORDER BY random() LIMIT _limit)
  LIMIT _limit + 1;
$$;

CREATE OR REPLACE FUNCTION public.find_matches(_user_id uuid, _limit int DEFAULT 20)
RETURNS TABLE(
  member_id uuid,
  display_name text,
  organization_name text,
  stakeholder_type stakeholder_type,
  region text,
  city text,
  country text,
  lat double precision,
  lng double precision,
  bio text,
  interests text[],
  score int,
  match_score int,
  shared_interests text[],
  match_reasons text[]
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  me public.network_members%ROWTYPE;
BEGIN
  SELECT * INTO me FROM public.network_members WHERE profile_user_id = _user_id AND is_active = true LIMIT 1;
  IF me IS NULL THEN RETURN; END IF;

  RETURN QUERY
  WITH complement AS (
    SELECT * FROM (VALUES
      ('entrepreneur'::stakeholder_type, 'investor'::stakeholder_type, 40),
      ('investor', 'entrepreneur', 40),
      ('entrepreneur', 'corporate', 25),
      ('corporate', 'entrepreneur', 25),
      ('university', 'corporate', 30),
      ('corporate', 'university', 30),
      ('nonprofit', 'government', 30),
      ('government', 'nonprofit', 30),
      ('university', 'government', 25),
      ('government', 'university', 25)
    ) AS t(a, b, bonus)
  ),
  scored AS (
    SELECT
      n.*,
      ARRAY(SELECT unnest(n.interests) INTERSECT SELECT unnest(me.interests)) AS shared,
      COALESCE((SELECT bonus FROM complement WHERE a = me.stakeholder_type AND b = n.stakeholder_type), 0) AS type_bonus,
      CASE WHEN n.region = me.region THEN 15 ELSE 25 END AS region_bonus
    FROM public.network_members n
    WHERE n.is_active = true AND n.id <> me.id
  )
  SELECT
    s.id, s.display_name, s.organization_name, s.stakeholder_type,
    s.region, s.city, s.country, s.lat, s.lng, s.bio, s.interests, s.score,
    (COALESCE(array_length(s.shared, 1),0) * 15 + s.type_bonus + s.region_bonus + (s.score / 10))::int AS match_score,
    s.shared,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN array_length(s.shared, 1) > 0 THEN array_length(s.shared, 1)::text || ' shared interests' END,
      CASE WHEN s.type_bonus > 0 THEN 'Complementary role' END,
      CASE WHEN s.region <> me.region THEN 'Cross-region collaboration' ELSE 'Same region' END
    ], NULL)
  FROM scored s
  WHERE COALESCE(array_length(s.shared, 1),0) > 0 OR s.type_bonus > 0
  ORDER BY match_score DESC, s.score DESC
  LIMIT _limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_globe_sample(uuid, int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_matches(uuid, int) TO authenticated;
