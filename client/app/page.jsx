import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ExchangeMarquee } from "@/components/exchange-marquee";
import { StatsStrip } from "@/components/stats-strip";
import { BotsSection } from "@/components/bots-section";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Pricing } from "@/components/pricing";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Navbar />
      <Hero />
      <ExchangeMarquee />
      <StatsStrip />
      <BotsSection />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
