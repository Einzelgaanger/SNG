# SNG Design System — "Neo-Organic Tech" Editorial

> **Purpose of this doc**: A complete handoff for another Lovable AI (or human designer/dev) to understand, extend, or replicate the visual system used in **Stakeholder Network Globe (SNG)**, a product of **Venture Garden Group (VGG)**. Read this end-to-end before making any visual changes.

---

## 1. Brand & Product Context

- **Parent brand**: Venture Garden Group (VGG) — fintech/infrastructure group operating in emerging markets.
- **Product**: SNG (Stakeholder Network Globe) — a 3D globe + matching engine that surfaces collaborators (entrepreneurs, investors, universities, governments, corporates, nonprofits) across emerging economies.
- **Audience**: Senior stakeholders — founders, fund managers, policy leads, deans. Skews professional, international, mobile-first in many markets.
- **Tone**: Serious, editorial, optimistic, "atlas-of-what's-possible." NOT generic SaaS, NOT brutalist, NOT playful. Think *Monocle / The Economist 1843 / Kinfolk* meets a research console.

---

## 2. Aesthetic Direction — "Neo-Organic Tech"

The chosen direction (selected by the founder from a 4-option spread) blends:

1. **Organic / editorial photography** — aerial nature, hands, leaves, atlases. AI-generated, high contrast, slight grain.
2. **Tech precision** — mono labels, tabular numerals, sharp 4px radii, dot-grid overlays, ink-black borders.
3. **Serif display + sans body + mono data** — a tri-typographic system (see §4).
4. **Editorial structure** — eyebrows, figure captions ("Fig. 03 — River delta, dawn"), index numbers ("Index 001 / 2026"), section labels.

### The 4 anchor moves (apply these everywhere)

| Move | What it looks like | Why |
|------|---------------------|-----|
| **Sharp edges** | `--radius: 0.25rem` (4px). No rounded-2xl/3xl. | Editorial precision, breaks the "AI SaaS" look. |
| **Serif italic accents** | Headlines use Fraunces with `<em className="font-light italic">` for a single phrase. | Adds warmth + voice without being twee. |
| **Mono uppercase metadata** | Eyebrows, captions, badges, stat labels use JetBrains Mono, 10–11px, `tracking-[0.22em]`, uppercase. | Signals "data product," not blog. |
| **Ink + cream** | Bone-white background, near-black "forest ink" foreground, deep-green primary. Borders are ink at low opacity, not gray. | Removes the cold "white SaaS" feel; reads as paper. |

### What this aesthetic explicitly REJECTS

- ❌ Gradients of any kind (light or dark) — the brand memory is **strict flat**.
- ❌ Glassmorphism / frosted blur as primary surface (used sparingly only as image overlay).
- ❌ Purple/violet accents, neon, dark mode.
- ❌ Inter, Poppins, Geist, or any other "AI-default" sans.
- ❌ Rounded-2xl cards, soft shadows everywhere, generic hero illustration.

---

## 3. Color System

All colors live as **HSL CSS variables** in `src/index.css` and are exposed to Tailwind via `tailwind.config.ts`. Components must use semantic tokens (`bg-primary`, `text-foreground`) — never hex or `text-white`/`bg-black`.

### Palette tokens

```css
/* src/index.css :root */
--background: 40 33% 96%;     /* bone / cream paper */
--foreground: 160 28% 9%;     /* near-black forest ink */
--card: 0 0% 100%;            /* pure white cards on cream */

--primary: 110 55% 28%;       /* deep VGG green (sharpened from brand #4DB848) */
--primary-glow: 117 60% 45%;  /* lighter green for hover/accents on dark */
--primary-foreground: 40 33% 97%;

--accent: 205 70% 38%;        /* sharpened ocean blue (from brand #2E86C1) */
--accent-foreground: 40 33% 97%;

--muted: 40 20% 93%;
--muted-foreground: 160 12% 38%;

--border: 160 10% 84%;        /* tinted toward green-ink, NOT neutral gray */
--input: 160 10% 84%;
--ring: 110 55% 28%;

--destructive: 8 72% 48%;

/* Editorial extensions */
--ink: 160 28% 9%;            /* alias of foreground for clarity in shadows */
--paper: 40 33% 96%;
--paper-deep: 40 22% 90%;     /* slightly darker cream for contrast surfaces */

--radius: 0.25rem;            /* SHARP — 4px everywhere */
```

### Usage rules

- **Backgrounds**: page = `bg-background` (cream), surface cards = `bg-card` (white), nested rows = `bg-paper-deep/40` (darker cream).
- **Borders**: always `border-border` (tinted ink) — never `border-gray-200`. For high-contrast editorial frames use `border-foreground/85`.
- **Primary actions**: solid `bg-primary text-primary-foreground` with sharp corners. No gradient buttons.
- **Accent**: ocean blue is rare — use for secondary informational cues, not CTAs.
- **Shadows**: only two are allowed:
  - `shadow-[0_1px_0_hsl(var(--ink)/0.04)]` — hairline ink shadow on cards
  - `shadow-[6px_6px_0_0_hsl(var(--primary)/0.85)]` — offset green block shadow on framed photos (`.ink-frame`)
- **No gradients** — including `bg-gradient-to-*`. The only exception is photo overlays (`from-foreground/85 via-foreground/40 to-foreground/85`) to make text legible over imagery.

---

## 4. Typography — Tri-Font System

Loaded from Google Fonts via `<link>` in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Font roles

| Role | Family | Where | Notes |
|------|--------|-------|-------|
| **Display / headlines** | **Fraunces** (variable serif) | All `<h1>`, `.font-display`, marketing/auth heroes | Use `font-variation-settings: "SOFT" 30, "WONK" 0` for headers; `"WONK" 1` for big numerals. Mix weights 300–500. |
| **Body / UI** | **DM Sans** | Body, paragraphs, buttons, inputs, default `<h2>`–`<h4>` | Default font on `body`. Weight 400 body, 500–600 emphasis. |
| **Data / labels** | **JetBrains Mono** | Eyebrows, badges, stat labels, captions, `<code>` | Use `.font-mono-display`. Always `uppercase tracking-[0.18em]–[0.24em]` at 10–11px. |

### Editorial typographic patterns

Use these literal patterns — they define the look:

#### 4.1 Headline with italic accent
```tsx
<h1 className="font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.045em]">
  The atlas of <em className="font-light italic text-primary">what's possible.</em>
</h1>
```
- Always **one** italic phrase per headline, colored `text-primary`, weight 300.
- Use `clamp()` for fluid sizing across viewports.
- Tight tracking (`-0.04em` to `-0.05em`) and tight leading (`0.92`–`0.98`).

#### 4.2 Eyebrow label (above headlines / on sections)
```tsx
<span className="font-mono-display inline-flex items-center gap-2 border-l-2 border-primary px-2.5 text-[10.5px] uppercase tracking-[0.24em] text-primary">
  ◉ Stakeholder Network Globe
</span>
```
Or use the utility class `.eyebrow-primary`. The `◉` glyph is a recurring brand mark — also use `◐`, `◇`, `→` as accent glyphs.

#### 4.3 Mono caption / figure number
```tsx
<div className="font-mono-display flex justify-between text-[10.5px] uppercase tracking-[0.22em] text-background/60">
  <span>Index 001 / 2026</span>
  <span>Fig. 03 — River delta, dawn</span>
</div>
```

#### 4.4 Editorial numeral (stats)
```tsx
<p className="numeral text-[clamp(2.5rem,6vw,4rem)] leading-none">142</p>
<p className="font-mono-display text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Active markets</p>
```
The `.numeral` class enables Fraunces with `WONK 1` and tabular nums.

---

## 5. Layout & Spacing

### Container & rhythm utilities (in `index.css` `@layer components`)

```css
.app-page         { @apply h-full overflow-y-auto; }
.app-container    { @apply mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-8 sm:py-10; }
.app-header       { @apply flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between; }
.app-header-title { @apply font-display text-[clamp(1.75rem,6vw,2.5rem)] font-medium leading-[1.05] tracking-tight; }
.surface-card     { @apply rounded-sm border border-border bg-card p-5 shadow-[0_1px_0_hsl(var(--ink)/0.04)]; }
.auth-form-shell  { @apply rounded-sm border border-border bg-card p-5 shadow-[...] sm:p-7 lg:p-9; }
```

**Rule**: every dashboard page wraps content in `<div className="app-page"><div className="app-container">…</div></div>`. Every section inside is a `.surface-card`. Page titles use `.app-header-title`.

### Grids
- Editorial split layouts (auth, onboarding) use `lg:flex` with a `flex-1` image panel and a fixed-width form panel (`lg:w-[min(100%,560px)] xl:w-[600px]`).
- Stats use `grid grid-cols-2` mobile → `grid-cols-4` desktop with `divide-x divide-y divide-border` for hairline cells.
- Card grids: `grid gap-3 sm:grid-cols-2 xl:grid-cols-3`.

### Border philosophy
- Hairlines everywhere instead of shadows.
- Use `divide-x`/`divide-y` on grids to create newspaper-column feel.
- High-impact framed images use `.ink-frame` (1px ink border + 6px offset green block shadow).

---

## 6. Imagery System

6 AI-generated images form the visual backbone. All live in `src/assets/`:

| File | Use | Prompt direction |
|------|-----|------------------|
| `hero-globe.jpg` | Landing hero | Abstract editorial 3D globe, deep greens + ocean blues, atlas/topographic feel |
| `auth-river-delta.jpg` | Login left panel | Aerial turquoise river delta winding through deep forest, dawn light |
| `section-leaf-circuit.jpg` | Landing capability section | Macro leaf veins morphing into circuitry, cream + green |
| `section-network-atlas.jpg` | Landing network section | Antique-style world atlas with glowing connection nodes |
| `section-impact-hands.jpg` | Landing use-case section | Hands holding seedling / soil — warm editorial documentary |
| `texture-topo.jpg` | Subtle background texture | Topographic contour lines on cream paper |

### Image rules
- **Always overlay** with a foreground gradient when text sits on top: `bg-gradient-to-br from-foreground/85 via-foreground/40 to-foreground/85`.
- **Always mix** with a `dot-grid` or `topo` overlay at low opacity for texture.
- **Always frame** hero/feature shots with `.ink-frame`.
- Generate at editorial aspect ratios (16:9, 3:4, 4:5). Avoid square hero images.

---

## 7. Component Patterns

These are not shadcn overrides — they're recurring composition recipes.

### 7.1 Editorial card
```tsx
<article className="rounded-sm border border-border bg-card p-5 transition-all hover:shadow-[4px_4px_0_0_hsl(var(--primary))]">
  <span className="eyebrow">◉ Match · 92%</span>
  <h3 className="font-display mt-2 text-2xl">Founder, Lagos</h3>
  <p className="mt-2 text-sm text-muted-foreground">…</p>
</article>
```
Hover lifts via offset green block shadow — never via translate or scale.

### 7.2 Tab toggle (sign in / sign up)
```tsx
<div className="grid grid-cols-2 border border-border bg-paper-deep/30 p-1">
  {modes.map(m => (
    <button className={cn(
      "font-mono-display py-2.5 text-[11px] uppercase tracking-[0.18em] transition-all",
      active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
    )}>{m}</button>
  ))}
</div>
```
Inverted `foreground/background` for the active state — high contrast, no rounded corners.

### 7.3 Stats strip (newspaper grid)
```tsx
<div className="grid grid-cols-2 divide-x divide-y divide-border border border-border sm:grid-cols-4 sm:divide-y-0">
  {stats.map(s => (
    <div className="p-5">
      <p className="numeral text-4xl">{s.value}</p>
      <p className="font-mono-display mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</p>
    </div>
  ))}
</div>
```

### 7.4 Sidebar nav (dashboard)
- Active state = full inversion: `bg-foreground text-background` + 2px primary bar at left edge.
- Inactive: `text-foreground/70 hover:bg-paper-deep/60`.
- Section labels: `◉ Workspace`, `◉ Administration` in mono uppercase.

### 7.5 Marquee strip
A continuous horizontal scroll of mono-uppercase keywords separated by `·`, used between landing sections. No animation library — pure CSS `@keyframes marquee`.

---

## 8. Motion

- Library: **framer-motion** (already in deps).
- Primary entrance: `fade-in` (0.6s `cubic-bezier(0.16, 1, 0.3, 1)` with 12px translateY).
- Slow variant for hero copy: `.fade-in-slow` (1s).
- Step transitions (onboarding, dialogs): `initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}` at 0.22s.
- **No micro-interactions** on every button — keep motion intentional and rare.
- Hover = block shadow shift, not scale/translate.

---

## 9. Mobile Responsiveness Rules

This product was redesigned for mobile **after** the desktop overhaul, so the rules are explicit:

1. **Fluid headlines**: every editorial headline uses `clamp(min, vw, max)` — never fixed `text-6xl` that overflows on 360px viewports.
2. **Touch targets**: all buttons ≥ 44px tall (`h-11` or `h-12`).
3. **Stats grids**: 2 cols mobile → 4 cols desktop, with `divide-x divide-y` swapping to `sm:divide-y-0`.
4. **Drawer nav**: `w-[86vw] max-w-[300px]`, full editorial styling matching desktop sidebar (not a different mobile-only design).
5. **Forms**: full-width primary CTAs on mobile (`w-full sm:w-auto`).
6. **Dialogs**: `max-h-[90vh] overflow-y-auto` so long forms scroll on small phones.
7. **Filter rows**: `flex flex-wrap gap-1.5` so chips wrap cleanly.
8. **Auth shells**: `p-5 sm:p-7 lg:p-9` — tight on phone, generous on desktop.
9. **Hidden side panels**: branded image panels are `hidden lg:flex`. Mobile gets a small logo + back link instead.

---

## 10. File Map (where things live)

```
src/
├── index.css                       # Design tokens, utility classes, font setup
├── assets/                         # All generated editorial imagery
│   ├── hero-globe.jpg
│   ├── auth-river-delta.jpg
│   ├── section-leaf-circuit.jpg
│   ├── section-network-atlas.jpg
│   ├── section-impact-hands.jpg
│   └── texture-topo.jpg
├── pages/
│   ├── LandingPage.tsx             # Editorial hero, marquee, image-led sections
│   ├── LoginPage.tsx               # Dual-pane auth with river-delta panel
│   ├── OnboardingPage.tsx          # 6-step wizard, sidebar progress
│   ├── GlobePage.tsx               # 3D globe + filter rail
│   ├── MatchesPage.tsx             # Editorial match cards
│   ├── ActivityFeedPage.tsx        # Posts feed (kind chips, like/delete)
│   ├── MyNetworkPage.tsx           # Connections grouped by type
│   ├── NotificationsPage.tsx       # Alert list
│   ├── ProfileSettings.tsx         # Profile + notification prefs
│   └── AdminUsers.tsx              # RBAC management
├── components/
│   ├── dashboard/DashboardLayout.tsx  # Sidebar + mobile drawer + header
│   └── sng/                        # Globe scene, match dialog, notification bell
└── tailwind.config.ts              # Maps tokens, registers font families
```

---

## 11. Tools Used to Build This

- **Image generation**: Lovable's built-in `imagegen` (`fast`/`standard` tier). All hero images at 1536×864 or 1024×1280.
- **Fonts**: Google Fonts (Fraunces variable, DM Sans, JetBrains Mono).
- **Components**: shadcn/ui (Button, Input, Dialog, etc.) — radii flattened by global `--radius: 0.25rem`.
- **Icons**: lucide-react, always `strokeWidth={1.5}` or `1.75` (thinner than default for editorial feel).
- **Animation**: framer-motion + CSS keyframes.
- **No CSS-in-JS, no Emotion, no styled-components.** Tailwind + tokens only.

---

## 12. Reference: How a New Page Should Be Built

Checklist when adding a new page in this system:

1. ✅ Wrap in `.app-page > .app-container`.
2. ✅ Top of page: `.app-header` with `.app-header-title` (Fraunces) + `.app-header-description` (DM Sans muted).
3. ✅ Add an eyebrow above the title with `◉` glyph + mono uppercase label.
4. ✅ Sections = `.surface-card` (white on cream, hairline ink border, 4px corners, hairline shadow).
5. ✅ Stat blocks = `.numeral` for figures + `.font-mono-display` for labels.
6. ✅ Primary CTA = solid `bg-primary` with sharp 4px corners; secondary = `border-foreground/15 bg-background`.
7. ✅ Headlines: at most one italic primary-colored phrase via `<em>`.
8. ✅ Mobile: fluid `clamp()` typography, `w-full sm:w-auto` CTAs, `max-h-[90vh]` dialogs.
9. ✅ Never introduce: gradients, purple/violet, rounded-2xl, Inter, glassmorphism as primary surface.
10. ✅ Use semantic tokens only — no `text-white`, no hex.

---

## 13. Quick Glossary for the Next AI

- **"Editorial"** = newspaper/magazine logic: eyebrows, captions, hairlines, ink shadows, figure numbers.
- **"Neo-Organic Tech"** = the named direction: organic photography + tech-precise typography + ink-on-cream palette.
- **"Bone / cream / paper"** = the background family (`--background`, `--paper`, `--paper-deep`).
- **"Forest ink"** = the foreground (deep green-black, never pure black).
- **"Sharp"** = 4px max radius, period.
- **"Mono metadata"** = JetBrains Mono uppercase 10–11px with wide tracking — used for any data label.
- **"Hairline"** = 1px `border-border` line, used instead of shadows to create structure.

---

**End of handoff.** When in doubt: read a section of `LandingPage.tsx` or `LoginPage.tsx` — they are the reference implementations of every pattern above.
