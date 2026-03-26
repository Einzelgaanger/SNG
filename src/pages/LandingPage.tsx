import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Globe2, Layers, Menu, Network, Shield, Sparkles, Users, X, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import sngLogo from "@/assets/logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] } }),
};

const stats = [
  { value: "40+", label: "Countries" },
  { value: "2,500+", label: "Stakeholders" },
  { value: "12K+", label: "Connections" },
  { value: "98%", label: "Uptime" },
];

const features = [
  { icon: Globe2, title: "Interactive 3D Globe", desc: "Navigate stakeholders geographically on a real-time, interactive globe with multiple visual modes." },
  { icon: Users, title: "Stakeholder Profiles", desc: "Rich profiles with impact metrics, interests, initiatives, and collaboration history." },
  { icon: Sparkles, title: "AI-Powered Insights", desc: "Smart signals detect collaboration opportunities, funding alignment, and partnership potential." },
  { icon: Network, title: "Relationship Mapping", desc: "Visualize connection arcs between stakeholders across regions and sectors." },
  { icon: BarChart3, title: "Impact Metrics", desc: "Track funding, reach, and budget across your entire innovation network." },
  { icon: Layers, title: "Multi-Mode Views", desc: "Switch between enhanced, heatmap, satellite, and simple views for different analysis needs." },
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
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center">
            <img src={sngLogo} alt="Venture Garden Group" className="h-8 w-auto" />
          </a>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">Features</a>
            <a href="#use-cases" className="transition hover:text-foreground">Use Cases</a>
            <a href="#network" className="transition hover:text-foreground">Network</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>
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

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm md:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <img src={sngLogo} alt="VGG" className="h-8 w-auto" />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-col gap-4 p-6">
            <a href="#features" className="text-lg font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#use-cases" className="text-lg font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Use Cases</a>
            <a href="#network" className="text-lg font-medium text-foreground" onClick={() => setMobileMenuOpen(false)}>Network</a>
            <div className="mt-4 flex flex-col gap-3">
              <Button variant="outline" className="w-full" onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}>Sign in</Button>
              <Button className="w-full" onClick={() => { setMobileMenuOpen(false); navigate("/login?mode=signup"); }}>Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Decorative arcs */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute -right-32 -top-32 h-[600px] w-[600px] text-primary/[0.06]" viewBox="0 0 600 600" fill="none">
            <circle cx="300" cy="300" r="200" stroke="currentColor" strokeWidth="1" />
            <circle cx="300" cy="300" r="260" stroke="currentColor" strokeWidth="1" />
            <circle cx="300" cy="300" r="150" stroke="currentColor" strokeWidth="0.5" />
          </svg>
          <svg className="absolute -left-20 bottom-0 h-[400px] w-[400px] text-accent/[0.06]" viewBox="0 0 400 400" fill="none">
            <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" />
            <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-32 md:pt-28">
          <motion.div className="max-w-3xl space-y-6 sm:space-y-8" initial="hidden" animate="visible">
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Zap className="h-3.5 w-3.5" /> Stakeholder Network Globe
            </motion.div>
            <motion.h1 custom={1} variants={fadeUp} className="text-3xl font-bold leading-[1.06] sm:text-5xl md:text-6xl lg:text-7xl">
              Powering innovative{" "}
              <span className="text-brand">transformation.</span>
            </motion.h1>
            <motion.p custom={2} variants={fadeUp} className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              We power transformative growth in emerging economies — mapping stakeholders, visualizing partnerships, and unlocking AI-powered collaboration signals.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button size="lg" className="h-12 px-8 text-sm font-semibold" onClick={() => navigate("/login?mode=signup")}>
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-sm" onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}>
                See how it works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mt-12 grid grid-cols-2 gap-3 sm:mt-20 sm:gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-card p-4 shadow-sm sm:p-6">
                <p className="text-2xl font-bold text-primary sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative border-t border-border/30 bg-muted/30 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Platform</p>
            <h2 className="mt-4 text-2xl font-bold sm:text-4xl md:text-5xl">Everything you need to navigate the global ecosystem</h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">A comprehensive suite of tools designed for stakeholders who think globally.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground sm:text-xl">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual showcase */}
      <section className="border-t border-border/30 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Intelligence</p>
              <h2 className="text-2xl font-bold sm:text-4xl md:text-5xl">AI-powered collaboration signals</h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                Our platform analyzes geographic proximity, thematic alignment, and network position to surface high-confidence partnership opportunities.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  { icon: Shield, text: "Enterprise-grade data security" },
                  { icon: Zap, text: "Real-time network updates" },
                  { icon: Sparkles, text: "AI confidence scoring on signals" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/30 p-8 sm:p-12">
              <div className="flex items-center justify-center">
                <div className="relative h-48 w-48 sm:h-64 sm:w-64">
                  <div className="absolute inset-0 animate-pulse rounded-full border-2 border-primary/20" />
                  <div className="absolute inset-4 animate-pulse rounded-full border border-accent/20" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute inset-8 rounded-full bg-primary/5" />
                  <Globe2 className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-primary sm:h-16 sm:w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="border-t border-border/30 bg-muted/30 py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Use Cases</p>
            <h2 className="mt-4 text-2xl font-bold sm:text-4xl md:text-5xl">Built for every player in the ecosystem</h2>
          </div>
          <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {useCases.map((uc) => (
              <div key={uc.title} className="rounded-xl border border-border/50 bg-card p-5 shadow-sm sm:p-6">
                <p className="text-base font-semibold text-foreground">{uc.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="network" className="relative border-t border-border/30 py-16 sm:py-24 md:py-32">
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Join the Network</p>
          <h2 className="mt-4 text-2xl font-bold sm:text-4xl md:text-5xl">Ready to map your <span className="text-brand">innovation network?</span></h2>
          <p className="mt-4 text-base text-muted-foreground sm:mt-6 sm:text-lg">
            Join thousands of stakeholders already using SNG to discover partnerships, track impact, and navigate the global innovation ecosystem.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
            <Button size="lg" className="h-12 w-full px-8 text-sm font-semibold sm:w-auto" onClick={() => navigate("/login?mode=signup")}>
              Create free account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 w-full px-8 text-sm sm:w-auto" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-muted/20 py-8 sm:py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
          <img src={sngLogo} alt="Venture Garden Group" className="h-7 w-auto" />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Venture Garden Group. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
