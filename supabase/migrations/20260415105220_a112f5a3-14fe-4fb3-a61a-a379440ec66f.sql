
-- Network members table for globe visualization
CREATE TABLE public.network_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  organization_name TEXT NOT NULL DEFAULT 'Independent',
  stakeholder_type public.stakeholder_type NOT NULL DEFAULT 'other',
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  bio TEXT DEFAULT '',
  interests TEXT[] NOT NULL DEFAULT '{}',
  initiatives TEXT[] NOT NULL DEFAULT '{}',
  impact_metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INTEGER NOT NULL DEFAULT 50,
  connections UUID[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_network_members_region ON public.network_members(region);
CREATE INDEX idx_network_members_type ON public.network_members(stakeholder_type);
CREATE INDEX idx_network_members_profile ON public.network_members(profile_user_id);

-- Enable RLS
ALTER TABLE public.network_members ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view active members
CREATE POLICY "Anyone can view active network members"
ON public.network_members
FOR SELECT
TO authenticated
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage network members"
ON public.network_members
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Users can update their own linked member record
CREATE POLICY "Users can update own network member"
ON public.network_members
FOR UPDATE
TO authenticated
USING (profile_user_id = auth.uid())
WITH CHECK (profile_user_id = auth.uid());

-- Trigger for updated_at
CREATE TRIGGER update_network_members_updated_at
BEFORE UPDATE ON public.network_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to sync profile to network_members on onboarding completion
CREATE OR REPLACE FUNCTION public.sync_profile_to_network()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  region_lat DOUBLE PRECISION;
  region_lng DOUBLE PRECISION;
BEGIN
  -- Only sync when onboarding is completed
  IF NEW.onboarding_completed = true THEN
    -- Map region to coordinates
    SELECT lat, lng INTO region_lat, region_lng FROM (VALUES
      ('North America', 40.7128, -74.006),
      ('Latin America', 4.711, -74.0721),
      ('Europe', 52.52, 13.405),
      ('Africa', -1.2864, 36.8172),
      ('Middle East', 25.2048, 55.2708),
      ('Asia', 1.3521, 103.8198),
      ('Oceania', -33.8688, 151.2093)
    ) AS regions(name, lat, lng)
    WHERE name = NEW.region;

    -- Default coordinates if region not matched
    IF region_lat IS NULL THEN
      region_lat := 0;
      region_lng := 0;
    END IF;

    INSERT INTO public.network_members (
      profile_user_id, display_name, organization_name, stakeholder_type,
      region, city, country, lat, lng, bio, interests, initiatives,
      impact_metrics, score
    ) VALUES (
      NEW.user_id,
      COALESCE(NEW.display_name, 'Anonymous'),
      COALESCE(NEW.organization_name, 'Independent'),
      COALESCE(NEW.stakeholder_type, 'other'),
      COALESCE(NEW.region, 'Other'),
      COALESCE(NEW.city, 'Unknown'),
      COALESCE(NEW.country, COALESCE(NEW.region, 'Unknown')),
      region_lat,
      region_lng,
      COALESCE(NEW.bio, ''),
      NEW.interests,
      NEW.initiatives,
      NEW.impact_metrics,
      95
    )
    ON CONFLICT (profile_user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      organization_name = EXCLUDED.organization_name,
      stakeholder_type = EXCLUDED.stakeholder_type,
      region = EXCLUDED.region,
      city = EXCLUDED.city,
      country = EXCLUDED.country,
      lat = EXCLUDED.lat,
      lng = EXCLUDED.lng,
      bio = EXCLUDED.bio,
      interests = EXCLUDED.interests,
      initiatives = EXCLUDED.initiatives,
      impact_metrics = EXCLUDED.impact_metrics,
      updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

-- Unique constraint for the ON CONFLICT to work
CREATE UNIQUE INDEX idx_network_members_profile_unique ON public.network_members(profile_user_id) WHERE profile_user_id IS NOT NULL;

-- Attach trigger to profiles
CREATE TRIGGER sync_profile_to_network_trigger
AFTER INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_to_network();

-- Enable realtime for network_members
ALTER PUBLICATION supabase_realtime ADD TABLE public.network_members;
