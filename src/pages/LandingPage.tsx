import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, Globe2, Layers, Network, Shield, Sparkles, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import heroCity from "@/assets/hero-city.jpg";
import globeNetwork from "@/assets/globe-network.jpg";
import featureNetwork from "@/assets/feature-network.jpg";
import authCollaboration from "@/assets/auth-collaboration.jpg";

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

  useEffect(() => {
    if (!loading && user) {
      navigate("/app", { replace: true });
    }
  }, [loading, user, navigate]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <Globe2 className="h-4.5 w-4.5 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-wide">SNG</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="transition hover:text-foreground">Features</a>
            <a href="#use-cases" className="transition hover:text-foreground">Use Cases</a>
            <a href="#network" className="transition hover:text-foreground">Network</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Sign in
            </Button>
            <Button size="sm" onClick={() => navigate("/login?mode=signup")}>
              Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={globeNetwork} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 md:pb-32 md:pt-28">
          <motion.div className="max-w-3xl space-y-8" initial="hidden" animate="visible">
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Zap className="h-3.5 w-3.5" /> Stakeholder Network Globe
            </motion.div>
            <motion.h1 custom={1} variants={fadeUp} className="text-5xl leading-[1.06] md:text-6xl lg:text-7xl">
              Map your global<br />
              <span className="text-gradient-warm">innovation network.</span>
            </motion.h1>
            <motion.p custom={2} variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Discover stakeholders, visualize partnerships on an interactive 3D globe, and unlock AI-powered collaboration signals — all from one platform.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <Button size="lg" className="h-12 px-8 text-sm font-semibold" onClick={() => navigate("/login?mode=signup")}>
                Start for free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 border-border/50 text-sm" onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}>
                See how it works
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border/30 bg-card/50 p-6 backdrop-blur-sm">
                <p className="text-3xl font-bold text-gradient-warm" style={{ fontFamily: "Instrument Serif" }}>{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative border-t border-border/20 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Platform</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Everything you need to navigate<br />the global ecosystem</h2>
            <p className="mt-4 text-lg text-muted-foreground">A comprehensive suite of tools designed for stakeholders who think globally.</p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group rounded-2xl border border-border/30 bg-card/40 p-8 transition-all hover:border-primary/20 hover:bg-card/70"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-medium text-foreground" style={{ fontFamily: "DM Sans" }}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual showcase */}
      <section className="border-t border-border/20 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Intelligence</p>
              <h2 className="text-4xl md:text-5xl">AI-powered collaboration<br />signals</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
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
            <div className="relative overflow-hidden rounded-2xl border border-border/30">
              <img src={featureNetwork} alt="Network visualization" className="h-full w-full object-cover" loading="lazy" width={1200} height={800} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="border-t border-border/20 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative overflow-hidden rounded-2xl border border-border/30 lg:order-first">
              <img src={authCollaboration} alt="Global collaboration" className="h-full w-full object-cover" loading="lazy" width={800} height={1200} />
              <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Use Cases</p>
                <h2 className="mt-4 text-4xl md:text-5xl">Built for every player<br />in the ecosystem</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {useCases.map((uc) => (
                  <div key={uc.title} className="rounded-xl border border-border/30 bg-card/40 p-5">
                    <p className="text-sm font-semibold text-foreground">{uc.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{uc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network section */}
      <section id="network" className="relative border-t border-border/20 py-24 md:py-32">
        <div className="absolute inset-0">
          <img src={heroCity} alt="" className="h-full w-full object-cover opacity-15" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Join the Network</p>
          <h2 className="mt-4 text-4xl md:text-5xl">Ready to map your<br /><span className="text-gradient-warm">innovation network?</span></h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Join thousands of stakeholders already using SNG to discover partnerships, track impact, and navigate the global innovation ecosystem.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-sm font-semibold" onClick={() => navigate("/login?mode=signup")}>
              Create free account <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 border-border/50 text-sm" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
              <Globe2 className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-wide">SNG</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Stakeholder Network Globe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
