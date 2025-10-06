import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import Hero from "@/components/landing/Hero";
import SellersPartners from "@/components/landing/SellersPartners";
import Testimonials from "@/components/landing/Testimonials";
import ValueSection from "@/components/landing/ValueSection";

// ...other sections (we’ll create them next)
export default function Page() {
  return (
    <main>
      <Hero />
      <ValueSection />
      <Features />
      <SellersPartners />
      <Testimonials />
      <FinalCTA />
      {/* WhyWhatHow, Features, Sellers, Partners, Testimonials, FinalCTA */}
    </main>
  );
}
