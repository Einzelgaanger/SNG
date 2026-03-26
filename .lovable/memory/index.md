# Memory: index.md
Updated: now

Design system: Deep Navy primary (#080d1a bg), Warm Amber primary (38 92% 55%), Teal accent (200 70% 50%).
Fonts: Instrument Serif for headings, DM Sans for body.
Glass panels: glass-panel class with backdrop-blur-20 and saturate-1.3.
No mock stakeholders — data comes only from authenticated user profiles.

## Architecture
- `/` = LandingPage (public), `/login` = LoginPage, `/onboarding` = OnboardingPage
- `/app` = DashboardLayout (sidebar nav) with nested routes: Globe, Settings, Admin
- Roles: admin, moderator, user — stored in user_roles table, checked via has_role() function
- Admin can view all profiles, manage roles. Moderator can view all profiles. User sees own data.
- Profile fields: display_name, org, bio, linkedin_url, website_url, phone, country, city, region, interests, initiatives, impact_metrics
- Onboarding: 6 steps (Role, Identity, Contact, Location, Impact, Interests)
