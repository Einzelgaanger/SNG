import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Layers,
  Menu,
  Network,
  Shield,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import vggLogo from "@/assets/vgg-logo.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stats = [
  { value: "40+", label: "Countries" },
  { value: "2,500+", label: "Stakeholders" },
  { value: "12K+", label: "Connections" },
  { value: "98%", label: "Uptime" },
];

const features = [
  {
    icon: Globe2,
    title: "Interactive 3D Globe",
    desc: "Navigate stakeholders geographically on a real-time, interactive globe with multiple visual modes.",
    large: true,
  },
  {
    icon: Users,
    title: "Stakeholder Profiles",
    desc: "Rich profiles with impact metrics, interests, initiatives, and collaboration history.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    desc: "Smart signals detect collaboration opportunities, funding alignment, and partnership potential.",
  },
  {
    icon: Network,
    title: "Relationship Mapping",
    desc: "Visualize connection arcs between stakeholders across regions and sectors.",
  },
  {
    icon: BarChart3,
    title: "Impact Metrics",
    desc: "Track funding, reach, and budget across your entire innovation network.",
  },
  {
    icon: Layers,
    title: "Multi-Mode Views",
    desc: "Switch between enhanced, heatmap, satellite, and simple views for different analysis needs.",
  },
];

const useCases = [
  { title: "Entrepreneurs", desc: "Find investors, mentors, and collaborators in your innovation corridor." },
  { title: "Universities", desc: "Connect research with industry partners and funding bodies worldwide." },
  { title: "Investors", desc: "Discover emerging ventures and track portfolio network effects." },
  { title: "Governments", desc: "Map innovation ecosystems and facilitate cross-border partnerships." },
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
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center transition-opacity hover:opacity-90">
            <img src={vggLogo} alt="Venture Garden Group" className="h-8 w-auto" />
          </a>
          <div className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
            <a
              href="#features"
              className="rounded-lg px-3 py-2 transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="rounded-lg px-3 py-2 transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              Use Cases
            </a>
            <a
              href="#network"
              className="rounded-lg px-3 py-2 transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              Network
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
            <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login?mode=signup")}>
              Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md md:hidden">
          <div className="flex h-16 items-center justify-between border-b border-border/40 px-4">
            <img src={vggLogo} alt="VGG" className="h-8 w-auto" />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <a
              href="#features"
              className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#use-cases"
              className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Use Cases
            </a>
            <a
              href="#network"
              className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              Network
            </a>
            <div className="mt-4 flex flex-col gap-3 border-t border-border/40 pt-6">
              <Button
                variant="outline"
                className="h-11 w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
              >
                Sign in
              </Button>
              <Button
                className="h-11 w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login?mode=signup");
                }}
              >
                Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden mesh-hero border-b border-border/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg
            className="absolute -right-24 -top-24 h-[520px] w-[520px] text-primary/[0.07]"
            viewBox="0 0 600 600"
            fill="none"
            aria-hidden
          >
            <circle cx="300" cy="300" r="200" stroke="currentColor" strokeWidth="1" />
            <circle cx="300" cy="300" r="260" stroke="currentColor" strokeWidth="1" />
            <circle cx="300" cy="300" r="150" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <svg
            className="absolute -bottom-8 -left-16 h-[380px] w-[380px] text-accent/[0.07]"
            viewBox="0 0 400 400"
            fill="none"
            aria-hidden
          >
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <motion.div
              className="max-w-2xl space-y-7 sm:space-y-8"
              initial="hidden"
              animate="visible"
            >
              <motion.div custom={0} variants={fadeUp} className="marketing-section-label">
                <Zap className="mr-1.5 h-3.5 w-3.5" /> Stakeholder Network Globe
              </motion.div>
              <motion.h1
                custom={1}
                variants={fadeUp}
                className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[3.5rem]"
              >
                Powering innovative{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  transformation.
                </span>
              </motion.h1>
              <motion.p
                custom={2}
                variants={fadeUp}
                className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                We power transformative growth in emerging economies — mapping stakeholders, visualizing
                partnerships, and unlocking AI-powered collaboration signals.
              </motion.p>
              <motion.div
                custom={3}
                variants={fadeUp}
                className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
              >
                <Button size="lg" className="h-12 px-8 text-sm font-semibold" onClick={() => navigate("/login?mode=signup")}>
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-sm"
                  onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                >
                  See how it works
                </Button>
              </motion.div>

              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4 sm:gap-4"
              >
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border/50 bg-card/70 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-md sm:p-5"
                  >
                    <p className="text-2xl font-semibold tabular-nums text-primary sm:text-3xl">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Product preview — desktop */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-primary/15 via-transparent to-accent/10 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/90 p-6 shadow-2xl shadow-foreground/[0.06] backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
                    <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
                  </div>
                  <span className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Live network
                  </span>
                </div>
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-b from-muted/50 to-background">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.12),transparent_55%)]" />
                  <Globe2 className="relative z-10 h-20 w-20 text-primary/90" strokeWidth={1.25} />
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    {["Enhanced", "Heatmap", "Satellite"].map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-border/50 bg-card/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "Nodes", val: "2.5k" },
                    { label: "Arcs", val: "12k" },
                    { label: "Regions", val: "40+" },
                  ].map((row) => (
                    <div key={row.label} className="rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-center">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{row.label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">{row.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features — bento */}
      <section id="features" className="relative border-t border-border/30 bg-muted/25 py-16 sm:py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="marketing-section-label mx-auto">Platform</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Everything you need to navigate the global ecosystem
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              A comprehensive suite of tools designed for stakeholders who think globally.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                className={`group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-lg sm:p-7 ${
                  f.large ? "sm:col-span-2 lg:col-span-2 lg:grid lg:grid-cols-[auto_1fr] lg:items-start lg:gap-8" : ""
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105 ${
                    f.large ? "lg:mt-1" : ""
                  }`}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <div className={f.large ? "mt-5 lg:mt-0" : "mt-5"}>
                  <h3 className="text-lg font-semibold text-foreground sm:text-xl">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="border-t border-border/30 py-16 sm:py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 sm:gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <p className="marketing-section-label">Intelligence</p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                AI-powered collaboration signals
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Our platform analyzes geographic proximity, thematic alignment, and network position to surface
                high-confidence partnership opportunities.
              </p>
              <ul className="space-y-4 pt-2">
                {[
                  { icon: Shield, text: "Enterprise-grade data security" },
                  { icon: Zap, text: "Real-time network updates" },
                  { icon: Sparkles, text: "AI confidence scoring on signals" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/40">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm leading-relaxed text-foreground sm:text-base">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-muted/40 via-card/80 to-card p-8 sm:p-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08),transparent_65%)]" />
              <div className="relative flex items-center justify-center py-6 sm:py-10">
                <div className="relative h-52 w-52 sm:h-64 sm:w-64">
                  <div className="absolute inset-0 animate-pulse rounded-full border-2 border-primary/25" />
                  <div
                    className="absolute inset-4 animate-pulse rounded-full border border-accent/25"
                    style={{ animationDelay: "0.5s" }}
                  />
                  <div className="absolute inset-10 rounded-full bg-primary/5" />
                  <Globe2 className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 text-primary sm:h-16 sm:w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="border-t border-border/30 bg-muted/25 py-16 sm:py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="marketing-section-label mx-auto">Use Cases</p>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Built for every player in the ecosystem
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
              >
                <p className="text-base font-semibold text-foreground">{uc.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="network" className="relative border-t border-border/30 py-16 sm:py-24 md:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 text-center shadow-xl shadow-foreground/[0.04] sm:p-12 md:p-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
            <div className="relative">
              <p className="marketing-section-label mx-auto">Join the Network</p>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Ready to map your{" "}
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  innovation network?
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:mt-6 sm:text-lg">
                Join thousands of stakeholders already using SNG to discover partnerships, track impact, and navigate
                the global innovation ecosystem.
              </p>
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
                <Button size="lg" className="h-12 px-8 text-sm font-semibold sm:min-w-[200px]" onClick={() => navigate("/login?mode=signup")}>
                  Create free account <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-8 text-sm sm:min-w-[160px]" onClick={() => navigate("/login")}>
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-muted/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <img src={vggLogo} alt="Venture Garden Group" className="h-7 w-auto" />
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <a href="#features" className="transition-colors hover:text-foreground">
                Features
              </a>
              <a href="#use-cases" className="transition-colors hover:text-foreground">
                Use cases
              </a>
              <a href="/login" className="transition-colors hover:text-foreground">
                Sign in
              </a>
            </nav>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Venture Garden Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
