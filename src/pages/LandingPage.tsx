import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Globe2,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import vggLogo from "@/assets/vgg-logo.webp";
import heroGlobe from "@/assets/hero-globe.jpg";
import sectionLeaf from "@/assets/section-leaf-circuit.jpg";
import sectionAtlas from "@/assets/section-network-atlas.jpg";
import sectionImpact from "@/assets/section-impact-hands.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const stats = [
  { value: "40", suffix: "+", label: "Countries mapped" },
  { value: "2.5", suffix: "K", label: "Stakeholders" },
  { value: "12", suffix: "K", label: "Active connections" },
  { value: "98", suffix: "%", label: "Network uptime" },
];

const capabilities = [
  {
    no: "01",
    title: "Geographic intelligence",
    desc: "A real-time, interactive 3D globe with four visual modes — enhanced, heatmap, satellite, and simple — for navigating stakeholders by place.",
  },
  {
    no: "02",
    title: "Stakeholder profiles",
    desc: "Rich profiles with impact metrics, interests, initiatives, and an evolving collaboration history.",
  },
  {
    no: "03",
    title: "AI collaboration signals",
    desc: "Smart matching surfaces partnership potential, funding alignment, and complementary capability — with confidence scoring.",
  },
  {
    no: "04",
    title: "Relationship arcs",
    desc: "Visualize connection arcs across regions and sectors, then drill into the people behind each thread.",
  },
  {
    no: "05",
    title: "Activity feed",
    desc: "Updates, asks, initiatives, and wins from your network — filtered to what matters to your work.",
  },
  {
    no: "06",
    title: "Impact metrics",
    desc: "Track funding deployed, people reached, and budget across your full innovation network.",
  },
];

const useCases = [
  { title: "Entrepreneurs", desc: "Find investors, mentors, and collaborators in your innovation corridor." },
  { title: "Universities", desc: "Connect research with industry partners and funding bodies worldwide." },
  { title: "Investors", desc: "Discover emerging ventures and track portfolio network effects." },
  { title: "Governments", desc: "Map innovation ecosystems and facilitate cross-border partnerships." },
];

const marqueeWords = [
  "Stakeholders",
  "Partnerships",
  "Funding flows",
  "Initiatives",
  "Cross-border",
  "AI signals",
  "Impact",
  "Networks",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/app", { replace: true });
    }
  }, [loading, user, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src={vggLogo} alt="Venture Garden Group" className="h-7 w-auto" />
            <span className="hidden font-mono-display text-[10.5px] uppercase tracking-[0.24em] text-muted-foreground sm:inline">
              · SNG / v1.0
            </span>
          </a>
          <div className="hidden items-center gap-1 text-sm md:flex">
            {[
              ["Capabilities", "#capabilities"],
              ["Use cases", "#use-cases"],
              ["Network", "#network"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="font-mono-display rounded-none px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>
              Sign in
            </Button>
            <Button size="sm" className="hidden sm:inline-flex rounded-sm" onClick={() => navigate("/login?mode=signup")}>
              Get started <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border px-5">
            <img src={vggLogo} alt="VGG" className="h-7 w-auto" />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col gap-1 p-5">
            {[
              ["Capabilities", "#capabilities"],
              ["Use cases", "#use-cases"],
              ["Network", "#network"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="font-display rounded-sm px-4 py-4 text-2xl tracking-tight text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <div className="mt-6 grid gap-3 border-t border-border pt-6">
              <Button variant="outline" className="h-12 rounded-sm" onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}>
                Sign in
              </Button>
              <Button className="h-12 rounded-sm" onClick={() => { setMobileMenuOpen(false); navigate("/login?mode=signup"); }}>
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border mesh-hero">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-10 sm:gap-10 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-12 lg:gap-12 lg:pb-28 lg:pt-24">
          {/* Eyebrow column */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="space-y-6 sm:space-y-9 lg:col-span-7"
          >
            <motion.div custom={0} variants={fadeUp} className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="marketing-section-label">
                <Sparkles className="mr-1 h-3 w-3" /> Stakeholder Network Globe
              </span>
              <span className="font-mono-display text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:text-[10.5px]">
                Index No. 001 / 2026
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="font-display text-[clamp(2.25rem,8vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-foreground sm:leading-[0.92]"
            >
              Map the world{" "}
              <em className="font-light not-italic text-primary">
                <span className="italic">that</span>
              </em>{" "}
              <span className="block">
                <span className="italic font-light">builds</span> what's
              </span>
              <span className="block">
                <span className="text-primary">next.</span>
              </span>
            </motion.h1>

            <motion.div custom={2} variants={fadeUp} className="grid max-w-xl gap-4 sm:grid-cols-[auto_1fr] sm:gap-6">
              <div className="font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground sm:pt-1.5">
                ↳ Premise
              </div>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-[1.0625rem]">
                A living atlas of the people, capital, and institutions powering transformative growth in emerging
                economies. Discover stakeholders, visualize partnerships, and unlock AI-powered collaboration signals.
              </p>
            </motion.div>

            <motion.div custom={3} variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button
                size="lg"
                className="h-12 rounded-sm px-7 text-sm font-semibold"
                onClick={() => navigate("/login?mode=signup")}
              >
                Start mapping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="group h-12 rounded-sm px-3 text-sm font-medium text-foreground hover:bg-transparent"
                onClick={() => document.getElementById("capabilities")?.scrollIntoView({ behavior: "smooth" })}
              >
                See how it works
                <span className="ml-2 h-px w-10 bg-foreground transition-all group-hover:w-16" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero image column */}
          <motion.div
            className="relative lg:col-span-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute -left-6 -top-6 hidden font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground lg:block">
              Fig. 01 — The living network
            </div>
            <div className="relative overflow-hidden rounded-sm border border-foreground/85 ink-shadow">
              <img
                src={heroGlobe}
                alt="A translucent globe of light intertwined with vines — illustrating the SNG network"
                width={1600}
                height={1200}
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-foreground/10" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-foreground/85 bg-paper/90 px-4 py-2.5 backdrop-blur-sm">
                <span className="font-mono-display text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Live · 2,500+ nodes
                </span>
                <span className="font-mono-display text-[10px] uppercase tracking-[0.22em] text-primary">
                  ◉ Streaming
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-border bg-paper-deep/40">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border border-border sm:grid-cols-4 sm:divide-y-0 sm:border-x">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-5 sm:px-7 sm:py-7">
                <p className="numeral text-3xl text-foreground sm:text-5xl">
                  {s.value}
                  <span className="text-primary">{s.suffix}</span>
                </p>
                <p className="font-mono-display mt-2 text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section aria-hidden className="border-b border-border bg-foreground py-4 text-background sm:py-5">
        <div className="flex gap-8 overflow-hidden sm:gap-12">
          <div className="flex shrink-0 animate-marquee gap-8 whitespace-nowrap font-display text-xl italic sm:gap-12 sm:text-3xl">
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span key={i} className="flex items-center gap-8 sm:gap-12">
                {w} <span className="text-primary-glow">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <p className="marketing-section-label">Capabilities</p>
              <h2 className="font-display mt-5 text-4xl leading-[0.95] tracking-tight sm:text-5xl">
                Six tools.
                <br />
                <em className="font-light text-primary">One atlas.</em>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                Built for stakeholders who think in systems — entrepreneurs, investors, universities, governments — and
                everyone moving capital and ideas across borders.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="grid divide-y divide-border border-y border-border">
                {capabilities.map((c, i) => (
                  <motion.article
                    key={c.no}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group grid grid-cols-[auto_1fr] items-start gap-6 py-7 sm:grid-cols-[80px_1fr_auto] sm:gap-8"
                  >
                    <span className="font-mono-display text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {c.no}
                    </span>
                    <div className="space-y-2">
                      <h3 className="font-display text-2xl tracking-tight text-foreground">{c.title}</h3>
                      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
                    </div>
                    <ArrowUpRight className="hidden h-5 w-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:block" />
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial split — leaf + atlas */}
      <section className="border-b border-border bg-paper-deep/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-stretch gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-sm border border-foreground/85 ink-shadow">
                <img
                  src={sectionAtlas}
                  alt="Network nodes glowing on an old-world atlas page"
                  loading="lazy"
                  width={1600}
                  height={1100}
                  className="aspect-[16/11] w-full object-cover"
                />
              </div>
              <div className="mt-3 flex items-center justify-between font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>Fig. 02 — Cross-border arcs</span>
                <span>40+ regions</span>
              </div>
            </div>
            <div className="space-y-6 lg:col-span-5 lg:py-6">
              <p className="marketing-section-label">Intelligence</p>
              <h2 className="font-display text-4xl leading-[0.95] tracking-tight sm:text-[3rem]">
                The signal hidden in <em className="font-light text-primary">the noise.</em>
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Our model analyzes geographic proximity, thematic alignment, and network position to surface
                high-confidence partnership opportunities — with reasoning you can trust.
              </p>
              <ul className="space-y-4 border-t border-border pt-6">
                {[
                  ["01", "Enterprise-grade data security"],
                  ["02", "Real-time network updates"],
                  ["03", "Confidence-scored AI signals"],
                ].map(([no, text]) => (
                  <li key={no} className="grid grid-cols-[auto_1fr] items-baseline gap-5">
                    <span className="font-mono-display text-[11px] uppercase tracking-[0.22em] text-primary">{no}</span>
                    <span className="text-base leading-relaxed text-foreground">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases — editorial cards with imagery */}
      <section id="use-cases" className="border-b border-border py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-12 grid items-end gap-6 sm:mb-16 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="marketing-section-label">For everyone in the ecosystem</p>
              <h2 className="font-display mt-5 text-4xl leading-[0.95] tracking-tight sm:text-[3.25rem]">
                Made for the <em className="font-light text-primary">connectors.</em>
              </h2>
            </div>
            <p className="font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
              Index 04 / Use cases
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="overflow-hidden rounded-sm border border-foreground/85 lg:col-span-5 lg:row-span-2 ink-shadow">
              <img
                src={sectionLeaf}
                alt="Macro of a leaf vein structure transitioning into a circuit"
                loading="lazy"
                width={1280}
                height={1600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid gap-4 lg:col-span-7 sm:grid-cols-2">
              {useCases.map((uc, i) => (
                <motion.article
                  key={uc.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className="group flex flex-col justify-between gap-6 rounded-sm border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-[6px_6px_0_0_hsl(var(--primary))]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">
                      0{i + 1} / {useCases.length}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <div>
                    <p className="font-display text-2xl tracking-tight text-foreground">{uc.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{uc.desc}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact / closing image */}
      <section className="border-b border-border bg-paper-deep/40 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-6 lg:col-span-6">
            <p className="marketing-section-label">Impact</p>
            <h2 className="font-display text-4xl leading-[0.95] tracking-tight sm:text-[3.5rem]">
              Growth that <em className="font-light text-primary">takes root.</em>
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
              Behind every connection is a person, a place, and a possibility. SNG measures the funding deployed,
              people reached, and budgets aligned across your entire innovation network — so impact is never abstract.
            </p>
            <div className="grid grid-cols-3 gap-px border border-border bg-border">
              {[
                ["$2.4B", "Funding tracked"],
                ["18M", "People reached"],
                ["340+", "Active initiatives"],
              ].map(([v, l]) => (
                <div key={l} className="bg-background px-4 py-5">
                  <p className="numeral text-2xl text-foreground sm:text-3xl">{v}</p>
                  <p className="font-mono-display mt-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative lg:col-span-6">
            <div className="overflow-hidden rounded-sm border border-foreground/85 ink-shadow">
              <img
                src={sectionImpact}
                alt="Hands holding a sapling with holographic data overlay"
                loading="lazy"
                width={1100}
                height={1400}
                className="aspect-[5/6] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="network" className="relative overflow-hidden border-b border-border py-16 sm:py-32">
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-8">
          <p className="marketing-section-label mx-auto inline-flex">Join the network</p>
          <h2 className="font-display mt-6 text-[clamp(2.25rem,9vw,5rem)] leading-[0.95] tracking-[-0.04em] sm:text-7xl">
            Ready to <em className="font-light text-primary">map</em> what's
            <br />
            possible?
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Join thousands of stakeholders already using SNG to discover partnerships, track impact, and navigate the
            global innovation ecosystem.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              size="lg"
              className="h-12 rounded-sm px-8 text-sm font-semibold sm:min-w-[220px]"
              onClick={() => navigate("/login?mode=signup")}
            >
              Create free account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-sm border-foreground/20 px-8 text-sm sm:min-w-[160px]"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12 text-background sm:py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Globe2 className="h-5 w-5 text-primary-glow" strokeWidth={1.4} />
              <span className="font-display text-2xl tracking-tight">SNG</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/65">
              The Stakeholder Network Globe by Venture Garden Group. A living atlas of the people powering
              transformative growth.
            </p>
          </div>
          {[
            { title: "Product", links: [["Capabilities", "#capabilities"], ["Use cases", "#use-cases"], ["Sign in", "/login"]] },
            { title: "Company", links: [["About VGG", "https://venturegardengroup.com"], ["Privacy", "#"], ["Terms", "#"]] },
            { title: "Connect", links: [["Get started", "/login?mode=signup"], ["Contact", "mailto:hello@vgg.app"]] },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-background/60">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([l, h]) => (
                  <li key={l}>
                    <a href={h} className="text-sm text-background/85 transition-colors hover:text-primary-glow">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-background/15 px-5 pt-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-background/55">
            © {new Date().getFullYear()} Venture Garden Group · Index 001 / 2026
          </p>
          <p className="font-mono-display text-[10.5px] uppercase tracking-[0.22em] text-background/55">
            Made for the connectors.
          </p>
        </div>
      </footer>
    </div>
  );
}
